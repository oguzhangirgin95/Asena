import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Browser runtime marker.
// On SSR we install a shim that defines `window`, so use this flag to differentiate.
(globalThis as any).__ASENA_SSR_SHIM__ = false;
(globalThis as any).__ASENA_IS_BROWSER__ = true;
(globalThis as any).__ASENA_IS_SERVER__ = false;

bootstrapApplication(App, appConfig).catch((err) =>
  console.error(err)
);
