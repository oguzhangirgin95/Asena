import { ApplicationConfig, provideBrowserGlobalErrorListeners, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor, Configuration, provideServiceRegistry, ResourceService } from '@frontend/shared';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptorsFromDi()),
    provideServiceRegistry(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { 
      provide: Configuration, 
      useFactory: () => new Configuration({ basePath: '' }) 
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (resourceService: ResourceService) => () => resourceService.ensureGeneralLoaded(),
      deps: [ResourceService],
      multi: true
    }
  ]
};
