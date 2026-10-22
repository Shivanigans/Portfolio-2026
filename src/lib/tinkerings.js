// Your projects. This is the only file you need to edit to update them.
// The home page, the Projects page, the Tinkerings matrix and the project popup all read from here.
//
// To add or change a project:
// 1. Put its images or videos in static/tinkerings
// 2. Edit the list below.
//
// id           short name for its web address, lowercase with dashes, e.g. 'silence-task'
//              (opens at /tinkerings?project=walks-from-life). Must be unique.
// title        the project name, shown under its card and as the popup heading.
//              Wrap words in *stars* to show them in italics, e.g. 'Silence, *task!*'
// note         short grey line under the title, on its card and in the popup, e.g. 'A browser extension'
// tags         one or two of the tags listed further down, e.g. ['Creative coding', 'Data viz']
// x, y         where it sits on the matrix, 0 to 100. Leave both out to keep it off the matrix
//              (it still shows on the home page and the Projects page).
//              x: 0 = hand-drawn (left), 100 = technical (right)
//              y: 0 = build for work (top), 100 = build for fun (bottom)
// width        how wide its card is on the matrix, as a share of the matrix width (e.g. 18)
// media        thumbnail file name in static/tinkerings. Images, GIFs or videos
//              (.mp4 or .webm play on a silent loop). Leave '' for a blank card.
// thumb        optional still picture for its card, if the card shouldn't move while the popup
//              plays the video, e.g. '/projects/sticker-press/sticker-press.jpg'
// cover        optional main visual at the top of the popup (full width), if it should differ from media
// images       optional pictures for the top of the popup, side by side in two columns,
//              e.g. ['walks-from-life.png', '/blog/Walking_with_a_dog-front.webp'].
//              Without it, the popup shows the cover (or media) on its own, at full width.
// description  a short summary, about 2 lines (not shown at the moment, kept from the old list page)
// aboutHeading optional small heading above `about`, e.g. 'About'
// about        the text shown when the project is opened in the popup, in your own words.
//              Start a new paragraph with \n\n. Link words like this: [Graphical](https://www.graphicalui.com)
// details      rows in the popup, each { label: '...', value: '...' }
// moreImages   optional extra images further down the popup, each { src: '...', alt: '...' }
//              (src is a file name in static/tinkerings, or a full path like '/blog/x.webp')
// gallery      optional grid of cards with a caption each, each { src: '...', caption: '...' }
// quotes       optional stack of quote cards, shown at the top of the popup instead of a picture.
//              Each { text: '...', who: '...' }. Put a meme in curly brackets straight after
//              its word, e.g. 'Uh {umm}, how do I go about doing that?' The memes are in
//              static/tinkerings/context-subtext: umm, ithink, ifeel, and, said, huh, question,
//              ironic, actually, lockin, lockin1, cried, slay, lowkeyslay, please, evil
// story        optional write-up after `about`, in order. Each part is one of:
//                { text: '...' }                         a paragraph
//                { image: '...', alt: '...', caption: '...' }  a picture with a caption
//                                                        (image '' shows a placeholder box)
//                { cards: true }                         where the quote cards go
//                { heading: '...' }                      a small heading
//                { points: ['...', '...'] }              a list
//                { closing: '...' }                      a last line, in italics
//              With a story, the quote cards sit where { cards: true } is, not at the top.
// behance      for a project documented on Behance: its Behance link. Its card opens Behance in a
//              new tab instead of the popup, so it needs no about.
// link         optional outside link, e.g. the walks site. Leave '' for none.
//              With a link, the popup shows an "Explore the project" button next to the title.
// thumbZoom    optional: zooms the card picture in, to crop off edges, e.g. { scale: 1.18, origin: '50% 44%' }
// stickers     optional: stickers laid out on its card's picture frame instead of a picture,
//              which visitors can peel off and move. Each { src, alt, x, y, w, turn }
//              (see Stickers for CEEW below)
// caseStudy    optional: gives the project its own page, /projects/walks-from-life, which its
//              card on Home and the Projects page opens instead of the popup. It has:
//                intro     one line under the title
//                details   rows between two lines, each { label: 'Role', value: '...' }
//                note      the margin note on its page, a list of short paragraphs
//                parts     the page, in order. Each part can have a heading, text (a list of
//                          paragraphs), images (always two, side by side: each { src, alt },
//                          or { label } for a placeholder box) and a caption under the images
//                links     links at the end, each { label: '...', href: '...' }
//
// Anything marked PLACEHOLDER is a stand-in for you to replace.
// On phones the projects show in one list, in quadrant order, worked out from x and y.

