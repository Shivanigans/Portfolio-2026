<script>
	// Your logo leaving its spot in the header and drifting around the screen,
	// bouncing off the edges like an old DVD screensaver. Each time it touches an edge
	// it changes colour, picked at random from the bounce images in src/lib/stickers.js. It floats over the page,
	// but clicks pass straight through it, so links still work.
	// `from` is the header spot it starts from.
	import { onMount } from 'svelte';
	import { logoImage, logoStar, logoFace, bounceImages } from '$lib/stickers.js';

	let { from } = $props();

	// How fast it drifts, in pixels per second
	const speed = 110;

	let x = $state(0);
	let y = $state(0);
	let size = $state(0);

	// Which colour is showing. Starts on yellow, like the logo it sets off from.
	let colour = $state(Math.max(0, bounceImages.findIndex((src) => src.includes('yellow'))));

	// Pick a different colour from the one showing, so every bounce visibly changes
	function changeColour() {
		if (bounceImages.length < 2) return;
		const next = Math.floor(Math.random() * (bounceImages.length - 1));
		colour = next >= colour ? next + 1 : next;
	}

	onMount(() => {
		// Start exactly where the header logo sits
		const spot = from.getBoundingClientRect();
		x = spot.left;
		y = spot.top;
		size = spot.width;

		// Visitors who turn off motion in their settings see it stay put
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		let dx = 1;
		let dy = 1;
		let last = performance.now();
		let frame;

		const step = (now) => {
			// Capped so it doesn't jump after the tab has been in the background
			const seconds = Math.min((now - last) / 1000, 0.05);
			last = now;
			size = from.offsetWidth; // follows the header size on phones
			const w = innerWidth - size;
			const h = innerHeight - size;

			x += dx * speed * seconds;
			y += dy * speed * seconds;

			// Bounce off the edges, changing colour once per bounce (a corner counts as one)
			let bounced = false;
			if (x <= 0) (x = 0), (dx = 1), (bounced = true);
			if (x >= w) (x = w), (dx = -1), (bounced = true);
			if (y <= 0) (y = 0), (dy = 1), (bounced = true);
			if (y >= h) (y = h), (dy = -1), (bounced = true);
			if (bounced) changeColour();

			frame = requestAnimationFrame(step);
		};

		frame = requestAnimationFrame(step);
		return () => cancelAnimationFrame(frame);
	});
</script>

<div
	class="bouncer"
	class:ready={size}
	style:width="{size}px"
	style:transform="translate({x}px, {y}px)"
	aria-hidden="true"
>
	{#if bounceImages.length}
		<!-- All the colours are loaded up front, and only the current one shows, so there is no flicker -->
		{#each bounceImages as src, i}
			<img class:hidden={i !== colour} {src} alt="" />
		{/each}
	{:else if logoStar && logoFace}
		<img class="star" src={logoStar} alt="" />
		<img class="face" src={logoFace} alt="" />
	{:else if logoImage}
		<img class="star" src={logoImage} alt="" />
	{/if}
</div>

<style>
	.bouncer {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100; /* above everything, including text */
		pointer-events: none; /* clicks go to whatever is underneath */
		opacity: 0;
	}

	/* Hidden until it has found the header spot */
	.bouncer.ready {
		opacity: 1;
	}

	img {
		display: block;
		width: 100%;
		height: auto;
	}

	.face {
		position: absolute;
		inset: 0;
	}

	.hidden {
		display: none;
	}
</style>
