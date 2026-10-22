// The home page story, top to bottom: what you're doing now, what you did before, and for fun.
// Each part has a note, which shows in the margin while its sections are on screen, and its
// sections. Each section is a heading and its project cards.
//
// note:      the margin note while this part is in view
// tag:       the section's tag, from src/lib/tinkerings.js
// heading:   the section heading
// projects:  the ids of the projects to show, from src/lib/tinkerings.js
// standIns:  projects to show for now, while some of `projects` aren't on the site yet.
//            They fill the gaps in order. Once the real ones are added, the stand-ins drop out.
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
		note: 'Previously, I turned',
		sections: [
			{
				tag: 'Data viz',
				heading: 'Climate research reach an audience beyond PDFs',
				projects: ['ceew-charts-and-viz', 'data-book-illustrations']
			}
		]
	},
	{
		note: 'I draw to make sense of the world',
		sections: [
			{
				tag: 'Illustration',
				heading: 'I enjoy drawing puns and people',
				projects: ['stickers-for-ceew', 'rvl-comics-and-merch']
			}
		]
	}
];
