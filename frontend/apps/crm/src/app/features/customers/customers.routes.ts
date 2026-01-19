import { Route } from '@angular/router';

export const customersRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./customers-start.component').then((m) => m.CustomersStartComponent),
  },
];
