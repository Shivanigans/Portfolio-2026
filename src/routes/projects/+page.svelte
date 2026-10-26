<script>
	// Projects: every project as a row — its name, description and tags on the left, its picture
	// on the right — with a row of filters above, one per tag.
	// /projects?tag=data-viz opens with that filter already chosen.
	// A row opens its case study, its Behance page, or its popup right here (see ProjectRow).
	// The projects and tags come from src/lib/tinkerings.js.
	import { onMount } from 'svelte';
	import { replaceState } from '$app/navigation';
	import ProjectRow from '$lib/components/ProjectRow.svelte';
	import ProjectPanel from '$lib/components/ProjectPanel.svelte';
	import { tagSlug } from '$lib/tinkerings.js';
	import { ProjectPopup } from '$lib/projectPopup.svelte.js';

	let { data } = $props();

	// Projects kept off this page. They still show on Home and the Tinkering matrix.
	const hidden = ['context-subtext', 'portrait-in-p5js', 'stickers-for-ceew', 'chaos-mode'];
	const listed = data.tinkerings.filter((t) => !hidden.includes(t.id));

	let chosen = $state(null); // the tag being shown, or null for all
	const shown = $derived(chosen ? listed.filter((t) => t.tags?.includes(chosen)) : listed);

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

	// Each row and each name link, by id: the popup grows out of the row's picture, and focus
	// goes back to the name when it closes
	const rows = {};
	const names = {};
	const projects = new ProjectPopup(
		() => listed,
		(id) => names[id]
	);
</script>

<svelte:head>
	<title>Projects · shivanigans</title>
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

	<ul class="rows">
		{#each shown as item, i (item.id)}
			<li>
				<ProjectRow
					{item}
					priority={i === 0}
					bind:el={rows[item.id]}
					bind:nameEl={names[item.id]}
					onopen={projects.open}
					onfilter={choose}
				/>
			</li>
		{/each}
	</ul>
</div>

{#if projects.current}
	<ProjectPanel
		bind:this={projects.panel}
		project={projects.current}
		origin={(id) => rows[id]?.querySelector('.thumb')}
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

	/* Not chosen: nothing behind it, so the page shows through, in a deep pink outline */
	.filter {
		min-height: 38px;
		padding: 0 0.9375rem;
		border: 1px solid var(--pink-deep);
		background: transparent;
		font: inherit;
		font-size: var(--type-footer);
		font-weight: 500;
		color: var(--text);
		cursor: pointer;
		transition: background-color 0.15s ease;
	}

	.filter:hover {
		background: var(--pink-soft);
	}

	/* Chosen: filled deep pink, with the page grey for words (5.5:1) */
	.filter[aria-pressed='true'] {
		background: var(--pink-deep);
		color: var(--desk);
	}

	.filter:focus-visible {
		outline: 2px solid var(--text);
		outline-offset: 3px;
	}

	/* One project to a row: 64px below the filters, so they read as separate from the work,
	   then 48px between one project and the next */
	.rows {
		display: flex;
		flex-direction: column;
		gap: 48px;
		margin: 64px 0 0;
		padding: 0;
		list-style: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.filter {
			transition: none;
		}
	}
</style>
