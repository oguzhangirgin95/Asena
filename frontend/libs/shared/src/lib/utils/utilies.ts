import { Base } from '../base/base';

/**
 * Shared utility helper.
 * Intentionally class-based to match the project's base/derived patterns.
 */
export class Utilities extends Base {
	public constructor() {
		super();
	}

	public getWindow(): Window | null {
		if (!this.isBrowser) return null
		try {
			return globalThis.window
		} catch {
			return null
		}
	}

	public getWindowInnerWidth(fallback = 0): number {
		const w = this.getWindow()
		if (!w) return fallback
		return w.innerWidth ?? fallback
	}

	public setDocumentTitle(title: string): boolean {
		if (!this.isBrowser) return false
		try {
			globalThis.document.title = title
			return true
		} catch {
			return false
		}
	}

	public addWindowEventListener<K extends keyof WindowEventMap>(
		type: K,
		handler: (this: Window, ev: WindowEventMap[K]) => any,
		options?: boolean | AddEventListenerOptions
	): (() => void) {
		const w = this.getWindow()
		if (!w) return () => undefined
		w.addEventListener(type, handler as any, options)
		return () => w.removeEventListener(type, handler as any, options)
	}

	public getFromStorage(key: string, fallback: string | null = null): string | null {
		if (!this.isBrowser) return fallback
		try {
			return globalThis.localStorage?.getItem(key) ?? fallback
		} catch {
			return fallback
		}
	}

	public setToStorage(key: string, value: string): boolean {
		if (!this.isBrowser) return false
		try {
			globalThis.localStorage?.setItem(key, value)
			return true
		} catch {
			return false
		}
	}

	public getJsonFromStorage<T>(key: string, fallback?: T): T | undefined {
		const raw = this.getFromStorage(key, null)
		if (raw === null) return fallback
		return this.safeJsonParse<T>(raw, fallback)
	}

	public setJsonToStorage(key: string, value: unknown): boolean {
		try {
			return this.setToStorage(key, JSON.stringify(value))
		} catch {
			return false
		}
	}

	public querySelector<T extends Element = Element>(selector: string): T | null {
		if (!this.isBrowser) return null
		try {
			return globalThis.document?.querySelector(selector) as T | null
		} catch {
			return null
		}
	}

	public scheduleNextFrame(fn: () => void): void {
		if (!this.isBrowser) {
			fn()
			return
		}
		try {
			globalThis.requestAnimationFrame(fn)
		} catch {
			fn()
		}
	}

	public isBlank(value: unknown): boolean {
		if (value === null || value === undefined) return true;
		if (typeof value === 'string') return value.trim().length === 0;
		return false;
	}

	public toNumber(value: unknown, fallback = 0): number {
		if (typeof value === 'number' && Number.isFinite(value)) return value;
		if (typeof value === 'string') {
			const parsed = Number(value);
			return Number.isFinite(parsed) ? parsed : fallback;
		}
		return fallback;
	}

	public safeJsonParse<T>(json: string, fallback?: T): T | undefined {
		return this.parseJson<T>(json, fallback);
	}
}