// The tags, in the order the home page and the Projects page show them
export const tags = ['Product & UX', 'Data viz', 'Illustration', 'UI experiments', 'Creative coding'];

// A tag as it appears in a web address, e.g. 'Data viz' becomes 'data-viz' (/projects?tag=data-viz)
export const tagSlug = (tag) =>
	tag
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');

export const intro =
	'This space currently serves as a canvas for tinkering with design and AI, fuelling curiosity by doing and building my instinct.';

export const tinkerings = [
	{
		id: 'walks-from-life',
		title: 'Walks from life',
		tags: ['Creative coding', 'Data viz'],
		x: 52,
		y: 54,
		width: 16,
		media: '/blog/Walking_with_a_dog-front.webp',
		// Zoomed in on its card so the postcard's cream edges and caption strip don't show
		thumbZoom: { scale: 1.24, origin: '50% 40%' },
		cover: 'walks-from-life.png',
		images: ['walks-from-life.png', '/blog/Walking_with_a_dog-front.webp'],
		description:
			'Walks from life was born out of noticing the shapes my walks take and how movement tells a story.The shapes are unique to each of the walks. (I’ve) started with data from 9 walks while looking beyond the step count',
	
		about: 'Walks from life is a way to notice how movement tells a story. The shapes are unique to each of the walks. I’ve started with data from 9 walks while looking beyond a step count. The walks are from my life, and I’ve tried to capture the essence of each walk in a shape.',
		gallery: [
			{ src: '/blog/Walking_with_a_dog-front.webp', caption: 'Walking with a dog' },
			{ src: '/blog/Dog_walked_me-front.webp', caption: 'Dog walked me' }
		],
		link: 'https://walks-from-life.vercel.app',
		// From the agreed mock (handover, 22 Oct 2026). The placeholder boxes wait for real pictures.
		caseStudy: {
			intro: 'Serial walker, any distance is walkable if you have enough will.',
			details: [
				{ label: 'Role', value: 'Everything: walking, drawing, scripting' },
				{ label: 'Type', value: 'Data viz · Creative coding' },
				{ label: 'Data', value: 'My own Strava walks' },
				{ label: 'Status', value: 'Ongoing' }
			],
			note: [
				'Started after Priti Panduragan’s VizChitra workshop on walks as a way to capture data.',
				'↘ Every walk shares one scale, so a long walk can bleed off the card.'
			],
			parts: [
				{
					images: [
						{
							src: '/blog/Walking_with_a_dog-front.webp',
							alt: 'Postcard front: a walk drawn as a red line over a yellow map with little trees'
						},
						{ label: 'postcard back' }
					],
					caption: 'Front shows the walk and its distance. Flip it for the story.'
				},
				{
					heading: 'Context',
					text: [
						'I like maps, but a map is made for everyone. I draw my own, with the clues Google Maps doesn’t have: a hoarding, something peculiar at a crossway.',
						'The line is a drawing made on foot. A friend pausing at mango stalls, a dog walk’s loops, back and forth at an airport.'
					]
				},
				{
					heading: 'Work in progress',
					images: [{ label: 'early plate' }, { label: 'shared-scale test' }]
				},
				{
					heading: 'Output',
					images: [
						{ src: '/blog/Dog_walked_me-front.webp', alt: 'Postcard: Dog walked me' },
						{ src: 'walks-from-life.png', alt: 'The walks from life gallery page' }
					]
				}
			],
			links: [
				{ label: 'See the gallery', href: 'https://walks-from-life.vercel.app' },
				{ label: 'Read the project note', href: '/blog/September-finds' }
			]
		}
	},
	{
		id: 'sticker-press',
		title: 'Sticker Press',
		tags: ['UI experiments', 'Illustration'],
		note: 'Building my own tool for a motion experiment',
		x: 25,
		y: 14,
		width: 16,
		media: 'Orbit Motion Exploration.mp4',
		thumb: '/projects/sticker-press/sticker-press.jpg', // the video's first frame, kept still
		description:
			'A motion experiment: playing with my existing stickers for motion work. I built a tool to process and tweak this.',
		about:
			'I came across [Graphical](https://www.graphicalui.com) by Josh Puckett and Adam Michela on Twitter, with an orbital UI motion, and thought I’d recreate it with existing assets I have. These are some stickers I made for my previous organisations, CEEW and Revisual Labs.\n\nFor a one-time task, we can definitely do a one-shot prompt, but making tweaks and achieving a finished look is much easier when you can adjust parameters via a tool. So I made two browser-based tools: Sticker Press, which gives the stickers a die-cut shape and papery feel and exports them as MP4 or GIF, and an orbital motion tool where I can pick and drop PNGs and export the animation as code.',
		link: ''
	},
	{
		id: 'portrait-in-p5js',
		title: 'Portrait in p5.js',
		tags: ['Creative coding'],
		note: 'Understand how drawing in p5.js works',
		x: 14,
		y: 57,
		width: 16,
		media: 'portrait-in-code.png',
		description: 'From my p5.js portraits project, where I draw in code. A slow project, work in progress.',
		about:
			'I love drawing on paper, and I was introduced to drawing with code through [Schubert’s workshop at VizChitra](https://draw-with-data.netlify.app). While you can one-shot prompt most things now, it’s important for me to understand the foundations of how things are built.\n\nI started with p5.js, drawing my monogram through basic shapes. My biggest learning was understanding that this grid is not the same one introduced to us in maths class. In code, the starting point (0, 0) sits at the top-left corner, and the numbers grow as you go down, not up. This is a WIP, more on this as I continue to explore this.',
		link: ''
	},
	{
		id: 'context-subtext',
		title: 'A visual dictionary for my fillers',
		tags: ['UI experiments'],
		note: 'Building a context layer for my own understanding with an LLM',
		x: 80,
		y: 74,
		width: 16,
		media: 'context-subtext.png',
		description:
			'Quote cards from my chats with my LLM, with a little dictionary of the filler words I use.',
		about:
			'My starting point was thinking about how type can convey tone with actual voice input. Then I saw the words taking shape while I talked, and saw the pauses. The fillers are raw material of their own.',
		story: [
			{
				image: 'context-subtext.png',
				alt: 'A quote set in type with small hamster memes placed between the words: The horrors persist but so do I.',
				caption: 'My first try styled for reference, typeface is PP Mondwest by PangramPangram.'
			},
			{
				text: 'So I did a small exercise with Claude where I assigned memes to my disfluencies (words like uh, umm, anddd) and to a few tones and slang I use, while pulling quotes from my conversations with it.'
			},
			{
				image: 'context-subtext-vocab.jpg',
				alt: 'A sheet of sixteen memes each with the word or tone it stands for, such as umm (thinks), HUH (confused) and I already said this.',
				caption: 'The assigned personal vocabulary.'
			},
			{ text: 'Here are a few cherry-picked by me samples Claude produced, from both sides of the conversation.' },
			{ cards: true },
			{ closing: 'How we talk to our LLMs is how we talk to the world but for now 100% of my vocabulary is reserved for humans.' }
		],
		quotes: [
			{ text: 'Uh {umm}, how do I go about doing that, actually?', who: '– you, in a project nobody asked for' },
			{
				text: 'And I feel {ifeel} like what would be a good starting point is, um {umm}, I tried to basically ask... I tried to basically have... why am I missing this? {huh}',
				who: '– you, in a serious project'
			},
			{ text: 'no no I dont understnad this {huh}', who: '– you, in a slow project' },
			{
				text: 'dawg {lockin} the prompt does not include the work for finding location for offline centre',
				who: '– you, in a serious project, getting less serious'
			},
			{ text: 'Ugly {actually}', who: '– you, in a chat about one letter' },
			{
				text: 'I couldn’t identify the serif in your samples {cried}, so I used a Baskerville.',
				who: '– Claude, in the chat where this started'
			},
			{
				text: 'Your message cut off after the comma though. What was the second part? {question}',
				who: '– Claude, in a serious project, again'
			},
			{ text: 'exactly. {actually}', who: '– you, in a serious project, in reply' },
			{ text: 'That clears up a misreading {ifeel} on my part.', who: '– Claude, in the chat where this started' },
			{ text: 'Fair. {cried} I was over-strategising a thought dump.', who: '– Claude, in a not serious project' },
			{ text: 'Thank you, it felt right for stickers. {lowkeyslay}', who: '– Claude, in a sticker animation' },
			{ text: 'I’m not an influencer. {ironic}', who: '– you, in a serious project, off topic' }
		],
		link: ''
	},
	{
		id: 'shivani-is-online',
		title: 'Footer design',
		note: 'A live presence indicator',
		tags: ['UI experiments'],
		// PLACEHOLDER spot on the matrix: move it by changing x and y
		x: 93,
		y: 0,
		width: 16,
		media: '/projects/shivani-is-online/tab-status-thumbnail-4x3.png',
		cover: '/projects/shivani-is-online/tab-status-transition-4x3.mp4',
		aboutHeading: 'About',
		about:
			'A small line at the bottom of my site that shows whether I’m at my laptop, and how many tabs I have open. Online, the tabs show up as tally marks. Away, the marks sink and grass grows in their place.',
		// Tools, Process and Output, switched off for now: UI experiments show just their About.
		// To show them again, remove the // at the start of each line.
		// story: [
		// 	{ heading: 'Tools' },
		// 	{ text: 'Figma, SvelteKit, Firebase Realtime Database, a small Opera extension, Claude.' },
		// 	{ heading: 'Process' },
		// 	{
		// 		text: 'It started with a question: can a website see how many tabs I have open? Not on its own. Browsers keep that private, but an extension can count my own tabs.'
		// 	},
		// 	{
		// 		text: 'So a tiny extension sends my tab count to a database every minute, like a heartbeat. The site reads it, and if it hasn’t heard from me in three minutes, it says I’m away.'
		// 	},
		// 	{
		// 		text: 'For the visuals, I wanted the count to feel hand-made, so tabs became tally marks. Grass for away felt right because it’s made of the same strokes. I drew both in Figma.'
		// 	},
		// 	{
		// 		text: 'The transition: tally marks sink into the ground, then the grass rises strand by strand and sways. Coming back, it plays in reverse. The status words sit on a rough highlighter swipe, green for online and yellow for away.'
		// 	},
		// 	{
		// 		text: 'A few edge cases along the way: it doesn’t replay the animation every time the page loads, it keeps my last count while I’m away so the right marks sink, and it follows the page’s background colour.'
		// 	},
		// 	{ heading: 'Output' },
		// 	{ text: 'The live line, at the bottom of this site, and the transition loop.' }
		// ],
		link: ''
	},
	{
		id: 'multitudes-tooltip',
		// The second "tooltip" is raised small, like a tooltip on a tooltip (see Title.svelte)
		title: 'Tooltip^tooltip^',
		note: 'A hidden punchline, one step at a time',
		tags: ['UI experiments'],
		// PLACEHOLDER spot on the matrix: move it by changing x and y
		x: 78,
		y: 33,
		width: 16,
		media: '/projects/tooltip-tooltip/tooltip-tooltip.webp', // the turtles demo, its stack open
		// The three demos, live in the popup (static/projects/tooltip-tooltip/)
		demos: [
			{ src: '/projects/tooltip-tooltip/turtles.html', title: 'Demo: It’s turtles all the way down' },
			{ src: '/projects/tooltip-tooltip/goodnight.html', title: 'Demo: Hope you have a goodnight' },
			{ src: '/projects/tooltip-tooltip/beanstalk.html', title: 'Demo: Jack and the beanstalk', wide: true }
		],
		aboutHeading: 'About',
		about:
			'A tooltip that tells a story in steps. Hover ‘multitudes’ on my landing page, then keep hovering.\n\nOriginally a prompt from [Soren Iverson](https://paste.design/day/12?accent=ff2a8e&density=2).',
		link: ''
	},
	{
		id: 'miss-you-screensaver',
		title: 'Miss you screensaver',
		note: 'A screensaver with the people you miss',
		tags: ['Creative coding', 'UI experiments'],
		// Build for fun, leaning technical, with hand-drawn faces
		x: 33,
		y: 86,
		width: 16,
		media: '/projects/bouncy-friends/bouncy-friends.png', // the four in a row, kept still on the card
		cover: '/projects/bouncy-friends/bouncy-friends-4x3.mp4', // the 14s clip, in the popup
		aboutHeading: 'About',
		about:
			'Screensavers are a bit of a lost art. Miss you screensaver brings them back, with the people you miss.\n\nAdd your friends’ faces, as photos or doodles, and they bounce around your screen like the old DVD logo, changing colour at every wall. The motion borrows that nostalgia, and the look comes from mine: playing with craft paper and making collages.\n\nIt’s for anyone who misses their friends and spends too much time on their laptop. I’ll be publishing the tool soon, with a simple guide to setting it up as your screensaver.\n\nWindows setup uses the free [Webview2 WebPage Screensaver](https://github.com/muro-dot/Webview2_WebPage_Screensaver) by muro-dot.',
		details: [{ label: 'Status', value: 'Work in progress, to be updated' }],
		link: ''
	},
	{
		id: 'chaos-mode',
		title: 'Chaos mode',
		note: 'A hypnosis easter egg',
		tags: ['UI experiments'],
		// PLACEHOLDER spot on the matrix: move it by changing x and y
		x: 93,
		y: 97,
		width: 16,
		media: '', // PLACEHOLDER: add its capture here
		about: '',
		link: ''
	},
	{
		id: 'water-portfolio-map',
		title: 'Water portfolio map',
		note: 'UI/UX case study',
		tags: ['Product & UX'],
		media: '/projects/water-portfolio-map/water-portfolio-map.webp', // its Behance cover
		behance: 'https://www.behance.net/gallery/257250019/Water-Program-Portfolio-Interactive-Dashboard'
	},
	{
		id: 'ceew-charts-and-viz',
		title: 'CEEW charts and viz',
		note: 'CEEW',
		tags: ['Data viz'],
		media: '/projects/ceew-charts-and-viz/ceew-charts-and-viz.jpg',
		behance: 'https://www.behance.net/gallery/254613877/Data-vis-CEEW'
	},
	{
		id: 'stickers-for-ceew',
		title: 'Stickers for CEEW',
		note: 'CEEW',
		tags: ['Illustration'],
		media: '/projects/stickers-for-ceew/stickers-for-ceew.png', // the whole sheet, for the popup
		// The stickers on its card's frame, which can be peeled off and moved (StickerSheet.svelte).
		// x, y: where the top left sits; w: how wide; all as a share of the frame. turn: degrees.
		stickers: [
			{ src: '/projects/stickers-for-ceew/dont-hate-mitigate.png', alt: 'Heart sticker: Don’t hate, mitigate', x: 3, y: 4, w: 28.5, turn: -6 },
			{ src: '/projects/stickers-for-ceew/dont-be-fossil-minded.png', alt: 'Cloud sticker: Don’t be fossil-minded', x: 35, y: 6, w: 31, turn: 3 },
			{ src: '/projects/stickers-for-ceew/powered-by-peer-review.png', alt: 'Sticky note sticker: Powered by peer review', x: 70, y: 4, w: 25.5, turn: 5 },
			{ src: '/projects/stickers-for-ceew/solar-so-good.png', alt: 'Solar panel sticker: Solar, so good', x: 2, y: 52, w: 31, turn: 4 },
			{ src: '/projects/stickers-for-ceew/water-you-waiting-for.png', alt: 'Hourglass sticker: Water you waiting for?', x: 33, y: 60, w: 37.5, turn: -3 },
			{ src: '/projects/stickers-for-ceew/2-degrees-2-much.png', alt: 'Flame sticker: 2 degrees 2 much!', x: 71, y: 51, w: 27.5, turn: -5 }
		],
		about: '', // in your own words, when you're ready
		link: ''
	}
];

// Taken off the Tinkerings page for now, to come back to later.
// To put it back: move this block into the list above (before the closing ];)
// and remove the // at the start of each line.
//
//	{
//		id: 'slice-board',
//		title: 'Slice Board',
//		tags: ['UI experiments'],
//		note: 'A browser extension',
//		x: 70,
//		y: 6,
//		width: 16,
//		media: 'Slice Board Demo.mp4',
//		description:
//			'My personal task tracker, an Opera browser extension. Tasks get sliced with a katana, Fruit Ninja style, and a "silence, <task>" meme shows on completion.',
//		// TO WRITE: describe this project in your own words. The site won't build until you do.
//		about: '',
//		link: ''
//	},
