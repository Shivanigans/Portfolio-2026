<script>
	// The frame round every page: a grey desk with a bar across the top (logo, tabs, Resume),
	// and the page's content underneath, sitting straight on the desk.
	// Tinkering is different: its canvas fills the whole screen and the top bar floats on it.
	// On phones the tabs hide behind a menu button on the right of the bar.
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
	import '../app.css';

	let { children } = $props();

	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/projects', label: 'Projects' },
		{ href: '/tinkering', label: 'Tinkering' },
		{ href: '/about', label: 'About' },
		{ href: '/blog', label: 'Blog' }
	];

	// Pages where the logo leaves its spot and drifts around the screen.
	// Remove a page from this list once it has real content. The 404 page always does it.
	const bouncePages = ['/about'];
	const bouncing = $derived(!!page.error || bouncePages.includes(page.url.pathname));

	// The star only spins on the home page
	const spinning = $derived(!page.error && page.url.pathname === '/');
	let logoSpot = $state();

	// Tinkering is a canvas that fills the screen
	const canvas = $derived(!page.error && page.url.pathname === '/tinkering');

	// Whether the window is phone-sized. It starts false so the server and the browser draw the
	// same thing to begin with, and is set as soon as the page is open.
	let phone = $state(false);
	$effect(() => {
		const narrow = matchMedia('(max-width: 48rem)');
		const sync = () => (phone = narrow.matches);
		sync();
		narrow.addEventListener('change', sync);
		return () => narrow.removeEventListener('change', sync);
	});

	// The blog has the same slim bar as Tinkering; every other page has the socials table.
	// On phones every page has the table: the slim bar is too cramped to read at that width.
	const footer = $derived(!phone && page.url.pathname.startsWith('/blog') ? 'bar' : 'table');

	// The tab just clicked, so it lights up straight away while the next page loads
	let clicked = $state('');
	// Phones: whether the menu is open. It closes after tapping a link.
	let menuOpen = $state(false);

	afterNavigate(() => {
		clicked = '';
		menuOpen = false;
	});

	// A tab counts as the current page for its own pages too, e.g. a blog post.
	// Home only counts for the home page itself.
	const isHere = (href) =>
		href === '/' ? page.url.pathname === '/' : page.url.pathname === href || page.url.pathname.startsWith(href + '/');
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && (menuOpen = false)} />

