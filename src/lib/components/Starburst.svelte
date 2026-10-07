<script>
	// A yellow spiky sticker shape. It fills the width of whatever holds it.
	// Whatever you put inside it sits in the middle.
	let { points = 20, color = 'var(--sun)', children } = $props();

	// Alternate between the outer tips and the inner dips to draw the spikes
	const shape = $derived(
		Array.from({ length: points * 2 }, (_, i) => {
			const r = i % 2 === 0 ? 48 : 38;
			const angle = (Math.PI * i) / points - Math.PI / 2;
			return `${(50 + r * Math.cos(angle)).toFixed(2)},${(50 + r * Math.sin(angle)).toFixed(2)}`;
		}).join(' ')
	);
</script>

<div class="burst">
	<svg viewBox="0 0 100 100" aria-hidden="true">
		<polygon points={shape} fill={color} stroke={color} stroke-width="3" stroke-linejoin="round" />
	</svg>
	<div class="inside">{@render children?.()}</div>
</div>

<style>
	.burst {
		position: relative;
		width: 100%;
		aspect-ratio: 1;
	}

	svg,
	.inside {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.inside {
		display: grid;
		place-items: center;
		text-align: center;
	}
</style>
