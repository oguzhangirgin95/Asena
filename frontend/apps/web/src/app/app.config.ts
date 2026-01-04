import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor, Configuration, provideServiceRegistry } from '@frontend/shared';

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
    }
  ]
};
