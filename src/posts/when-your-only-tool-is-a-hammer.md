---
title: October bakes
date: 2026-10-31
summary: ten small things I made in October, and what they taught me about my own tools
tags: 
---

<script>
	import BlogMedia from '$lib/components/BlogMedia.svelte';
	import FaviconPuzzle from '$lib/components/FaviconPuzzle.svelte';
	import StoryTooltip from '$lib/StoryTooltip.svelte';

	// The word and its one bubble live up here, not down in the line itself: a component
	// written inside a sentence has its quote marks curled into ‘ ’ along with the prose,
	// which Svelte then can't read.
	const word = 'continues.';
	const laugh = ['😼 mwahaha'];
</script>

<blockquote class="opening"><p><strong>When your only tool is a hammer, everything looks like a nail</strong></p><p class="from">- Marc Schütz<br />- From Abraham Maslow’s <em>The Psychology of Science</em></p></blockquote>

This is something I heard from Marc Schütz of <a href="https://schultzschultz.com" target="_blank" rel="noopener">schultzschultz</a>, a German creative studio. He was quoting the law of the instrument during an online talk. I’ve known about their work because they build free tools to play around with Type from the pre-AI era. More on this later.

For October, I wanted to start posting my work and work-in-progress. Two trial reels and one Twitter post later… I’m here writing about it. I have a long way to go.

It’s been 3 months of working along with Claude Code - definitely enough of a courtship period to understand and develop my own process of working with it. I wanted to make 10 small projects with it. The idea was to play with motion, learn how creative coding works and do some fun UI explorations.

## Things I made this month

**1. My website’s footer** aka a tab presence indicator: tally marks that turn into a grass tuft when you are away, with an Opera extension and Firebase behind it.

<BlogMedia file="/projects/shivani-is-online/tab-status-transition-4x3.mp4" alt="The footer's tally marks sinking into the ground, and the grass tuft rising strand by strand in their place" />

My favourite one. I love how the grass strokes rhymed with the tally bars. Also, a cool crossover of my data viz sensibilities and passion for grass.

You’d probably see it live if you scroll to the footer of my website. The patch is hand-drawn; it has a little sway to it. I'm swayed.

**2. [Orbit Motion Maker:](/tinkering?project=sticker-press)** A tool for icons orbiting centred text, with reordering, per-item sizing and GIF export.

<BlogMedia file="/tinkerings/Orbit Motion Exploration.mp4" alt="Stickers orbiting a line of centred text" />

This is the first time I made a tool to tweak the final result I wanted. This is a GIF of some stickers I played around with. A subtool I made before this gave the stickers a die-cut feel and look, and let me experiment with texture.

I realised this was a one-off task to achieve a specific motion only. Looking back, I would want a library of micro-animation work to be possible within the tool, so it becomes reusable. This opened the gates of motion design for me so I’m happy for now.

**3. [A visual dictionary for my fillers:](/tinkering?project=context-subtext)** Meme images placed inline to carry tone in voice notes.

<BlogMedia name="quote-card" alt="A quote card reading: Your message cut off after the comma though. What was the second part? with a bespectacled cat meme after it, and under it a line reading Claude, in a serious project, again" caption="One of the quote cards Claude made" />

I use voice notes to communicate with Claude sometimes and asked it to work on adding memes to give them a contextual tone. Made a little dictionary of how I use stickers to talk, and let Claude pick up cues and use them.

[Made a quote card deck here.](/tinkering?project=context-subtext) This is where the silliness began.

**4. Chaos mode hypnosis easter egg:** A WebGL spiral with synthesised sound, built over about 13 iterations. This was made as a result of being inspired by Soren Iverson’s talk at Config India 2026 on ***taking stupid seriously***. No screenshot, just find it on my website.

**5. [Nested tooltip:](/tinkering?project=multitudes-tooltip)** Tooltips that nest inside each other as a tool for storytelling. This tooltip was originally a prompt from Soren Iverson. The silliness <span class="story"><StoryTooltip {word} steps={laugh} /></span> I played with three variants; try them here.

**6. [Miss you screensaver:](/tinkering?project=miss-you-screensaver)** A DVD-style bouncing screensaver with your friends’ faces.

<BlogMedia file="/projects/bouncy-friends/bouncy-friends-4x3.mp4" alt="Friends' faces bouncing around the screen like the old DVD logo, changing colour at every wall" />

I made a custom screensaver because I missed my long-distance friends and this way their presence remains in my daily life. This was also done first as a tool and I shall publish it soon.

I also made it usable on my PC using the free <a href="https://github.com/muro-dot/Webview2_WebPage_Screensaver" target="_blank" rel="noopener">Webview2 WebPage Screensaver</a> by muro-dot.

**7. Favicon sliding puzzle:** A 3x3 swap puzzle for my monogram on the About page.

I’ve been playing a lot of puzzle and trivia games, so this was born out of it. Although this remains in the shadows, you can try it here.

<FaviconPuzzle />

**8. <a href="https://merakiarchive.vercel.app/#archive" target="_blank" rel="noopener">Meraki Archive:</a>** A non-commercial microsite preserving editions of Meraki, NIFT Hyderabad’s student magazine.

<BlogMedia file="/projects/meraki-archive/meraki-archive.jpg" alt="The Meraki archive home page: the masthead, a line calling it an unofficial archive, and three issue covers in a row - Desi Punk, Figuring It Out and Mirage" />

I’ve always wanted Meraki to have a place on the internet since my time in the magazine from 2021 to 2023. I did this for my 20-year-old self whose life changed after being in the magazine and working with cool people.

**9. This website and graphics:** I bought a domain and solidified the presence of this space, worked on 10 different nav bar styles, downloaded 17 fonts and am currently in the process of moving in.

**10. Physical note taking**

<div class="notes"><BlogMedia name="physical-notes-1" alt="A notebook page of sketchnotes from the talk: looping circles linking playground, client work, type design and teaching, with the line, from these failures we create something very personal feeling" /><BlogMedia name="physical-notes-2" alt="A notebook page from the talk, boxed in the middle: if you have a hammer, you think of everything as a nail, with write your own tool written under it" /></div>

Listening to Mark Schultz’s talk this past week was a full-circle moment. He spoke about how they build tools in-house to play along with things, something I have also been trying my hand at for the past month.

For November, we try to not limit our thinking to a hammer, we drop it and try our hand at what the hands can make.

Some notes I picked up. I will write more about how I'm thinking about tools in a later blog. For now, toodles.

---

<p class="disclosure"><em>AI disclosure: All parts of this blog were written by me, while a grammatical check was performed by AI.</em></p>

<style>
	/* The two notebook pages from the talk, side by side. They are a glance at the notes rather than something
	   to read here (the post says the thinking comes in a later one), so they sit small and
	   side by side. On a phone they go one under another at full width, where they can
	   actually be read. */
	.notes {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.75rem;
		margin-top: 2rem;
	}

	.notes :global(figure) {
		margin: 0;
	}

	@media (max-width: 48rem) {
		.notes {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	/* "continues." looks like "multitudes" on the home page: the word in the deep pink
	   (the pink that's meant to be read), with a dotted underline in the brighter pink */
	.story :global(.word) {
		color: var(--pink-deep);
		text-decoration-color: var(--pink);
	}
</style>
