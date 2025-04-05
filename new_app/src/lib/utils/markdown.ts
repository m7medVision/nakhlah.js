import { marked } from 'marked';

/**
 * Converts markdown content to HTML
 * @param content The markdown content to be converted
 * @returns Processed HTML content
 */
export function renderMarkdown(content: string): string {
    // Configure marked options if needed
    marked.setOptions({
        gfm: true, // GitHub flavored markdown
        breaks: true, // Convert \n to <br>
        sanitize: false, // Allow HTML tags in markdown
        smartLists: true,
        smartypants: true, // Typographic replacements like quotes and dashes
        langPrefix: 'language-', // CSS language prefix for code blocks
    });
    
    // Convert markdown to HTML
    return marked.parse(content);
}