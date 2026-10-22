<script>
	// Home: the hello, then the story of your work in sections (a heading and its project cards),
	// the TL;DR line, and the way to reach you. The socials and the live status line come after,
	// from the layout. As you scroll, the margin note changes to match the part of the story in view.
	// Each piece fades and slides up as it scrolls into view (use:reveal, src/lib/reveal.js).
	// Click a card and its popup opens right here.
	// The story's notes, headings and projects are in src/lib/home.js, the projects in
	// src/lib/tinkerings.js, the email link in src/lib/links.js.
	import { onMount } from 'svelte';
	import Arrow from '$lib/components/Arrow.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import ProjectPanel from '$lib/components/ProjectPanel.svelte';
	import StoryTooltip from '$lib/StoryTooltip.svelte';
	import { emailLink } from '$lib/links.js';
	import { live } from '$lib/notes.svelte.js';
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

	// The margin note follows the story. Whichever part crosses a line about 40% of the way
	// down the window sets the note; the hello and the ending put the page's own note back.
	const watched = new Map();
	let watcher;

	function noteFor(node, note) {
		watched.set(node, note);
		watcher?.observe(node);
		return { destroy: () => (watched.delete(node), watcher?.unobserve(node)) };
	}

	onMount(() => {
		watcher = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) live.text = watched.get(entry.target);
				}
			},
			{ rootMargin: '-40% 0px -59% 0px' }
		);
		watched.forEach((_, node) => watcher.observe(node));
		return () => {
			watcher.disconnect();
			live.text = null;
		};
	});

	// The back-to-top button shows once you've scrolled about 600px down
	let scrollY = $state(0);
	const showTop = $derived(scrollY > 600);

	function toTop() {
		const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
		window.scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' });
	}
</script>

<svelte:window bind:scrollY />

<svelte:head>
	<title>Shivani Singh Ghoshi</title>
</svelte:head>

<!-- While the popup is open, the page behind can't be clicked or tabbed into -->
<div class="home" inert={!!projects.current}>
	<section class="hello" use:noteFor={null}>
		<!-- The space before the dash doesn't break, so no line starts with it -->
		<h1>Hi, I’m Shivani&nbsp;- a designer, maker and chief LLM operator.</h1>
		<p>I’m in the process of moving in this place. Curating it project by project and word by word.</p>
	</section>

	{#each data.parts as part}
		<div class="part" use:noteFor={[part.note]}>
			{#each part.sections as section (section.slug)}
				<section class="topic" aria-labelledby="topic-{section.slug}">
					<h2 id="topic-{section.slug}" use:reveal>{section.heading}</h2>

					<ul class="grid">
						{#each section.items as item (item.id)}
							<li use:reveal={0.1}>
								<ProjectCard
									{item}
									bind:el={cards[`${section.slug}:${item.id}`]}
									onopen={(t) => openFrom(section, t)}
								/>
							</li>
						{/each}
					</ul>
				</section>
			{/each}
		</div>
	{/each}

	<section class="closing" use:noteFor={null} use:reveal>
		<!-- "multitudes" tells a little story on desktops: point at it, then keep pointing
		     (src/lib/StoryTooltip.svelte). On phones and tablets it's just the word. -->
		<h2 class="tldr" id="multitudes">
			TL;DR, I contain <span class="story-desktop"
				><StoryTooltip word="multitudes" steps={['fortitude,', 'gratitude,', 'attitude', 'and vicissitude.']} /></span
			><span class="story-plain">multitudes</span>.
		</h2>
		<p>I’m open to work full-time and freelance roles, get in touch I would to collaborate!</p>

		<div class="actions">
			<a class="pill-button" href="/projects">View all projects</a>
			<!-- Opens a new email to you, in a new tab -->
			<a class="pill-button" href={emailLink} target="_blank" rel="noopener">Send email <Arrow dir="out" /></a>
		</div>
	</section>
</div>

<button
	type="button"
	class="to-top"
	class:shown={showTop && !projects.current}
	onclick={toTop}
	aria-label="Back to top"
	tabindex={showTop ? 0 : -1}
>
	<Arrow dir="up" />
</button>

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
		font-size: var(--type-label);
	}

	/* The story: 64px between sections, more before the first */
	.part:first-of-type {
		margin-top: 4rem;
	}

	.topic {
		margin-top: 4rem;
	}

	h2 {
		margin-bottom: 1rem;
		text-wrap: balance;
	}

	/* Home thumbnails are 480px wide */
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(0, 480px));
		gap: 1.5rem 1.25rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	/* The ending: the TL;DR line at 48px, the open-to-work line, then the two buttons */
	.closing {
		margin-top: 7rem;
	}

	.tldr {
		margin-bottom: 1.25rem;
		font-size: 3rem;
		line-height: 1.1;
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
		font-size: var(--type-label);
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

	/* Back to top: a 48px square button in the bottom right corner, hidden near the top */
	.to-top {
		position: fixed;
		right: 1.5rem;
		bottom: 1.5rem;
		z-index: 100;
		display: grid;
		place-items: center;
		width: 48px;
		height: 48px;
		padding: 0;
		border: 1px solid var(--text);
		background: var(--bg);
		font-size: var(--type-card);
		color: var(--text);
		cursor: pointer;
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 0.25s ease,
			visibility 0.25s,
			background-color 0.15s ease;
	}

	.to-top.shown {
		opacity: 1;
		visibility: visible;
	}

	.to-top:hover {
		background: var(--pink-soft);
	}

	.to-top:focus-visible {
		outline: 2px solid var(--text);
		outline-offset: 3px;
	}

	/* Phones: cards fill the width, two to a row */
	@media (max-width: 48rem) {
		.grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 1.5rem 1rem;
		}

		.tldr {
			font-size: var(--type-title);
		}

		.to-top {
			right: 1rem;
			bottom: 1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.to-top {
			transition: none;
		}
	}
</style>
