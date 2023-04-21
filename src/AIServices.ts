/* eslint-disable @typescript-eslint/naming-convention */
import fetch from "node-fetch";

const api_key = "{YOUR_API_KEY}";
const base_url = "https://{YOUR_AOAI_INSTANCE}.openai.azure.com/";
const deployment_name = "{YOUR_DEPLOYMENT_NAME}";
const endpoint = `${base_url}/openai/deployments/${deployment_name}/completions?api-version=2022-12-01`;

import * as vscode from "vscode";

export class AIService {
    static async getChatCompletion(prompt: string): Promise<string> {
        console.log("getChatCompletion called with prompt: " + prompt);
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": api_key,
            },
            body: JSON.stringify({
                prompt: prompt,
                max_tokens: 500,
            }),
        });

        const data = await response.json();
        console.log(data);
        let text = data.choices[0].text;
        console.log(text);
        AIServiceCache.setCache(text);
        return text;
    }
}

const KEY = "AIServiceCache";

export class AIServiceCache {
    static globalState: vscode.Memento;

    static setCache(text: string) {
        return this.globalState.update(KEY, text);
    }

    static getCache(): string | undefined {
        return this.globalState.get(KEY);
    }

    static deleteCache() {
        return this.globalState.update(KEY, "");
    }
}
