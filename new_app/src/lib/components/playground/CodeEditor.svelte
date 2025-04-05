<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { EditorState } from '@codemirror/state';
    import { EditorView } from '@codemirror/view';
    import { javascript } from '@codemirror/lang-javascript';
    
    export let initialValue = '// Type your JavaScript code here\nconsole.log("Hello, Nakhlah.js!");\n';
    export let onChange = (value: string) => {};
    
    let element: HTMLElement;
    let view: EditorView;
    
    const createState = (doc: string) => {
        return EditorState.create({
            doc,
            extensions: [
                javascript(),
                EditorView.theme({
                    "&": { height: "100%", fontSize: "14px" },
                    ".cm-scroller": { overflow: "auto" },
                    ".cm-content": { fontFamily: "monospace" },
                    ".cm-line": { padding: "0 8px" }
                }),
                EditorView.updateListener.of(update => {
                    if (update.docChanged) {
                        onChange(update.state.doc.toString());
                    }
                })
            ]
        });
    };
    
    onMount(() => {
        // Initialize the editor
        view = new EditorView({
            state: createState(initialValue),
            parent: element
        });
        
        return () => {
            view.destroy();
        };
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
        background-color: #1e293b;
        color: #e2e8f0;
    }
</style>