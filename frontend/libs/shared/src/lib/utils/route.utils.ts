import { Route } from '@angular/router';
import { FlowConfig } from '../services/flow.service';

export function createTransactionRoutes(
  path: string,
  startComponentLoader: () => Promise<any>,
  flowConfig: FlowConfig,
  additionalSteps: Route[] = [],
  includeStandardSteps: boolean = true
): Route {
  const children: Route[] = [
    {
      path: '',
      redirectTo: 'start',
      pathMatch: 'full',
    },
    {
      path: 'start',
      loadComponent: startComponentLoader,
      data: { flowConfig }
    },
    ...additionalSteps,
  ];

  if (includeStandardSteps) {
    children.push(
      {
        path: 'confirm',
        loadComponent: () =>
          import('../base/confirm.component').then((m) => m.ConfirmComponent),
      },
      {
        path: 'execute',
        loadComponent: () =>
          import('../base/execute.component').then((m) => m.ExecuteComponent),
      }
    );
  }

  return {
    path,
    loadComponent: () =>
      import('../ui/transaction-layout/transaction-layout.component').then(
        (m) => m.TransactionLayout
      ),
    children,
  };
}
