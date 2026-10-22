<script>
	// The project popup. It grows out of the project's card, fades the page behind,
	// and shrinks back into the card of whichever project is showing when it closes.
	// Everything it shows comes from src/lib/tinkerings.js.
	import { onMount } from 'svelte';
	import Arrow from '$lib/components/Arrow.svelte';
	import Media from '$lib/components/Media.svelte';
	import QuoteStack from '$lib/components/QuoteStack.svelte';
	import Title, { plain } from '$lib/components/Title.svelte';

	// project: the one to show. origin(id): the card thumbnail on the page for that project.
	// onclosed: called once the closing animation has finished.
	// top: how far down the window the panel starts, in pixels.
	// step(dir): optional, moves to the next project (1) or the one before (-1). With it, the panel
	// shows ← and → buttons and the arrow keys work. position: e.g. '2 / 8', shown above the title.
	let { project, origin, onclosed, top = 56, step = null, position = '' } = $props();

	// The pictures across the top, side by side: the project's images if it lists them,
	// otherwise its cover (or card picture) on its own. A project with a story and no cover
	// has its pictures in the story instead. A project with live demos shows those instead.
	const pics = $derived(
		project.demos?.length
			? []
			: project.images?.length
				? project.images
				: !project.story?.length || project.cover
					? [project.cover || project.media]
					: []
	);

	const ease = 'cubic-bezier(.2,.8,.2,1)';
	const growTime = 450;
	const fadeTime = 400;

	let overlay, panel, content, cross, scroller;

	// Moving to another project starts it from the top
	$effect(() => {
		project.id;
		if (scroller) scroller.scrollTop = 0;
	});
	let closing = false;

	const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

	// The transform that makes the open panel sit exactly over a card
	function overCard(card) {
		const from = card.getBoundingClientRect();
		const to = panel.getBoundingClientRect();
		return `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`;
	}

	onMount(() => {
		// Lock the page behind so only the panel scrolls
		const root = document.documentElement;
		const before = root.style.overflow;
		root.style.overflow = 'hidden';

		overlay.animate([{ opacity: 0 }, { opacity: 1 }], { duration: fadeTime, easing: 'ease-out' });

		const card = origin(project.id);
		if (reduceMotion() || !card) {
			panel.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250, easing: 'ease-out' });
		} else {
			// Start exactly over the card, then grow to the open size
			panel.animate([{ transform: overCard(card) }, { transform: 'none' }], { duration: growTime, easing: ease });
			// Content fades in a moment later, so nothing looks squashed mid-grow
			for (const part of [content, cross]) {
				part.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250, delay: 200, fill: 'backwards' });
			}
		}

		// Move keyboard focus into the panel
		panel.focus({ preventScroll: true });

		return () => (root.style.overflow = before);
	});

	export async function close() {
		if (closing) return;
		closing = true;

		overlay.animate([{ opacity: 1 }, { opacity: 0 }], { duration: fadeTime, easing: 'ease-in', fill: 'forwards' });

		const card = origin(project.id);
		let shrink;
		if (reduceMotion() || !card) {
			shrink = panel.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, fill: 'forwards' });
		} else {
			for (const part of [content, cross]) {
				part.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: 'forwards' });
			}
			shrink = panel.animate([{ transform: 'none' }, { transform: overCard(card) }], {
				duration: growTime,
				easing: ease,
				fill: 'forwards'
			});
		}

		await shrink.finished;
		onclosed();
	}

	// Splits text into plain words and links, written as [words](https://...)
	function withLinks(text) {
		const out = [];
		let last = 0;
		for (const match of text.matchAll(/\[([^\]]+)\]\(([^)\s]+)\)/g)) {
			if (match.index > last) out.push({ text: text.slice(last, match.index) });
			out.push({ text: match[1], url: match[2] });
			last = match.index + match[0].length;
		}
		if (last < text.length) out.push({ text: text.slice(last) });
		return out;
	}

	// Escape closes. With step, the left and right arrow keys move between projects.
	function onkeydown(e) {
		if (e.key === 'Escape') close();
		if (!step || closing || e.target.closest?.('input, textarea, [contenteditable]')) return;
		if (e.key === 'ArrowLeft') step(-1);
		if (e.key === 'ArrowRight') step(1);
	}
</script>

<svelte:window {onkeydown} />

<!-- Pale veil over the page. Clicking it also closes the panel (Escape does the same from the keyboard). -->
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div class="overlay" bind:this={overlay} onclick={close} aria-hidden="true"></div>

