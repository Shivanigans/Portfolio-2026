// Marks the numbered items in a blog post, so the styles can give each one room above it.
//
// An item is a paragraph that *begins* with a bold run-in heading starting with a number
// and a dot, the way the posts are written:
//
//   **1. My website's footer** aka a tab presence indicator: ...
//
// Each one gets class="item", and src/routes/blog/[slug]/+page.svelte spaces them out.
//
// This can't be done in CSS alone. "p:has(> strong:first-child)" looks right, but CSS
// counts only elements when it says "first child", so it also matches a paragraph with
// plain words in front of its first bold bit, like "...Config India 2026 on **taking
// stupid seriously**." Here the words really are looked at, so only true items match.

export function numberedItems() {
	return (tree) => {
		for (const node of tree.children ?? []) {
			if (node.type !== 'paragraph') continue;
			const first = node.children?.[0];
			if (first?.type !== 'strong') continue;
			if (!/^\s*\d+\./.test(text(first))) continue;
			node.data ??= {};
			node.data.hProperties = { ...node.data.hProperties, class: 'item' };
		}
	};
}

// All the words inside a node, with any links and emphasis flattened out
function text(node) {
	if (typeof node.value === 'string') return node.value;
	return (node.children ?? []).map(text).join('');
}
