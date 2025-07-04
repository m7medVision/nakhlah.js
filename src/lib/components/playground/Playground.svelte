<script lang="ts">
	import CodeEditor from './CodeEditor.svelte';
	import Console from './Console.svelte';

	let { initialCode = '// Type your JavaScript code here\nconsole.log("Hello, Nakhlah.js!");\n' } = $props();

	let code = $state(initialCode);
	let logs = $state<Array<{ type: string; content: any; source?: string }>>([]);
	let editor: CodeEditor;
	let lastInitialCode = $state(initialCode);

	let testingStatus = $state<'idle' | 'loading' | 'success' | 'error'>('idle');
    let testOutputMessage = $state('');

	$effect(() => {
		if (initialCode !== lastInitialCode) {
			lastInitialCode = initialCode;
			code = initialCode;
			if (editor) {
				editor.setValue(initialCode);
			}
            logs = [];
            testingStatus = 'idle';
            testOutputMessage = '';
		}
	});

	function runCode() {
		logs = [];
        testingStatus = 'idle';
        testOutputMessage = '';

		const originalConsole = {
			log: console.log,
			error: console.error,
			warn: console.warn,
			info: console.info
		};

		console.log = (...args) => {
			originalConsole.log(...args);
			logs = [...logs, { type: 'log', content: args.length === 1 ? args[0] : args, source: 'client' }];
		};
		console.error = (...args) => {
			originalConsole.error(...args);
			logs = [...logs, { type: 'error', content: args.length === 1 ? args[0] : args, source: 'client' }];
		};
		console.warn = (...args) => {
			originalConsole.warn(...args);
			logs = [...logs, { type: 'warn', content: args.length === 1 ? args[0] : args, source: 'client' }];
		};
		console.info = (...args) => {
			originalConsole.info(...args);
			logs = [...logs, { type: 'info', content: args.length === 1 ? args[0] : args, source: 'client' }];
		};

		try {
			const executeCode = new Function(code);
			executeCode();
		} catch (error) {
			logs = [...logs, { type: 'error', content: error, source: 'client' }];
		} finally {
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
        testingStatus = 'idle';
        testOutputMessage = '';
	}
</script>

<div class="playground flex h-full flex-col">
	<div class="flex items-center justify-between rounded-t-lg bg-base-300 p-2">
		<div class="text-lg font-bold">Playground</div>
		<div class="space-x-2">
			<button class="btn btn-outline btn-sm" onclick={runCode} disabled={testingStatus === 'loading'}>
				Run Code
			</button>
			<button class="btn btn-outline btn-sm" onclick={resetCode} disabled={testingStatus === 'loading'}>
				Reset
			</button>
		</div>
	</div>

	<div class="grid flex-grow grid-rows-2 gap-2 rounded-b-lg bg-base-200 p-2">
		<div class="h-full">
			<CodeEditor bind:this={editor} initialValue={code} onChange={(value) => (code = value)} />
		</div>

		<div class="h-full flex flex-col">
            {#if testOutputMessage}
                <div
                    class="mb-1 p-2 rounded text-xs font-semibold"
                    class:bg-success={testingStatus === 'success' && !testOutputMessage.includes("No Test")}
                    class:text-success-content={testingStatus === 'success' && !testOutputMessage.includes("No Test")}
                    class:bg-error={testingStatus === 'error'}
                    class:text-error-content={testingStatus === 'error'}
                    class:bg-info={testingStatus === 'success' && testOutputMessage.includes("No Test")}
                    class:text-info-content={testingStatus === 'success' && testOutputMessage.includes("No Test")}
                    class:bg-warning={testingStatus === 'loading'}
                    class:text-warning-content={testingStatus === 'loading'}
                >
                    {testOutputMessage}
                </div>
            {/if}
			<div class="flex-grow min-h-0">
                 <Console {logs} />
            </div>
		</div>
	</div>
</div>

<style>
    .playground > .grid {
        min-height: 0;
    }
    .playground .h-full {
        display: flex;
        flex-direction: column;
        min-height: 0;
    }
    .playground .h-full > .flex-grow > :global(div:first-child),
    .playground .h-full > :global(div:first-child) {
        flex-grow: 1;
        min-height: 0;
        overflow: auto;
    }
</style>