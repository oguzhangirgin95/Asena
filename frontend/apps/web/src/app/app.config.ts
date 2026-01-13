import {
  ApplicationConfig,
  ErrorHandler,
  provideBrowserGlobalErrorListeners,
  APP_INITIALIZER,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import {
  AuthInterceptor,
  BaseAppService,
  Configuration,
  GlobalErrorHandler,
  provideServiceRegistry,
  ResourceService,
  EnvironmentConfigService,
  TRANSACTION_PATH_MAP,
} from '@frontend/shared';
import {
  provideClientHydration,
  withIncrementalHydration,
} from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    // Hybrid hydration (incremental hydration): enables @defer hydrate triggers and more SSR-friendly boot.
    provideClientHydration(withIncrementalHydration()),
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    provideServiceRegistry(),
    // Example handler: centralize unhandled error reporting/logging.
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    {
      provide: TRANSACTION_PATH_MAP,
      useValue: {
        // authentication
        login: 'authentication/login',

        // main
        dashboard: 'main/dashboard',

        // payment
        'money-transfer': 'payment/money-transfer',

        // account
        'all-account': 'account/all-account',
        'account-detail': 'account/account-detail',

        // loan
        'apply-vehicle-credit': 'loan/apply-vehicle-credit',
      },
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: Configuration,
      useFactory: () => new Configuration({ basePath: '' }),
    },
    {
      provide: APP_INITIALIZER,
      useFactory:
        (
          env: EnvironmentConfigService,
          apiConfig: Configuration,
          resourceService: ResourceService,
        ) =>
        async () => {
          // Hybrid hydration / SSR: do not run browser-only initialization on the server.
          // NOTE: `typeof window !== 'undefined'` is not reliable because SSR shim defines `window`.
          if (!BaseAppService.isBrowser) return;
          await env.load();
          apiConfig.basePath = env.getApiBasePath();
          await resourceService.ensureGeneralLoaded();
        },
      deps: [EnvironmentConfigService, Configuration, ResourceService],
      multi: true,
    },
  ],
};
