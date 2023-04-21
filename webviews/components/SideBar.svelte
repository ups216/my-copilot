<script lang="ts">
    import { onMount } from "svelte";

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
</script>

<h1>Hello My Copilot</h1>
