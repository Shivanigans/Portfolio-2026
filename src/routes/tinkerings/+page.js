import { intro, tinkerings } from '$lib/tinkerings.js';

export function load() {
	// Only projects with a place on the matrix (an x and a y) show there
	return {
		intro,
		tinkerings: tinkerings.filter((t) => t.x != null && t.y != null),
		note: ['A canvas for tinkering with design and AI, fuelling curiosity by doing.', '✥ drag to wander, click to open.']
	};
}
