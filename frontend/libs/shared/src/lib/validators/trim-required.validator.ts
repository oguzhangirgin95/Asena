import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors } from '@angular/forms';
import { BaseAppValidator } from '../base/base.validator';

@Directive({
	selector:
		'[appTrimRequired][ngModel],[appTrimRequired][formControlName],[appTrimRequired][formControl]',
	standalone: true,
	providers: [
		{
			provide: NG_VALIDATORS,
			useExisting: TrimRequiredValidatorDirective,
			multi: true,
		},
	],
})
export class TrimRequiredValidatorDirective extends BaseAppValidator {
	public constructor() {
		super();
	}

	public override validate(control: AbstractControl): ValidationErrors | null {
		const value = control.value;
		if (value === null || value === undefined) return { trimRequired: true };
		if (typeof value !== 'string') return null;

		return value.trim().length > 0 ? null : { trimRequired: true };
	}
}
