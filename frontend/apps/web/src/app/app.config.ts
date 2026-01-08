import { ApplicationConfig, provideBrowserGlobalErrorListeners, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor, Configuration, provideServiceRegistry, ResourceService, EnvironmentConfigService, TRANSACTION_PATH_MAP } from '@frontend/shared';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptorsFromDi()),
    provideServiceRegistry(),
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
      }
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: Configuration,
      useFactory: () => new Configuration({ basePath: '' })
    },
    {
      provide: APP_INITIALIZER,
      useFactory:
        (env: EnvironmentConfigService, apiConfig: Configuration, resourceService: ResourceService) =>
        async () => {
          await env.load();
          apiConfig.basePath = env.getApiBasePath();
          await resourceService.ensureGeneralLoaded();
        },
      deps: [EnvironmentConfigService, Configuration, ResourceService],
      multi: true
    }
  ]
};
