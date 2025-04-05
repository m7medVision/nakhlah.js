<script lang="ts">
    import { onMount } from 'svelte';
    import { afterUpdate } from 'svelte';
    import CodeEditor from './CodeEditor.svelte';
    import Console from './Console.svelte';
    
    export let initialCode = '// Type your JavaScript code here\nconsole.log("Hello, Nakhlah.js!");\n';
    
    let code = initialCode;
    let logs: Array<{ type: string; content: any }> = [];
    let editor: CodeEditor;
    let lastInitialCode = initialCode;
    
    afterUpdate(() => {
        // Check if initialCode prop has changed
        if (initialCode !== lastInitialCode) {
            lastInitialCode = initialCode;
            code = initialCode;
            if (editor) {
                editor.setValue(initialCode);
            }
        }
    });
    
    function runCode() {
        logs = [];
        
        const originalConsole = {
            log: console.log,
            error: console.error,
            warn: console.warn,
            info: console.info
        };
        
        // Override console methods to capture output
        console.log = (...args) => {
            originalConsole.log(...args);
            logs = [...logs, { type: 'log', content: args.length === 1 ? args[0] : args }];
        };
        
        console.error = (...args) => {
            originalConsole.error(...args);
            logs = [...logs, { type: 'error', content: args.length === 1 ? args[0] : args }];
        };
        
        console.warn = (...args) => {
            originalConsole.warn(...args);
            logs = [...logs, { type: 'warn', content: args.length === 1 ? args[0] : args }];
        };
        
        console.info = (...args) => {
            originalConsole.info(...args);
            logs = [...logs, { type: 'info', content: args.length === 1 ? args[0] : args }];
        };
        
        try {
            // Execute the code
            const executeCode = new Function(code);
            executeCode();
        } catch (error) {
            logs = [...logs, { type: 'error', content: error }];
        } finally {
            // Restore original console methods
            console.log = originalConsole.log;
            console.error = originalConsole.error;
            console.warn = originalConsole.warn;
            console.info = originalConsole.info;
        }
    }
    
    function resetCode() {
        code = initialCode;
        if (editor) {
            editor.setValue(initialCode);
        }
        logs = [];
    }
</script>

<div class="playground flex flex-col h-full">
    <div class="flex justify-between items-center p-2 bg-base-300 rounded-t-lg">
        <div class="text-lg font-bold">Playground</div>
        <div class="space-x-2">
            <button class="btn btn-sm btn-primary" on:click={runCode}>
                Run Code
            </button>
            <button class="btn btn-sm btn-outline" on:click={resetCode}>
                Reset
            </button>
        </div>
    </div>
    
    <div class="flex-grow grid grid-rows-2 gap-2 p-2 bg-base-200 rounded-b-lg">
        <!-- Code Editor -->
        <div class="h-full">
            <CodeEditor 
                bind:this={editor} 
                initialValue={initialCode} 
                onChange={(value) => code = value} 
            />
        </div>
        
        <!-- Console Output -->
        <div class="h-full">
            <Console {logs} />
        </div>
    </div>
</div>