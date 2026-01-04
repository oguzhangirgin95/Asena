import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlowService, FlowConfig } from '../services/flow.service';
import { LoggerService } from '../services/logger.service';
import { ValidationService } from '../services/validation.service';

@Component({
  template: ''
})
export abstract class BaseComponent implements OnInit, OnDestroy {
  protected flowService = inject(FlowService);
  protected logger = inject(LoggerService);
  protected validationService = inject(ValidationService);
  protected route = inject(ActivatedRoute);
  
  protected flowConfig?: FlowConfig;

  /* eslint-disable @typescript-eslint/no-explicit-any */
  public State: any = new Proxy({}, {
    get: (target, prop: string) => this.flowService.get(prop),
    set: (target, prop: string, value: any) => {
      this.flowService.set(prop, value);
      return true;
    }
  });

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

  protected onValidate(fn: () => boolean): void {
    this.validationService.registerValidation(fn);
  }

  ngOnDestroy(): void {
    this.logger.log(`Destroying ${this.constructor.name}`);
  }
}
