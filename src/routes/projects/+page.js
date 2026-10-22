import { tags, tinkerings } from '$lib/tinkerings.js';

// The Projects page: every project, with a filter for each tag
export function load() {
	return {
		tags,
		tinkerings,
		note: ['Somewhere between thinking and tinkering I found thinkering.']
	};
}
