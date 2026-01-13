import { Directive } from '@angular/core';
import { BaseAppService } from './base.service';

@Directive()
export abstract class BaseAppDirective {
	protected constructor() {
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
}
