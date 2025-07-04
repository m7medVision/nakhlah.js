// This file should only be imported from server-side code
import { promises as fs } from 'node:fs';
import path from 'node:path';

// Cache for pre-code
const precodeCache = new Map<string, string>();
const defaultCode = `console.log("سلام");`;

/**
 * Gets the pre-code (default code for the editor) for a specific lesson
 * @param slug The lesson slug
 * @returns The pre-code as a string
 */
export async function getPreCode(slug: string): Promise<string> {
    // Check cache first
    if (precodeCache.has(slug)) {
        return precodeCache.get(slug)!;
    }
    
    try {
        // Construct the path to the pre-code file
        const precodePath = path.join(process.cwd(), 'src', 'lib', 'precodes', `${slug}.js`);
        
        // Check if the file exists and read it
        const text = await fs.readFile(precodePath, 'utf-8');
        
        if (text && text.length > 0) {
            // Store in cache and return
            precodeCache.set(slug, text);
            return text;
        }
        
        return defaultCode;
    } catch (error) {
        console.log(`Pre-code not found for ${slug}, using default code`);
        return defaultCode;
    }
}