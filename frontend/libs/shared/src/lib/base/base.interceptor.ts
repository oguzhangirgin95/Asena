import { BaseAppService } from './base.service';

export abstract class BaseAppInterceptor {
	protected constructor() {
		BaseAppService.ensureSsrCompat();
	}
}
