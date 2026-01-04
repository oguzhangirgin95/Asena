import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
console.log('Asena extension is now active!');

let disposable = vscode.commands.registerCommand('asena.createFlow', async () => {
const name = await vscode.window.showInputBox({
placeHolder: 'Enter flow name (e.g., my-flow)',
prompt: 'Create a new Asena Flow'
});

if (name) {
const terminal = vscode.window.createTerminal('Asena');
terminal.show();
            terminal.sendText(`if (Test-Path frontend) { cd frontend }`);
            terminal.sendText(`npx nx g ./tools/generators:create-flow --name=${name}`);
}
});

context.subscriptions.push(disposable);
}

export function deactivate() {}
