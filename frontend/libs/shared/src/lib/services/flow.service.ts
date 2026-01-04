import { Injectable, inject, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { ValidationService, ValidationRuleConfig } from './validation.service';
import { ServiceRegistry } from './service-registry.service';

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
  private readonly STORAGE_KEY = 'flow_state';
  
  private router = inject(Router);
  private location = inject(Location);
  private validationService = inject(ValidationService);
  private injector = inject(Injector);
  private serviceRegistry = inject(ServiceRegistry);

  private stepsSubject = new BehaviorSubject<FlowStep[]>([]);
  public steps$ = this.stepsSubject.asObservable();

  private currentStepIndexSubject = new BehaviorSubject<number>(0);
  public currentStepIndex$ = this.currentStepIndexSubject.asObservable();

  constructor() {
    this.loadState();
  }

  public initFlow(config: FlowConfig): void {
    this.stepsSubject.next(config.config.steps);
    this.currentStepIndexSubject.next(0);
    this.clear(); // Clear previous state on new flow init
    
    if (config.config.steps.length > 0) {
      this.validationService.setRules(config.config.steps[0].validation);
    }
  }

  public registerValidation(fn: () => boolean): void {
    this.validationService.registerValidation(fn);
  }

  public navigate(transactionName: string): void {
    this.router.navigate([transactionName]);
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
      this.location.back();
    }
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
        
        const newUrl = segments.slice(0, segments.length - 1).map(s => s.path).join('/');
        this.router.navigate([newUrl, stepName]);
    }
  }

  public set(key: string, value: any): void {
    this.state.set(key, value);
    this.saveState();
  }

  public get<T>(key: string): T | undefined {
    return this.state.get(key) as T;
  }

  public clear(): void {
    this.state.clear();
    sessionStorage.removeItem(this.STORAGE_KEY);
  }

  private saveState(): void {
    const obj = Object.fromEntries(this.state);
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(obj));
  }

  private loadState(): void {
    const stored = sessionStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const obj = JSON.parse(stored);
        this.state = new Map(Object.entries(obj));
      } catch (e) {
        console.error('Failed to load state', e);
        this.state = new Map();
      }
    }
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