<div class="group" class:canvas>
	<!-- While a project popup is open, the top bar can't be clicked or tabbed into -->
	<header class="topbar" inert={popup.open}>
		<!-- Logo on the left. On the home page the star turns while it is pointed at (see .spin below). -->
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
			aria-controls="site-menu"
			aria-label={menuOpen ? 'Close menu' : 'Open menu'}
			onclick={() => (menuOpen = !menuOpen)}
		>
			<span class="bars" class:open={menuOpen} aria-hidden="true">
				<span></span><span></span><span></span>
			</span>
		</button>

		<!-- The tabs and Resume. On desktop these sit straight in the bar (the wrapper disappears);
		     on phones they become the list the menu button opens. -->
		<div class="menu" class:open={menuOpen} id="site-menu">
			<!-- The tabs sit on one line, like the tabs along the top of a browser. The current page
			     is the raised one: filled, outlined on three sides, open at the bottom. -->
			<nav id="site-nav" aria-label="Pages">
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
			</nav>

			<!-- Resume opens in a new tab, so it gets an arrow pointing up and out -->
			<a class="resume" href={resumeLink} target="_blank" rel="noopener">
				Resume <Arrow dir="out" />
			</a>
		</div>
	</header>

	{#if bouncing && logoSpot}
		<BouncingLogo from={logoSpot} />
	{/if}

	{#if canvas}
		<!-- Tinkering: the canvas fills the screen behind the top bar, with its slim footer
		     along the bottom -->
		<!-- While a project is open, the canvas comes forward, so the popup covers the bar too -->
		<main class="canvas-page" class:raised={popup.open}>
			{@render children()}
		</main>
		<div class="canvas-footer" inert={popup.open}>
			<SiteFooter variant={phone ? 'table' : 'bar'} />
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
	/* Every page: the bar across the top, then the content under it, both on the grey desk. */
	.group {
		min-height: 100vh;
		min-height: 100dvh;
	}

	/* The top bar: logo on the left, tabs in the middle, Resume in the right corner.
	   It sits --edge (96px) in from the sides of the window, with 40px above it.
	   Three columns, with the outer two the same width (1fr each), so the tabs in the middle
	   land in the centre of the page rather than halfway between the logo and Resume. */
	.topbar {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: 1.5rem;
		padding: 40px var(--edge) 0;
	}

	/* The tabs and Resume aren't wrapped in anything on desktop: they sit straight in the bar,
	   so the space between them spreads out evenly. (On phones the wrapper comes back as a menu.) */
	.menu {
		display: contents;
	}

	.home {
		display: block;
		flex-shrink: 0;
	}

	.home:focus-visible {
		outline: 2px solid var(--text);
		outline-offset: 2px;
	}

	/* The logo: a 120px square */
	.logo {
		position: relative;
		display: block;
		width: 120px;
		height: 120px;
	}

	.logo img {
		display: block;
		width: 100%;
		height: 100%;
	}

	/* The sticker under the logo: it settles in just as the logo drifts off it. It's drawn as big
	   as the star's points reach (its picture has less empty space round it, hence the padding). */
	.logo .awesome {
		padding: 5px;
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

	/* The tabs sit on a single grey line, like the tabs along the top of a browser */
	nav {
		display: flex;
		align-items: flex-end;
		border-bottom: 1px solid var(--rule);
	}

	nav a {
		padding: 7px 14px;
		font-family: var(--mono);
		font-size: var(--type-footer);
		font-weight: 600;
		letter-spacing: var(--tracking);
		text-transform: uppercase;
		white-space: nowrap;
		color: var(--text);
		text-decoration: none;
		transition: color 0.15s ease;
	}

	nav a:hover {
		color: var(--pink-deep);
	}

	/* The current page: a raised tab. It's filled, outlined on the top and sides, and open at the
	   bottom, so it joins the page underneath. The -1px pulls it over the line so it sits on top. */
	nav a.selected {
		margin-bottom: -1px;
		border: 1px solid var(--rule);
		border-bottom: none;
		background: var(--greige);
		color: var(--pink-deep);
	}

	nav a:focus-visible {
		outline: 2px solid var(--text);
		outline-offset: -2px;
	}

	/* Resume, in the right corner, in the same capitals as the tabs */
	.resume {
		display: inline-flex;
		align-items: center;
		justify-self: end; /* the right-hand column is wide, so Resume keeps to its far edge */
		gap: 0.4em;
		font-family: var(--mono);
		font-size: var(--type-footer);
		font-weight: 600;
		letter-spacing: var(--tracking);
		text-transform: uppercase;
		white-space: nowrap;
		text-decoration: none;
	}

	.resume:focus-visible {
		outline: 2px solid var(--text);
		outline-offset: 3px;
	}

	/* The page's content: a column --column (664px) wide, in the middle of the window, starting
	   72px under the bar. On narrower windows the column shrinks instead of the page scrolling
	   sideways, keeping at least 24px of room on each side. At least a screen tall, so the
	   footer sits at the bottom on short pages. */
	.sheet {
		position: relative;
		display: flex;
		flex-direction: column;
		width: min(var(--column), 100% - 48px);
		margin-inline: auto;
		min-width: 0;
		min-height: calc(100dvh - var(--bar-space));
		padding: 72px 0 0;
	}

	/* Tinkering: the canvas fills the whole screen behind everything, a shade lighter than the
	   page so it still reads as a canvas */
	.canvas-page {
		position: fixed;
		inset: 0;
		background: var(--canvas);
	}

	/* While a project popup or chaos mode is open, the canvas comes forward so they cover the
	   bar and the footer too */
	.canvas-page.raised,
	.canvas-page:has(:global(.hypno)) {
		z-index: 4;
	}

	/* The bar floats on top of the canvas, on a patch of the canvas colour that fades out
	   below it, so the tabs stay readable over whatever is on the canvas behind them */
	.canvas .topbar {
		position: relative;
		z-index: 2;
		background: linear-gradient(var(--canvas) 65%, transparent);
		pointer-events: none;
	}

	.canvas .topbar > * {
		pointer-events: auto;
	}

	/* The canvas is the whole page, so the page itself never scrolls (dragging and the
	   trackpad move the canvas instead). Phones get a plain list that scrolls as usual. */
	@media (min-width: 48.01rem) {
		:global(html:has(.group.canvas)) {
			overflow: hidden;
		}
	}

	/* The blog's slim bar runs across the whole window under the page, like on Tinkering.
	   The page leaves room for it, so on a short page the bar still sits at the bottom of the screen. */
	.sheet.barred {
		--bar-height: calc(2.65rem + 5px); /* about how tall the bar is */
		min-height: calc(100dvh - var(--bar-space) - var(--bar-height));
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

	/* Phones: the bar is the logo on the left and the menu button on the right. The tabs and
	   Resume drop down under it as a list when the menu is opened. */
	@media (max-width: 48rem) {
		/* Two columns instead of three: the middle one was what held the tabs in the centre of
		   the page, and with it gone the menu button sits in the right corner. */
		.topbar {
			grid-template-columns: 1fr auto;
			gap: 0;
			padding: 0.75rem 0.75rem 0.75rem 1rem;
		}

		.logo {
			width: 72px;
			height: 72px;
		}

		.menu-button {
			display: block;
		}

		/* The wrapper comes back here, so the tabs and Resume can hide and show together */
		.menu {
			display: none;
			grid-column: 1 / -1;
			margin-top: 0.75rem;
		}

		.menu.open {
			display: block;
		}

		/* The list: each row full width with a thin line under it, Resume last */
		nav {
			display: block;
			border-bottom: none;
		}

		nav a,
		.resume {
			display: flex;
			align-items: center;
			justify-self: stretch; /* Resume is a row like the rest, not tucked into the corner */
			min-height: 44px;
			padding: 0 0.5rem;
			border-bottom: 1px solid var(--line);
		}

		nav a.selected {
			margin-bottom: 0;
			border: none;
			border-bottom: 1px solid var(--line);
		}

		.sheet {
			min-height: 0;
			padding: 2.5rem 0 0;
		}

		.canvas-page {
			position: static;
		}

		.canvas-footer {
			position: static;
			padding: 0 24px;
		}
	}

	/* Visitors who turn off motion in their settings see the logo still, and nothing slides */
	@media (prefers-reduced-motion: reduce) {
		.spin,
		.logo .awesome {
			animation: none;
		}

		.bars span,
		nav a {
			transition: none;
		}
	}
</style>
