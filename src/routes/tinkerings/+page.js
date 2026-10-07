import { intro, tinkerings } from '$lib/tinkerings.js';

export function load() {
	return {
		intro,
		tinkerings,
		// The day the site was built, shown as "last updated" in the footer
		updated: new Date().toISOString().slice(0, 10)
	};
}
