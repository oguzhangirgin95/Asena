/// <reference types="node" />
import {
  formatFiles,
  generateFiles,
  Tree,
  names,
  offsetFromRoot,
} from '@nx/devkit';
import * as path from 'path';

interface CreateFlowGeneratorOptions {
  module: string;
  transaction: string;
  onlyStart?: boolean;
}

export async function createFlowGenerator(
  tree: Tree,
  options: CreateFlowGeneratorOptions
) {
  const moduleName = names(options.module).fileName;
  const transactionName = names(options.transaction).fileName;
  const projectRoot = `apps/web/src/app/${moduleName}/${transactionName}`;

  const templateOptions = {
    ...options,
    onlyStart: options.onlyStart ?? false,
    ...names(options.transaction),
    name: names(options.transaction).fileName,
    module: moduleName,
    transaction: transactionName,
    offsetFromRoot: offsetFromRoot(projectRoot),
    template: '',
  };

  generateFiles(
    tree,
    path.join(__dirname, 'files/src/lib'),
    projectRoot,
    templateOptions
  );

  updateModuleRoutes(tree, options);
  updateAppRoutes(tree, options);
  
  await formatFiles(tree);
}

function updateAppRoutes(tree: Tree, options: CreateFlowGeneratorOptions) {
  const moduleName = names(options.module).fileName;
  const modulePropertyName = names(options.module).propertyName;
  const appRoutesPath = 'apps/web/src/app/app.routes.ts';

  if (tree.exists(appRoutesPath)) {
    const content = tree.read(appRoutesPath, 'utf-8');
    if (content && !content.includes(`path: '${moduleName}'`)) {
      // Prefer inserting into the guarded parent route block so new modules are protected by AuthGuard.
      // Special-case authentication module to remain public.
      const routeEntryInChildren = `      {
        path: '${moduleName}',
        loadChildren: () =>
          import('./${moduleName}/${moduleName}.routes').then((m) => m.${modulePropertyName}Routes),
      },`;

      const routeEntryTopLevel = `  {
    path: '${moduleName}',
    loadChildren: () =>
      import('./${moduleName}/${moduleName}.routes').then((m) => m.${modulePropertyName}Routes),
  },`;

      const guardedMarker = 'canActivateChild: [AuthGuard]';
      const guardedIndex = content.indexOf(guardedMarker);

      const insertIntoGuardedChildren = moduleName !== 'authentication' && guardedIndex !== -1;
      if (insertIntoGuardedChildren) {
        const childrenIndex = content.indexOf('children: [', guardedIndex);
        if (childrenIndex !== -1) {
          const openBracketIndex = content.indexOf('[', childrenIndex);
          if (openBracketIndex !== -1) {
            // Find matching closing bracket for the children array.
            let depth = 0;
            let closeBracketIndex = -1;
            for (let i = openBracketIndex; i < content.length; i++) {
              const ch = content[i];
              if (ch === '[') depth++;
              if (ch === ']') {
                depth--;
                if (depth === 0) {
                  closeBracketIndex = i;
                  break;
                }
              }
            }

            if (closeBracketIndex !== -1) {
              const newContent =
                content.slice(0, closeBracketIndex) +
                routeEntryInChildren +
                '\n' +
                content.slice(closeBracketIndex);
              tree.write(appRoutesPath, newContent);
              return;
            }
          }
        }
      }

      // Fallback: append to top-level routes array.
      const lastBracketIndex = content.lastIndexOf(']');
      if (lastBracketIndex > -1) {
        const newContent =
          content.slice(0, lastBracketIndex) +
          routeEntryTopLevel +
          '\n' +
          content.slice(lastBracketIndex);
        tree.write(appRoutesPath, newContent);
      }
    }
  }
}

function updateModuleRoutes(tree: Tree, options: CreateFlowGeneratorOptions) {
  const moduleName = names(options.module).fileName;
  const modulePropertyName = names(options.module).propertyName;
  const transactionName = names(options.transaction).fileName;
  const transactionClassName = names(options.transaction).className;
  
  const moduleRoutesPath = `apps/web/src/app/${moduleName}/${moduleName}.routes.ts`;
  
  if (!tree.exists(moduleRoutesPath)) {
      const content = `import { Route } from '@angular/router';
import { createTransactionRoutes } from '@frontend/shared';

export const ${modulePropertyName}Routes: Route[] = [
];
`;
      tree.write(moduleRoutesPath, content);
  }
  
  let content = tree.read(moduleRoutesPath, 'utf-8');
  
  if (content && !content.includes('createTransactionRoutes')) {
    const importStatement = `import { createTransactionRoutes } from '@frontend/shared';`;
    if (!content.includes(importStatement)) {
       // Insert after the last import or at the top
       const lastImportIndex = content.lastIndexOf('import ');
       if (lastImportIndex > -1) {
         const endOfImport = content.indexOf(';', lastImportIndex);
         content = content.slice(0, endOfImport + 1) + '\n' + importStatement + content.slice(endOfImport + 1);
       } else {
         content = importStatement + '\n' + content;
       }
       tree.write(moduleRoutesPath, content);
    }
  }

  content = tree.read(moduleRoutesPath, 'utf-8'); // Read again in case it changed

  if (content && !content.includes(`'${transactionName}'`)) {
      const configImport = `import { ${transactionClassName}Config } from './${transactionName}/${transactionName}.config';`;
      if (!content.includes(configImport)) {
          const lastImportIndex = content.lastIndexOf('import ');
          if (lastImportIndex > -1) {
              const endOfImport = content.indexOf(';', lastImportIndex);
              content = content.slice(0, endOfImport + 1) + '\n' + configImport + content.slice(endOfImport + 1);
          } else {
              content = configImport + '\n' + content;
          }
      }

      const includeStandardSteps = options.onlyStart ? ', [], false' : '';
      const routeEntry = `  createTransactionRoutes(
    '${transactionName}', 
    () => import('./${transactionName}/${transactionName}-start.component').then(m => m.${transactionClassName}StartComponent),
    ${transactionClassName}Config${includeStandardSteps}
  ),`;

      const lastBracketIndex = content.lastIndexOf(']');
      if (lastBracketIndex > -1) {
          const newContent = content.slice(0, lastBracketIndex) + routeEntry + '\n' + content.slice(lastBracketIndex);
          tree.write(moduleRoutesPath, newContent);
      }
  }
}

export default createFlowGenerator;
