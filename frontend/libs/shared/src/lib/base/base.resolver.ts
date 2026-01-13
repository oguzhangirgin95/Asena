import { BaseAppService } from './base.service';

export abstract class BaseAppResolver<T = unknown> {
	protected constructor() {
		BaseAppService.ensureSsrCompat();
	}
}
