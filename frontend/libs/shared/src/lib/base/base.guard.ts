import { BaseAppService } from './base.service';

export abstract class BaseAppGuard {
	protected constructor() {
		BaseAppService.ensureSsrCompat();
	}
}
