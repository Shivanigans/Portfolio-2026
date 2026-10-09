<script>
	// The frame round every page: the side panel on the left (logo, menu, note),
	// and the page itself on the right. On phones the side panel becomes a band across the top.
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import Starburst from '$lib/components/Starburst.svelte';
	import BouncingLogo from '$lib/components/BouncingLogo.svelte';
	import SocialIcon from '$lib/components/SocialIcon.svelte';
	import { logoImage, logoStar, logoFace } from '$lib/stickers.js';
	import { popup } from '$lib/popup.svelte.js';
	import '../app.css';

	let { children } = $props();

	const links = [
		{ href: '/projects', label: 'Projects' },
		{ href: '/tinkerings', label: 'Tinkerings' },
		{ href: '/blog', label: 'Blog' },
		{ href: '/about', label: 'About' }
	];

	// Links in the note at the bottom of the side panel
	const behanceLink = 'https://www.behance.net/shivanigans';
	const linkedinLink = 'https://www.linkedin.com/in/shivanisinghghoshi';
	const instagramLink = 'https://www.instagram.com/_shivanigans_';
	const resumeLink = 'https://drive.google.com/file/d/1E4UBo4NH8hVvh5J31Wnv1Z4iuO1KdUJo/view?usp=sharing';

	// Pages where the logo leaves its spot and drifts around the screen.
	// Remove a page from this list once it has real content. The 404 page always does it.
	const bouncePages = ['/projects', '/about'];
	const bouncing = $derived(!!page.error || bouncePages.includes(page.url.pathname));

	// The star only spins on the home page
	const spinning = $derived(!page.error && page.url.pathname === '/');
	let logoSpot = $state();

	// Pages that fill the whole space right of the side panel, edge to edge,
	// instead of sitting in the usual centred column
	const fullPages = ['/tinkerings'];
	const full = $derived(fullPages.includes(page.url.pathname));

	// The menu item just clicked, so it turns pink straight away while the next page loads
	let clicked = $state('');
	// Phones: whether the menu is open. It closes after tapping a link.
	let menuOpen = $state(false);

	afterNavigate(() => {
		clicked = '';
		menuOpen = false;
	});

	// A menu item counts as the current page for its own pages too, e.g. a blog post
	const isHere = (href) => page.url.pathname === href || page.url.pathname.startsWith(href + '/');
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && (menuOpen = false)} />

