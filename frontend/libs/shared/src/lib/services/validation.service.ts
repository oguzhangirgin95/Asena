import { Injectable } from '@angular/core';
import validationRules from '../config/validation.json';
import { ResourceService } from './resource.service';

export interface ValidationRule {
  required?: boolean;
  regex?: string;
}

export interface ValidationConfig {
  [key: string]: ValidationRule;
}

export interface ValidationRuleConfig {
  id: string;
  validatorType: string;
  validationMessage: string;
}

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  private rules: ValidationConfig = validationRules as ValidationConfig;
  private currentRules: ValidationRuleConfig[] = [];
  private customValidationFn: (() => boolean) | null = null;

  constructor(private resourceService: ResourceService) {}

  setRules(rules: ValidationRuleConfig[]) {
    this.currentRules = rules || [];
  }

  registerValidation(fn: () => boolean): void {
    this.customValidationFn = fn;
  }

  Validate(): boolean {
    // 1. Custom component validation
    if (this.customValidationFn) {
      const isValid = this.customValidationFn();
      if (!isValid) {
        console.log('Custom validation failed');
        return false;
      }
    }

    // 2. Config-based validation
    if (this.currentRules.length > 0) {
      let isStepValid = true;
      for (const rule of this.currentRules) {
        const element = document.getElementById(rule.id) as HTMLInputElement;
        if (element) {
           const value = element.value;
           const error = this.validateByType(value, rule.validatorType);
           if (error) {
             console.error(`Validation failed for ${rule.id}: ${rule.validationMessage}`);
             isStepValid = false;
             element.classList.add('error');
             this.showError(element, rule.validationMessage);
           } else {
             element.classList.remove('error');
             this.clearError(element);
           }
        } else {
          console.warn(`Element with id ${rule.id} not found for validation.`);
        }
      }

      if (!isStepValid) {
        return false;
      }
    }
    return true;
  }

  private showError(element: HTMLElement, message: string): void {
    let errorElement = element.nextElementSibling as HTMLElement;
    if (!errorElement || !errorElement.classList.contains('validation-message')) {
      errorElement = document.createElement('div');
      errorElement.classList.add('validation-message');
      element.parentNode?.insertBefore(errorElement, element.nextSibling);
    }
    errorElement.innerText = this.resourceService.getMessage(message);
  }

  private clearError(element: HTMLElement): void {
    const errorElement = element.nextElementSibling as HTMLElement;
    if (errorElement && errorElement.classList.contains('validation-message')) {
      errorElement.remove();
    }
  }

  validate(value: unknown, ruleKey: string): string | null {
    const rule = this.rules[ruleKey];
    if (!rule) {
      return null;
    }

    if (rule.required) {
      if (value === null || value === undefined || value === '') {
        return this.resourceService.get('VALIDATION_REQUIRED');
      }
    }

    if (rule.regex && typeof value === 'string' && value !== '') {
      const regex = new RegExp(rule.regex);
      if (!regex.test(value)) {
        return this.resourceService.get('VALIDATION_INVALID_FORMAT');
      }
    }

    return null;
  }

  validateByType(value: unknown, type: string): string | null {
    if (type === 'ValidatorEnum.Required') {
      if (value === null || value === undefined || value === '') {
        return this.resourceService.get('VALIDATION_REQUIRED');
      }
    }
    // Add more validators here as needed
    return null;
  }
}
