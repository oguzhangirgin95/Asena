import { Route } from '@angular/router';
import { createTransactionRoutes } from '@frontend/shared';
import { MoneyTransferConfig } from './money-transfer/money-transfer.config';

export const paymentRoutes: Route[] = [
  createTransactionRoutes(
    'money-transfer',
    () =>
      import('./money-transfer/money-transfer-start.component').then(
        (m) => m.MoneyTransferStartComponent,
      ),
    MoneyTransferConfig,
    [],
    true,
  ),
];
