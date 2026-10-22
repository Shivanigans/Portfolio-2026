<script>
	// Projects: every project as a boxed card, with a row of filters, one per tag.
	// /projects?tag=data-viz opens with that filter already chosen.
	// A card opens its case study, its Behance page, or its popup right here (see ProjectCard).
	// The projects and tags come from src/lib/tinkerings.js.
	import { onMount } from 'svelte';
	import { replaceState } from '$app/navigation';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import ProjectPanel from '$lib/components/ProjectPanel.svelte';
	import { tagSlug } from '$lib/tinkerings.js';
	import { ProjectPopup } from '$lib/projectPopup.svelte.js';

	let { data } = $props();

	let chosen = $state(null); // the tag being shown, or null for all
	const shown = $derived(chosen ? data.tinkerings.filter((t) => t.tags?.includes(chosen)) : data.tinkerings);

	// The filter in the address, read once the page is open
	onMount(() => {
		const slug = new URLSearchParams(location.search).get('tag');
		chosen = data.tags.find((tag) => tagSlug(tag) === slug) ?? null;
	});

	// Choosing a filter also puts it in the address, so the page can be shared filtered
	function choose(tag) {
		chosen = tag;
		const params = new URLSearchParams(location.search);
		if (tag) params.set('tag', tagSlug(tag));
		else params.delete('tag');
		const query = params.toString();
		replaceState(location.pathname + (query ? `?${query}` : ''), {});
	}

	// Each card's link, by id, so focus can go back to it when its popup closes
	const cards = {};
	const projects = new ProjectPopup(() => data.tinkerings, (id) => cards[id]);
</script>

<svelte:head>
	<title>Projects · Shivani Singh Ghoshi</title>
</svelte:head>

<!-- While the popup is open, the page behind can't be clicked or tabbed into -->
<div inert={!!projects.current}>
	<h1>Projects</h1>

	<div class="filters" role="group" aria-label="Show projects by tag">
		<button type="button" class="filter" aria-pressed={!chosen} onclick={() => choose(null)}>All</button>
		{#each data.tags as tag}
			<button type="button" class="filter" aria-pressed={chosen === tag} onclick={() => choose(tag)}>
				{tag}
			</button>
		{/each}
	</div>

	<!-- Read out when the filter changes -->
	<p class="visually-hidden" aria-live="polite">
		Showing {shown.length}
		{shown.length === 1 ? 'project' : 'projects'}{#if chosen}&nbsp;in {chosen}{/if}
	</p>

	<ul class="grid">
		{#each shown as item (item.id)}
			<li>
				<ProjectCard {item} boxed href="/projects?project={item.id}" bind:el={cards[item.id]} onopen={projects.open} />
			</li>
		{/each}
	</ul>
</div>

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
	h1 {
		margin-bottom: 1.25rem;
	}

	/* The filters: small square-cornered buttons in a row that wraps */
	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	/* Not chosen: white with a deep pink outline */
	.filter {
		min-height: 32px;
		padding: 0 0.75rem;
		border: 1px solid var(--pink-deep);
		background: var(--bg);
		font: inherit;
		font-size: var(--type-meta);
		color: var(--text);
		cursor: pointer;
		transition: background-color 0.15s ease;
	}

	.filter:hover {
		background: var(--pink-soft);
	}

	/* Chosen: bright pink, dark words */
	.filter[aria-pressed='true'] {
		border-color: var(--pink);
		background: var(--pink);
		color: var(--on-pink);
	}

	.filter:focus-visible {
		outline: 2px solid var(--text);
		outline-offset: 3px;
	}

	/* Two cards side by side, one under another on phones */
	.grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
		margin: 2.25rem 0 0;
		padding: 0;
		list-style: none;
	}

	@media (max-width: 40rem) {
		.grid {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.filter {
			transition: none;
		}
	}
</style>
