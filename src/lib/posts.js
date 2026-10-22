// Finds every .md file in src/posts and reads its details (title, date, summary).
// You never need to edit this file. Just add posts to src/posts.
//
// Footnotes: number them in the text with <sup>1</sup>, <sup>2</sup> and so on, and list them
// in the post's details block. They show in the margin beside the post (under it on phones):
//
//   footnotes:
//     - Slice Board, my task tracker, now lives in my browser.
//     - Took three tries.

export function getPosts() {
	const files = import.meta.glob('/src/posts/*.md', { eager: true });

	return Object.entries(files)
		.map(([path, file]) => ({
			slug: path.split('/').pop().replace('.md', ''),
			...file.metadata
		}))
		.filter((post) => !post.draft)
		.sort((a, b) => new Date(b.date) - new Date(a.date)); // newest first
}

export function formatDate(date) {
	return new Date(date).toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	});
}
