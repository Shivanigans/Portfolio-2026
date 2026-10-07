<script>
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import { formatDate } from '$lib/posts.js';
	import Starburst from '$lib/components/Starburst.svelte';
	import BouncingLogo from '$lib/components/BouncingLogo.svelte';
	import { logoImage, logoStar, logoFace, awesomeImage } from '$lib/stickers.js';
	import '../app.css';

	let { children } = $props();

	// Your resume on Google Drive
	const resumeLink = 'https://drive.google.com/file/d/1E4UBo4NH8hVvh5J31Wnv1Z4iuO1KdUJo/view?usp=sharing';

	const links = [
		{ href: '/projects', label: 'Projects' },
		{ href: '/tinkerings', label: 'Tinkerings' },
		{ href: '/about', label: 'About' }
	];

	// Footer rows
	const elsewhere = [
		{ href: 'https://www.behance.net/shivanigans', label: 'Behance', note: 'Archive Portfolio' },
		{ href: 'https://www.instagram.com/_shivanigans_', label: 'Instagram', note: 'Illustration and comics' },
		{ href: 'https://www.linkedin.com/in/shivanisinghghoshi', label: 'LinkedIn', note: 'Work history' }
	];

	// "Get in touch" opens a new Gmail draft addressed to you
	const email = 'singhshivani11240@gmail.com';
	const contactLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`;

	// Pages where the header logo leaves its spot and drifts around the screen.
	// Remove a page from this list once it has real content. The 404 page always does it.
	const bouncePages = ['/projects', '/about'];
	const bouncing = $derived(!!page.error || bouncePages.includes(page.url.pathname));

	// The star only spins on the home page
	const spinning = $derived(!page.error && page.url.pathname === '/');
	let logoSpot = $state();

	// Whether the phone menu is open
	let menuOpen = $state(false);

	// Close the menu after tapping a link
	afterNavigate(() => (menuOpen = false));
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && (menuOpen = false)} />

<!-- Your portrait sticker as the browser tab icon -->
<svelte:head>
	{#if logoImage}
		<link rel="icon" type="image/png" href={logoImage} />
	{/if}
</svelte:head>

<!-- Trial layouts under /try bring their own header and nav, so skip the usual ones -->
{#if page.route.id?.startsWith('/try')}
	{@render children()}
{:else}

<header class="site-header">
	<a href="/" class="home" aria-label="Home">
		<!-- On the home page the star turns slowly. Speed is set in .spin in the styles below -->
		{#if bouncing}
			<!-- Empty spot the logo sets off from; it's drifting around the screen instead -->
			<div class="logo-spot" bind:this={logoSpot}></div>
		{:else if logoStar && logoFace}
			<div class="logo">
				<img class:spin={spinning} src={logoStar} alt="" />
				<img class="face" src={logoFace} alt="" />
			</div>
		{:else}
			<div class:spin={spinning}>
				{#if logoImage}
					<img src={logoImage} alt="" />
				{:else}
					<Starburst><span class="monogram">SSG</span></Starburst>
				{/if}
			</div>
		{/if}
	</a>

	{#if bouncing && logoSpot}
		<BouncingLogo from={logoSpot} />
	{/if}

	<!-- Each page can set its own intro. Tinkerings sets it in src/lib/tinkerings.js -->
	{#if page.data.intro}
		<p class="intro">{page.data.intro}</p>
	{/if}

	<!-- Only visible on phones -->
	<button
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
			<a href={link.href} aria-current={page.url.pathname.startsWith(link.href) ? 'page' : undefined}>
				{link.label}
			</a>
		{/each}
		<a href={resumeLink} class="external" target="_blank" rel="noopener">
			Resume
			<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 12 12 4M5.5 4H12v6.5" /></svg>
		</a>
		<a href={contactLink} class="external" target="_blank" rel="noopener">
			Get in touch
			<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 12 12 4M5.5 4H12v6.5" /></svg>
		</a>
	</nav>
</header>

<main>
	{@render children()}
</main>

<footer class="site-footer">
	<ul class="elsewhere">
		{#each elsewhere as link}
			<li>
				<a href={link.href} target="_blank" rel="noopener">
					<span class="name">{link.label}</span>
					<span class="note">{link.note}</span>
				</a>
			</li>
		{/each}
	</ul>

	{#if page.data.updated}
		<p class="updated">Last updated <time datetime={page.data.updated}>{formatDate(page.data.updated)}</time></p>
	{/if}

	<div class="sticker">
		{#if awesomeImage}
			<img src={awesomeImage} alt="Don’t forget to be awesome!" />
		{:else}
			<Starburst points={18}>
				<span class="awesome">Don’t forget to be awesome!</span>
			</Starburst>
		{/if}
	</div>
</footer>
{/if}

<style>
	/* Header */
	.site-header {
		max-width: var(--page);
		margin: 0 auto;
		padding: 5rem 1rem 7.5rem;
		display: flex;
		align-items: flex-start;
		gap: 1.5rem 2rem;
	}

	.home {
		flex-shrink: 0;
		width: 150px;
		text-decoration: none;
		margin-top: -2rem;
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

	.logo-spot {
		aspect-ratio: 1;
	}

	/* Face sits exactly on top of the star */
	.logo {
		position: relative;
	}

	.logo .face {
		position: absolute;
		inset: 0;
	}

	.home img,
	.sticker img {
		display: block;
		width: 100%;
		height: auto;
	}

	.monogram {
		font-weight: 700;
		font-size: 1.4rem;
	}

	.intro {
		max-width: 18rem;
		margin: 0;
		font-size: 1.125rem;
		line-height: 1.45;
	}

	nav {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 0.5rem 2.25rem;
		font-size: 0.95rem;
	}

	nav a {
		text-decoration: none;
	}

	nav a:hover,
	nav a[aria-current='page'] {
		text-decoration: underline;
		text-decoration-color: currentColor; /* same colour as the text */
		text-underline-offset: 3px;
	}

	/* Resume and Get in touch: plain links like the rest, with a small arrow
	   to show they open somewhere else */
	.external {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		white-space: nowrap; /* keeps "Get in touch" on one line */
	}

	.external svg {
		flex-shrink: 0;
		width: 0.85rem;
		height: 0.85rem;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.4;
	}

	.menu-button {
		display: none;
		background: none;
		border: 0;
		padding: 0.5rem;
		margin: -0.5rem;
		cursor: pointer;
		color: var(--text);
	}

	/* Three lines that turn into a cross when open */
	.bars {
		display: grid;
		gap: 5px;
		width: 22px;
	}

	.bars span {
		display: block;
		height: 2px;
		background: currentColor;
		transition: transform 0.2s ease, opacity 0.2s ease;
	}

	.bars.open span:nth-child(1) {
		transform: translateY(7px) rotate(45deg);
	}

	.bars.open span:nth-child(2) {
		opacity: 0;
	}

	.bars.open span:nth-child(3) {
		transform: translateY(-7px) rotate(-45deg);
	}

	/* Footer */
	.site-footer {
		max-width: calc(var(--column) + 0.75rem);
		margin: 0 auto;
		padding: 10rem 1rem 3.5rem;
	}

	.elsewhere {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.elsewhere a {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.4rem 1.1rem 0.3rem;
		border-bottom: 1px solid var(--line);
		text-decoration: none;
	}

	.name {
		font-weight: 500;
	}

	.note {
		color: var(--muted);
		min-width: 13.5rem;
	}

	.elsewhere a:hover .name {
		text-decoration: underline;
		text-decoration-color: currentColor;
		text-underline-offset: 3px;
	}

	.updated {
		margin: 1.25rem 1.1rem 0;
		font-size: 0.9rem;
		color: var(--muted);
	}

	.sticker {
		width: 160px;
		margin: 3rem auto 0;
	}

	.awesome {
		width: 6.5rem;
		font-family: var(--sticker);
		font-size: 1.3rem;
		line-height: 0.95;
		color: var(--pink);
		transform: rotate(-6deg);
	}

	/* Phones: stack the header and hide the links until the menu is opened */
	@media (max-width: 48rem) {
		.site-header {
			flex-wrap: wrap;
			align-items: center;
			padding: 2rem 1rem 3.5rem;
		}

		.home {
			width: 96px;
			margin-top: 0;
		}

		.monogram {
			font-size: 1rem;
		}

		.menu-button {
			display: block;
			margin-left: auto;
		}

		.intro {
			order: 3;
			flex-basis: 100%;
			max-width: none;
		}

		nav {
			order: 2;
			display: none;
			flex-basis: 100%;
			flex-direction: column;
			align-items: stretch;
			gap: 0;
			margin-left: 0;
			font-size: 1rem;
		}

		nav.open {
			display: flex;
		}

		nav a {
			padding: 0.7rem 0;
			border-bottom: 1px solid var(--line);
		}

		.site-footer {
			padding-top: 6rem;
		}

		.elsewhere a {
			flex-wrap: wrap;
			padding-inline: 0;
		}

		.note {
			min-width: 0;
		}

		.updated {
			margin-inline: 0;
		}
	}

	/* Visitors who turn off motion in their settings see the logo still */
	@media (prefers-reduced-motion: reduce) {
		.spin {
			animation: none;
		}
	}
</style>
