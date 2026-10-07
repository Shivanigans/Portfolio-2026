import { error } from '@sveltejs/kit';
import { getPosts } from '$lib/posts.js';

// Opens the matching .md file for the web address, e.g. /blog/hello-world
export async function load({ params }) {
	try {
		const post = await import(`../../../posts/${params.slug}.md`);
		return { content: post.default, meta: post.metadata };
	} catch {
		error(404, 'Post not found');
	}
}

// Tells the build which post pages to create
export function entries() {
	return getPosts().map((post) => ({ slug: post.slug }));
}
