<script>
	// The way into chaos mode, on the Tinkering page: a reward for scrolling.
	// After about two scrolls, the bottom right corner of the page curls up, like a page about
	// to be turned. Pointing at it (or tabbing to it) lifts it further and shows what's underneath.
	// Pressing it starts chaos mode. Once the corner has appeared, it stays until you leave the page.
	//
	// Chaos mode itself (src/lib/ChaosMode.svelte) is only downloaded when the corner is pressed,
	// so the Tinkering page loads just as fast as without it.
	import { onMount, tick } from 'svelte';
	import { popup } from '$lib/popup.svelte.js';

	// onclosed: called once chaos mode has gone, so the page can go back to its start
	let { onclosed } = $props();

	const SCROLLS = 2; // how many scrolls it takes for the corner to appear

	let shown = $state(false);
	let open = $state(false);
	let recording = $state(false);
	let Chaos = $state(null); // chaos mode, once it has been downloaded
	let audio = null;
	let corner;

	onMount(() => {
		recording = location.hash === '#record';

		// Count scrolls: a flick of the mouse wheel or trackpad, a swipe up on a phone, a press of
		// Page Down / Space / the down arrow, or dragging the scrollbar a little way. Everything that
		// happens close together counts as one scroll.
		let count = 0;
		let lastAt = -Infinity;
		let lastY = scrollY;
		let touchY = null;

		function scrolled() {
			const now = performance.now();
			const fresh = now - lastAt > 450;
			lastAt = now;
			if (!fresh || popup.open) return;
			count += 1;
			if (count >= SCROLLS) appear();
		}

		const onwheel = (e) => e.deltaY > 0 && scrolled();
		const ontouchstart = (e) => (touchY = e.touches[0].clientY);
		const ontouchend = (e) => {
			if (touchY !== null && touchY - e.changedTouches[0].clientY > 40) scrolled();
			touchY = null;
		};
		const onkeydown = (e) => {
			if (!['PageDown', ' ', 'ArrowDown', 'End'].includes(e.key)) return;
			if (e.target.closest?.('button, a, input, textarea, select, [contenteditable]')) return;
			scrolled();
		};
		const onscroll = () => {
			if (scrollY - lastY > 150) scrolled();
			lastY = scrollY;
		};

		const events = [
			['wheel', onwheel],
			['touchstart', ontouchstart],
			['touchend', ontouchend],
			['keydown', onkeydown],
			['scroll', onscroll]
		];
		for (const [name, fn] of events) addEventListener(name, fn, { passive: true });
		const stop = () => events.forEach(([name, fn]) => removeEventListener(name, fn));

		function appear() {
			shown = true;
			stop();
		}

		return stop;
	});

	async function unleash() {
		// The browser only allows sound straight after a tap, so the sound engine starts here
		try {
			audio = new (window.AudioContext || window.webkitAudioContext)();
			audio.resume();
		} catch {
			audio = null;
		}
		if (!Chaos) Chaos = (await import('$lib/ChaosMode.svelte')).default;
		open = true;
	}

	// When chaos mode closes ("pretend this never happened", or Esc), the page goes back to its
	// start, and keyboard focus goes back to the corner
	async function closed() {
		open = false;
		onclosed?.();
		await tick();
		corner?.focus({ preventScroll: true });
	}
</script>

<svelte:head>
	{#if shown}
		<!-- DM Mono for the corner's words, fetched only once the corner appears -->
		<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@500&display=swap" rel="stylesheet" />
	{/if}
</svelte:head>

{#if shown && !popup.open && !open}
	<button type="button" class="corner" bind:this={corner} onclick={unleash}>
		<!-- What's under the page, with the words along the fold -->
		<span class="under"><span class="label"><span>unleash chaos mode</span></span></span>
		<!-- The curled-up corner of the page itself, casting a soft shadow -->
		<span class="flap-shadow" aria-hidden="true"><span class="flap"></span></span>
	</button>
{/if}

{#if recording}
	<p class="record-badge">recording mode on</p>
{/if}

{#if open && Chaos}
	<Chaos {audio} onclose={closed} />
{/if}

<style>
	/* The corner: a square in the bottom right of the window. The fold runs corner to corner
	   across it: below the fold is what's under the page, above it the curled-up flap. */
	.corner {
		--s: 76px;
		position: fixed;
		right: 0;
		bottom: 0;
		z-index: 150;
		width: var(--s);
		height: var(--s);
		padding: 0;
		border: 0;
		background: none;
		cursor: pointer;
		transition:
			width 0.35s cubic-bezier(0.16, 1, 0.3, 1),
			height 0.35s cubic-bezier(0.16, 1, 0.3, 1);
		animation: curl 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

	/* Arriving: the corner curls up from nothing */
	@keyframes curl {
		from {
			width: 0;
			height: 0;
		}
	}

	/* Pointing at it or tabbing to it lifts the page further */
	.corner:hover,
	.corner:focus-visible {
		--s: 132px;
	}

	.corner:focus-visible {
		outline: none;
	}

	/* Under the page: dark, with the words along the fold in DM Mono */
	.under {
		position: absolute;
		inset: 0;
		clip-path: polygon(100% 0, 100% 100%, 0 100%);
		background: var(--text);
	}

	.label {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		transform: rotate(-45deg) translateY(22%);
		font-family: 'DM Mono', ui-monospace, monospace;
		font-size: calc(var(--s) * 0.068);
		font-weight: 500;
		white-space: nowrap;
		color: var(--bg);
		opacity: 0;
		transition: opacity 0.2s ease;
	}

	.corner:hover .label,
	.corner:focus-visible .label {
		opacity: 1;
	}

	.corner:focus-visible .label span {
		outline: 2px solid var(--bg);
		outline-offset: 3px;
	}

	/* The flap: the back of the paper, a little greyer towards the fold */
	.flap-shadow {
		position: absolute;
		inset: 0;
		filter: drop-shadow(-3px -3px 5px rgba(65, 60, 50, 0.18));
	}

	.flap {
		position: absolute;
		inset: 0;
		clip-path: polygon(0 0, 100% 0, 0 100%);
		background: linear-gradient(
			135deg,
			var(--card) 0%,
			color-mix(in srgb, var(--line) 40%, var(--card)) 50%
		);
	}

	/* Phones can't point, so the corner sits a little higher, with its words showing */
	@media (hover: none) {
		.corner {
			--s: 116px;
		}

		.label {
			opacity: 1;
		}
	}

	.record-badge {
		position: fixed;
		left: 16px;
		bottom: 16px;
		z-index: 150;
		margin: 0;
		padding: 6px 12px;
		border: 1px solid var(--text);
		border-radius: 999px;
		font-family: 'DM Mono', ui-monospace, monospace;
		font-size: var(--type-caption);
		color: var(--text);
		opacity: 0.6;
	}

	/* People who have asked for less motion: the corner just appears, and doesn't move */
	@media (prefers-reduced-motion: reduce) {
		.corner {
			animation: none;
			transition: none;
		}

		.label {
			transition: none;
		}
	}
</style>
