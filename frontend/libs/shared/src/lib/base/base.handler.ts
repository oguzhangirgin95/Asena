import { ErrorHandler, Injectable } from '@angular/core';
import { BaseAppService } from './base.service';

@Injectable()
export class BaseAppHandler extends ErrorHandler {
	public constructor() {
		super();
		BaseAppService.ensureSsrCompat();
	}

	protected get isBrowser(): boolean {
		return BaseAppService.isBrowser;
	}

	protected get isServer(): boolean {
		return BaseAppService.isServer;
	}

	public override handleError(error: unknown): void {
		// Default behavior: keep Angular's error handler behavior.
		// Ensure this never crashes SSR even if some custom logging throws.
		try {
			super.handleError(error);
		} catch {
			// ignore
		}
	}
}
