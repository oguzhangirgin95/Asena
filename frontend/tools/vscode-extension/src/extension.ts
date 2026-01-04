import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Asena extension is now active!');

    const disposable = vscode.commands.registerCommand('asena.createFlow', async () => {
        const module = await vscode.window.showInputBox({
            placeHolder: 'Enter module name (e.g., payment)',
            prompt: 'Asena: Create Flow - Module'
        });

        if (!module) return;

        const safeModule = module.replace(/"/g, '').trim();
        if (!safeModule) return;

        const transaction = await vscode.window.showInputBox({
            placeHolder: 'Enter transaction name (e.g., money-transfer)',
            prompt: 'Asena: Create Flow - Transaction'
        });

        if (!transaction) return;

        const safeTransaction = transaction.replace(/"/g, '').trim();
        if (!safeTransaction) return;

        const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder is open.');
            return;
        }

        // Prefer running from <workspace>/frontend if it exists.
        const frontendUri = vscode.Uri.joinPath(vscode.Uri.file(workspaceFolder), 'frontend');
        const cwd = await vscode.workspace.fs.stat(frontendUri).then(
            () => frontendUri.fsPath,
            () => workspaceFolder,
        );

        const commandLine = `npx nx g ./tools/generators:create-flow --module="${safeModule}" --transaction="${safeTransaction}"`;

        const task = new vscode.Task(
            { type: 'asena', task: 'create-flow' },
            vscode.TaskScope.Workspace,
            'Asena: Create Flow',
            'asena',
            new vscode.ShellExecution(commandLine, { cwd }),
        );

        task.presentationOptions = {
            reveal: vscode.TaskRevealKind.Never,
            panel: vscode.TaskPanelKind.Dedicated,
            clear: true,
            focus: false,
            showReuseMessage: false,
        };

        const endDisposable = vscode.tasks.onDidEndTaskProcess((e: vscode.TaskProcessEndEvent) => {
            if (e.execution.task.name !== task.name) return;
            endDisposable.dispose();
            if (e.exitCode === 0) {
                vscode.window.showInformationMessage('Flow created successfully.');
            } else {
                vscode.window.showErrorMessage('Flow creation failed. Check task output.');
            }
        });

        vscode.window.showInformationMessage('Creating flow...');
        await vscode.tasks.executeTask(task);
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
