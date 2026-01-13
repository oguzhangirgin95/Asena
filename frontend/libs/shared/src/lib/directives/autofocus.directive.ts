import { AfterViewInit, Directive, ElementRef, inject } from '@angular/core';
import { BaseAppDirective } from '../base/base.directive';

@Directive({
	selector: '[appAutofocus]',
	standalone: true,
})
export class AutofocusDirective extends BaseAppDirective implements AfterViewInit {
	private readonly el = inject(ElementRef<HTMLElement>);

	public constructor() {
		super();
	}

	public ngAfterViewInit(): void {
		this.whenBrowser(() => {
			// Defer to avoid ExpressionChanged errors and let the element exist.
			setTimeout(() => {
				try {
					this.el.nativeElement.focus?.();
				} catch {
					// ignore
				}
			}, 0);
		});
	}
}
