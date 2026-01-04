import { Route } from '@angular/router';
import { createTransactionRoutes } from '@frontend/shared';
import { LoginConfig } from './login/login.config';

export const authenticationRoutes: Route[] = [
  createTransactionRoutes(
    'login', 
    () => import('./login/login-start.component').then((m) => m.LoginStartComponent),
    LoginConfig
  ),
];
