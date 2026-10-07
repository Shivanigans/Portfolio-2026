<script>
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import '../app.css';

	let { children } = $props();

	// Replace with your Google Drive resume link
	const resumeLink = 'https://drive.google.com/';

	const links = [
		{ href: '/projects', label: 'Projects' },
		{ href: '/playground', label: 'Playground' },
		{ href: '/blog', label: 'Blog' },
		{ href: '/about', label: 'About' }
	];

	// Whether the phone menu is open
	let menuOpen = $state(false);

	// Close the menu after tapping a link
	afterNavigate(() => (menuOpen = false));
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && (menuOpen = false)} />

<header class="site-header">
	<!-- Swap this text for your monogram image later -->
	<a href="/" class="monogram" aria-label="Home">SSG</a>

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
		<a href={resumeLink} target="_blank" rel="noopener">Resume ↗</a>
	</nav>
</header>

<main>
	{@render children()}
</main>

<style>
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

	/* Phones: hide the links until the menu is opened */
	@media (max-width: 40rem) {
		.site-header {
			align-items: center;
		}

		.menu-button {
			display: block;
		}

		nav {
			display: none;
			flex-basis: 100%;
			flex-direction: column;
			gap: 0;
			font-size: 1rem;
		}

		nav.open {
			display: flex;
		}

		/* Styled like the itinerary list in the reference */
		nav a {
			padding: 0.7rem 0;
			border-bottom: 1px solid var(--line);
		}
	}
</style>
