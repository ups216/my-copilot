import * as vscode from "vscode";
import { SidebarProvider } from "./SidebarProvider";
import { AIServiceCache, AIService } from "./AIServices";

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "my-copilot" is now active!');

    const sidebarProvider = new SidebarProvider(context.extensionUri);
    AIServiceCache.globalState = context.globalState;

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            "my-copilot-sidebar",
            sidebarProvider
        )
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(
            "my-copilot.sendCodeCompletionReqest",
            async () => {
                const editor = vscode.window.activeTextEditor;
                if (editor) {
                    editor.edit((editBuilder) => {
                        const currentContent = editor.document.getText();
                        AIService.getChatCompletion(currentContent).then(
                            (response) => {
                                console.log("NEW CONTENT \n" + currentContent);
                                vscode.commands.executeCommand(
                                    "my-copilot.getCodeCompletionResult"
                                );
                            }
                        );
                    });
                }
            }
        )
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(
            "my-copilot.getCodeCompletionResult",
            async () => {
                const editor = vscode.window.activeTextEditor;
                if (editor) {
                    editor.edit((editBuilder) => {
                        const currentContent = editor.document.getText();
                        const newContent =
                            currentContent + AIServiceCache.getCache();
                        const wholeDocumentRange =
                            editor.document.validateRange(
                                new vscode.Range(
                                    0,
                                    0,
                                    Number.MAX_SAFE_INTEGER,
                                    Number.MAX_SAFE_INTEGER
                                )
                            );
                        editBuilder.replace(wholeDocumentRange, newContent);
                        console.log("NEW CONTENT \n" + newContent);
                        AIServiceCache.deleteCache();
                    });
                }
            }
        )
    );

    context.subscriptions.push(
        vscode.commands.registerCommand("my-copilot.askQuestion", async () => {
            const answer = await vscode.window.showInformationMessage(
                "How are you!",
                "Yes",
                "No"
            );

            if (answer === "Yes") {
                vscode.window.showInformationMessage("I am fine, thanks!");
            } else {
                vscode.window.showInformationMessage(
                    "I am sorry to hear that!"
                );
            }
        })
    );
}

export function deactivate() {}
