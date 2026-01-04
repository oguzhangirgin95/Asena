import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { vi } from 'vitest';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthGuard, AuthService]
    });
    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should allow activation if authenticated', () => {
    vi.spyOn(authService, 'isAuthenticated').mockReturnValue(true);
    const result = guard.canActivate();
    expect(result).toBe(true);
  });

  it('should redirect to login if not authenticated', () => {
    vi.spyOn(authService, 'isAuthenticated').mockReturnValue(false);
    const createUrlTreeSpy = vi.spyOn(router, 'createUrlTree');
    
    const result = guard.canActivate();
    
    expect(createUrlTreeSpy).toHaveBeenCalledWith(['/authentication/login']);
  });
});
