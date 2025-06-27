<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import CodeEditor from './CodeEditor.svelte';
	import Console from './Console.svelte';

	export let initialCode = '// Type your JavaScript code here\nconsole.log("Hello, Nakhlah.js!");\n';
	export let slug: string; // Slug for the current course/quiz

	let code = initialCode;
	let logs: Array<{ type: string; content: any; source?: string }> = [];
	let editor: CodeEditor;
	let lastInitialCode = initialCode;

	let testingStatus: 'idle' | 'loading' | 'success' | 'error' = 'idle';
    let testOutputMessage: string = '';

	afterUpdate(() => {
		if (initialCode !== lastInitialCode) {
			lastInitialCode = initialCode;
			code = initialCode;
			if (editor) {
				editor.setValue(initialCode);
			}
            logs = []; // Clear logs when initial code changes
            testingStatus = 'idle'; // Reset testing status
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

	async function handleTestCode() {
		if (!slug) {
			logs = [...logs, { type: 'error', content: 'No slug provided for testing.', source: 'system' }];
            testOutputMessage = 'System Error: Slug not available for testing.';
            testingStatus = 'error';
			return;
		}
        logs = []; // Clear previous logs
		testingStatus = 'loading';
        testOutputMessage = 'Testing in progress...';

		try {
			const response = await fetch('/api/run-quiz', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ code: editor.getValue(), slug })
			});

			const result = await response.json();

			if (response.ok) {
				if (result.success) {
					testingStatus = 'success';
                    testOutputMessage = result.output && result.output.includes("No test case found") ? "Content Processed (No Test)" : "Tests Passed!";
                    if (result.output) {
                        logs = [...logs, { type: 'log', content: `Server Output:\n${result.output}`, source: 'server-test' }];
                    }
                    if (testingStatus === 'success' && !testOutputMessage.includes("No Test")) {
                        if (typeof window !== 'undefined' && (window as any).tsParticles) {
                            (window as any).tsParticles.confetti();
                        }
                    }
				} else {
					testingStatus = 'error';
                    testOutputMessage = `Test Failed: ${result.error || 'Unknown error'}`;
                     if (result.output) {
                        logs = [...logs, { type: 'log', content: `Server Output:\n${result.output}`, source: 'server-test' }];
                    }
				}
			} else {
				testingStatus = 'error';
                testOutputMessage = `Error ${response.status}: ${result.error || result.message || 'Failed to run tests'}`;
                if (result.output) {
                     logs = [...logs, { type: 'log', content: `Server Output:\n${result.output}`, source: 'server-test' }];
                }
			}
		} catch (err: any) {
			testingStatus = 'error';
            testOutputMessage = `Network or system error: ${err.message}`;
			logs = [...logs, { type: 'error', content: `Error submitting test: ${err.message}`, source: 'system' }];
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
			<button class="btn btn-primary btn-sm" on:click={runCode} disabled={testingStatus === 'loading'}>
				Run Code
			</button>
			<button
                class="btn btn-sm"
                class:btn-accent={testingStatus === 'idle' || (testingStatus === 'success' && testOutputMessage.includes("No Test"))}
                class:btn-success={testingStatus === 'success' && !testOutputMessage.includes("No Test")}
                class:btn-error={testingStatus === 'error'}
                on:click={handleTestCode}
                disabled={testingStatus === 'loading' || !slug}
            >
				{#if testingStatus === 'loading'}
					<span class="loading loading-spinner loading-xs"></span>
					Testing...
				{:else if testingStatus === 'success'}
                    {testOutputMessage.includes("No Test") ? "Processed" : "Tests Passed!"}
                {:else if testingStatus === 'error'}
                    Test Failed
				{:else}
					Test Code
				{/if}
			</button>
			<button class="btn btn-outline btn-sm" on:click={resetCode} disabled={testingStatus === 'loading'}>
				Reset
			</button>
		</div>
	</div>

	<div class="grid flex-grow grid-rows-2 gap-2 rounded-b-lg bg-base-200 p-2">
		<!-- Code Editor -->
		<div class="h-full">
			<CodeEditor bind:this={editor} initialValue={code} onChange={(value) => (code = value)} />
		</div>

		<!-- Console Output -->
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
			<div class="flex-grow min-h-0"> {/* Wrapper for Console to make it scrollable */}
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
    /* Ensure Console component itself can be scrollable if its content overflows */
    .playground .h-full > .flex-grow > :global(div:first-child),
    .playground .h-full > :global(div:first-child) { /* Target direct child of CodeEditor/Console wrapper OR Console itself if it's the direct child */
        flex-grow: 1;
        min-height: 0;
        overflow: auto; /* Fallback, ideally Console component handles its own scrolling */
    }
</style>