import { Route } from '@angular/router';
import { createTransactionRoutes } from '@frontend/shared';
import { DashboardConfig } from './dashboard/dashboard.config';

export const mainRoutes: Route[] = [
  createTransactionRoutes(
    'dashboard',
    () =>
      import('./dashboard/dashboard-start.component').then(
        (m) => m.DashboardStartComponent,
      ),
    DashboardConfig,
    [],
    false,
  ),
];