<!-- Your portrait sticker as the browser tab icon -->
<svelte:head>
	{#if logoImage}
		<link rel="icon" type="image/png" href={logoImage} />
	{/if}
</svelte:head>

<div class="frame">
	<!-- While a project popup is open, the side panel can't be clicked or tabbed into -->
	<aside class="side" inert={popup.open}>
		<!-- Logo at the top. On the home page the star turns slowly (speed is set in .spin below). -->
		<a href="/" class="home" aria-label="Home">
			{#if bouncing}
				<!-- Empty spot the logo sets off from; it's drifting around the screen instead -->
				<span class="logo" bind:this={logoSpot}></span>
			{:else if logoStar && logoFace}
				<span class="logo">
					<img class:spin={spinning} src={logoStar} alt="" />
					<img class="face" src={logoFace} alt="" />
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

		<!-- Hover shows a light pink bar. The current page, or the one just clicked,
		     gets the bright pink bar. -->
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

		<nav id="site-nav" class:open={menuOpen}>
			{#each links as link}
				{@const here = isHere(link.href)}
				<a
					href={link.href}
					class:selected={clicked ? clicked === link.href : here}
					aria-current={here ? 'page' : undefined}
					onclick={() => (clicked = link.href)}
				>
					<span>{link.label}</span>
				</a>
			{/each}

			<!-- Resume opens in a new tab, so it gets an arrow pointing up and out -->
			<a href={resumeLink} target="_blank" rel="noopener">
				<span>Resume</span>
				<svg class="out" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 9.5l7-7M4 2.5h5.5V8" /></svg>
			</a>

			<!-- Behance, LinkedIn and Instagram icons in a row: at the bottom of the side panel,
			     or at the end of the menu on phones -->
			<div class="social">
				<a href={behanceLink} target="_blank" rel="noopener" aria-label="Behance"><SocialIcon name="behance" /></a>
				<a href={linkedinLink} target="_blank" rel="noopener" aria-label="LinkedIn"><SocialIcon name="linkedin" /></a>
				<a href={instagramLink} target="_blank" rel="noopener" aria-label="Instagram"><SocialIcon name="instagram" /></a>
			</div>
		</nav>

	</aside>

	{#if bouncing && logoSpot}
		<BouncingLogo from={logoSpot} />
	{/if}

	<main class:full>
		{@render children()}
	</main>
</div>

<style>
	.frame {
		display: grid;
		/* --side: the side panel width. --logo: the star logo size, 256px, or 78% of the panel
		   width on narrower windows, or 24% of the screen height on short screens, so the
		   side panel always fits on one screen. The logo row is sized to fit the logo. */
		--side: clamp(13rem, 18vw, 22rem);
		--logo: min(256px, calc(var(--side) * 0.78), 24vh);
		--logo: min(256px, calc(var(--side) * 0.78), 24dvh);
		grid-template-columns: var(--side) minmax(0, 1fr);
		/* dvh is the height you can actually see. On iPads and phones, plain vh also counts
		   the bit hidden behind the browser bars, which made the page scroll. */
		min-height: 100vh;
		min-height: 100dvh;
	}

	/* Side panel: logo on top, the menu, then a boxed note at the bottom.
	   It stays put while the page beside it scrolls. */
	.side {
		position: sticky;
		top: 0;
		height: 100vh;
		height: 100dvh;
		overflow-y: auto; /* only on very short screens, so the note is never cut off */
		display: grid;
		grid-template-rows: calc(var(--logo) / 0.78) 1fr;
		min-height: 0;
		border-right: 1px solid var(--line); /* full-height divider */
	}

	.home {
		display: grid;
		place-items: center;
		min-height: 0;
	}

	/* Always square, at the --logo size set on .frame */
	.logo {
		position: relative;
		display: block;
		width: var(--logo);
		height: var(--logo);
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

	.monogram {
		font-weight: 700;
		font-size: 1.4rem;
	}

	/* One full turn every 20 seconds. Lower the number to spin faster. */
	.spin {
		animation: spin 20s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Menu: full-width rows. Light pink on hover, bright pink when selected. */
	nav {
		display: flex;
		flex-direction: column;
		gap: 0.4dvh;
		padding-top: 5dvh;
	}

	nav a {
		display: flex;
		align-items: center;
		min-height: 6.2dvh;
		padding: 0.2rem 1.75rem;
		font-family: var(--sticker); /* Junicode */
		font-size: 1.75rem; /* 28px */
		font-weight: 500; /* Junicode Condensed Medium */
		line-height: 1.1;
		color: var(--ink);
		text-decoration: none;
		transition: background 0.15s ease;
	}

	/* Honey leaves extra room under the letters, which made them sit high in the pink bar.
	   This trims the text to the top of the capitals and the baseline, so it centres exactly. */
	nav a span {
		text-box: trim-both cap alphabetic;
	}

	nav a:hover {
		background: var(--pink-soft);
	}

	nav a.selected {
		background: var(--pink);
	}

	nav a:focus-visible {
		outline: 2px solid var(--text);
		outline-offset: -2px;
	}

	/* The arrow after Resume: 14px, a thin line like the Tinkerings arrows */
	.out {
		width: 0.5em;
		height: 0.5em;
		margin-left: 0.3em;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.4;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	/* Icons pushed to the bottom of the side panel, lined up with the menu words.
	   36px icons, 36px apart. */
	.social {
		display: flex;
		gap: 36px;
		margin-top: auto;
		padding: 2rem 1.75rem 2.5rem;
	}

	/* Only the colour changes on hover: dark to pink, no pink bar like the menu words */
	nav .social a {
		display: block;
		width: 36px;
		height: 36px;
		min-height: 0;
		padding: 0;
		color: var(--ink);
	}

	nav .social a:hover {
		background: none;
		color: var(--pink);
	}

	/* Usual pages: a centred column with room above and below */
	/* Usual pages: 100px in from the side panel line. The top padding puts the page title
	   level with the top of the star logo: the logo is centred in its row, and the star
	   starts 8.2% of the way into the logo image. */
	main {
		width: 100%;
		max-width: calc(var(--column) + 100px + 1rem);
		margin: 0;
		padding: calc(0.223 * var(--logo)) 1rem 8rem 100px;
	}

	/* Full pages (Tinkerings) fill the space themselves */
	main.full {
		max-width: none;
		margin: 0;
		padding: 0;
	}

	/* The menu button only shows on phones */
	.menu-button {
		display: none;
		padding: 0.75rem;
		border: 0;
		background: none;
		color: var(--ink);
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
		transition: transform 0.2s ease, opacity 0.2s ease;
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

	/* Phones: the side panel splits up. The logo and menu button make a band across the top,
	   and the links (with the icons) drop down below the logo when the menu is opened. */
	@media (max-width: 48rem) {
		/* Rows: logo and menu button, the links (when open), then the page */
		.frame {
			grid-template-columns: auto minmax(0, 1fr);
			grid-template-rows: auto auto 1fr;
		}

		/* The side panel lets its parts sit straight in the rows above */
		.side {
			display: contents;
		}

		.home {
			grid-row: 1;
			padding: 0.75rem;
		}

		/* Logo on phones: 114px wide (grown by the same share as desktop, 180px to 256px) */
		.logo {
			width: 114px;
			height: 114px;
		}

		.menu-button {
			grid-row: 1;
			display: block;
			justify-self: end;
			/* The lines sit as far in from the right edge as the star sits from the left
			   (12px padding + the star starting 8.2% into the 114px logo = 21px) */
			margin-right: calc(114px * 0.082);
		}

		/* Hidden until the menu is opened, then full-width rows like on desktop */
		nav {
			display: none;
			grid-row: 2;
			grid-column: 1 / -1;
			gap: 0;
			padding: 0 0 0.75rem;
		}

		nav.open {
			display: flex;
		}

		nav a {
			min-height: 3.25rem;
			padding: 0.5rem 1rem;
			font-size: 1.5rem;
		}

		/* Line under the band (and under the links when the menu is open) */
		main {
			grid-row: 3;
			grid-column: 1 / -1;
			border-top: 1px solid var(--line);
			max-width: none;
			padding: 2.5rem 1rem 5rem;
		}

		/* Phones: the icons sit in a row at the end of the open menu.
		   28px icons, each with a 44px tap area, lined up with the menu words. */
		.social {
			gap: 0.5rem;
			margin-top: 0;
			padding: 0.5rem calc(1rem - 8px) 0;
		}

		nav .social a {
			width: 44px;
			height: 44px;
			padding: 8px;
		}
	}

	/* Visitors who turn off motion in their settings see the logo still */
	@media (prefers-reduced-motion: reduce) {
		.spin {
			animation: none;
		}

		.bars span {
			transition: none;
		}

		nav a {
			transition: none;
		}
	}
</style>
