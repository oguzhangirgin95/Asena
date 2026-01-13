import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { BaseAppGuard } from '../base/base.guard';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard extends BaseAppGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {
    super();
  }

  canActivate(
    _route?: ActivatedRouteSnapshot,
    _state?: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.isAuthenticated()
      ? true
      : this.router.createUrlTree(['/authentication/login']);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.canActivate(childRoute, state);
  }
}
