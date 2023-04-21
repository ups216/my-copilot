<script lang="ts">
    import { onMount } from "svelte";

    let chathistory: Array<{ text: string }> = [];
    let input: string = "";

    const api_key = "YOUR_API_KEY";
    const base_url = "https://{YOUR_INSTANCE_NAME}.openai.azure.com";
    const deployment_name = "YOUR_DEPLOYMENT_NAME";
    const endpoint = `${base_url}/openai/deployments/${deployment_name}/completions?api-version=2022-12-01`;

    onMount(async () => {
        window.addEventListener("message", async (event) => {
            const message = event.data;
            console.log({ message });
            switch (message.type) {
                case "testingMessage":
                    console.log(`testingMessage`);
                    break;
            }
        });

        tsvscode.postMessage({
            type: "onInfo",
            value: "My Copilot: hello there",
        });
    });

    async function sendAskMessage(prompt: string) {
        console.log("sendAskMessage called with prompt: " + prompt);
        chathistory.push({ text: "me: " + input });
        chathistory = [...chathistory];
        input = "";
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
        let answer = data.choices[0].text;
        console.log(answer);

        chathistory.push({ text: "copilot: " + answer });

        chathistory = [...chathistory];
    }
</script>

<h1>My Copilot</h1>
<div id="chathistory">
    <ul>
        {#each chathistory as chat}
            <li>{chat.text}</li>
        {/each}
    </ul>
</div>
<div style="text-align: left; width:80%">
    <input
        type="text"
        class="inputbox"
        bind:value={input}
        on:keydown={(event) => {
            if (event.key === "Enter") {
                sendAskMessage(input);
            }
        }}
    />
</div>
<div style="text-align: right; width:80%">
    <button
        class="askbutton"
        on:click={() => {
            sendAskMessage(input);
        }}>Ask</button
    >
</div>

<style>
    /**add style to vertical algin input at the bottom of page, align to the right*/
    .askbutton {
        position: absolute;
        bottom: 5px;
        width: 20%;
        height: 30px;
    }
    /**add style to vertical algin input at the bottom of page, and on top of askbutton*/
    .inputbox {
        position: absolute;
        background-color: azure;
        bottom: 5px;
        width: 65%;
        align-self: left;
        height: 18px;
    }
    /** unordered list without bullet points */
    ul {
        list-style-type: none;
        margin-bottom: 20px;
    }
    ul li {
        margin-bottom: 10px;
    }
</style>
