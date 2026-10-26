<script>
	// One project as a row on the Projects page: on the left its name, description and tags,
	// on the right its picture at its own shape. On phones the two stack, picture last.
	// The name and the picture are the same link, and open the project the same way a card does:
	// - a project with a case study opens its own page, /projects/walks-from-life
	// - a project documented on Behance opens Behance in a new tab
	// - any other project opens its popup right here
	// The picture repeats that link, so it's hidden from screen readers and skipped by the
	// tab key: the name is the one link for each project.
	// The tags underneath are their own links, and filter the page to that tag.
	//
	// item:     the project, from src/lib/tinkerings.js
	// onopen:   called with the project when a popup project is clicked
	// onfilter: called with a tag when one of the tags is clicked
	// el:       the row itself, so the popup knows which picture to grow out of
	// nameEl:   the name link, so focus can go back to it when the popup closes
	// priority: the first row on the page, whose picture loads straight away
	import Media from '$lib/components/Media.svelte';
	import Title from '$lib/components/Title.svelte';
	import { behanceLink } from '$lib/links.js';
	import { tagSlug } from '$lib/tinkerings.js';

	let { item, onopen, onfilter, el = $bindable(), nameEl = $bindable(), priority = false } = $props();

	const outside = $derived(!!item.behance);
	const study = $derived(!outside && !!item.caseStudy);
	// Until a project's own Behance link is in, its row opens your Behance profile
	const behanceHref = $derived(item.behance?.startsWith('http') ? item.behance : behanceLink);
	const link = $derived(outside ? behanceHref : study ? `/projects/${item.id}` : `?project=${item.id}`);
	// A project without a description shows its note instead
	const words = $derived(item.description || item.note || '');

	function onclick(e) {
		// Behance and case study links just go where they point
		if (outside || study) return;
		// Cmd/Ctrl/Shift-click and middle-click still open the link in a new tab or window
		if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
		e.preventDefault();
		onopen(item);
	}

	function onTag(e, tag) {
		// Plain clicks filter the page; Cmd/Ctrl-click still opens the filtered page in a new tab
		if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
		e.preventDefault();
		onfilter(tag);
	}
</script>

<div class="row" bind:this={el}>
	<div class="words">
		<a
			class="name"
			href={link}
			target={outside ? '_blank' : undefined}
			rel={outside ? 'noopener' : undefined}
			bind:this={nameEl}
			{onclick}
		>
			<Title text={item.title} />
			{#if outside}<span class="visually-hidden"> (opens Behance in a new tab)</span>{/if}
		</a>

		{#if words}<p class="note">{words}</p>{/if}

		{#if item.tags?.length}
			<p class="tags">
				{#each item.tags as tag, i}{#if i}{', '}{/if}<a
						href="/projects?tag={tagSlug(tag)}"
						onclick={(e) => onTag(e, tag)}>{tag}</a
					>{/each}
			</p>
		{/if}
	</div>

	<a
		class="picture"
		href={link}
		target={outside ? '_blank' : undefined}
		rel={outside ? 'noopener' : undefined}
		tabindex="-1"
		aria-hidden="true"
		{onclick}
	>
		<span class="thumb"><Media src={item.thumb || item.media} alt="" calm {priority} /></span>
	</a>
</div>

<style>
	/* The two sides: 240px of words, 28px of space, then the picture taking the rest */
	.row {
		display: grid;
		grid-template-columns: 240px minmax(0, 1fr);
		gap: 28px;
		align-items: start;
	}

	.words {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	/* The name: National Park SemiBold at 16px, in capitals */
	.name {
		font-family: var(--display);
		font-size: var(--type-body);
		font-weight: 600;
		letter-spacing: var(--display-spacing);
		line-height: 1.25;
		text-transform: uppercase;
		text-decoration: none;
		color: var(--text);
	}

	.name:focus-visible {
		outline: 2px solid var(--text);
		outline-offset: 3px;
	}

	/* The description (or, if there isn't one, the project's note): Paper Mono Medium at 15px */
	.note {
		margin: 0;
		font-size: var(--type-footer);
		font-weight: 500;
		line-height: 1.5;
	}

	/* The tags, comma separated, each one a deep pink link that filters the page */
	.tags {
		margin: 0;
		font-size: var(--type-footer);
		color: var(--pink-deep);
	}

	.tags a {
		color: var(--pink-deep);
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	/* The picture keeps its own shape and fills its side */
	.picture {
		display: block;
	}

	.thumb {
		position: relative;
		display: block;
		background: var(--greige);
	}

	/* Pointing at the row draws a pink outline round its picture */
	.thumb::after {
		content: '';
		position: absolute;
		inset: 0;
		border: 2px solid var(--pink);
		opacity: 0;
		transition: opacity 0.15s ease;
		pointer-events: none;
	}

	.row:hover .thumb::after,
	.row:focus-within .thumb::after {
		opacity: 1;
	}

	/* Phones: the name, description and tags, then the picture underneath */
	@media (max-width: 40rem) {
		.row {
			grid-template-columns: minmax(0, 1fr);
			gap: 1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.thumb::after {
			transition: none;
		}
	}
</style>
