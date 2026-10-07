<script>
	// TRIAL LAYOUT: side nav, with the projects placed on a 2x2 matrix.
	// Your real Tinkerings page is untouched. Delete the src/routes/try folder to remove this.
	// All project content and positions live in src/lib/tinkerings.js, not here.
	import { onMount, tick, untrack } from 'svelte';
	import { page } from '$app/state';
	import { pushState, replaceState } from '$app/navigation';
	import { logoImage, logoStar, logoFace } from '$lib/stickers.js';
	import Media from '$lib/components/Media.svelte';
	import ProjectPanel from '$lib/components/ProjectPanel.svelte';
	import Title, { plain } from '$lib/components/Title.svelte';

	let { data } = $props();

	const links = [
		{ href: '/projects', label: 'Projects' },
		{ href: '/try/tinkerings', label: 'Tinkerings' },
		{ href: '/blog', label: 'Blog' },
		{ href: '/about', label: 'About' }
	];

	// Links in the note at the bottom of the side panel
	const behanceLink = 'https://www.behance.net/shivanigans';
	const linkedinLink = 'https://www.linkedin.com/in/shivanisinghghoshi';
	const instagramLink = 'https://www.instagram.com/_shivanigans_';
	const emailLink = 'https://mail.google.com/mail/?view=cm&fs=1&to=singhshivani11240@gmail.com';
	const resumeLink = 'https://drive.google.com/file/d/1E4UBo4NH8hVvh5J31Wnv1Z4iuO1KdUJo/view?usp=sharing';

	// The menu item just clicked, so it turns pink straight away while the next page loads
	let clicked = $state('');

	// ---- The project popup ----
	// Each open project gets its own address, e.g. /try/tinkerings?project=silence-task

	let current = $state(null); // the project showing in the popup, or null when closed
	let panel; // the popup, so we can ask it to close
	let topLine; // the band with the intro; the popup starts just below it
	const panelTop = () => topLine?.getBoundingClientRect().bottom ?? 32;
	const cards = {}; // each project's card button on the matrix, by id

	const thumbOf = (id) => cards[id]?.querySelector('.thumb');

	// The order the arrows go in: round the quadrants clockwise, starting top left
	// (hand-drawn + work, technical + work, technical + fun, hand-drawn + fun).
	// Worked out from each project's x and y, so moving a project updates it.
	const tour = $derived(
		[...data.tinkerings].sort(
			(a, b) => Math.atan2(a.y - 50, a.x - 50) - Math.atan2(b.y - 50, b.x - 50)
		)
	);

	function open(item) {
		current = item;
		pushState(`?project=${item.id}`, { project: item.id });
	}

	// Arrows: swap to the previous or next project, looping round at the ends
	function step(by) {
		const i = tour.findIndex((t) => t.id === current.id);
		current = tour[(i + by + tour.length) % tour.length];
		// Keep the address in step, without adding to the back button history
		replaceState(`?project=${current.id}`, page.state.project ? { project: current.id } : {});
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
		cards[id]?.focus({ preventScroll: true });
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
	<title>Tinkerings (trial layout) · Shivani Singh Ghoshi</title>
</svelte:head>

<!-- While the popup is open, the page behind can't be clicked or tabbed into -->
<div class="frame" inert={!!current}>
	<aside class="side">
		<!-- Logo at the top -->
		<a href="/" class="home" aria-label="Home">
			<span class="logo">
				{#if logoStar && logoFace}
					<img src={logoStar} alt="" />
					<img class="face" src={logoFace} alt="" />
				{:else if logoImage}
					<img src={logoImage} alt="" />
				{/if}
			</span>
		</a>

		<!-- Hover shows a light pink bar. The current page, or the one just clicked,
		     gets the full pink bar and bold text. -->
		<nav>
			{#each links as link}
				{@const here = page.url.pathname === link.href}
				<a
					href={link.href}
					class:selected={clicked ? clicked === link.href : here}
					aria-current={here ? 'page' : undefined}
					onclick={() => (clicked = link.href)}
				>
					{link.label}
				</a>
			{/each}
		</nav>

		<div class="side-note">
			<p>
				A bunch of my projects live on <a href={behanceLink} target="_blank" rel="noopener">Behance</a>. Find my
				<a href={linkedinLink} target="_blank" rel="noopener">LinkedIn</a>,
				<a href={emailLink} target="_blank" rel="noopener">email</a> and
				<a href={instagramLink} target="_blank" rel="noopener">Instagram</a> here.
			</p>
			<p>Also, my <a href={resumeLink} target="_blank" rel="noopener">resume</a>.</p>
		</div>
	</aside>

	<main class="content">
		<header bind:this={topLine}>
			<p class="intro">{data.intro}</p>
		</header>

		<h1 class="visually-hidden">Tinkerings</h1>

		<section class="matrix" aria-label="Projects placed from hand-drawn to technical, and from build for work to build for fun">
			<!-- The two axes and their labels -->
			<div class="axis across" aria-hidden="true"></div>
			<div class="axis down" aria-hidden="true"></div>
			<span class="axis-label top" aria-hidden="true">↑ build for work</span>
			<span class="axis-label bottom" aria-hidden="true">↓ build for fun</span>
			<span class="axis-label left" aria-hidden="true">← hand-drawn</span>
			<span class="axis-label right" aria-hidden="true">technical →</span>

			<ul>
				{#each data.tinkerings as item (item.id)}
					<li style:left="{item.x}%" style:top="{item.y}%" style:--w={item.width}>
						<button
							type="button"
							class="card"
							bind:this={cards[item.id]}
							aria-label="Open {plain(item.title)}"
							onclick={() => open(item)}
						>
							<div class="thumb">
								<Media src={item.media} alt="" />
							</div>
							<p>
								<span class="name"><Title text={item.title} /></span>{#if item.note}<span class="note">&nbsp;· {item.note}</span>{/if}
							</p>
						</button>
					</li>
				{/each}
			</ul>
		</section>
	</main>
</div>

{#if current}
	<ProjectPanel
		bind:this={panel}
		project={current}
		origin={thumbOf}
		top={panelTop()}
		onclosed={closed}
		onprev={() => step(-1)}
		onnext={() => step(1)}
	/>
{/if}

<style>
	.frame {
		display: grid;
		grid-template-columns: clamp(13rem, 18vw, 22rem) 1fr;
		height: 100vh;
	}

	/* Side panel: logo on top, the menu, then a boxed note at the bottom */
	.side {
		display: grid;
		grid-template-rows: minmax(0, 26vh) 1fr auto;
		min-height: 0;
		border-right: 1px solid var(--line); /* full-height divider */
	}

	.home {
		display: grid;
		place-items: center;
		min-height: 0;
	}

	.logo {
		position: relative;
		display: block;
		height: 78%;
		max-width: 78%;
		aspect-ratio: 1;
	}

	.logo img {
		display: block;
		width: 100%;
		height: 100%;
	}

	.logo .face {
		position: absolute;
		inset: 0;
	}

	/* Menu: full-width rows. Light pink on hover, full pink and bold when selected. */
	nav {
		display: flex;
		flex-direction: column;
		gap: 0.4vh;
		padding-top: 5vh;
	}

	nav a {
		display: flex;
		align-items: center;
		min-height: 6.2vh;
		padding: 0.2rem 1.75rem;
		font-size: 1.75rem; /* 28px */
		letter-spacing: -1px;
		line-height: 1.1;
		color: var(--ink);
		text-decoration: none;
		transition: background 0.15s ease;
	}

	nav a:hover {
		background: #ffd3ea;
	}

	nav a.selected {
		background: #ff89c4;
		font-weight: 700;
	}

	nav a:focus-visible {
		outline: 2px solid var(--text);
		outline-offset: -2px;
	}

	/* Note at the bottom, with a line above it */
	.side-note {
		padding: 1.75rem 1.75rem 1.5rem;
		border-top: 1px solid var(--line);
		font-size: clamp(0.85rem, 1vw, 1rem);
		line-height: 1.4;
		color: var(--ink);
	}

	.side-note p {
		margin: 0;
	}

	.side-note p + p {
		margin-top: 1.25rem;
	}

	.side-note a {
		text-decoration: underline;
		text-decoration-color: currentColor;
		text-underline-offset: 3px;
	}

	/* Header on top, matrix fills the rest of the screen height */
	.content {
		max-width: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		min-height: 0;
	}

	/* Top band: a horizontal box with a line under it, like the side panels */
	header {
		display: flex;
		align-items: center;
		gap: 1.75rem;
		padding: 0.9rem clamp(1.25rem, 2.5vw, 2.5rem);
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

	.card p {
		margin: 0.45rem 0 0;
		font-size: 0.75rem;
		line-height: 1.3;
	}

	.name {
		color: var(--ink);
		font-weight: 500;
	}

	.note {
		color: var(--muted);
	}

	.card .thumb {
		transition: box-shadow 0.2s ease, transform 0.2s ease;
	}

	.card:hover .thumb {
		transform: translateY(-2px);
		box-shadow: 0 4px 14px rgba(65, 60, 50, 0.18);
	}

	/* Phones: no room for the matrix, so the nav goes across the top and cards stack */
	@media (max-width: 48rem) {
		.frame {
			grid-template-columns: 1fr;
			height: auto;
		}

		/* Side panel becomes a band across the top: logo, then the links in a row, then the note */
		.side {
			grid-template-rows: auto;
			grid-template-columns: auto 1fr;
			border-right: 0;
			border-bottom: 1px solid var(--line);
		}

		.home {
			padding: 0.75rem;
		}

		.logo {
			height: auto;
			width: 64px;
		}

		nav {
			flex-direction: row;
			align-items: center;
			flex-wrap: wrap;
			gap: 0.5rem 1.25rem;
			padding: 0 1rem;
		}

		nav a {
			min-height: 0;
			padding: 0.3rem 0.5rem;
			font-size: 1.05rem;
		}

		.side-note {
			grid-column: 1 / -1;
			padding: 0.75rem 1rem;
			border-right: 0;
			font-size: 0.9rem;
		}

		header {
			align-items: flex-start;
			gap: 1rem;
		}

		/* No room for one line on a phone, so let it wrap */
		.intro {
			font-size: 1rem;
			white-space: normal;
		}

		.matrix {
			background: none;
		}

		.axis,
		.axis-label {
			display: none;
		}

		ul {
			display: grid;
			gap: 3rem;
		}

		li {
			position: static;
			width: auto;
		}

		.card p {
			font-size: 0.95rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		nav a {
			transition: none;
		}

		.card .thumb {
			transition: none;
		}

		.card:hover .thumb {
			transform: none;
		}
	}
</style>
