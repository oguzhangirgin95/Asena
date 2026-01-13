// Ensure SSR compatibility shims are installed before any application code runs.
// This protects against import-time access to browser globals.
import '@frontend/shared';

import {
  BootstrapContext,
  bootstrapApplication,
} from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';

const bootstrap = (context: BootstrapContext) =>
  bootstrapApplication(App, config, context);

export default bootstrap;
