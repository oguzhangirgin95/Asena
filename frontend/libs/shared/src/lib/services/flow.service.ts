import { Injectable, inject, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Location } from '@angular/common';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { ValidationService, ValidationRuleConfig } from './validation.service';
import { ServiceRegistry } from './service-registry.service';
import { ResourceService } from './resource.service';
import { TRANSACTION_PATH_MAP, TransactionPathMap } from '../tokens/transaction-paths.token';

export interface ServiceConfig {
  serviceName: string;
  methodName: string;
  params: any[];
}

export interface FlowStep {
  step: string;
  validation: ValidationRuleConfig[];
  showContinueButton?: boolean;
  showBackButton?: boolean;
  service?: ServiceConfig;
  disableLayout?: boolean;
  keepState?: boolean;
  buttons?: FlowButton[];
}

export type FlowButtonVariant = 'primary' | 'secondary' | 'outline';

export interface FlowButtonVisibilityContext {
  get<T>(key: string): T | undefined;
}

export interface FlowButton {
  id: string;
  label: string;
  navigate: string;
  /** Back-compat for older configs. Prefer `variant`. */
  color?: FlowButtonVariant;
  variant?: FlowButtonVariant;
  isVisible?: boolean | string | ((ctx: FlowButtonVisibilityContext) => boolean);
}

