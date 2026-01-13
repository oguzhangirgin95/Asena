import { Directive } from '@angular/core';
import { AbstractControl, ValidationErrors, Validator } from '@angular/forms';
import { BaseAppDirective } from './base.directive';

@Directive()
export abstract class BaseAppValidator extends BaseAppDirective implements Validator {
	public validate(_control: AbstractControl): ValidationErrors | null {
		return null;
	}
}
