import { getPosts } from '$lib/posts.js';

export function load() {
	return { posts: getPosts() };
}
