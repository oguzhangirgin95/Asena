import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
console.log('Asena extension is now active!');

let disposable = vscode.commands.registerCommand('asena.createFlow', async () => {
    const module = await vscode.window.showInputBox({
        placeHolder: 'Enter module name (e.g., payment)',
        prompt: 'Create a new Asena Flow - Module'
    });

    if (!module) return;

    const transaction = await vscode.window.showInputBox({
        placeHolder: 'Enter transaction name (e.g., money-transfer)',
        prompt: 'Create a new Asena Flow - Transaction'
    });

    if (!transaction) return;

    const terminal = vscode.window.createTerminal('Asena');
    terminal.show();
    terminal.sendText(`if (Test-Path frontend) { cd frontend }`);
    terminal.sendText(
        `npx nx g ./tools/generators:create-flow --module=${module} --transaction=${transaction}`
    );
});

context.subscriptions.push(disposable);
}

export function deactivate() {}
