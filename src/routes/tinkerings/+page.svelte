<script>
	// Tinkerings: the projects placed on a 2x2 matrix. The side panel comes from src/routes/+layout.svelte.
	// All project content and positions live in src/lib/tinkerings.js, not here.
	import { onMount, tick, untrack } from 'svelte';
	import { page } from '$app/state';
	import { pushState, replaceState } from '$app/navigation';
	import Media from '$lib/components/Media.svelte';
	import ProjectPanel from '$lib/components/ProjectPanel.svelte';
	import Title, { plain } from '$lib/components/Title.svelte';
	import { popup } from '$lib/popup.svelte.js';

	let { data } = $props();

	// ---- The project popup ----
	// Each open project gets its own address, e.g. /tinkerings?project=walks-from-life

	let current = $state(null); // the project showing in the popup, or null when closed

	// Let the side panel know, so it can step out of the way while the popup is open
	$effect(() => {
		popup.open = !!current;
		return () => (popup.open = false);
	});
	let panel; // the popup, so we can ask it to close
	let topLine; // the band with the intro; the popup starts just below it
	const isPhone = () => matchMedia('(max-width: 48rem)').matches;
	// On phones the top line may be scrolled away, so the popup starts near the top instead
	const panelTop = () => (isPhone() ? 24 : (topLine?.getBoundingClientRect().bottom ?? 32));

	// Each project's card button, by id: one set on the matrix, one in the phone list.
	// Only one set is showing at a time.
	const cards = {};
	const phoneCards = {};
	const cardOf = (id) => (isPhone() ? phoneCards[id] : cards[id]);
	const thumbOf = (id) => cardOf(id)?.querySelector('.thumb');

	// Phones: one plain list, in quadrant order (worked out from x and y)
	const phoneList = $derived(
		[
			{ left: true, top: true },
			{ left: false, top: true },
			{ left: true, top: false },
			{ left: false, top: false }
		].flatMap((q) =>
			data.tinkerings
				.filter((t) => t.x < 50 === q.left && t.y < 50 === q.top)
				.sort((a, b) => a.y - b.y)
		)
	);

	function open(item) {
		current = item;
		pushState(`?project=${item.id}`, { project: item.id });
	}

	// Runs after the popup has shrunk back into its card
	async function closed() {
		const id = current.id;
		current = null;
		// Tidy the address: step back if we added it, otherwise just clear it
		if (page.state.project) history.back();
		else replaceState(location.pathname, {});
		// Wait until the page behind is clickable again, then put focus back on the card
		await tick();
		cardOf(id)?.focus({ preventScroll: true });
	}

	// Opening a link straight to a project, e.g. one someone shared
	onMount(() => {
		const id = new URLSearchParams(location.search).get('project');
		const item = data.tinkerings.find((t) => t.id === id);
		if (item) current = item;
	});

	// Browser back and forward buttons close and reopen the popup.
	// Only reacts when the address actually changes.
	let lastState;
	$effect(() => {
		const id = page.state.project;
		if (id === lastState) return;
		lastState = id;
		untrack(() => {
			if (!id && current && panel) panel.close();
			if (id && !current) current = data.tinkerings.find((t) => t.id === id) ?? null;
		});
	});
</script>

<svelte:head>
	<title>Tinkerings · Shivani Singh Ghoshi</title>
</svelte:head>

