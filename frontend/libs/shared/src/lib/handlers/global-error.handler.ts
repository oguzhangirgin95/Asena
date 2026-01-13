import { Injectable } from '@angular/core';
import { BaseAppHandler } from '../base/base.handler';
import { LoggerService } from '../services/logger.service';

@Injectable()
export class GlobalErrorHandler extends BaseAppHandler {
	public constructor(private readonly logger: LoggerService) {
		super();
	}

	public override handleError(error: unknown): void {
		try {
			this.logger.error('Unhandled application error', error);
		} catch {
			// ignore
		}
		super.handleError(error);
	}
}
