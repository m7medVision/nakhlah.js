import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import fs from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';

// Determine the base path for testcases dynamically
// Assuming this file is in new_app/src/routes/api/run-quiz/+server.ts
// and testcases are in new_app/src/lib/server/testcases/
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const projectRoot = path.resolve(__dirname, '../../../../'); // Adjust based on actual depth
const testcasesBasePath = path.join(projectRoot, 'src/lib/server/testcases');
const sandboxRunnerPath = path.join(projectRoot, 'src/lib/server/sandbox_runner.cjs');


export const POST: RequestHandler = async ({ request }) => {
    try {
        const body = await request.json();
        const { code, slug } = body;

        if (!code || typeof code !== 'string') {
            throw error(400, 'Missing or invalid "code" in request body');
        }
        if (!slug || typeof slug !== 'string') {
            throw error(400, 'Missing or invalid "slug" in request body');
        }

        const testCaseFileName = `${slug}.js`;
        // Basic security check for slug to prevent path traversal
        if (slug.includes('..') || slug.includes('/') || !/^[a-zA-Z0-9_-]+$/.test(slug.split('/').pop() || slug)) {
            console.error(`Invalid slug format detected: ${slug}`);
            throw error(400, 'Invalid slug format');
        }
        const testCasePath = path.join(testcasesBasePath, testCaseFileName);

        let testCaseCode: string;
        try {
            await fs.access(testcasesBasePath); // Check if base directory exists
        } catch (e) {
            console.error('Testcases base directory not found at:', testcasesBasePath, e);
            throw error(500, 'Server configuration error: Testcases directory missing.');
        }

        try {
            testCaseCode = await fs.readFile(testCasePath, 'utf-8');
        } catch (e) {
            console.warn(`Test case not found for slug: ${slug} at ${testCasePath}. This might be intentional if the lesson has no test.`);
            // If the test case doesn't exist, assume no test means automatic pass or specific handling
            return json({ success: true, output: 'No test case found for this lesson. Content processed.', error: null });
        }

        try {
            await fs.access(sandboxRunnerPath);
        } catch (e) {
            console.error('Sandbox runner script not found at:', sandboxRunnerPath, e);
            throw error(500, 'Server configuration error: Sandbox runner missing.');
        }

        return new Promise((resolve, reject) => {
            const child = spawn('node', [sandboxRunnerPath], { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] });

            let stdoutData = '';
            let stderrData = '';

            child.stdout?.on('data', (data) => {
                stdoutData += data.toString();
            });

            child.stderr?.on('data', (data) => {
                stderrData += data.toString();
            });

            child.on('message', (message: { success: boolean; output: string; error?: string }) => {
                resolve(json(message));
                if (!child.killed) child.kill();
            });

            child.on('error', (err) => {
                console.error('Failed to start child process.', err);
                reject(error(500, `Execution error: ${err.message}`));
                 if (!child.killed) child.kill();
            });

            child.on('close', (code) => {
                if (!child.killed) {
                    // This path means 'message' was not received from sandbox_runner.js
                    console.error(`Child process exited prematurely or without IPC message. Code: ${code}. Stderr: ${stderrData}. Stdout: ${stdoutData}`);
                    // Avoid rejecting if already resolved/rejected to prevent double error handling
                    // SvelteKit's error() throws, so direct reject isn't always needed if error() is called.
                    // However, if we want to return a JSON response indicating failure:
                    resolve(json({ success: false, output: stdoutData, error: stderrData || `Execution failed or sandbox did not report result. Exit code: ${code}` }));
                }
            });

            child.stdin?.write(JSON.stringify({ userCode: code, testCode: testCaseCode }));
            child.stdin?.end();
        });

    } catch (err: any) {
        console.error('Error in POST /api/run-quiz:', err);
        if (err.status && err.body) {
            const message = typeof err.body === 'string' ? err.body : (err.body.message || 'An unexpected error occurred');
            // error() throws, so no need to return its result
            // SvelteKit handles the response for thrown errors.
            // To be absolutely sure we don't fall through, we can just call it:
            // throw error(err.status, message);
            // But since this is the top-level catch, the original throw is sufficient.
             return json({ success: false, output: '', error: message }, { status: err.status });
        }
        // For non-SvelteKit errors or unhandled ones
        return json({ success: false, output: '', error: 'An unexpected server error occurred.' }, { status: 500 });
    }
};
