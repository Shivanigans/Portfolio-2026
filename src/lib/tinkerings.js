// Your Tinkerings projects. This is the only file you need to edit to update them.
// Both Tinkerings pages (the list and the /try matrix) and the project popup read from here.
//
// To add or change a project:
// 1. Put its images or videos in static/tinkerings
// 2. Edit the list below.
//
// id           short name for its web address, lowercase with dashes, e.g. 'silence-task'
//              (opens at /try/tinkerings?project=silence-task). Must be unique.
// title        the project name, shown under its card and as the popup heading.
//              Wrap words in *stars* to show them in italics, e.g. 'Silence, *task!*'
// x, y         where it sits on the matrix, 0 to 100.
//              x: 0 = hand-drawn (left), 100 = technical (right)
//              y: 0 = build for work (top), 100 = build for fun (bottom)
// width        how wide its card is on the matrix, as a share of the matrix width (e.g. 18)
// note         short grey words after the title under the card, e.g. 'meme in motion'
// media        thumbnail file name in static/tinkerings. Images, GIFs or videos
//              (.mp4 or .webm play on a silent loop). Leave '' for a blank card.
// description  short text for the list version of the Tinkerings page, about 2 lines
// about        the text shown when the project is opened in the popup
// aboutLink    optional words at the end of `about` that link to `link`
// details      rows in the popup, each { label: '...', value: '...' }
// images       optional extra images further down the popup, each { src: '...', alt: '...' }
//              (src is a file name in static/tinkerings, or a full path like '/blog/x.webp')
// gallery      optional grid of cards with a caption each, each { src: '...', caption: '...' }
// link         optional outside link, e.g. the walks site. Leave '' for none.
// linkText     words for that link on the list version of the page, e.g. 'Explore the walks here.'
//
// Anything marked PLACEHOLDER is a stand-in for you to replace.
// The left and right arrows in the popup go round the matrix quadrants, worked out from x and y.
// The "last updated" date in the footer sets itself each time the site is built.

export const intro =
	'This space currently serves as a canvas for tinkering with design and AI, fuelling curiosity by doing and building my instinct.';

export const tinkerings = [
	{
		id: 'walks-from-life',
		title: 'Walks from life',
		x: 52,
		y: 54,
		width: 21.6,
		note: 'Documenting the shapes of my walks',
		media: '/blog/Walking_with_a_dog-front.webp',
		description:
			'Walks from life was born out of noticing the shapes my walks take and how movement tells a story.',
		about:
			'An ongoing documentation project that draws my Strava walks as a gallery of postcards, each one flipping to show the details of the walk. It captures the eccentricities of each walk and the shape of the movement.',
		aboutLink: 'Explore the project here.',
		details: [
			{ label: 'Walks', value: '9 so far' },
			{ label: 'Made with', value: 'Claude Code' },
		],
		gallery: [
			{ src: '/blog/Walking_with_a_dog-front.webp', caption: 'Walking with a dog' },
			{ src: '/blog/Dog_walked_me-front.webp', caption: 'Dog walked me' }
		],
		link: 'https://walks-from-life.vercel.app',
		linkText: 'Explore the walks here.'
	},
	{
		id: 'silence-task',
		title: 'Silence, *task!*',
		x: 70,
		y: 6,
		width: 14.4,
		note: 'meme in motion',
		media: 'Slice Board Demo.mp4',
		description:
			'My personal task tracker, an Opera browser extension. Tasks get sliced with a katana, Fruit Ninja style, and a "silence, <task>" meme shows on completion.',
		about:
			'A task tracker built as a browser extension for short work sessions of about three tasks. Tasks are crossed off by slicing them with a katana, in the style of Fruit Ninja. Each completed task brings up a "silence, task" meme, captioned "shivani is working".',
		details: [
			{ label: 'Type', value: 'Opera browser extension' },
			{ label: 'Made with', value: 'Claude Code' },
		],
		link: ''
	},
	{
		id: 'sticker-press',
		title: 'Sticker Press',
		x: 25,
		y: 14,
		width: 23,
		note: 'motion experiment',
		media: 'Orbit Motion Exploration.mp4',
		description:
			'A motion experiment: playing with my existing stickers for motion work. I built a tool to process and tweak this.',
		about:
			'A motion experiment using stickers I designed for CEEW and Revisual Labs. I built a browser tool that processes existing artwork into die-cut print looks and a stop-motion animation, where the stickers are placed one by one.',
		details: [
			{ label: 'Type', value: 'Motion experiment' },
			{ label: 'Made with', value: 'Claude Code' },
		],
		link: ''
	},
	{
		id: 'portrait-in-p5js',
		title: 'Portrait in p5.js (work in progress)',
		x: 14,
		y: 57,
		width: 15.8,
		note: '',
		media: 'portrait-in-code.png',
		description: 'From my p5.js portraits project, where I draw in code. A slow project, work in progress.',
		about:
			'An exploration of creative coding, where I am trying to recreate my monogram using p5.js brushes. I am writing the code myself to understand how drawing works in code.',
		details: [
			{ label: 'Made with', value: 'p5.js and p5.brush' },
			{ label: 'Status', value: 'Work in progress' },
		],
		link: ''
	}
];
