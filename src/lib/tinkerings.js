// Your Tinkerings projects. This is the only file you need to edit to update them.
// The Tinkerings matrix and the project popup read from here.
//
// To add or change a project:
// 1. Put its images or videos in static/tinkerings
// 2. Edit the list below.
//
// id           short name for its web address, lowercase with dashes, e.g. 'silence-task'
//              (opens at /tinkerings?project=walks-from-life). Must be unique.
// title        the project name, shown under its card and as the popup heading.
//              Wrap words in *stars* to show them in italics, e.g. 'Silence, *task!*'
// note         short grey line under the title in the popup, e.g. 'A browser extension'
// x, y         where it sits on the matrix, 0 to 100.
//              x: 0 = hand-drawn (left), 100 = technical (right)
//              y: 0 = build for work (top), 100 = build for fun (bottom)
// width        how wide its card is on the matrix, as a share of the matrix width (e.g. 18)
// media        thumbnail file name in static/tinkerings. Images, GIFs or videos
//              (.mp4 or .webm play on a silent loop). Leave '' for a blank card.
// cover        optional main visual at the top of the popup, if it should differ from media
// description  a short summary, about 2 lines (not shown at the moment, kept from the old list page)
// about        the text shown when the project is opened in the popup, in your own words.
//              While any project has an empty about, the site will not build.
//              Start a new paragraph with \n\n. Link words like this: [Graphical](https://www.graphicalui.com)
// aboutLink    optional words at the end of `about` that link to `link`
// details      rows in the popup, each { label: '...', value: '...' }
// images       optional extra images further down the popup, each { src: '...', alt: '...' }
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
// link         optional outside link, e.g. the walks site. Leave '' for none.
// linkText     words for that link, e.g. 'Explore the walks here.' (not shown at the moment)
//
// Anything marked PLACEHOLDER is a stand-in for you to replace.
// On phones the projects show in one list, in quadrant order, worked out from x and y.

export const intro =
	'This space currently serves as a canvas for tinkering with design and AI, fuelling curiosity by doing and building my instinct.';

export const tinkerings = [
	{
		id: 'walks-from-life',
		title: 'Walks from life',
		x: 52,
		y: 54,
		width: 16,
		media: '/blog/Walking_with_a_dog-front.webp',
		cover: 'walks-from-life.png',
		description:
			'Walks from life was born out of noticing the shapes my walks take and how movement tells a story.The shapes are unique to each of the walks. (I’ve) started with data from 9 walks while looking beyond the step count',
	
		about: 'Walks from life is a way to notice how movement tells a story. The shapes are unique to each of the walks. I’ve started with data from 9 walks while looking beyond a step count. The walks are from my life, and I’ve tried to capture the essence of each walk in a shape.',
		aboutLink: 'Explore the project here.',
		gallery: [
			{ src: '/blog/Walking_with_a_dog-front.webp', caption: 'Walking with a dog' },
			{ src: '/blog/Dog_walked_me-front.webp', caption: 'Dog walked me' }
		],
		link: 'https://walks-from-life.vercel.app',
		linkText: 'Explore the walks here.'
	},
	{
		id: 'sticker-press',
		title: 'Playing with Motion',
		note: 'Building my own tool for a motion experiment',
		x: 25,
		y: 14,
		width: 16,
		media: 'Orbit Motion Exploration.mp4',
		description:
			'A motion experiment: playing with my existing stickers for motion work. I built a tool to process and tweak this.',
		about:
			'I came across [Graphical](https://www.graphicalui.com) by Josh Puckett and Adam Michela on Twitter, with an orbital UI motion, and thought I’d recreate it with existing assets I have. These are some stickers I made for my previous organisations, CEEW and Revisual Labs.\n\nFor a one-time task, we can definitely do a one-shot prompt, but making tweaks and achieving a finished look is much easier when you can adjust parameters via a tool. So I made two browser-based tools: Sticker Press, which gives the stickers a die-cut shape and papery feel and exports them as MP4 or GIF, and an orbital motion tool where I can pick and drop PNGs and export the animation as code.',
		link: ''
	},
	{
		id: 'portrait-in-p5js',
		title: 'Portrait in p5.js',
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
	}
];

// Taken off the Tinkerings page for now, to come back to later.
// To put it back: move this block into the list above (before the closing ];)
// and remove the // at the start of each line.
//
//	{
//		id: 'silence-task',
//		title: 'Silence, *task!*',
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
