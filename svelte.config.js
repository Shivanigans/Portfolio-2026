import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Lets .md files (your blog posts) work like pages
	extensions: ['.svelte', '.md'],
	preprocess: [mdsvex({ extensions: ['.md'] })],
	kit: {
		// Builds the site as plain static files you can host anywhere
		// fallback makes a 404.html, so hosts can show your "Page not found" page
		adapter: adapter({ fallback: '404.html' })
	}
};

export default config;
