<script>
	// Stickers laid out on a project card's picture frame, that you can peel off and move.
	// Pointing at one lifts its edge a little, as if it's starting to come away. Press and drag it
	// to peel it off and stick it somewhere else on the frame. A plain click (no drag) still
	// opens the project, like the rest of the card.
	// Dragging works with a mouse or pen. On touch screens the stickers stay put, so swiping
	// past the card still scrolls the page.
	//
	// stickers: each { src, alt, x, y, w, turn }: where its top left sits and how wide it is, as a
	//           share of the frame (0 to 100), and how far it's turned, in degrees.
	//           The files are in static/projects/<project>/, set in src/lib/tinkerings.js.
	let { stickers = [] } = $props();

	// Where each sticker is now (they start where tinkerings.js puts them), and which is on top
	const start = () => stickers.map((s, i) => ({ ...s, z: i + 1 }));
	let placed = $state(start());
	let top = placed.length;

	let sheet;
	let peeling = $state(-1); // the sticker being dragged, or -1
	let press = null;
	let dragged = false;

	function ondown(e, i) {
		if (e.button !== 0 || e.pointerType === 'touch') return;
		const box = sheet.getBoundingClientRect();
		press = { i, x: e.clientX, y: e.clientY, sx: placed[i].x, sy: placed[i].y, box };
		dragged = false;
	}

	function onmove(e) {
		if (!press) return;
		const dx = e.clientX - press.x;
		const dy = e.clientY - press.y;
		if (peeling < 0) {
			if (Math.hypot(dx, dy) < 4) return;
			// Peeled: it comes up on top of the others
			peeling = press.i;
			placed[press.i].z = ++top;
			sheet.setPointerCapture(e.pointerId);
		}
		dragged = true;
		const s = placed[press.i];
		// Kept on the frame, so it can't be lost off the edge
		s.x = clamp(press.sx + (dx / press.box.width) * 100, -s.w * 0.3, 100 - s.w * 0.7);
		s.y = clamp(press.sy + (dy / press.box.height) * 100, -10, 85);
	}

	function onup() {
		press = null;
		peeling = -1;
	}

	// A drag ends with a click; that click mustn't open the project
	function onclickcapture(e) {
		if (!dragged) return;
		dragged = false;
		e.preventDefault();
		e.stopPropagation();
	}

	const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
	class="sheet"
	bind:this={sheet}
	onpointermove={onmove}
	onpointerup={onup}
	onpointercancel={onup}
	{onclickcapture}
	ondragstart={(e) => e.preventDefault()}
>
	{#each placed as s, i}
		<span
			class="sticker"
			class:peeling={peeling === i}
			style:left="{s.x}%"
			style:top="{s.y}%"
			style:width="{s.w}%"
			style:z-index={s.z}
			style:--turn="{s.turn}deg"
			onpointerdown={(e) => ondown(e, i)}
		>
			<img src={s.src} alt={s.alt} draggable="false" />
		</span>
	{/each}
</span>

<style>
	.sheet {
		position: absolute;
		inset: 0;
		display: block;
	}

	/* Stuck down: flat on the frame, a small soft shadow round its die-cut edge */
	.sticker {
		position: absolute;
		display: block;
		transform: perspective(700px) rotate(var(--turn));
		transform-origin: 50% 50%;
		filter: drop-shadow(0 1px 1.5px color-mix(in srgb, var(--text) 22%, transparent));
		cursor: grab;
		touch-action: auto;
		transition:
			transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1),
			filter 0.25s ease;
	}

	.sheet .sticker img {
		display: block;
		width: 100%;
		height: auto;
		object-fit: fill;
		pointer-events: none;
		user-select: none;
	}

	/* Pointing at it: one edge starts to come away, so it tilts up and its shadow spreads */
	.sticker:hover {
		transform: perspective(700px) rotate(var(--turn)) rotateX(10deg) rotateY(-12deg) translateY(-2px);
		filter: drop-shadow(2px 6px 6px color-mix(in srgb, var(--text) 26%, transparent));
	}

	/* Peeled off and being moved: lifted right up, a little bigger, a deeper shadow under it */
	.sticker.peeling {
		transform: perspective(700px) rotate(calc(var(--turn) - 4deg)) rotateX(14deg) rotateY(-16deg) scale(1.08);
		filter: drop-shadow(4px 14px 12px color-mix(in srgb, var(--text) 30%, transparent));
		cursor: grabbing;
		transition: filter 0.2s ease;
	}

	/* People who have asked for less motion: no tilting, they can still be moved */
	@media (prefers-reduced-motion: reduce) {
		.sticker,
		.sticker.peeling {
			transition: none;
		}

		.sticker:hover {
			transform: rotate(var(--turn));
		}

		.sticker.peeling {
			transform: rotate(var(--turn)) scale(1.05);
		}
	}
</style>
