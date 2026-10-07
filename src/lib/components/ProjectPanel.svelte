<script>
	// The project popup. It grows out of the project's card, fades the page behind,
	// and shrinks back into the card of whichever project is showing when it closes.
	// Everything it shows comes from src/lib/tinkerings.js.
	import { onMount } from 'svelte';
	import Media from '$lib/components/Media.svelte';
	import Title, { plain } from '$lib/components/Title.svelte';

	// project: the one to show. origin(id): the card thumbnail on the page for that project.
	// onclosed: called once the closing animation has finished.
	// onprev / onnext: swap to the previous or next project.
	// top: how far down the window the panel starts, in pixels (just under the top line).
	let { project, origin, onclosed, onprev, onnext, top = 32 } = $props();

	const ease = 'cubic-bezier(.2,.8,.2,1)';
	const growTime = 450;
	const fadeTime = 400;

	let overlay, panel, scroller, content;
	let closing = false;

	// When the arrows swap the project, jump back to the top of the panel
	$effect(() => {
		project.id;
		if (scroller) scroller.scrollTop = 0;
	});

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

	// Escape closes; left and right arrow keys move between projects
	function onkeydown(e) {
		if (closing) return;
		if (e.key === 'Escape') close();
		else if (e.key === 'ArrowLeft') onprev();
		else if (e.key === 'ArrowRight') onnext();
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
	<div class="scroller" bind:this={scroller}>
		<div class="content" bind:this={content}>
			<!-- No visible cross: clicking outside the panel or pressing Escape closes it.
			     This button stays hidden unless someone reaches it with the Tab key. -->
			<button type="button" class="close" onclick={close}>Close {plain(project.title)}</button>

			<!-- Stage holding the main visual, with plain arrows either side.
			     The arrows scroll away with the stage. -->
			<div class="stage">
				<button type="button" class="arrow" aria-label="Previous project" onclick={onprev}>
					<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4l-8 8 8 8" /></svg>
				</button>
				<div class="visual">
					<Media src={project.media} alt={plain(project.title)} />
				</div>
				<button type="button" class="arrow" aria-label="Next project" onclick={onnext}>
					<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4l8 8-8 8" /></svg>
				</button>
			</div>

			<div class="text">
				<h2 id="panel-title"><Title text={project.title} /></h2>

				<p class="about">
					{project.about ?? project.description}
					{#if project.link && project.aboutLink}
						<a href={project.link} target="_blank" rel="noopener">{project.aboutLink}</a>
					{/if}
				</p>

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
		grid-template-columns: auto 1fr auto;
		align-items: center;
		justify-items: center;
		gap: 1rem;
		padding: 4.5rem 1.25rem 3rem;
		background: #fff;
	}

	/* Plain arrow icons, no circle */
	.arrow {
		width: 2.25rem;
		height: 2.25rem;
		padding: 0.55rem;
		border: 0;
		background: none;
		color: var(--ink);
		cursor: pointer;
		opacity: 0.7;
		transition: opacity 0.15s ease;
	}

	.arrow:hover {
		opacity: 1;
	}

	.arrow svg {
		display: block;
		width: 100%;
		height: 100%;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.6;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.arrow:focus-visible {
		outline: 2px solid var(--text);
		outline-offset: 2px;
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

	/* Text runs across the panel, inside thick margins that line up with the arrows */
	.text {
		padding: 1rem 4.5rem 0;
	}

	h2 {
		margin: 0 0 1rem;
		font-family: var(--sans);
		font-size: 1.75rem;
		font-weight: 600;
		color: var(--ink);
	}

	.about {
		margin: 0;
		font-size: 1.1rem;
		line-height: 1.55;
		color: var(--ink);
	}

	.about a {
		color: var(--muted);
		text-decoration: underline;
		text-underline-offset: 3px;
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
</style>
