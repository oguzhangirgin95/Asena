import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { vi } from 'vitest';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and set token', () => {
    const mockResponse = { token: 'fake-token' };
    service.login({ username: 'test', password: 'password' }).subscribe(response => {
      expect(response.token).toBe('fake-token');
      expect(service.getToken()).toBe('fake-token');
    });

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should logout and remove token', () => {
    service.setToken('fake-token');
    const navigateSpy = vi.spyOn(router, 'navigate');
    service.logout();
    expect(service.getToken()).toBeNull();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
