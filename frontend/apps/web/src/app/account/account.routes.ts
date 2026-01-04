import { Route } from '@angular/router';
import { createTransactionRoutes } from '@frontend/shared';
import { AllAccountConfig } from './all-account/all-account.config';
import { AccountDetailConfig } from './account-detail/account-detail.config';

export const accountRoutes: Route[] = [
  createTransactionRoutes(
    'all-account',
    () =>
      import('./all-account/all-account-start.component').then(
        (m) => m.AllAccountStartComponent,
      ),
    AllAccountConfig,
  ),
  createTransactionRoutes(
    'account-detail',
    () =>
      import('./account-detail/account-detail-start.component').then(
        (m) => m.AccountDetailStartComponent,
      ),
    AccountDetailConfig,
  ),
];
