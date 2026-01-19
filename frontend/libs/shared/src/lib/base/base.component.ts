import { Component, OnInit, OnDestroy, inject, Injector, NgZone, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlowService, FlowConfig } from '../services/flow.service';
import { LoggerService } from '../services/logger.service';
import { ValidationService } from '../services/validation.service';
import { BaseAppService } from './base.service';
import { CrossAppStateService } from '../services/cross-app-state.service';

type CrossAppMessage = {
  type: 'ASENA_CROSS_APP_STATE';
  key: string;
  value: unknown;
};

@Component({
  template: ''
})
export abstract class BaseComponent implements OnInit, OnDestroy {
  private readonly injector = inject(Injector);
  private readonly zone = inject(NgZone);
  private readonly cdr = inject(ChangeDetectorRef);

  // Lazily resolve shared services so apps that only need `SharedState` don't
  // have to provide HTTP/config-related dependencies.
  protected get flowService(): FlowService {
    return this.injector.get(FlowService);
  }

  protected get logger(): LoggerService {
    return this.injector.get(LoggerService);
  }

  protected get validationService(): ValidationService {
    return this.injector.get(ValidationService);
  }

  protected get route(): ActivatedRoute {
    return this.injector.get(ActivatedRoute);
  }

  protected get crossAppState(): CrossAppStateService {
    return this.injector.get(CrossAppStateService);
  }
  
  protected flowConfig?: FlowConfig;

  public State: any = new Proxy({}, {
    get: (target, prop: string) => this.flowService.get(prop),
    set: (target, prop: string, value: any) => {
      this.flowService.set(prop, value);
      return true;
    }
  });

  /**
   * Lightweight app-agnostic state (no URL, no localStorage). Intended for cross-app communication.
   * Use like: `this.SharedState.someKey = 'value'`.
   */
  public SharedState: any = new Proxy({}, {
    get: (target, prop: string) => this.crossAppState.get(prop),
    set: (target, prop: string, value: any) => {
      this.crossAppState.set(prop, value);
      return true;
    }
  });

  private crossAppListenerAttached = false;

  public constructor() {
    BaseAppService.ensureSsrCompat();
  }

  protected get isBrowser(): boolean {
    return BaseAppService.isBrowser;
  }

  protected get isServer(): boolean {
    return BaseAppService.isServer;
  }

  protected whenBrowser(fn: () => void): void {
    BaseAppService.whenBrowser(fn);
  }

  protected whenServer(fn: () => void): void {
    BaseAppService.whenServer(fn);
  }

  protected async whenBrowserAsync<T>(fn: () => Promise<T>): Promise<T | undefined> {
    return await BaseAppService.whenBrowserAsync(fn);
  }

  ngOnInit(): void {
    this.logger.log(`Initializing ${this.constructor.name}`);
    
    const config = this.route.snapshot.data['flowConfig'];
    if (config) {
      this.flowConfig = config;
    }

    if (this.flowConfig) {
      // Transaction route is the parent of the step route (e.g. /authentication/login/start -> parent path is 'login').
      const transactionName = this.route.parent?.routeConfig?.path;
      this.flowService.initFlow(this.flowConfig, transactionName);
    }
  }

  /**
   * Receives cross-app state updates via `window.postMessage` and stores them into `SharedState`.
   * Call this from a component (e.g. login) that should accept values.
   */
  protected enableCrossAppStateReceiver(options?: { allowedOrigins?: string[] }): void {
    if (!BaseAppService.isBrowser) return;
    if (this.crossAppListenerAttached) return;
    this.crossAppListenerAttached = true;

    const allowedOrigins = (options?.allowedOrigins ?? []).map((o) => o.toLowerCase());

    window.addEventListener('message', (event: MessageEvent) => {
      if (!event?.data) return;
      if (allowedOrigins.length > 0 && !allowedOrigins.includes((event.origin ?? '').toLowerCase())) {
        return;
      }

      const msg = event.data as Partial<CrossAppMessage>;
      if (msg.type !== 'ASENA_CROSS_APP_STATE') return;
      if (!msg.key) return;

      // Ensure Angular change detection runs even when the update originates
      // from a raw DOM event (postMessage). Otherwise UI may update only on next user interaction.
      this.zone.run(() => {
        this.crossAppState.set(String(msg.key), msg.value);
        this.cdr.markForCheck();
      });
    });
  }

  /**
   * Sends a single key/value to another window using `postMessage`.
   * This does NOT modify URLs.
   */
  protected sendCrossAppState(targetWindow: Window | null, key: string, value: unknown, targetOrigin: string): void {
    if (!BaseAppService.isBrowser) return;
    if (!targetWindow) return;
    const payload: CrossAppMessage = { type: 'ASENA_CROSS_APP_STATE', key, value };
    targetWindow.postMessage(payload, targetOrigin);
  }

  protected onValidate(fn: () => boolean): void {
    this.validationService.registerValidation(fn);
  }

  ngOnDestroy(): void {
    this.logger.log(`Destroying ${this.constructor.name}`);
  }
}
