import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthControllerService } from '../api/api/auth-controller.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private authController: AuthControllerService, private router: Router) {}

  login(credentials: { [key: string]: string }): Observable<{ [key: string]: string }> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.authController.login(credentials, 'body', false, { httpHeaderAccept: 'application/json' } as any).pipe(
      tap(response => {
        console.log('AuthService: Login response', response);
        if (response && response['token']) {
          console.log('AuthService: Token found in response, saving...');
          this.setToken(response['token']);
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
    return !!token;
  }

  logout(): void {
    this.removeToken();
    this.router.navigate(['/login']);
  }
}