<!-- The arrow on the matrix labels. One drawing, turned to point each way, so all four match. -->
{#snippet arrow(turn)}
	<svg class="arrow" viewBox="0 0 12 12" style:transform="rotate({turn}deg)">
		<path d="M1 6h10M7 2l4 4-4 4" />
	</svg>
{/snippet}

<!-- One project card: the thumbnail with its name underneath. Clicking it opens the popup. -->
{#snippet card(item, store)}
	<button
		type="button"
		class="card"
		bind:this={store[item.id]}
		aria-label="Open {plain(item.title)}"
		onclick={() => open(item)}
	>
		<div class="thumb">
			<Media src={item.media} alt="" />
		</div>
		<p>
			<span class="name"><Title text={item.title} /></span>
		</p>
	</button>
{/snippet}

<!-- While the popup is open, the page behind can't be clicked or tabbed into -->
<div class="content" inert={!!current}>
	<header bind:this={topLine}>
		<p class="intro">{data.intro}</p>
	</header>

	<h1 class="visually-hidden">Tinkerings</h1>

	<section class="matrix" aria-label="Projects placed from hand-drawn to technical, and from build for work to build for fun">
		<!-- The two axes and their labels -->
		<div class="axis across" aria-hidden="true"></div>
		<div class="axis down" aria-hidden="true"></div>
		<span class="axis-label top" aria-hidden="true">{@render arrow(-90)} build for work</span>
		<span class="axis-label bottom" aria-hidden="true">{@render arrow(90)} build for fun</span>
		<span class="axis-label left" aria-hidden="true">{@render arrow(180)} hand-drawn</span>
		<span class="axis-label right" aria-hidden="true">technical {@render arrow(0)}</span>

		<ul>
			{#each data.tinkerings as item (item.id)}
				<li style:left="{item.x}%" style:top="{item.y}%" style:--w={item.width}>
					{@render card(item, cards)}
				</li>
			{/each}
		</ul>
	</section>

	<!-- Phones only: the same projects in one plain list -->
	<div class="stacked">
		<ul>
			{#each phoneList as item (item.id)}
				<li>{@render card(item, phoneCards)}</li>
			{/each}
		</ul>
	</div>
</div>

{#if current}
	<ProjectPanel
		bind:this={panel}
		project={current}
		origin={thumbOf}
		top={panelTop()}
		onclosed={closed}
	/>
{/if}

<style>
	/* Header on top, matrix fills the rest of the screen height */
	.content {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}

	/* Top band: a horizontal box with a line under it, like the side panels */
	header {
		display: flex;
		align-items: center;
		gap: 1.75rem;
		/* Text starts in line with the "hand-drawn" label below it */
		padding: 0.9rem 1.1rem;
		border-bottom: 1px solid var(--line);
	}

	/* Intro on one line */
	.intro {
		margin: 0;
		font-size: clamp(0.9rem, 1.05vw, 1.2rem);
		font-weight: 500;
		line-height: 1.35;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* The matrix, on faint graph paper, filling the rest of the screen */
	.matrix {
		--faint: #cfcfc4;
		position: relative;
		flex: 1;
		min-height: 0;
		margin: 0; /* fills the whole area right of the nav and below the top line */
		background-image:
			linear-gradient(to right, rgba(0, 0, 0, 0.045) 1px, transparent 1px),
			linear-gradient(to bottom, rgba(0, 0, 0, 0.045) 1px, transparent 1px);
		background-size: 24px 24px;
		/* Start the squares from the middle, so the two axes sit exactly on grid lines */
		background-position: calc(50% + 12px) calc(50% + 12px);
	}

	.axis {
		position: absolute;
		background: var(--faint);
	}

	.axis.across {
		left: 0;
		right: 0;
		top: 50%;
		height: 1px;
	}

	.axis.down {
		top: 0;
		bottom: 0;
		left: 50%;
		width: 1px;
	}

	.axis-label {
		position: absolute;
		font-size: 0.8rem;
		color: var(--muted);
		background: var(--bg);
		padding: 0 0.35rem;
		white-space: nowrap;
	}

	/* Label arrows: 11px, a thin line in the same grey as the text */
	.arrow {
		width: 0.85em;
		height: 0.85em;
		vertical-align: -0.08em;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.3;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.axis-label.top {
		top: 0.5rem;
		left: 50%;
		transform: translateX(0.4rem);
	}

	.axis-label.bottom {
		bottom: 0.5rem;
		left: 50%;
		transform: translateX(0.4rem);
	}

	.axis-label.left {
		left: 0.75rem;
		top: 50%;
		transform: translateY(0.3rem);
	}

	.axis-label.right {
		right: 0.75rem;
		top: 50%;
		transform: translateY(0.3rem);
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	li {
		position: absolute;
		/* Width as a share of the matrix, but never so big it runs off the bottom */
		width: min(calc(var(--w) * 1%), calc(var(--w) * 1.6vh));
	}

	/* Cards are buttons, reset to look like plain cards */
	.card {
		display: block;
		width: 100%;
		padding: 0;
		border: 0;
		background: none;
		font: inherit;
		color: inherit;
		text-align: left;
		cursor: pointer;
	}

	.card:focus-visible {
		outline: 2px solid var(--text);
		outline-offset: 4px;
		border-radius: 4px;
	}

	.thumb {
		background: var(--card);
		border-radius: 4px;
		box-shadow: var(--shadow);
		overflow: hidden;
	}

	/* Card titles stay on one line */
	.card p {
		margin: 0.45rem 0 0;
		font-size: 0.75rem;
		line-height: 1.3;
		white-space: nowrap;
	}

	.name {
		color: var(--ink);
		font-weight: 500;
	}

	.card .thumb {
		transition: box-shadow 0.2s ease, transform 0.2s ease;
	}

	.card:hover .thumb {
		transform: translateY(-2px);
		box-shadow: 0 4px 14px rgba(65, 60, 50, 0.18);
	}

	/* The phone list stays hidden on bigger screens */
	.stacked {
		display: none;
	}

	/* Phones: no room for the matrix, so the cards stack in one list */
	@media (max-width: 48rem) {
		/* The page grows with the list instead of filling one screen */
		.content {
			height: auto;
		}

		/* Text starts in line with the cards below it */
		header {
			align-items: flex-start;
			gap: 1rem;
			padding-inline: 1rem;
		}

		/* No room for one line on a phone, so let it wrap */
		.intro {
			font-size: 1rem;
			white-space: normal;
		}

		/* Swap the matrix for the plain list */
		.matrix {
			display: none;
		}

		.stacked {
			display: block;
			padding: 1.5rem 1rem 4rem;
		}

		.card p {
			font-size: 0.95rem;
		}
	}

	/* Phone list: projects one under another, 32px apart */
	.stacked ul {
		display: grid;
		gap: 2rem;
	}

	.stacked li {
		position: static;
		width: auto;
	}

	@media (prefers-reduced-motion: reduce) {
		.card .thumb {
			transition: none;
		}

		.card:hover .thumb {
			transform: none;
		}
	}
</style>