<div
	class="panel"
	bind:this={panel}
	style:top="{top}px"
	role="dialog"
	aria-modal="true"
	aria-labelledby="panel-title"
	tabindex="-1"
>
	<!-- Top right: ← and → (when there are other projects to move to), and the cross.
	     Clicking outside the panel or pressing Escape closes it too. -->
	<div class="controls" bind:this={cross}>
		{#if step}
			<button type="button" onclick={() => step(-1)} aria-label="Previous project"><Arrow dir="left" /></button>
			<button type="button" onclick={() => step(1)} aria-label="Next project"><Arrow /></button>
		{/if}
		<button type="button" onclick={close} aria-label="Close project">
			<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
		</button>
	</div>

	<div class="scroller" bind:this={scroller}>
		<div class="content" bind:this={content}>
			<!-- The top: a stack of quote cards if the project has them and no story,
			     otherwise its pictures, two side by side (a picture on its own takes the full width) -->
			{#if project.quotes?.length && !project.story?.length}
				<div class="stage">
					<QuoteStack quotes={project.quotes} />
				</div>
			{:else if project.demos?.length}
				<!-- Live demos: small web pages to point at and play with. A wide one spans both columns. -->
				<div class="pics">
					{#each project.demos as demo}
						<div class="pic-tile demo" class:wide={demo.wide}>
							<iframe src={demo.src} title={demo.title} loading="lazy"></iframe>
						</div>
					{/each}
				</div>
			{:else if pics.length}
				<div class="pics" class:single={pics.length === 1}>
					{#each pics as src, i}
						<div class="pic-tile">
							<Media {src} alt={i === 0 ? plain(project.title) : ''} />
						</div>
					{/each}
				</div>
			{/if}

			<div class="text" class:first={!pics.length && !project.demos?.length && !(project.quotes?.length && !project.story?.length)}>
				<!-- The title with its tags under it on the left, and the project's own link on the right -->
				<div class="title-row">
					<div class="title-block">
						{#if position}<p class="position">{position}</p>{/if}
						<h2 id="panel-title"><Title text={project.title} /></h2>
						{#if project.tags?.length}
							<ul class="tags" aria-label="Tags">
								{#each project.tags as tag}<li class="tag">{tag}</li>{/each}
							</ul>
						{/if}
					</div>

					<!-- Opens the project itself, in a new tab -->
					{#if project.link}
						<a class="pill-button explore" href={project.link} target="_blank" rel="noopener">
							Explore the project <Arrow dir="out" />
						</a>
					{/if}
				</div>
				{#if project.note}
					<p class="subline">{project.note}</p>
				{/if}

				{#if project.aboutHeading}
					<h3 class="about-heading">{project.aboutHeading}</h3>
				{/if}

				{#if project.about}
					{@const paragraphs = project.about.split(/\n\s*\n/)}
					{#each paragraphs as paragraph, i}
						<p class="about">
							{#each withLinks(paragraph) as part}{#if part.url}<a
										href={part.url}
										target="_blank"
										rel="noopener">{part.text}</a
									>{:else}{part.text}{/if}{/each}
						</p>
					{/each}
				{:else}
					<!-- Only ever seen on your computer: the site won't build while this is empty -->
					<p class="to-write">
						Write this in your own words: fill in <code>about</code> for this project in
						src/lib/tinkerings.js
					</p>
				{/if}

				<!-- The write-up after the about text, part by part, in order -->
				{#each project.story ?? [] as part}
					{#if part.cards}
						<div class="cards"><QuoteStack quotes={project.quotes ?? []} /></div>
					{:else if part.image !== undefined}
						<figure class="pic">
							<Media src={part.image} alt={part.alt} />
							{#if part.caption}<figcaption>{part.caption}</figcaption>{/if}
						</figure>
					{:else if part.heading}
						<h3>{part.heading}</h3>
					{:else if part.points}
						<ul class="points">
							{#each part.points as point}<li>{point}</li>{/each}
						</ul>
					{:else if part.closing}
						<p class="about closing">{part.closing}</p>
					{:else if part.text}
						<p class="about">{part.text}</p>
					{/if}
				{/each}

				{#if project.details?.length}
					<dl class="details">
						{#each project.details as row}
							<div>
								<dt>{row.label}</dt>
								<dd>{row.value}</dd>
							</div>
						{/each}
					</dl>
				{/if}
			</div>

			{#if project.gallery?.length}
				<ul class="gallery">
					{#each project.gallery as walk}
						<li>
							<figure>
								<Media src={walk.src} alt={walk.caption} />
								<figcaption>{walk.caption}</figcaption>
							</figure>
						</li>
					{/each}
				</ul>
			{/if}

			{#if project.moreImages?.length}
				<div class="images">
					{#each project.moreImages as image}
						<Media src={image.src} alt={image.alt} />
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	/* The page behind fades into the desk colour and blurs */
	.overlay {
		position: fixed;
		inset: 0;
		z-index: 200;
		background: color-mix(in srgb, var(--desk) 72%, transparent);
		backdrop-filter: blur(6px);
	}

	/* Fixed to the window: a white sheet, centred, up to 860px wide, running off the bottom edge */
	.panel {
		--wide: min(86vw, 860px);
		position: fixed;
		z-index: 201;
		top: 56px;
		bottom: 0;
		width: var(--wide);
		left: calc((100vw - var(--wide)) / 2);
		background: var(--bg);
		box-shadow: 0 10px 40px color-mix(in srgb, var(--text) 14%, transparent);
		transform-origin: top left;
		overflow: hidden;
	}

	.panel:focus {
		outline: none;
	}

	/* Only the panel scrolls. The scrollbar is hidden, but wheel, trackpad and touch
	   scrolling still work, and scrolling past the end never moves the page behind. */
	.scroller {
		height: 100%;
		overflow-y: auto;
		overscroll-behavior: contain;
		scrollbar-width: none;
	}

	.scroller::-webkit-scrollbar {
		display: none;
	}

	.content {
		position: relative;
		padding-bottom: 5rem;
	}

	/* ←, → and the cross: 40px squares outlined in the text colour, top right.
	   They stay put while the panel scrolls. */
	.controls {
		position: absolute;
		top: 1.25rem;
		right: 1.25rem;
		z-index: 2;
		display: flex;
		gap: 0.5rem;
	}

	.controls button {
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
		padding: 0;
		border: 1px solid var(--text);
		background: var(--bg);
		font-size: 0.95rem;
		color: var(--text);
		cursor: pointer;
		transition: background-color 0.15s ease;
	}

	.controls svg {
		width: 16px;
		height: 16px;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.6;
		stroke-linecap: round;
	}

	/* Pointing at one fills it with the soft pink, so it's clear it can be pressed */
	.controls button:hover {
		background: var(--pink-soft);
	}

	.controls button:focus-visible {
		outline: 2px solid var(--text);
		outline-offset: 2px;
	}

	.stage {
		display: grid;
		justify-items: center;
		padding: 4.5rem 4.5rem 3rem;
		background: var(--bg);
	}

	/* The pictures across the top: two columns, 12px apart, as wide as the text below.
	   Each is cropped to 4:3, square corners, a faint line round it.
	   A single picture takes one column, so it's never one huge image. */
	.pics {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
		padding: 4.5rem 4.5rem 2.5rem;
	}

	/* One picture on its own fills the whole width */
	.pics.single {
		grid-template-columns: minmax(0, 1fr);
	}

	.pic-tile {
		position: relative;
		aspect-ratio: 4 / 3;
		overflow: hidden;
		background: var(--greige);
	}

	.pic-tile::after {
		content: '';
		position: absolute;
		inset: 0;
		border: 1px solid var(--line);
		pointer-events: none;
	}

	.pic-tile :global(img),
	.pic-tile :global(video),
	.pic-tile :global(.placeholder) {
		width: 100%;
		height: 100%;
		aspect-ratio: auto;
		object-fit: cover;
	}

	/* A live demo fills its tile. A wide one spans both columns and is taller, for a longer story. */
	.demo iframe {
		display: block;
		width: 100%;
		height: 100%;
		border: 0;
	}

	.demo.wide {
		grid-column: 1 / -1;
		aspect-ratio: auto;
		height: 33rem;
	}

	/* Text runs across the panel, inside thick margins */
	.text {
		padding: 1rem 4.5rem 0;
	}

	/* The title row: title and tags on the left, the Explore button on the right edge,
	   level with the pictures. Their tops line up. On narrow panels the button drops below. */
	.title-row {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem 1.5rem;
		margin-bottom: 1rem;
	}

	.title-block {
		min-width: 0;
	}

	/* "2 / 8": which project this is, small and grey above the title */
	.position {
		margin: 0 0 0.5rem;
		font-size: var(--type-meta);
		color: var(--muted);
	}

	/* Title: National Park at 48px, 28px on phones */
	h2 {
		margin: 0;
		font-family: var(--display);
		font-size: 3rem;
		font-weight: 600;
		letter-spacing: var(--display-spacing);
		line-height: 1.05;
		color: var(--ink);
		text-wrap: balance;
	}

	/* Tags just under the title */
	.text .tags {
		margin-top: 0.6rem;
	}

	/* The Explore button keeps to one line */
	.explore {
		flex: none;
		white-space: nowrap;
	}

	/* "About", when a project has it: the first small heading, so less space above */
	.about-heading {
		margin-top: 1.5rem;
	}

	/* Grey line under the title, 16px above the text */
	.subline {
		margin: -0.375rem 0 1rem;
		font-size: var(--type-label);
		line-height: 1.5;
		color: var(--muted);
	}

	/* Reminder box for a missing description: pink dashed border, 16px text */
	.to-write {
		margin: 0;
		padding: 1rem 1.25rem;
		border: 2px dashed var(--pink);
		background: color-mix(in srgb, var(--pink) 8%, var(--bg));
		font-size: var(--type-small);
		line-height: 1.5;
		color: var(--ink);
	}

	/* Description and story keep a comfortable reading width */
	.about,
	.points,
	.subline {
		max-width: 760px;
	}

	.about {
		max-width: 60ch;
		margin: 0;
		font-size: var(--type-small);
		line-height: 1.65;
		color: var(--ink);
	}

	/* With no picture on top, the title starts 72px down, same as a picture would */
	.text.first {
		padding-top: 4.5rem;
	}

	/* Story parts: 24px between paragraphs */
	.about + .about {
		margin-top: 1.5rem;
	}

	/* Pictures in the story: 40px above and below, 10px corners, caption 14px */
	.pic {
		margin: 2.5rem 0;
	}

	.pic :global(img),
	.pic :global(.placeholder) {
		box-shadow: var(--shadow);
	}

	.pic figcaption {
		margin-top: 0.6rem;
		font-size: var(--type-caption);
		color: var(--muted);
	}

	/* Quote cards in the story: 48px above and below, as wide as the text and pictures */
	.cards {
		margin: 3rem 0;
	}

	.cards :global(.wrap) {
		width: 100%;
	}

	/* Small heading: National Park at 22px, 48px above */
	h3 {
		margin: 3rem 0 1rem;
		font-family: var(--display);
		font-size: var(--type-card);
		font-weight: 600;
		color: var(--ink);
	}

	/* List: 10px between points */
	.points {
		margin: 0 0 1.5rem;
		padding-left: 1.2em;
		display: grid;
		gap: 0.6rem;
		font-size: var(--type-small);
		line-height: 1.55;
		color: var(--ink);
	}

	.closing {
		font-style: italic;
	}

	.about a {
		color: var(--muted);
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.about a:hover {
		color: var(--pink-deep);
	}

	.details {
		margin: 2rem 0 0;
		border-top: 1px solid var(--line);
	}

	.details div {
		display: grid;
		grid-template-columns: 10rem 1fr;
		gap: 1rem;
		padding: 0.7rem 0;
		border-bottom: 1px solid var(--line);
	}

	.details dt {
		color: var(--muted);
	}

	.details dd {
		margin: 0;
		color: var(--ink);
	}

	/* Walk cards, with a caption each */
	.gallery {
		list-style: none;
		margin: 3rem 0 0;
		padding: 0 4.5rem;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
		gap: 2rem 1.5rem;
	}

	.gallery figure {
		margin: 0;
	}

	.gallery figcaption {
		margin-top: 0.6rem;
		font-size: var(--type-caption);
		color: var(--ink);
	}

	.images {
		display: grid;
		gap: 1.5rem;
		margin-top: 3rem;
		padding: 0 4.5rem;
	}

	/* Phones: the panel fills the width, with slimmer margins */
	@media (max-width: 48rem) {
		.panel {
			width: 100vw;
			left: 0;
		}

		.stage {
			padding: 3rem 1.25rem 2rem;
		}

		/* Phones: the pictures one under another */
		.pics {
			grid-template-columns: minmax(0, 1fr);
			padding: 4rem 1.25rem 2rem;
		}

		.text,
		.gallery,
		.images {
			padding-left: 1.25rem;
			padding-right: 1.25rem;
		}

		h2 {
			font-size: 1.75rem;
		}

		.text.first {
			padding-top: 4.5rem;
		}

		.details div {
			grid-template-columns: 7rem 1fr;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.controls button {
			transition: none;
		}
	}
</style>
