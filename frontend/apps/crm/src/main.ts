import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Browser runtime marker.
// On SSR we install a shim that defines `window`, so use this flag to differentiate.
const runtimeFlags = globalThis as unknown as {
	__ASENA_SSR_SHIM__?: boolean;
	__ASENA_IS_BROWSER__?: boolean;
	__ASENA_IS_SERVER__?: boolean;
};
runtimeFlags.__ASENA_SSR_SHIM__ = false;
runtimeFlags.__ASENA_IS_BROWSER__ = true;
runtimeFlags.__ASENA_IS_SERVER__ = false;

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
