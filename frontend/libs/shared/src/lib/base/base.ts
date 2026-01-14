import { BaseAppService } from './base.service';

export abstract class Base extends BaseAppService {
	protected constructor() {
		super();
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

	protected async whenBrowserAsync<T>(fn: () => Promise<T>): Promise<T | undefined> {
		return await BaseAppService.whenBrowserAsync(fn);
	}

	protected parseJson<T>(json: string, fallback?: T): T | undefined {
		try {
			return JSON.parse(json) as T;
		} catch {
			return fallback;
		}
	}

	protected ensure(condition: unknown, message: string): asserts condition {
		if (!condition) throw new Error(message);
	}
}
