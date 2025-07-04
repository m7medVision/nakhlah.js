<script lang="ts">
    export let logs: Array<{ type: string; content: any }> = [];
</script>

<div dir="ltr" class="console overflow-y-auto p-4 h-full bg-neutral text-neutral-content rounded-lg">
    <div class="font-mono text-sm">
        {#if logs.length === 0}
            <div class="text-gray-400 italic">// Console output will appear here</div>
        {:else}
            {#each logs as log}
                <div class="py-1 border-b border-gray-700 last:border-0">
                    {#if log.type === 'log'}
                        <span class="text-green-400">› </span>
                        <span>{JSON.stringify(log.content)}</span>
                    {:else if log.type === 'error'}
                        <span class="text-red-400">✗ </span>
                        <span class="text-red-300">{log.content.toString()}</span>
                    {:else if log.type === 'warn'}
                        <span class="text-yellow-300">⚠ </span>
                        <span class="text-yellow-200">{JSON.stringify(log.content)}</span>
                    {:else if log.type === 'info'}
                        <span class="text-blue-300">ℹ </span>
                        <span>{JSON.stringify(log.content)}</span>
                    {/if}
                </div>
            {/each}
        {/if}
    </div>
</div>