export interface FlowConfig {
  config: {
    steps: FlowStep[];
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
@Injectable({
  providedIn: 'root'
})
export class FlowService {
  private state: Map<string, any> = new Map();

  private transactionBackStack: string[] = [];
  private preserveStateForNextFlowInit = false;

  private activeFlowConfig?: FlowConfig;
  private activeFlowTransactionName?: string;

  private router = inject(Router);
  private location = inject(Location);
  private validationService = inject(ValidationService);
  private injector = inject(Injector);
  private serviceRegistry = inject(ServiceRegistry);
  private resourceService = inject(ResourceService);
  private transactionPathMap: TransactionPathMap = inject(TRANSACTION_PATH_MAP);

  private stepsSubject = new BehaviorSubject<FlowStep[]>([]);
  public steps$ = this.stepsSubject.asObservable();

  private currentStepIndexSubject = new BehaviorSubject<number>(0);
  public currentStepIndex$ = this.currentStepIndexSubject.asObservable();

  constructor() {
    // State is now in-memory only
  }

  public initFlow(config: FlowConfig, transactionNameOverride?: string): void {
    // Load transaction-scoped resources once at the start of each flow.
    // Route convention: /.../{transactionName}/{step}
    const normalizedOverride = (transactionNameOverride ?? '').toString().trim();
    const transactionNameFromOverride = normalizedOverride && normalizedOverride !== 'general'
      ? normalizedOverride
      : undefined;

    const transactionNameFromRouteTree = this.getTransactionNameFromRouteTree();
    const transactionName = transactionNameFromOverride ?? transactionNameFromRouteTree ?? 'general';

    const isSameFlow = this.activeFlowConfig === config && this.activeFlowTransactionName === transactionName;
    const hasInitializedSteps = this.stepsSubject.value.length > 0;

    if (!isSameFlow || !hasInitializedSteps) {
      this.activeFlowConfig = config;
      this.activeFlowTransactionName = transactionName;

      this.stepsSubject.next(config.config.steps);
      this.currentStepIndexSubject.next(0);
      if (!this.preserveStateForNextFlowInit) {
        this.clear(); // Clear previous state only when starting a new flow
      }
      this.preserveStateForNextFlowInit = false;
    }

    this.resourceService.currentTransactionName.set(transactionName);
    // Fire-and-forget; UI bindings via resource pipe will update when loaded.
    this.resourceService.ensureTransactionLoaded(transactionName).catch(() => undefined);

    const steps = this.stepsSubject.value;
    const idx = this.currentStepIndexSubject.value;
    const current = steps[idx] ?? steps[0];
    if (current) {
      this.validationService.setRules(current.validation);
    }
  }

  public registerValidation(fn: () => boolean): void {
    this.validationService.registerValidation(fn);
  }

  public navigate(transactionName: string): void {
    const raw = (transactionName ?? '').toString().trim();
    if (!raw) return;

    const currentIndex = this.currentStepIndexSubject.value;
    const currentStep = this.stepsSubject.value[currentIndex];
    this.preserveStateForNextFlowInit = currentStep?.keepState === true;

    // Support legacy callers passing full paths like "payment/money-transfer".
    const normalized = raw.replace(/^\//, '');
    const mapped = this.transactionPathMap[normalized] ?? normalized;

    const currentBase = this.getCurrentTransactionBasePath();
    const targetBase = this.normalizeToTransactionBasePath(mapped);
    if (currentBase && targetBase && currentBase !== targetBase) {
      this.transactionBackStack.push(currentBase);
    }

    const basePath = (targetBase ?? mapped).replace(/^\//, '').replace(/\/+$/, '');
    const startPath = basePath.endsWith('/start') ? basePath : `${basePath}/start`;
    this.router.navigateByUrl(`/${startPath}`);
  }

  public async next(): Promise<void> {
    if (!this.validationService.Validate()) {
      return;
    }

    const currentIndex = this.currentStepIndexSubject.value;
    const steps = this.stepsSubject.value;

    if (currentIndex < steps.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextStep = steps[nextIndex];

      if (nextStep.service) {
        try {
          await this.executeService(nextStep.service);
        } catch (error) {
          console.error('Service execution failed', error);
          return;
        }
      }

      this.currentStepIndexSubject.next(nextIndex);
      this.navigateToStep(nextStep.step);

      // Update validation rules for the next step
      this.validationService.setRules(nextStep.validation);
      // Reset custom validation
      this.validationService.registerValidation(() => true);
    }
  }

  public back(): void {
    const currentIndex = this.currentStepIndexSubject.value;
    const steps = this.stepsSubject.value;

    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      this.currentStepIndexSubject.next(prevIndex);
      this.navigateToStep(steps[prevIndex].step);
    } else {
      const previousTransactionBase = this.transactionBackStack.pop();
      if (previousTransactionBase) {
        // Cross-transaction back should land on the previous transaction's start (not its last step).
        this.router.navigateByUrl(`${previousTransactionBase}/start`);
        return;
      }

      // Fallback: stay within the current transaction.
      this.navigateToCurrentTransactionStart();
    }
  }

  private getCurrentTransactionBasePath(): string | undefined {
    const urlTree = this.router.parseUrl(this.router.url);
    const segments = urlTree.root.children['primary']?.segments ?? [];
    if (segments.length < 2) return undefined;
    return `/${segments[0].path}/${segments[1].path}`;
  }

  private normalizeToTransactionBasePath(path: string): string | undefined {
    const trimmed = (path ?? '').toString().trim().replace(/^\//, '').replace(/\/+$/, '');
    if (!trimmed) return undefined;

    const parts = trimmed.split('/').filter(Boolean);
    if (parts.length === 0) return undefined;

    const last = parts[parts.length - 1];
    if (last === 'start' || last === 'confirm' || last === 'execute') {
      parts.pop();
    }

    if (parts.length >= 2) {
      return `/${parts[0]}/${parts[1]}`;
    }

    return `/${parts[0]}`;
  }

  private navigateToCurrentTransactionStart(): void {
    const urlTree = this.router.parseUrl(this.router.url);
    const segments = urlTree.root.children['primary']?.segments ?? [];
    if (segments.length === 0) return;

    // Expected shape: /{module}/{transaction}/{step}
    // Replace the last segment with 'start'.
    const baseSegments = segments.slice(0, Math.max(segments.length - 1, 0)).map((s) => s.path);
    const basePath = baseSegments.join('/');
    const startUrl = basePath ? `/${basePath}/start` : '/start';
    this.router.navigateByUrl(startUrl);
  }

  private navigateToStep(stepName: string): void {
    // Assumes relative navigation or specific route structure
    // For now, let's assume the route path matches the step name
    // We might need to know the base path of the module/transaction

    // Getting current URL parts to construct relative path
    const urlTree = this.router.parseUrl(this.router.url);
    const segments = urlTree.root.children['primary']?.segments;

    if (segments && segments.length > 0) {
      // Assuming the last segment is the current step, replace it
      // or if we are at the root of transaction, append it?
      // The generator creates routes like: 'start', 'confirm', 'execute'
      // relative to the transaction route.

      // If we are at .../transaction/start, we want .../transaction/confirm

      const baseSegments = segments.slice(0, segments.length - 1).map((s) => s.path);
      const targetUrl = `/${[...baseSegments, stepName].join('/')}`;
      this.router.navigateByUrl(targetUrl);
    }
  }

  public set(key: string, value: any): void {
    this.state.set(key, value);
  }

  public get<T>(key: string): T | undefined {
    return this.state.get(key) as T;
  }

  public clear(): void {
    this.state.clear();
  }

  private getTransactionNameFromRouteTree(): string | undefined {
    // Find deepest active route, then take its parent path as transaction name.
    // Example: /authentication/login/start -> deepest='start', parent='login'.
    let current: ActivatedRouteSnapshot | undefined = this.router.routerState.snapshot.root;
    while (current?.firstChild) {
      current = current.firstChild;
    }

    const tx = current?.parent?.routeConfig?.path;
    return tx ? tx.toString().trim() || undefined : undefined;
  }

  private async executeService(config: ServiceConfig): Promise<void> {
    const ServiceClass = this.serviceRegistry.get(config.serviceName);
    if (!ServiceClass) {
      throw new Error(`Service ${config.serviceName} not found`);
    }

    const serviceInstance = this.injector.get(ServiceClass);
    const params = this.resolveParams(config.params);

    const result$ = serviceInstance[config.methodName](...params);
    const result = await firstValueFrom(result$);

    console.log('FlowService: Service executed, result:', result);
    if (result) {
      this.set('lastServiceResult', result);
      console.log('FlowService: Saved lastServiceResult');
    }
  }

  private resolveParams(params: any[]): any[] {
    return params.map(param => {
      if (param && typeof param === 'object' && param.type === 'STATE') {
        return this.get(param.key);
      }
      return param;
    });
  }
}
