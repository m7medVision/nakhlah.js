import { marked } from 'marked';

/**
 * Converts markdown content to HTML
 * @param content The markdown content to be converted
 * @returns Processed HTML content
 */
export async function renderMarkdown(content: string): Promise<string> {
    // genreate the html
    const renderer = new marked.Renderer();
    let html = await marked(content, {
        renderer: renderer,
        gfm: true,
        breaks: true,
        pedantic: false,
    });

    html = html.replace(/<pre/g, '<pre dir="ltr"');
    // Add custom styles to the HTML
    return html
}