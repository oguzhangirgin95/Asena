import { BaseAppService } from './base.service';

export abstract class BaseAppPipe {
	protected constructor() {
		BaseAppService.ensureSsrCompat();
	}
}
