import { Route } from '@angular/router';
import { AuthGuard } from '@frontend/shared';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'authentication/login',
    pathMatch: 'full',
  },
  {
    path: 'authentication',
    loadChildren: () =>
      import('./authentication/authentication.routes').then(
        (m) => m.authenticationRoutes,
      ),
  },
  {
    path: '',
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'payment',
        loadChildren: () =>
          import('./payment/payment.routes').then((m) => m.paymentRoutes),
      },
      {
        path: 'main',
        loadChildren: () =>
          import('./main/main.routes').then((m) => m.mainRoutes),
      },
    ],
  },
];
