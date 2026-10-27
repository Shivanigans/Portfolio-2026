<script>
	// The way back to the top of a long page: a square button in the bottom right corner that
	// appears once you're about 600px down. `away` hides it while a popup is open.
	import Arrow from '$lib/components/Arrow.svelte';

	let { away = false } = $props();

	let scrollY = $state(0);
	const shown = $derived(scrollY > 600 && !away);

	function toTop() {
		const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
		window.scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' });
	}
</script>

<svelte:window bind:scrollY />

<button type="button" class="to-top" class:shown onclick={toTop} aria-label="Back to top" tabindex={shown ? 0 : -1}>
	<Arrow dir="up" />
</button>

<style>
	/* A 48px square in the bottom right corner, hidden near the top */
	.to-top {
		position: fixed;
		right: 1.5rem;
		bottom: 1.5rem;
		z-index: 100;
		display: grid;
		place-items: center;
		width: 48px;
		height: 48px;
		padding: 0;
		border: 1px solid var(--text);
		background: var(--bg);
		font-size: var(--type-card);
		color: var(--text);
		cursor: pointer;
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 0.25s ease,
			visibility 0.25s,
			background-color 0.15s ease;
	}

	.to-top.shown {
		opacity: 1;
		visibility: visible;
	}

	.to-top:hover {
		background: var(--pink-soft);
	}

	.to-top:focus-visible {
		outline: 2px solid var(--text);
		outline-offset: 3px;
	}

	/* Phones: the blog and Tinkering have a bar along the bottom, so sit a little higher */
	@media (max-width: 48rem) {
		.to-top {
			right: 1rem;
			bottom: 1rem;
		}
	}

	/* Visitors who turn off motion in their settings get no fade */
	@media (prefers-reduced-motion: reduce) {
		.to-top {
			transition: none;
		}
	}
</style>
