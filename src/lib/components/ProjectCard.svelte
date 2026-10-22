<script>
	// One project card: the picture, then its name and a few words underneath.
	// On Home it's just the picture and words. On the Projects page (boxed) it sits in a thin
	// frame, with the title in National Park and the tags under it.
	// The whole card is one link:
	// - a project with a case study opens its own page, /projects/walks-from-life
	// - a project documented on Behance opens Behance in a new tab
	// - any other project opens its popup right here (or its own address in a new tab,
	//   with Cmd/Ctrl-click)
	//
	// item:     the project, from src/lib/tinkerings.js
	// href:     where the link goes for a popup project (defaults to this page with ?project=...)
	// boxed:    the Projects page look
	// onopen:   called with the project when a popup project is clicked
	// el:       the link itself, so focus can go back to it when the popup closes
	import Media from '$lib/components/Media.svelte';
	import StickerSheet from '$lib/components/StickerSheet.svelte';
	import Title from '$lib/components/Title.svelte';
	import { behanceLink } from '$lib/links.js';

	let { item, href = `?project=${item.id}`, boxed = false, onopen, el = $bindable() } = $props();

	const outside = $derived(!!item.behance);
	const study = $derived(!outside && !!item.caseStudy);
	// Until a project's own Behance link is in, its card opens your Behance profile
	const behanceHref = $derived(item.behance?.startsWith('http') ? item.behance : behanceLink);
	const link = $derived(outside ? behanceHref : study ? `/projects/${item.id}` : href);

	function onclick(e) {
		// Behance and case study links just go where they point
		if (outside || study) return;
		// Cmd/Ctrl/Shift-click and middle-click still open the link in a new tab or window
		if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
		e.preventDefault();
		onopen(item);
	}
</script>

<a
	class="card"
	class:boxed
	href={link}
	target={outside ? '_blank' : undefined}
	rel={outside ? 'noopener' : undefined}
	bind:this={el}
	{onclick}
>
	<span
		class="thumb"
		class:bare={item.stickers?.length}
		style:--zoom={item.thumbZoom?.scale}
		style:--zoom-origin={item.thumbZoom?.origin}
	>
		{#if item.stickers?.length}
			<StickerSheet stickers={item.stickers} />
		{:else}
			<Media src={item.thumb || item.media} alt="" calm />
		{/if}
	</span>
	<!-- One line: the name in SemiBold, then | and what kind of project it is -->
	<span class="words">
		<span class="name"><Title text={item.title} /></span>{#if item.tags?.length}<span
				class="sep"
				aria-hidden="true">|</span
			><span class="type">{item.tags.join(' · ')}</span>{/if}
		{#if outside}<span class="visually-hidden"> (opens Behance in a new tab)</span>{/if}
	</span>
</a>

<style>
	.card {
		display: block;
		height: 100%;
		color: inherit;
		text-decoration: none;
	}

	.card:hover {
		color: inherit;
	}

	.card:focus-visible {
		outline: 2px solid var(--text);
		outline-offset: 4px;
	}

	/* The picture, cropped to 4:3 on every card so rows line up. Square corners. */
	.thumb {
		position: relative;
		display: block;
		aspect-ratio: 4 / 3;
		overflow: hidden;
		background: var(--greige);
	}

	/* A project's thumbZoom (in tinkerings.js) zooms its picture in, to crop off edges */
	.thumb :global(img),
	.thumb :global(video) {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transform: scale(var(--zoom, 1));
		transform-origin: var(--zoom-origin, center);
	}

	.thumb :global(.placeholder) {
		height: 100%;
		aspect-ratio: auto;
	}

	/* Pointing at a card draws a pink outline round its picture (decoration, so the brighter pink) */
	.thumb::after {
		content: '';
		position: absolute;
		inset: 0;
		border: 2px solid var(--pink);
		opacity: 0;
		transition: opacity 0.15s ease;
		pointer-events: none;
	}

	.card:hover .thumb::after {
		opacity: 1;
	}

	/* Stickers sit straight on the page: no greige frame, no outline round them */
	.thumb.bare {
		background: none;
		overflow: visible;
	}

	.thumb.bare::after {
		display: none;
	}

	/* Home: "Name | project type" on one line at 14px, the name in Paper Mono SemiBold,
	   the type in grey */
	.words {
		display: block;
		padding-top: 0.75rem;
		font-size: var(--type-caption);
		line-height: 1.4;
	}

	.name {
		font-weight: 600;
		color: var(--text);
	}

	.sep {
		margin: 0 0.5em;
		color: var(--muted);
	}

	.type {
		color: var(--muted);
	}

	/* Projects page: a thin frame round the whole card. The picture fills the top, the words sit
	   under it with room round them, the title in National Park at 22px. */
	.boxed {
		border: 1px solid var(--line);
		background: var(--bg);
		transition: border-color 0.15s ease;
	}

	.boxed:hover {
		border-color: var(--pink);
	}

	.boxed .thumb::after {
		display: none;
	}

	.boxed .words {
		padding: 0.9rem 1rem 1rem;
	}

	.boxed .name {
		font-family: var(--display);
		font-size: var(--type-card);
		font-weight: 600;
		letter-spacing: var(--display-spacing);
		line-height: 1.2;
	}

	.boxed .sep,
	.boxed .type {
		font-size: var(--type-meta);
	}

	@media (prefers-reduced-motion: reduce) {
		.thumb::after,
		.boxed {
			transition: none;
		}
	}
</style>
