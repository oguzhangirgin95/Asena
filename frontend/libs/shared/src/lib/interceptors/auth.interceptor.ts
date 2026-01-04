import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
    console.log('AuthInterceptor: Intercepting request to', request.url);

    // Global fix for OpenAPI-generated clients: they often send Accept: */*
    // which makes HttpClient treat JSON responses as Blob. Force JSON for API calls.
    // Safety: Only override when the caller didn't explicitly ask for a specific type.
    const accept = request.headers.get('Accept');
    const shouldForceJson =
      request.url.includes('/api/') &&
      (!accept || accept === '*/*') &&
      (request.responseType === 'blob' || request.responseType === 'json');

    if (shouldForceJson) {
      request = request.clone({
        setHeaders: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          Accept: 'application/json'
        },
        responseType: 'json'
      });

      // Token already applied above, skip the standard token clone below.
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.authService.logout();
          }
          return throwError(() => error);
        })
      );
    }

    if (token) {
      console.log('AuthInterceptor: Adding token to header');
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    } else {
      console.warn('AuthInterceptor: No token found');
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.logout();
        }
        return throwError(() => error);
      })
    );
  }
}
