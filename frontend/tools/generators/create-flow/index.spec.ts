import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';
import { describe, it, expect, beforeEach } from 'vitest';

import { createFlowGenerator } from './generator';

describe('create-flow generator', () => {
  let tree: Tree;
  const options = { module: 'payment', transaction: 'money-transfer' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await createFlowGenerator(tree, options);
    
    // Check if files are created in the correct location
    const basePath = 'apps/web/src/app/payment/money-transfer';
    
    expect(tree.exists(`${basePath}/money-transfer-start.component.ts`)).toBeTruthy();
    expect(tree.exists(`${basePath}/money-transfer-start.component.html`)).toBeTruthy();
    expect(tree.exists(`${basePath}/money-transfer-start.component.scss`)).toBeTruthy();
    expect(tree.exists(`${basePath}/money-transfer.config.ts`)).toBeTruthy();
    
    // Check that module routes file was created/updated with createTransactionRoutes
    const moduleRoutes = tree.read('apps/web/src/app/payment/payment.routes.ts', 'utf-8');
    expect(moduleRoutes).toContain("createTransactionRoutes(");
    expect(moduleRoutes).toContain("'money-transfer'");
  });

  it('should add new module route under guarded children when app.routes.ts exists', async () => {
    tree.write(
      'apps/web/src/app/app.routes.ts',
      `import { Route } from '@angular/router';
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
    ],
  },
];
`,
    );

    await createFlowGenerator(tree, { module: 'loans', transaction: 'apply-loan' });

    const updated = tree.read('apps/web/src/app/app.routes.ts', 'utf-8');
    expect(updated).toContain("path: 'loans'");
    expect(updated).toContain("canActivateChild: [AuthGuard]");
  });
});
