import * as vscode from "vscode";
import { SidebarProvider } from "./SidebarProvider";

export function activate(context: vscode.ExtensionContext) {
    const sidebarProvider = new SidebarProvider(context.extensionUri);
    console.log('Congratulations, your extension "my-copilot" is now active!');

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            "my-copilot-sidebar",
            sidebarProvider
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
