import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: [vitePreprocess(), mdsvex({
		extensions: ['.md', '.svx']
	})],
	kit: { adapter: adapter() },
	extensions: ['.svelte', '.svx', '.md']
};

export default config;
