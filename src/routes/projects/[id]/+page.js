import { error } from '@sveltejs/kit';
import { tinkerings } from '$lib/tinkerings.js';

// A project's case study page, e.g. /projects/walks-from-life.
// Only projects with a caseStudy in src/lib/tinkerings.js have one.
export function load({ params }) {
	const index = tinkerings.findIndex((t) => t.id === params.id && t.caseStudy && !t.caseStudy.own);
	if (index < 0) error(404, 'Project not found');

	const project = tinkerings[index];
	// The next project in the list, round to the start again after the last
	const next = tinkerings[(index + 1) % tinkerings.length];

	return { project, next, note: project.caseStudy.note ?? [] };
}

// Tells the build which case study pages to create
export function entries() {
	// A project with caseStudy.own has a hand-built page of its own (e.g. /projects/revisual-booth),
	// so this shared template leaves it alone.
	return tinkerings.filter((t) => t.caseStudy && !t.caseStudy.own).map((t) => ({ id: t.id }));
}
