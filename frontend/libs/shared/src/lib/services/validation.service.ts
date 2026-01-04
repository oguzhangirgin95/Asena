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
  customValidation?: (value: unknown, element?: HTMLInputElement) => boolean;
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
      const rulesById = new Map<string, ValidationRuleConfig[]>();
      for (const rule of this.currentRules) {
        const list = rulesById.get(rule.id);
        if (list) {
          list.push(rule);
        } else {
          rulesById.set(rule.id, [rule]);
        }
      }

      for (const [id, rules] of rulesById.entries()) {
        const element = document.getElementById(id) as HTMLInputElement;
        if (!element) {
          console.warn(`Element with id ${id} not found for validation.`);
          continue;
        }

        const value = element.value;
        let firstFailedRule: ValidationRuleConfig | undefined;

        for (const rule of rules) {
          if (rule.validatorType) {
            const error = this.validateByType(value, rule.validatorType);
            if (error) {
              firstFailedRule = rule;
              break;
            }
          }

          if (rule.customValidation) {
            const ok = rule.customValidation(value, element);
            if (!ok) {
              firstFailedRule = rule;
              break;
            }
          }
        }

        if (firstFailedRule) {
          console.error(`Validation failed for ${id}: ${firstFailedRule.validationMessage}`);
          isStepValid = false;
          element.classList.add('error');
          this.showError(element, firstFailedRule.validationMessage);
        } else {
          element.classList.remove('error');
          this.clearError(element);
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
    errorElement.textContent = this.resourceService.getMessage(message);
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
