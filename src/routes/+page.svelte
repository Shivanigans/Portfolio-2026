<script>
	// Home: the hello, then the story of your work in sections (a heading and either its project
	// cards or, where a section is there for a flavour rather than a case study, a few pictures),
	// the TL;DR line, and the way to reach you. The socials and the live status line come after,
	// from the layout. Each part of the story opens with its own small pink line.
	// Each piece fades and slides up as it scrolls into view (use:reveal, src/lib/reveal.js).
	// Click a card and its popup opens right here.
	// The story's lines, headings and projects are in src/lib/home.js, the projects in
	// src/lib/tinkerings.js, the email link in src/lib/links.js.
	import Arrow from '$lib/components/Arrow.svelte';
	import Media from '$lib/components/Media.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import ProjectPanel from '$lib/components/ProjectPanel.svelte';
	import StoryTooltip from '$lib/StoryTooltip.svelte';
	import ToTop from '$lib/components/ToTop.svelte';
	import { emailLink } from '$lib/links.js';
	import { ProjectPopup } from '$lib/projectPopup.svelte.js';
	import { reveal } from '$lib/reveal.js';

	let { data } = $props();

	// Each card's link, by section and project, so focus can go back to the card that was
	// clicked when its popup closes (a project could show in more than one section)
	const cards = {};
	let lastCard = '';
	const cardOf = (id) =>
		lastCard.endsWith(`:${id}`)
			? cards[lastCard]
			: Object.entries(cards).find(([key]) => key.endsWith(`:${id}`))?.[1];
	const projects = new ProjectPopup(() => data.tinkerings, cardOf);

	function openFrom(section, item) {
		lastCard = `${section.slug}:${item.id}`;
		projects.open(item);
	}
</script>

<svelte:head>
	<title>shivanigans</title>
</svelte:head>

