"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
function activate(context) {
    console.log('Asena extension is now active!');
    const disposable = vscode.commands.registerCommand('asena.createFlow', () => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const module = yield vscode.window.showInputBox({
            placeHolder: 'Enter module name (e.g., payment)',
            prompt: 'Asena: Create Flow - Module'
        });
        if (!module)
            return;
        const safeModule = module.replace(/"/g, '').trim();
        if (!safeModule)
            return;
        const transaction = yield vscode.window.showInputBox({
            placeHolder: 'Enter transaction name (e.g., money-transfer)',
            prompt: 'Asena: Create Flow - Transaction'
        });
        if (!transaction)
            return;
        const safeTransaction = transaction.replace(/"/g, '').trim();
        if (!safeTransaction)
            return;
        const workspaceFolder = (_b = (_a = vscode.workspace.workspaceFolders) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.uri.fsPath;
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder is open.');
            return;
        }
        // Prefer running from <workspace>/frontend if it exists.
        const frontendUri = vscode.Uri.joinPath(vscode.Uri.file(workspaceFolder), 'frontend');
        const cwd = yield vscode.workspace.fs.stat(frontendUri).then(() => frontendUri.fsPath, () => workspaceFolder);
        const commandLine = `npx nx g ./tools/generators:create-flow --module="${safeModule}" --transaction="${safeTransaction}"`;
        const task = new vscode.Task({ type: 'asena', task: 'create-flow' }, vscode.TaskScope.Workspace, 'Asena: Create Flow', 'asena', new vscode.ShellExecution(commandLine, { cwd }));
        task.presentationOptions = {
            reveal: vscode.TaskRevealKind.Never,
            panel: vscode.TaskPanelKind.Dedicated,
            clear: true,
            focus: false,
            showReuseMessage: false,
        };
        const endDisposable = vscode.tasks.onDidEndTaskProcess((e) => {
            if (e.execution.task.name !== task.name)
                return;
            endDisposable.dispose();
            if (e.exitCode === 0) {
                vscode.window.showInformationMessage('Flow created successfully.');
            }
            else {
                vscode.window.showErrorMessage('Flow creation failed. Check task output.');
            }
        });
        vscode.window.showInformationMessage('Creating flow...');
        yield vscode.tasks.executeTask(task);
    }));
    context.subscriptions.push(disposable);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map