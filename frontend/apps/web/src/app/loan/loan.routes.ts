import { Route } from '@angular/router';
import { createTransactionRoutes } from '@frontend/shared';
import { ApplyVehicleCreditConfig } from './apply-vehicle-credit/apply-vehicle-credit.config';

export const loanRoutes: Route[] = [
  createTransactionRoutes(
    'apply-vehicle-credit',
    () =>
      import(
        './apply-vehicle-credit/apply-vehicle-credit-start.component'
      ).then((m) => m.ApplyVehicleCreditStartComponent),
    ApplyVehicleCreditConfig,
  ),
];
