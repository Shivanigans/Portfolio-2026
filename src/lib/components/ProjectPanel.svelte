<script>
	// The project popup. It grows out of the project's card, fades the page behind,
	// and shrinks back into the card of whichever project is showing when it closes.
	// Everything it shows comes from src/lib/tinkerings.js.
	import { onMount } from 'svelte';
	import Media from '$lib/components/Media.svelte';
	import QuoteStack from '$lib/components/QuoteStack.svelte';
	import Title, { plain } from '$lib/components/Title.svelte';

	// project: the one to show. origin(id): the card thumbnail on the page for that project.
	// onclosed: called once the closing animation has finished.
	// top: how far down the window the panel starts, in pixels (just under the top line).
	let { project, origin, onclosed, top = 32 } = $props();

	const ease = 'cubic-bezier(.2,.8,.2,1)';
	const growTime = 450;
	const fadeTime = 400;

	let overlay, panel, content;
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
			content.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250, delay: 200, fill: 'backwards' });
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
			content.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: 'forwards' });
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

	// Escape closes
	function onkeydown(e) {
		if (e.key === 'Escape') close();
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
	<div class="scroller">
		<div class="content" bind:this={content}>
			<!-- No visible cross: clicking outside the panel or pressing Escape closes it.
			     This button stays hidden unless someone reaches it with the Tab key. -->
			<button type="button" class="close" onclick={close}>Close {plain(project.title)}</button>

			<!-- Stage holding the main visual: a stack of quote cards if the project has them,
			     otherwise the cover if there is one, otherwise the card's media.
			     A project with a story has no stage: its pictures and cards sit in the story. -->
			{#if !project.story?.length}
				<div class="stage">
					{#if project.quotes?.length}
						<QuoteStack quotes={project.quotes} />
					{:else}
						<div class="visual">
							<Media src={project.cover || project.media} alt={plain(project.title)} />
						</div>
					{/if}
				</div>
			{/if}

			<div class="text" class:first={project.story?.length}>
				<h2 id="panel-title"><Title text={project.title} /></h2>
				{#if project.note}
					<p class="subline">{project.note}</p>
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
							{#if i === paragraphs.length - 1 && project.link && project.aboutLink}
								<a href={project.link} target="_blank" rel="noopener">{project.aboutLink}</a>
							{/if}
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

			{#if project.images?.length}
				<div class="images">
					{#each project.images as image}
						<Media src={image.src} alt={image.alt} />
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.overlay {
		position: fixed;
		inset: 0;
		z-index: 200;
		background: rgba(247, 247, 239, 0.82);
	}

	/* Fixed to the window: centred, 80% wide up to 780px, from just under the top line down to the bottom edge */
	.panel {
		position: fixed;
		z-index: 201;
		top: 32px;
		bottom: 0;
		width: min(80vw, 780px);
		left: calc((100vw - min(80vw, 780px)) / 2);
		background: #fff;
		border-radius: 16px 16px 0 0;
		box-shadow: 0 10px 40px rgba(65, 60, 50, 0.18);
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

	/* Hidden close button: only appears when reached with the Tab key */
	.close {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		z-index: 2;
		padding: 0.4rem 0.7rem;
		border: 0;
		border-radius: 6px;
		background: var(--card);
		font: inherit;
		font-size: 0.85rem;
		color: var(--ink);
		cursor: pointer;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	.close:focus-visible {
		clip-path: none;
		outline: 2px solid var(--text);
	}

	.stage {
		display: grid;
		justify-items: center;
		padding: 4.5rem 4.5rem 3rem;
		background: #fff;
	}

	.visual {
		max-width: 100%;
		min-width: 0;
	}

	/* Main visual: as large as fits, never taller than most of the screen */
	.stage .visual :global(img),
	.stage .visual :global(video) {
		width: auto;
		max-width: 100%;
		max-height: 58vh;
		margin: 0 auto;
		border-radius: 10px;
		box-shadow: var(--shadow);
	}

	/* Text runs across the panel, inside thick margins */
	.text {
		padding: 1rem 4.5rem 0;
	}

	/* Title on one line: 28px, 20px on phones */
	h2 {
		margin: 0 0 1rem;
		font-family: var(--sans);
		font-size: 1.75rem;
		white-space: nowrap;
		font-weight: 600;
		color: var(--ink);
	}

	/* Grey line under the title: 17.6px, 6px below the title, 16px above the text */
	.subline {
		margin: -0.625rem 0 1rem;
		font-size: 1.1rem;
		line-height: 1.4;
		color: var(--muted);
	}

	/* Reminder box for a missing description: pink dashed border, 16px text */
	.to-write {
		margin: 0;
		padding: 1rem 1.25rem;
		border: 2px dashed #ff3ca1;
		border-radius: 8px;
		background: #fff0f7;
		font-size: 1rem;
		line-height: 1.5;
		color: var(--ink);
	}

	.about {
		margin: 0;
		font-size: 1.1rem;
		line-height: 1.55;
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

	/* Pictures in the story: 40px above and below, 10px corners, caption 14.4px */
	.pic {
		margin: 2.5rem 0;
	}

	.pic :global(img),
	.pic :global(.placeholder) {
		border-radius: 10px;
		box-shadow: var(--shadow);
	}

	.pic figcaption {
		margin-top: 0.6rem;
		font-size: 0.9rem;
		color: var(--muted);
	}

	/* Quote cards in the story: 48px above and below, as wide as the text and pictures */
	.cards {
		margin: 3rem 0;
	}

	.cards :global(.wrap) {
		width: 100%;
	}

	/* Small heading: 20px, 48px above */
	h3 {
		margin: 3rem 0 1rem;
		font-family: var(--sans);
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--ink);
	}

	/* List: 17.6px, 10px between points */
	.points {
		margin: 0 0 1.5rem;
		padding-left: 1.2em;
		display: grid;
		gap: 0.6rem;
		font-size: 1.1rem;
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
		color: var(--pink);
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
		font-size: 0.9rem;
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

		.text,
		.gallery,
		.images {
			padding-left: 1.25rem;
			padding-right: 1.25rem;
		}

		h2 {
			font-size: 1.25rem;
		}

		.text.first {
			padding-top: 3rem;
		}

		.details div {
			grid-template-columns: 7rem 1fr;
		}
	}
</style>
