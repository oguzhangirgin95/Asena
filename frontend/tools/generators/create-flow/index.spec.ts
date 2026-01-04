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
    expect(tree.exists(`${basePath}/money-transfer-confirm.component.ts`)).toBeTruthy();
    expect(tree.exists(`${basePath}/money-transfer-execute.component.ts`)).toBeTruthy();
    expect(tree.exists(`${basePath}/money-transfer.routes.ts`)).toBeTruthy();
    
    // Check content of routes file to ensure template variables were replaced
    const routesContent = tree.read(`${basePath}/money-transfer.routes.ts`, 'utf-8');
    expect(routesContent).toContain('MoneyTransferStartComponent');
    expect(routesContent).toContain('path: \'start\'');
  });
});
