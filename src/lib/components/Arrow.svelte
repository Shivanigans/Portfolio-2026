<script>
	// A thin line arrow, drawn the same way as the one after Resume in the side panel.
	// dir: 'out' points up and to the right (opens in a new tab), 'right' points on, 'left' points
	// back, 'up' points up.
	let { dir = 'right' } = $props();

	const paths = {
		out: 'M2.5 9.5l7-7M4 2.5h5.5V8',
		right: 'M1 6h10M7 2l4 4-4 4',
		left: 'M11 6H1M5 2L1 6l4 4',
		up: 'M6 11V1M2 5l4-4 4 4'
	};
</script>

<svg class="arrow" viewBox="0 0 12 12" aria-hidden="true"><path d={paths[dir]} /></svg>

<style>
	/* Sized by the text around it */
	.arrow {
		flex: none;
		width: 0.75em;
		height: 0.75em;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.4;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
</style>
