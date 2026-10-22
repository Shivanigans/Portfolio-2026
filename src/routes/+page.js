import { helloNote, story } from '$lib/home.js';
import { tagSlug, tinkerings } from '$lib/tinkerings.js';

// The home page story, worked out from src/lib/home.js: each section's projects that are on
// the site, with its stand-ins filling any gaps
export function load() {
	const byId = new Map(tinkerings.map((t) => [t.id, t]));
	const onSite = (ids = []) => ids.map((id) => byId.get(id)).filter(Boolean);

	const parts = story
		.map((part) => ({
			note: part.note,
			sections: part.sections
				.map((section) => {
					const items = onSite(section.projects);
					const gaps = section.projects.length - items.length;
					items.push(...onSite(section.standIns).slice(0, gaps));
					return { ...section, slug: tagSlug(section.tag), items };
				})
				.filter((section) => section.items.length)
		}))
		.filter((part) => part.sections.length);

	return { parts, tinkerings, note: [helloNote] };
}
