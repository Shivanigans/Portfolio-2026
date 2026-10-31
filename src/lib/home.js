// The home page story, top to bottom: what you're doing now, what you did before, and for fun.
// Each part has its sections, and may open with a small pink line of its own.
// Each section is a heading and either its project cards or a few loose pictures.
//
// note:      the small pink line above the part's first section. Leave it out for no line.
// tag:       the section's tag, from src/lib/tinkerings.js
// heading:   the section heading
// projects:  the ids of the projects to show, from src/lib/tinkerings.js
// standIns:  projects to show for now, while some of `projects` aren't on the site yet.
//            They fill the gaps in order. Once the real ones are added, the stand-ins drop out.
// images:    instead of project cards, a few loose pictures in a row, just to give an idea of
//            the work. Nothing opens when they're clicked. They share a height and each keeps
//            its own shape, so a tall sheet and a wide one sit together uncropped.
//            Each { src, alt }, where src is a file name in static/tinkerings or a full path
//            like '/projects/stickers-for-ceew/solar-so-good.webp'. Leave src empty for a
//            placeholder box until the real picture is in.
//            A section has either `projects` or `images`, not both.
//
// A project that isn't on the site yet is skipped. A section with nothing to show stays hidden.

// The margin note at the top of the page, before the story starts
export const helloNote = 'Hello, have a look around.';

export const story = [
	{
		note: 'Currently, I’m',
		sections: [
			{
				tag: 'Creative coding',
				heading: 'Tinkering with AI and code',
				projects: ['walks-from-life']
			},
			{
				tag: 'Product & UX',
				heading: 'Untangling the flows people get stuck in',
				projects: ['eci-voter-id-redesign'],
				standIns: ['water-portfolio-map']
			},
			{
				tag: 'UI experiments',
				heading: 'and making the terminal a friendlier place',
				projects: ['shivani-is-online', 'slice-board'],
				standIns: ['context-subtext']
			}
		]
	},
	{
		note: 'Previously, I helped',
		sections: [
			{
				tag: 'Data viz',
				heading: 'Climate research reach an audience beyond PDFs',
				projects: ['ceew-charts-and-viz', 'data-book-illustrations']
			}
		]
	},
	{
		// No note on this part: the heading says it on its own
		sections: [
			{
				tag: 'Illustration',
				heading: 'I enjoy drawing type, people and stories.',
				// Loose pictures rather than project cards, so this reads as a flavour of the
				// drawing rather than another case study. Add more as they're drawn.
				images: [
					{
						src: 'the-walking-club.jpg',
						alt: 'Sketchnote, The Walking Club: three friends stand arms folded while one explains something, the other two thinking “What is she even saying?” and “I zoned out 10 mins ago”. 8K steps everyday!'
					}
				]
			}
		]
	}
];
