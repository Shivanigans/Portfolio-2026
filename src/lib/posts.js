// Finds every .md file in src/posts and reads its details (title, date, summary).
// You never need to edit this file. Just add posts to src/posts.

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