<!-- While the popup is open, the page behind can't be clicked or tabbed into -->
<div class="home" inert={!!projects.current}>
	<section class="hello">
		<!-- The space before the dash doesn’t break, so no line starts with it -->
		<h1>hi, I’m Shivani&nbsp;— maker of visuals, teller of stories, builder of experiences</h1>
		<p>
			I enjoy building tools and experiences that are usable and driven by impact, and
			sometimes purely for fun.
		</p>
	</section>

	{#each data.parts as part}
		<div class="part">
			{#each part.sections as section, i (section.slug)}
				<section class="topic" aria-labelledby="topic-{section.slug}">
					<!-- The part's own line, once, just above its first heading -->
					<!-- A part may have no line of its own, and then nothing goes here -->
					{#if i === 0 && part.note}<p class="story-line" use:reveal>{part.note}</p>{/if}
					<h2 id="topic-{section.slug}" use:reveal>{section.heading}</h2>

					{#if section.images}
						<!-- Loose pictures: nothing opens when they're clicked, they're only here to
						     give an idea of the work -->
						<ul class="sketches">
							{#each section.images as picture, n (n)}
								<li use:reveal={0.1}>
									<Media src={picture.src ?? ''} alt={picture.alt ?? ''} />
								</li>
							{/each}
						</ul>
					{:else}
						<ul class="grid">
							{#each section.items as item (item.id)}
								<li use:reveal={0.1}>
									<ProjectCard
										{item}
										priority={section === data.parts[0].sections[0] && item === section.items[0]}
										bind:el={cards[`${section.slug}:${item.id}`]}
										onopen={(t) => openFrom(section, t)}
									/>
								</li>
							{/each}
						</ul>
					{/if}
				</section>
			{/each}
		</div>
	{/each}

	<section class="closing" use:reveal>
		<!-- "multitudes" tells a little story on desktops: point at it, then keep pointing
		     (src/lib/StoryTooltip.svelte). On phones and tablets it's just the word. -->
		<h2 class="tldr" id="multitudes">
			TL;DR, I contain <span class="story-desktop"
				><StoryTooltip word="multitudes" steps={['fortitude,', 'gratitude,', 'attitude', 'and vicissitude.']} /></span
			><span class="story-plain">multitudes</span>.
		</h2>
		<p>I’m open to full-time and freelance work. Get in touch if you’d like to collaborate!</p>

		<div class="actions">
			<a class="pill-button" href="/projects">View all projects</a>
			<!-- Opens a new email to you, in a new tab -->
			<a class="pill-button filled" href={emailLink} target="_blank" rel="noopener">Send email <Arrow dir="out" /></a>
		</div>
	</section>
</div>

<ToTop away={!!projects.current} />

{#if projects.current}
	<ProjectPanel
		bind:this={projects.panel}
		project={projects.current}
		origin={projects.thumbOf}
		top={56}
		onclosed={projects.closed}
	/>
{/if}

<style>
	/* The hello: National Park at 64px, then a small line in Paper Mono */
	h1 {
		max-width: 38rem;
		margin-bottom: 1.5rem;
	}

	.hello p {
		max-width: none;
		margin: 0;
		font-size: var(--type-body);
	}

	/* The story: 64px between the sections of one chapter ("Currently, I'm" and so on), and
	   112px between chapters, so each reads as its own group. More before the first. */
	.part:first-of-type {
		margin-top: 4rem;
	}

	.topic {
		margin-top: 4rem;
	}

	.part + .part > .topic:first-child {
		margin-top: 7rem;
	}

	h2 {
		margin-bottom: 1rem;
		text-wrap: balance;
	}

	/* The line that opens each part of the story ("Currently, I'm"): small, deep pink,
	   Paper Mono, sitting just above the first heading of that part */
	.story-line {
		margin: 0 0 0.5rem;
		font-size: var(--type-label);
		color: var(--pink-deep);
	}

	/* Two cards to a row, sharing the column between them */
	.grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1.5rem 1.25rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	/* A flavour of the drawing: the pictures in a row, each pinned up at its own small angle
	   so they read as sheets laid on the page rather than another row of cards */
	.sketches {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: 1.25rem;
		margin: 0.5rem 0 0;
		padding: 0;
		list-style: none;
	}

	/* They share a height and keep their own shapes, so a tall sheet and a wide one sit
	   together without either being cropped */
	.sketches li {
		height: clamp(14rem, 24vw, 21rem);
		border: 1px solid var(--line);
		background: var(--paper);
	}

	.sketches li:nth-child(3n + 1) {
		rotate: -1.5deg;
	}

	.sketches li:nth-child(3n + 2) {
		rotate: 0.75deg;
	}

	.sketches li:nth-child(3n) {
		rotate: -0.5deg;
	}

	.sketches li :global(img),
	.sketches li :global(video) {
		width: auto;
		height: 100%;
	}

	/* An empty slot keeps the 4:3 box Media gives it */
	.sketches li :global(.placeholder) {
		width: auto;
		height: 100%;
	}

	/* The ending: the TL;DR line at 48px, the open-to-work line, then the two buttons */
	.closing {
		margin-top: 7rem;
	}

	.tldr {
		margin-bottom: 1.25rem;
		font-size: var(--type-display);
		line-height: 1.15;
	}

	/* "multitudes" is in the deep pink (the pink for text, 6.0:1 on white), on phones too */
	.story-desktop :global(.word),
	.story-plain {
		color: var(--pink-deep);
	}

	/* and gets a dotted pink underline (decoration, so the brighter pink) */
	.story-desktop :global(.word) {
		text-decoration-color: var(--pink);
		text-underline-offset: 6px;
	}

	/* The story tooltips sit inside the heading, so they'd pick up its font and tight spacing.
	   They go back to the body text. */
	.story-desktop :global(.tip) {
		font-family: var(--mono);
		letter-spacing: normal;
		word-spacing: normal;
	}

	.closing p {
		margin: 0;
		font-size: var(--type-body);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-top: 1.5rem;
	}

	/* The story tooltip only works where there's a mouse to point with */
	.story-plain {
		display: none;
	}

	@media (hover: none), (pointer: coarse) {
		.story-desktop {
			display: none;
		}

		.story-plain {
			display: inline;
		}
	}

	/* Phones: one card to a row, the full width, so a picture is big enough to see */
	@media (max-width: 48rem) {
		.grid {
			grid-template-columns: minmax(0, 1fr);
			gap: 2rem;
		}

		/* The pictures shrink rather than filling the width: they're a glance, not the main
		   thing on the page */
		.sketches li {
			height: clamp(11rem, 38vw, 15rem);
		}

		.tldr {
			font-size: var(--type-title);
		}
	}
</style>
