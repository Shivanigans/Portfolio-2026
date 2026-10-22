import { error } from '@sveltejs/kit';
import { getPosts } from '$lib/posts.js';

// Every post's raw text, to count its words for the reading time
const texts = import.meta.glob('/src/posts/*.md', { query: '?raw', import: 'default', eager: true });

// Opens the matching .md file for the web address, e.g. /blog/hello-world
export async function load({ params }) {
	try {
		const post = await import(`../../../posts/${params.slug}.md`);
		const words = (texts[`/src/posts/${params.slug}.md`] ?? '').split(/\s+/).filter(Boolean).length;
		return {
			content: post.default,
			meta: post.metadata,
			// About 200 words a minute, never less than one
			minutes: Math.max(1, Math.round(words / 200)),
			// Footnotes from the post's details block show in the margin (see posts.js)
			footnotes: post.metadata.footnotes ?? []
		};
	} catch {
		error(404, 'Post not found');
	}
}

// Tells the build which post pages to create
export function entries() {
	return getPosts().map((post) => ({ slug: post.slug }));
}
