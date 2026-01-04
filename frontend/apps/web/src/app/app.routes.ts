import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'authentication/login',
    pathMatch: 'full',
  },
  {
    path: 'payment',
    loadChildren: () =>
      import('./payment/payment.routes').then((m) => m.paymentRoutes),
  },
  {
    path: 'authentication',
    loadChildren: () =>
      import('./authentication/authentication.routes').then(
        (m) => m.authenticationRoutes,
      ),
  },
  {
    path: 'main',
    loadChildren: () => import('./main/main.routes').then((m) => m.mainRoutes),
  },
];
