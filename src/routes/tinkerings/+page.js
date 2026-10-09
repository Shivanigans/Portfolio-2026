import { dev } from '$app/environment';
import { intro, tinkerings } from '$lib/tinkerings.js';

export function load() {
	// Every project needs a description in your own words before the site can be built.
	// While you're working on your computer (npm run dev) the page still opens, with a reminder.
	const missing = tinkerings.filter((t) => !t.about?.trim()).map((t) => t.title.replace(/\*/g, ''));
	if (missing.length && !dev) {
		throw new Error(
			`Write the description in your own words for: ${missing.join(', ')}. ` +
				`Fill in "about" for each one in src/lib/tinkerings.js.`
		);
	}

	return { intro, tinkerings };
}
