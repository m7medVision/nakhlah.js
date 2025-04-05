<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { basicSetup } from 'codemirror';
    import { EditorState } from '@codemirror/state';
    import { EditorView } from '@codemirror/view';
    import { javascript } from '@codemirror/lang-javascript';
    
    export let initialValue = '// Type your JavaScript code here\nconsole.log("Hello, Nakhlah.js!");\n';
    export let onChange = (value: string) => {};
    
    let element: HTMLElement;
    let view: EditorView;
    
    // Custom modern theme for CodeMirror
    const modernTheme = EditorView.theme({
        // Base editor styles
        "&": {
            height: "100%",
            fontSize: "15px",
            borderRadius: "0.5rem",
            overflow: "hidden"
        },
        // Editor content area
        ".cm-content": {
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Roboto Mono', monospace",
            padding: "8px 0",
            lineHeight: "1.6"
        },
        // Cursor styling
        ".cm-cursor": {
            borderLeftWidth: "2px",
            borderLeftColor: "#64B5F6",
            borderLeftStyle: "solid"
        },
        // Line number gutter styling
        ".cm-gutters": {
            backgroundColor: "#1E1E2E",
            color: "#565f89",
            border: "none",
            borderRight: "1px solid #313244",
            paddingRight: "8px",
            minWidth: "40px"
        },
        ".cm-lineNumbers .cm-gutterElement": {
            padding: "0 16px 0 8px",
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: "13px",
            fontWeight: "500"
        },
        // Active line highlighting
        ".cm-activeLine": {
            backgroundColor: "rgba(99, 102, 126, 0.15)"
        },
        ".cm-activeLineGutter": {
            backgroundColor: "rgba(99, 102, 126, 0.2)",
            color: "#A9B1D6"
        },
        // Selection styling
        ".cm-selectionMatch": {
            backgroundColor: "rgba(109, 129, 183, 0.3)"
        },
        ".cm-selectionBackground": {
            backgroundColor: "rgba(73, 186, 221, 0.2)"
        },
        // Syntax highlighting
        ".tok-keyword": { color: "#BB9AF7" },
        ".tok-string": { color: "#9ECE6A" },
        ".tok-number": { color: "#FF9E64" },
        ".tok-comment": { color: "#565F89", fontStyle: "italic" },
        ".tok-function": { color: "#7AA2F7" },
        ".tok-operator": { color: "#89DDFF" },
        ".tok-property": { color: "#73DACA" },
        ".tok-variableName": { color: "#C0CAF5" },
        ".tok-typeName": { color: "#2AC3DE" },
        ".tok-className": { color: "#2AC3DE" },
        
        // Dropdown and tooltip styling
        ".cm-tooltip": {
            backgroundColor: "#1E1E2E",
            border: "1px solid #313244",
            borderRadius: "0.5rem",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
            overflow: "hidden"
        },
        ".cm-tooltip-autocomplete": {
            "& > ul": {
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Roboto Mono', monospace",
                fontSize: "13px",
                maxHeight: "200px"
            },
            "& > ul > li": {
                padding: "4px 8px",
                lineHeight: "1.4"
            },
            "& > ul > li[aria-selected]": {
                backgroundColor: "rgba(100, 181, 246, 0.2)",
                color: "#C0CAF5"
            }
        },
        ".cm-completionIcon": {
            color: "#73DACA",
            marginRight: "8px"
        },
        ".cm-completionLabel": {
            color: "#C0CAF5"
        },
        ".cm-completionDetail": {
            color: "#7AA2F7",
            fontStyle: "italic"
        },
        ".cm-completionMatchedText": {
            color: "#FF9E64",
            textDecoration: "none",
            fontWeight: "bold"
        },
        ".cm-panels": {
            backgroundColor: "#1E1E2E",
            color: "#C0CAF5"
        },
        ".cm-panels-top": {
            borderBottom: "1px solid #313244"
        },
        ".cm-panels-bottom": {
            borderTop: "1px solid #313244"
        },
        ".cm-panel button": {
            backgroundColor: "#414868",
            color: "#C0CAF5",
            border: "none",
            borderRadius: "4px",
            padding: "4px 8px",
            marginRight: "8px"
        },
        ".cm-panel button:hover": {
            backgroundColor: "#545c7e"
        },
        ".cm-panel input": {
            backgroundColor: "#1a1b26",
            color: "#C0CAF5",
            border: "1px solid #313244",
            borderRadius: "4px",
            padding: "4px 8px"
        },
        ".cm-search": {
            padding: "8px"
        },
        ".cm-textfield": {
            backgroundColor: "#1a1b26",
            color: "#C0CAF5",
            border: "1px solid #313244",
            borderRadius: "4px"
        },
        ".cm-button": {
            backgroundColor: "#414868",
            color: "#C0CAF5",
            border: "none",
            borderRadius: "4px"
        },
        ".cm-button:hover": {
            backgroundColor: "#545c7e"
        }
    });
    
    onMount(() => {
        // Create and mount the editor
        view = new EditorView({
            state: EditorState.create({
                doc: initialValue,
                extensions: [
                    basicSetup,
                    javascript(),
                    modernTheme,
                    EditorView.updateListener.of(update => {
                        if (update.docChanged) {
                            onChange(update.state.doc.toString());
                        }
                    })
                ]
            }),
            parent: element
        });
    });
    
    onDestroy(() => {
        if (view) {
            view.destroy();
        }
    });
    
    export function getValue() {
        return view ? view.state.doc.toString() : initialValue;
    }
    
    export function setValue(value: string) {
        if (view) {
            view.dispatch({
                changes: {
                    from: 0,
                    to: view.state.doc.length,
                    insert: value
                }
            });
        }
    }
</script>

<div dir="ltr" class="code-editor h-full" bind:this={element}></div>

<style>
    .code-editor {
        overflow: hidden;
        border-radius: 0.5rem;
        background-color: #1a1b26;
        color: #c0caf5;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
    }
    
    /* Pre-load recommended coding fonts if available */
    @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500&display=swap');
    
    /* Scrollbar styling for modern browsers */
    :global(.cm-scroller::-webkit-scrollbar) {
        width: 10px;
        height: 10px;
    }
    
    :global(.cm-scroller::-webkit-scrollbar-track) {
        background: #1E1E2E;
        border-radius: 0.25rem;
    }
    
    :global(.cm-scroller::-webkit-scrollbar-thumb) {
        background: #414868;
        border-radius: 0.25rem;
    }
    
    :global(.cm-scroller::-webkit-scrollbar-thumb:hover) {
        background: #545c7e;
    }
    
    /* Better focus indication */
    :global(.cm-focused) {
        outline: none !important;
        box-shadow: 0 0 0 2px rgba(100, 181, 246, 0.5);
    }
</style>