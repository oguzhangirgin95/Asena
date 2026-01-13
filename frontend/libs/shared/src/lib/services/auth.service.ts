import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthControllerService } from '../api/api/auth-controller.service';
import { BaseAppService } from '../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseAppService {
  private readonly TOKEN_KEY = 'auth_token';

  // Session-bound flag (in-memory). It resets on full page reload,
  // preventing users from continuing by manually entering URLs.
  private sessionAuthenticated = false;

  constructor(private authController: AuthControllerService, private router: Router) {
    super();
  }

  login(credentials: { [key: string]: string }): Observable<{ [key: string]: string }> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.authController.login(credentials, 'body', false, { httpHeaderAccept: 'application/json' } as any).pipe(
      tap(response => {
        console.log('AuthService: Login response', response);
        if (response && response['token']) {
          console.log('AuthService: Token found in response, saving...');
          this.setToken(response['token']);
          this.sessionAuthenticated = true;
        } else {
          console.warn('AuthService: No token found in login response');
        }
      })
    );
  }

  setToken(token: string): void {
    console.log('AuthService: Setting token to localStorage');
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) {
      console.warn('AuthService: getToken returned null');
    }
    return token;
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    // In a real app, check expiry
    return !!token && this.sessionAuthenticated;
  }

  logout(): void {
    this.removeToken();
    this.sessionAuthenticated = false;
    this.router.navigate(['/authentication/login']);
  }
}
