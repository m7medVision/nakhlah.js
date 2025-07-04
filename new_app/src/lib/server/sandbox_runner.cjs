const vm = require('vm');
const util = require('util');

let SCRIPT_EXECUTION_TIMEOUT = 5000; // 5 seconds timeout for the script execution

let inputData = '';

process.stdin.on('data', (chunk) => {
    inputData += chunk;
});

process.stdin.on('end', () => {
    try {
        const { userCode, testCode } = JSON.parse(inputData);
        runInSandbox(userCode, testCode);
    } catch (e) {
        sendResult(false, '', `Failed to parse input: ${e.message}`);
        process.exit(1);
    }
});

function sendResult(success, output, error) {
    if (process.send) {
        process.send({ success, output, error: error || null });
    } else {
        // Fallback if IPC is not available (should not happen when spawned correctly)
        console.log(JSON.stringify({ success, output, error: error || null }));
    }
}

function runInSandbox(userCode, testCode) {
    let output = [];
    let isPass = false; // This will be set by the testCode
    let msg = ''; // This can be set by the testCode to provide more info on failure

    const sandbox = {
        console: {
            log: (...args) => {
                output.push(args.map(arg => util.inspect(arg, { depth: null, colors: false })).join(' '));
            },
            error: (...args) => {
                output.push(`ERROR: ${args.map(arg => util.inspect(arg, { depth: null, colors: false })).join(' ')}`);
            },
            warn: (...args) => {
                output.push(`WARN: ${args.map(arg => util.inspect(arg, { depth: null, colors: false })).join(' ')}`);
            }
        },
        // Define variables that test cases might expect (isPass, msg)
        // These need to be mutable from within the VM, so pass them as properties of an object
        // or handle their state carefully. For simplicity, testCode will assign to these.
        // This means testCode needs to be aware it's running in this specific sandboxed environment.
        // A more robust solution might involve a custom test runner DSL.
        __test_state: {
            isPass: false,
            msg: ''
        }
    };

    // Make 'isPass' and 'msg' directly available in the global scope of the sandbox
    // and allow them to be modified by the test code.
    // This is a common pattern for simple test harnesses run via eval/vm.
    // Test cases from the old app likely rely on this.
    sandbox.isPass = false;
    sandbox.msg = '';


    const context = vm.createContext(sandbox);

    try {
        // Execute user's code
        const userScript = new vm.Script(userCode);
        userScript.runInContext(context, { timeout: SCRIPT_EXECUTION_TIMEOUT });

        // Execute test code
        // The test code is expected to set `isPass = true` if tests pass,
        // and optionally `msg` for more details.
        const testScript = new vm.Script(testCode);
        testScript.runInContext(context, { timeout: SCRIPT_EXECUTION_TIMEOUT });

        // Retrieve isPass and msg from the context after test execution
        isPass = context.isPass; // or context.__test_state.isPass if using the object wrapper
        msg = context.msg;       // or context.__test_state.msg

        if (isPass) {
            sendResult(true, output.join('\n') || 'Test passed.', null);
        } else {
            sendResult(false, output.join('\n'), msg || 'Test failed. No specific message.');
        }

    } catch (e) {
        // Check if it's a timeout error
        if (e.message && e.message.includes('Script execution timed out')) {
             sendResult(false, output.join('\n'), 'Script execution timed out.');
        } else {
             sendResult(false, output.join('\n'), e.message || 'An unknown error occurred during execution.');
        }
    } finally {
        process.exit(0); // Ensure the child process exits
    }
}

// Safety net: if the process is still running after a longer timeout, exit.
// This is to prevent orphaned processes if something goes wrong with stdin 'end' or other logic.
setTimeout(() => {
    if (process.send) { // check if it has already sent a result
        // If it hasn't sent a result and exited, force exit.
        // This implies an issue in runInSandbox not calling sendResult or process.exit
    }
    console.error("Sandbox runner global timeout reached. Forcing exit.");
    process.exit(1);
}, SCRIPT_EXECUTION_TIMEOUT + 2000); // A bit longer than individual script timeout
