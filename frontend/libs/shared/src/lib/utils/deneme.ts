import { Base } from '../base/base';

export class Deneme extends Base {
	public constructor() {
		super();
	}

	public ping(): 'pong' {
		return 'pong';
	}

	public getRuntime(): 'browser' | 'server' {
		return this.isBrowser ? 'browser' : 'server';
	}

	public newId(): string {
		return globalThis.crypto.randomUUID();
	}
}
