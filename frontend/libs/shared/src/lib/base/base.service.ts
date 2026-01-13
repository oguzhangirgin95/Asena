type StorageLike = {
	readonly length: number;
	clear(): void;
	getItem(key: string): string | null;
	key(index: number): string | null;
	removeItem(key: string): void;
	setItem(key: string, value: string): void;
};

type SsrCompatOptions = {
	enableJqueryShim?: boolean;
};

/**
 * Base for all frontend (Angular) services.
 *
 * SSR note:
 * - On the server, browser globals like window/document/localStorage might be undefined.
 * - We install minimal no-op/in-memory shims so existing code paths won't crash.
 * - This is intentionally idempotent and only patches when running without a real window.
 */
export abstract class BaseAppService {
	protected constructor() {
		BaseAppService.ensureSsrCompat();
	}

	private static ssrCompatInitialized = false;

	/**
	 * SSR safety net: provide minimal no-op/proxy shims for browser globals.
	 * Goal: prevent server crashes from browser-only code without modifying derived classes.
	 */
	public static ensureSsrCompat(options: SsrCompatOptions = { enableJqueryShim: true }): void {
		if (BaseAppService.ssrCompatInitialized) return;
		BaseAppService.ssrCompatInitialized = true;

		// Only patch when running on the server.
		if (typeof window !== 'undefined') return;

		const g = globalThis as any;
		const noop = () => undefined;

		// Mark that we're running under SSR with a compatibility shim.
		// This lets app code reliably differentiate real browser vs shimmed "window".
		g.__ASENA_SSR_SHIM__ = true;
		g.__ASENA_IS_SERVER__ = true;
		g.__ASENA_IS_BROWSER__ = false;

		// atob/btoa shims (some libs expect them).
		const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
		const btoaFallback = (input: string): string => {
			const str = String(input);
			let output = '';
			let i = 0;
			while (i < str.length) {
				const chr1 = str.charCodeAt(i++);
				const chr2 = str.charCodeAt(i++);
				const chr3 = str.charCodeAt(i++);

				const enc1 = chr1 >> 2;
				const enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				const enc3 = Number.isNaN(chr2) ? 64 : ((chr2 & 15) << 2) | (chr3 >> 6);
				const enc4 = Number.isNaN(chr3) ? 64 : chr3 & 63;

				output +=
					base64Chars.charAt(enc1) +
					base64Chars.charAt(enc2) +
					base64Chars.charAt(enc3) +
					base64Chars.charAt(enc4);
			}
			return output;
		};

		const atobFallback = (input: string): string => {
			const str = String(input).replace(/[^A-Za-z0-9+/=]/g, '');
			let output = '';
			let i = 0;
			while (i < str.length) {
				const enc1 = base64Chars.indexOf(str.charAt(i++));
				const enc2 = base64Chars.indexOf(str.charAt(i++));
				const enc3 = base64Chars.indexOf(str.charAt(i++));
				const enc4 = base64Chars.indexOf(str.charAt(i++));

				const chr1 = (enc1 << 2) | (enc2 >> 4);
				const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				const chr3 = ((enc3 & 3) << 6) | enc4;

				output += String.fromCharCode(chr1);
				if (enc3 !== 64) output += String.fromCharCode(chr2);
				if (enc4 !== 64) output += String.fromCharCode(chr3);
			}
			return output;
		};

		g.atob ??= atobFallback;
		g.btoa ??= btoaFallback;

		// Storage shim (in-memory)
		const createStorage = (): StorageLike => {
			const store = new Map<string, string>();
			const storage: StorageLike = {
				get length() {
					return store.size;
				},
				clear() {
					store.clear();
				},
				getItem(key: string) {
					const k = String(key);
					return store.has(k) ? store.get(k)! : null;
				},
				key(index: number) {
					const keys = Array.from(store.keys());
					return keys[index] ?? null;
				},
				removeItem(key: string) {
					store.delete(String(key));
				},
				setItem(key: string, value: string) {
					store.set(String(key), String(value));
				},
			};
			return storage;
		};

		if (typeof g.localStorage === 'undefined') g.localStorage = createStorage();
		if (typeof g.sessionStorage === 'undefined') g.sessionStorage = createStorage();

		// Basic document shim.
		const createElement = () => {
			const element: any = {
				classList: { add: noop, remove: noop, contains: () => false },
				setAttribute: noop,
				getAttribute: () => null,
				removeAttribute: noop,
				appendChild: noop,
				insertBefore: noop,
				remove: noop,
				addEventListener: noop,
				removeEventListener: noop,
				dispatchEvent: () => false,
				getBoundingClientRect: () => ({ left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 }),
				offsetWidth: 0,
				offsetHeight: 0,
				nextSibling: null,
				nextElementSibling: null,
				parentNode: null,
				style: {},
				textContent: '',
				innerHTML: '',
				value: '',
			};
			return element;
		};

		if (typeof g.document === 'undefined') {
			g.document = {};
		}

		g.document.createElement ??= createElement;
		g.document.createTextNode ??= (_text: string) => ({ textContent: _text ?? '' });
		g.document.createDocumentFragment ??= () => ({ appendChild: noop });
		g.document.getElementById ??= () => null;
		g.document.getElementsByTagName ??= () => [];
		g.document.querySelector ??= () => null;
		g.document.querySelectorAll ??= () => [];
		g.document.addEventListener ??= noop;
		g.document.removeEventListener ??= noop;
		g.document.dispatchEvent ??= () => false;
		g.document.cookie ??= '';
		g.document.readyState ??= 'complete';
		g.document.scripts ??= [];
		g.document.currentScript ??= null;

		g.document.body ??= createElement();
		g.document.head ??= createElement();
		g.document.documentElement ??= createElement();
		g.document.body.hasAttribute ??= () => false;
		g.document.body.setAttribute ??= noop;
		g.document.body.removeAttribute ??= noop;

		// Basic location/navigator shims.
		if (typeof g.location === 'undefined') {
			g.location = { href: '', origin: '', pathname: '/', search: '', hash: '' };
		}
		if (typeof g.navigator === 'undefined') {
			g.navigator = { userAgent: 'ssr', language: 'en', languages: ['en'] };
		}

		// window shim with commonly used APIs.
		if (typeof g.window === 'undefined') {
			g.window = {};
		}
		g.self ??= g.window;
		g.global ??= g;
		g.window.window ??= g.window;
		g.window.document ??= g.document;
		g.document.defaultView ??= g.window;
		g.window.location ??= g.location;
		g.window.navigator ??= g.navigator;
		g.window.innerWidth ??= 0;
		g.window.innerHeight ??= 0;
		g.window.devicePixelRatio ??= 1;
		g.window.screen ??= { width: 0, height: 0 };
		g.window.scrollTo ??= () => undefined;
		g.window.addEventListener ??= () => undefined;
		g.window.removeEventListener ??= () => undefined;
		g.window.requestAnimationFrame ??= (cb: (...args: any[]) => void) => {
			// IMPORTANT: do not call the callback synchronously on the server.
			// Some libs schedule recursive rAF loops; synchronous execution can lead to tight loops/hangs.
			return setTimeout(() => {
				try {
					cb(Date.now());
				} catch {
					// ignore
				}
			}, 16) as unknown as number;
		};
		g.window.cancelAnimationFrame ??= () => undefined;
		g.window.matchMedia ??= () => ({
			matches: false,
			media: '',
			addListener: () => undefined,
			removeListener: () => undefined,
			addEventListener: () => undefined,
			removeEventListener: () => undefined,
			dispatchEvent: () => false,
		});

		// Observers: common in UI libs; provide no-op implementations.
		g.IntersectionObserver ??= class {
			observe() {
				return;
			}
			unobserve() {
				return;
			}
			disconnect() {
				return;
			}
		};
		g.MutationObserver ??= class {
			constructor(_cb: unknown) {}
			observe() {
				return;
			}
			disconnect() {
				return;
			}
			takeRecords() {
				return [];
			}
		};
		g.ResizeObserver ??= class {
			constructor(_cb: unknown) {}
			observe() {
				return;
			}
			unobserve() {
				return;
			}
			disconnect() {
				return;
			}
		};

		// Event constructors are sometimes referenced.
		g.Event ??= class {
			type: string;
			constructor(type: string) {
				this.type = type;
			}
		};
		g.CustomEvent ??= class extends g.Event {
			detail: unknown;
			constructor(type: string, init?: { detail?: unknown }) {
				super(type);
				this.detail = init?.detail;
			}
		};

		// DOM class references (instanceof checks).
		g.Node ??= class {};
		g.Element ??= class extends g.Node {};
		g.HTMLElement ??= class extends g.Element {};
		g.Image ??= class {
			onload: null | (() => void) = null;
			onerror: null | (() => void) = null;
			set src(_v: string) {
				// No-op; immediately succeed.
				try {
					this.onload?.();
				} catch {
					// ignore
				}
			}
		};

		// If fetch isn't available in the SSR runtime, provide a minimal stub to avoid ReferenceError.
		g.fetch ??= (_input: unknown, _init?: unknown) =>
			Promise.reject(new Error('fetch is not available in this SSR runtime'));

		// SSR safety: wrap native fetch with a default timeout so SSR doesn't hang forever
		// on unreachable backends (common during initial SSR rollout).
		if (typeof g.fetch === 'function' && g.__ASENA_FETCH_WRAPPED__ !== true) {
			const originalFetch = g.fetch.bind(g);
			g.fetch = (input: unknown, init?: any) => {
				const options = init ?? {};
				if (options.signal) {
					return originalFetch(input, options);
				}

				const controller = new g.AbortController();
				const timeoutMs = 5000;
				const timeoutId = setTimeout(() => {
					try {
						controller.abort();
					} catch {
						// ignore
					}
				}, timeoutMs);

				return originalFetch(input, { ...options, signal: controller.signal }).finally(() => {
					clearTimeout(timeoutId);
				});
			};
			g.__ASENA_FETCH_WRAPPED__ = true;
		}
		g.AbortController ??= class {
			signal = { aborted: false, addEventListener: noop, removeEventListener: noop };
			abort() {
				this.signal.aborted = true;
			}
		};

		// history/performance are occasionally accessed by third-party libs.
		if (typeof g.history === 'undefined') {
			g.history = {
				length: 0,
				state: null,
				back: () => undefined,
				forward: () => undefined,
				go: () => undefined,
				pushState: () => undefined,
				replaceState: () => undefined,
			};
		}
		if (typeof g.performance === 'undefined') {
			g.performance = {
				now: () => Date.now(),
			};
		}

		// crypto shim (prefer native; fallback provides randomUUID/getRandomValues when absent).
		if (typeof g.crypto === 'undefined') g.crypto = {};

		if (typeof g.crypto.getRandomValues !== 'function') {
			g.crypto.getRandomValues = (arr: ArrayLike<number>) => {
				// Not cryptographically strong; SSR-only safety shim.
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const out = arr as any;
				for (let i = 0; i < out.length; i++) out[i] = (Math.random() * 256) | 0;
				return arr;
			};
		}

		if (typeof g.crypto.randomUUID !== 'function') {
			g.crypto.randomUUID = () =>
				'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c: string) => {
					const r = (Math.random() * 16) | 0;
					const v = c === 'x' ? r : (r & 0x3) | 0x8;
					return v.toString(16);
				});
		}

		// jQuery/$ shim for legacy/3rd-party code paths.
		if ((options.enableJqueryShim ?? true) && typeof g.$ === 'undefined' && typeof g.jQuery === 'undefined') {
			let chainable: any;
			const baseFn = function () {
				return chainable;
			} as any;
			chainable = new Proxy(baseFn, {
				get(_t, prop) {
					if (prop === 'length') return 0;
					if (prop === 'toArray') return () => [];
					return (..._args: any[]) => chainable;
				},
				apply() {
					return chainable;
				},
			});

			g.$ = chainable;
			g.jQuery = chainable;
		}
	}

	/** True only in a real browser runtime (not SSR shim). */
	public static get isBrowser(): boolean {
		const g = globalThis as any;
		return typeof window !== 'undefined' && g.__ASENA_SSR_SHIM__ !== true;
	}

	/** True when running on server (SSR), including shimmed globals. */
	public static get isServer(): boolean {
		return !BaseAppService.isBrowser;
	}

	/**
	 * Run code only in the browser. In SSR it is skipped.
	 * Use this instead of `if (typeof window !== 'undefined')` because the SSR shim defines `window`.
	 */
	public static whenBrowser(fn: () => void): void {
		if (BaseAppService.isBrowser) fn();
	}

	public static async whenBrowserAsync<T>(fn: () => Promise<T>): Promise<T | undefined> {
		if (!BaseAppService.isBrowser) return undefined;
		return await fn();
	}

	public static whenServer(fn: () => void): void {
		if (BaseAppService.isServer) fn();
	}
}
