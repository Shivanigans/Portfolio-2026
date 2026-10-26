<script>
	// The frame round every page: a grey desk with a white sheet on it, and the margin to its
	// left (logo, tabs and the page's note). The two are centred together on the desk.
	// Tinkerings is different: its canvas fills the whole screen, and the margin floats on top
	// in the same spot. On phones the margin becomes a band across the top with a menu button.
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import Arrow from '$lib/components/Arrow.svelte';
	import Starburst from '$lib/components/Starburst.svelte';
	import BouncingLogo from '$lib/components/BouncingLogo.svelte';
	import LogoFace from '$lib/components/LogoFace.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	import { resumeLink } from '$lib/links.js';
	import { logoImage, logoStar, awesomeImage } from '$lib/stickers.js';
	import { popup } from '$lib/popup.svelte.js';
	import { live } from '$lib/notes.svelte.js';
	import '../app.css';

	let { children } = $props();

	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/projects', label: 'Projects' },
		{ href: '/tinkerings', label: 'Tinkering' },
		{ href: '/blog', label: 'Blog' },
		{ href: '/about', label: 'About' }
	];

	// Pages where the logo leaves its spot and drifts around the screen.
	// Remove a page from this list once it has real content. The 404 page always does it.
	const bouncePages = ['/about'];
	const bouncing = $derived(!!page.error || bouncePages.includes(page.url.pathname));

	// The star only spins on the home page
	const spinning = $derived(!page.error && page.url.pathname === '/');
	let logoSpot = $state();

	// Tinkerings is a canvas that fills the screen, with no sheet
	const canvas = $derived(!page.error && page.url.pathname === '/tinkerings');

	// The blog has the same slim bar as Tinkerings; every other page has the socials table
	const footer = $derived(page.url.pathname.startsWith('/blog') ? 'bar' : 'table');

	// The margin note: the page's own (from its +page.js), unless the page has swapped it.
	// A blog post with footnotes shows those instead.
	const note = $derived(live.text ?? page.data.note ?? []);
	const footnotes = $derived(page.data.footnotes ?? []);

	// A paragraph that starts with a symbol, like '↘ Every walk', shows the symbol in pink
	const marked = (text) => text.match(/^([^\p{L}\p{N}\s"'‘“(]+)\s+(.*)$/su);

	// The tab just clicked, so it slides out straight away while the next page loads
	let clicked = $state('');
	// Phones: whether the menu is open. It closes after tapping a link.
	let menuOpen = $state(false);

	afterNavigate(() => {
		clicked = '';
		menuOpen = false;
		live.text = null;
	});

	// A tab counts as the current page for its own pages too, e.g. a blog post.
	// Home only counts for the home page itself.
	const isHere = (href) =>
		href === '/' ? page.url.pathname === '/' : page.url.pathname === href || page.url.pathname.startsWith(href + '/');
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && (menuOpen = false)} />

<div class="group" class:canvas>
	<!-- While a project popup is open, the margin can't be clicked or tabbed into -->
	<aside class="side" inert={popup.open}>
		<!-- Logo at the top. On the home page the star turns while it is pointed at (see .spin below). -->
		<a href="/" class="home" aria-label="Home">
			{#if bouncing}
				<!-- The spot the logo sets off from. It's drifting around the screen instead, and as it
				     leaves, it uncovers your "Don't forget to be awesome!" sticker underneath. -->
				<span class="logo" bind:this={logoSpot}>
					{#if awesomeImage}
						<img class="awesome" src={awesomeImage} alt="Don’t forget to be awesome!" />
					{/if}
				</span>
			{:else if logoStar}
				<span class="logo">
					<img class:spin={spinning} src={logoStar} alt="" />
					<!-- Off Home, pointing at the logo makes its thumbs pop up again -->
					<LogoFace pop={!spinning} />
				</span>
			{:else if logoImage}
				<span class="logo">
					<img class:spin={spinning} src={logoImage} alt="" />
				</span>
			{:else}
				<span class="logo" class:spin={spinning}>
					<Starburst><span class="monogram">SSG</span></Starburst>
				</span>
			{/if}
		</a>

		<!-- Phones only: three lines that open the menu, and turn into a cross when it is open -->
		<button
			type="button"
			class="menu-button"
			aria-expanded={menuOpen}
			aria-controls="site-nav"
			aria-label={menuOpen ? 'Close menu' : 'Open menu'}
			onclick={() => (menuOpen = !menuOpen)}
		>
			<span class="bars" class:open={menuOpen} aria-hidden="true">
				<span></span><span></span><span></span>
			</span>
		</button>

		<!-- The tabs, tucked against the sheet. The current page (or the one just clicked)
		     slides out and turns yellow. Pointing at a tab slides it out a little. -->
		<nav id="site-nav" class:open={menuOpen}>
			{#each links as link}
				{@const here = isHere(link.href)}
				<a
					href={link.href}
					class:selected={clicked ? clicked === link.href : here}
					aria-current={here ? 'page' : undefined}
					onclick={() => (clicked = link.href)}
				>
					{link.label}
				</a>
			{/each}

			<!-- Resume opens in a new tab, so it gets an arrow pointing up and out -->
			<a href={resumeLink} target="_blank" rel="noopener">
				Resume <Arrow dir="out" />
			</a>
		</nav>

		<!-- The page's note, or a blog post's footnotes -->
		{#if footnotes.length}
			<section class="notes" aria-labelledby="notes-heading">
				<h2 id="notes-heading"><span aria-hidden="true">✳</span> footnotes</h2>
				<ol>
					{#each footnotes as footnote, i}
						<li id="footnote-{i + 1}"><span class="number">{i + 1}</span> {footnote}</li>
					{/each}
				</ol>
			</section>
		{:else if note.length}
			<section class="notes" aria-labelledby="notes-heading">
				<h2 id="notes-heading"><span aria-hidden="true">✳</span> notes</h2>
				<!-- Home changes its note as you scroll, so it's read out when it changes -->
				<div class="note-text" aria-live="polite">
					{#key note}
						<div class="note-fade">
							{#each note as paragraph}
								{@const mark = marked(paragraph)}
								<p>
									{#if mark}<span class="mark" aria-hidden="true">{mark[1]}</span> {mark[2]}{:else}<span
											class="square"
											aria-hidden="true"
										></span>{paragraph}{/if}
								</p>
							{/each}
						</div>
					{/key}
				</div>
			</section>
		{/if}
	</aside>

	{#if bouncing && logoSpot}
		<BouncingLogo from={logoSpot} />
	{/if}

	{#if canvas}
		<!-- Tinkerings: the canvas fills the screen behind the margin, with its slim footer
		     along the bottom -->
		<!-- While a project is open, the canvas comes forward, so the popup covers the margin too -->
		<main class="canvas-page" class:raised={popup.open}>
			{@render children()}
		</main>
		<div class="canvas-footer" inert={popup.open}>
			<SiteFooter variant="bar" />
		</div>
	{:else}
		<main class="sheet" class:barred={footer === 'bar'}>
			{@render children()}
			{#if footer !== 'bar'}
				<SiteFooter variant={footer} />
			{/if}
		</main>
	{/if}
</div>

<!-- The blog: the same slim bar as Tinkering, across the whole window under the page -->
{#if !canvas && footer === 'bar'}
	<div class="page-bar"><SiteFooter variant="bar" /></div>
{/if}

<style>
	/* The margin (230px) and the sheet (880px). The sheet sits in the middle of the window, with
	   the margin hanging off its left: the right gets an empty space as wide as the margin.
	   On windows too narrow for that, the empty space gives way first, then the sheet shrinks
	   rather than the page scrolling sideways.
	   The sheet starts 56px from the top and runs off the bottom of the screen. */
	.group {
		display: grid;
		grid-template-columns: var(--side) minmax(0, var(--sheet));
		justify-content: center;
		padding-top: var(--sheet-top);
		padding-right: clamp(0px, 100% - var(--sheet) - var(--side), var(--side));
		min-height: 100vh;
		min-height: 100dvh;
	}

	/* The margin stays put while the sheet scrolls */
	.side {
		position: sticky;
		top: var(--sheet-top);
		align-self: start;
		/* Never scrolls on its own: the gaps below shrink on shorter windows instead */
		overflow: clip visible; /* the spinning star's see-through corners poke out as it turns */
		padding-bottom: 2rem;
	}

	.home {
		display: block;
		width: 200px;
	}

	.home:focus-visible {
		outline: 2px solid var(--text);
		outline-offset: 2px;
	}

	/* The logo: a 200px square */
	.logo {
		position: relative;
		display: block;
		width: 200px;
		height: 200px;
	}

	.logo img {
		display: block;
		width: 100%;
		height: 100%;
	}

	/* The sticker under the logo: it settles in just as the logo drifts off it. It's drawn as big
	   as the star's points reach (its picture has less empty space round it, hence the padding). */
	.logo .awesome {
		padding: 9px;
		animation: uncover 0.5s 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
	}

	@keyframes uncover {
		from {
			opacity: 0;
			transform: scale(0.9);
		}
	}

	.monogram {
		font-weight: 600;
		font-size: 1.4rem;
	}

	/* Home: the star holds still, and turns only while the logo is pointed at (or tabbed to).
	   It stops where it got to. One full turn every 20 seconds; lower the number to spin faster. */
	.spin {
		animation: spin 20s linear infinite paused;
	}

	.home:hover .spin,
	.home:focus-visible .spin {
		animation-play-state: running;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* The tabs: 56px under the logo (less on short windows), lined up on the right of their
	   column. Each is 140px wide; the current one slides out to 162px. */
	nav {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 8px;
		margin-top: clamp(24px, 100dvh - 820px, 56px);
	}

	nav a {
		display: flex;
		align-items: center;
		gap: 0.4em;
		width: 140px;
		min-height: 34px;
		padding: 0 18px;
		background: var(--greige);
		font-family: var(--display);
		font-size: var(--type-label);
		font-weight: 500;
		text-transform: uppercase;
		color: var(--text);
		text-decoration: none;
		transition:
			width 0.2s cubic-bezier(0.2, 0.8, 0.2, 1),
			background-color 0.15s ease;
	}

	/* Pointing at a tab slides it out a little and tints it soft pink.
	   The current page slides out further, in the bright pink. */
	nav a:hover {
		width: 148px;
		background: var(--pink-soft);
		color: var(--text);
	}

	nav a.selected {
		width: 162px;
		background: var(--pink);
		color: var(--on-pink);
	}

	nav a:focus-visible {
		outline: 2px solid var(--text);
		outline-offset: -2px;
	}

	/* The note: 64px under the tabs (less on short windows) */
	.notes {
		margin-top: clamp(24px, 100dvh - 800px, 64px);
		padding: 0 1rem 0 0.75rem;
		font-size: var(--type-label);
		line-height: 1.55;
	}

	.notes h2 {
		margin: 0 0 0.6rem;
		font-size: var(--type-lead);
		font-weight: 600;
		color: var(--pink-deep);
	}

	.notes p,
	.notes ol {
		margin: 0;
	}

	/* No word left alone on a note's last line */
	.notes p,
	.notes li {
		text-wrap: pretty;
	}

	.notes p + p,
	.notes li + li {
		margin-top: 0.85rem;
	}

	.notes ol {
		padding: 0;
		list-style: none;
	}

	.mark,
	.number {
		color: var(--pink-deep);
	}

	/* A new note fades in over the old one */
	.note-text {
		display: grid;
	}

	.note-fade {
		grid-area: 1 / 1;
		animation: note-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

	/* As it comes in, it fades up from faint and rises a few pixels into place */
	@keyframes note-in {
		from {
			opacity: 0;
			transform: translateY(5px);
		}
	}

	/* The small pink square at the start of a note (a note with its own mark, like ✥, keeps that) */
	.square {
		display: inline-block;
		width: 7px;
		height: 7px;
		margin-right: 0.6em;
		vertical-align: 0.1em;
		background: var(--pink);
	}

	/* The page's content column (still called the sheet): no paper of its own any more, the
	   content sits straight on the page background. At least a screen tall, 72px of room at the
	   top and 80px at the sides. The footer sits at the bottom on short pages. */
	.sheet {
		position: relative;
		display: flex;
		flex-direction: column;
		min-width: 0;
		min-height: calc(100dvh - var(--sheet-top));
		padding: 72px clamp(1.5rem, 6vw, 80px) 0;
	}

	/* Tinkerings: the canvas fills the whole screen behind everything, a shade lighter than the
	   page so it still reads as a canvas */
	.canvas-page {
		position: fixed;
		inset: 0;
		background: var(--canvas);
	}

	/* While a project popup or chaos mode is open, the canvas comes forward so they cover the
	   margin and the footer bar too */
	.canvas-page.raised,
	.canvas-page:has(:global(.hypno)) {
		z-index: 4;
	}

	/* The margin floats on the canvas, on a soft patch of the canvas colour so it stays readable */
	.canvas .side {
		position: relative;
		top: auto; /* no sticky offset here, or it would sit 56px lower than on the other pages */
		max-height: none;
		z-index: 2;
		overflow: visible;
		pointer-events: none;
	}

	.canvas .side > * {
		pointer-events: auto;
	}

	.canvas .side::before {
		content: '';
		position: absolute;
		inset: -2.5rem -2rem 0 -3rem;
		z-index: -1;
		background: var(--canvas);
		mask-image: radial-gradient(closest-side, black 70%, transparent);
		mask-size: 100% 100%;
	}

	/* The canvas is the whole page, so the page itself never scrolls (dragging and the
	   trackpad move the canvas instead). Phones get a plain list that scrolls as usual. */
	@media (min-width: 48.01rem) {
		:global(html:has(.group.canvas)) {
			overflow: hidden;
		}
	}

	/* Very short windows: tighter gaps (the logo keeps its size), so the note still fits above the footer */
	@media (min-width: 48.01rem) and (max-height: 48rem) {
		.canvas nav {
			margin-top: 32px;
		}

		.canvas .notes {
			margin-top: 32px;
		}
	}

	/* The blog's slim bar runs across the whole window under the page, like on Tinkering.
	   The page leaves room for it, so on a short page the bar still sits at the bottom of the screen. */
	.sheet.barred {
		--bar-height: calc(2.65rem + 5px); /* about how tall the bar is */
		min-height: calc(100dvh - var(--sheet-top) - var(--bar-height));
		padding-bottom: 4rem;
	}

	.group:has(.sheet.barred) {
		min-height: calc(100dvh - 2.65rem - 5px);
	}

	/* The slim footer, along the bottom of the canvas */
	.canvas-footer {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 3;
	}

	/* The menu button only shows on phones */
	.menu-button {
		display: none;
		padding: 0.75rem;
		border: 0;
		background: none;
		color: var(--text);
		cursor: pointer;
	}

	.menu-button:focus-visible {
		outline: 2px solid var(--text);
	}

	/* Three lines, each 24px long and 2px thick, 5px apart */
	.bars {
		display: grid;
		gap: 5px;
		width: 24px;
	}

	.bars span {
		display: block;
		height: 2px;
		background: currentColor;
		transition:
			transform 0.2s ease,
			opacity 0.2s ease;
	}

	/* The cross: lines shrink from 24px to 18px long (scaleX 0.75) */
	.bars.open span:nth-child(1) {
		transform: translateY(7px) rotate(45deg) scaleX(0.75);
	}

	.bars.open span:nth-child(2) {
		opacity: 0;
	}

	.bars.open span:nth-child(3) {
		transform: translateY(-7px) rotate(-45deg) scaleX(0.75);
	}

	/* Phones (not designed yet): the margin becomes a band across the top, the logo on the left
	   and the menu button on the right. The tabs drop down under it when the menu is opened.
	   The note is left out. */
	@media (max-width: 48rem) {
		.group {
			display: block;
			padding-top: 0;
			padding-right: 0;
		}

		.side {
			position: static;
			display: grid;
			grid-template-columns: auto auto;
			justify-content: space-between;
			align-items: center;
			max-height: none;
			overflow: visible;
			padding: 0.75rem 0.75rem 0.75rem 1rem;
		}

		.home,
		.logo {
			width: 72px;
			height: 72px;
		}

		.menu-button {
			display: block;
		}

		nav {
			display: none;
			grid-column: 1 / -1;
			align-items: stretch;
			margin-top: 0.75rem;
		}

		nav.open {
			display: flex;
		}

		nav a,
		nav a:hover,
		nav a.selected {
			width: auto;
			min-height: 44px;
		}

		.notes {
			display: none;
		}

		.sheet {
			min-height: 0;
			padding: 2.5rem 1.25rem 0;
		}

		/* Tinkerings on phones: a plain list on the desk, no floating margin */
		.canvas .side::before {
			display: none;
		}

		.canvas-page {
			position: static;
		}

		.canvas-footer {
			position: static;
		}
	}

	/* Visitors who turn off motion in their settings see the logo still, and nothing slides */
	@media (prefers-reduced-motion: reduce) {
		.spin,
		.note-fade,
		.logo .awesome {
			animation: none;
		}

		.bars span,
		nav a {
			transition: none;
		}
	}
</style>
