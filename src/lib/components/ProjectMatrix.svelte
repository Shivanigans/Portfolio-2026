<script>
	// The Tinkerings canvas: the 2x2 matrix of projects on a desk that fills the screen.
	// Drag anywhere to look around (or scroll with a trackpad), + and − to zoom. It opens
	// slightly zoomed out, with the matrix in the free space beside the margin.
	// Click a card (without dragging) and it grows into the project popup, which can step through
	// every project with ← and →.
	// Pointing at a card, or tabbing to it, plots it: the other cards fade back, a small pink
	// square marks where it sits on each axis (with "mostly hand-drawn", "built for fun" and so
	// on beside it), and the labels on its side of each axis turn dark.
	// All project content and positions live in src/lib/tinkerings.js, not here.
	//
	// items:    the projects
	// open:     whether the popup is showing, so the page can make its own parts unclickable
	import { onMount } from 'svelte';
	import Media from '$lib/components/Media.svelte';
	import ProjectPanel from '$lib/components/ProjectPanel.svelte';
	import Title, { plain } from '$lib/components/Title.svelte';
	import { ProjectPopup } from '$lib/projectPopup.svelte.js';

	let { items, open = $bindable(false) } = $props();

	// The size of the matrix on the canvas, in pixels at full zoom
	const WIDTH = 1300;
	const HEIGHT = 940;
	// How far in from the edges the cards' points can go, so no card covers an axis label
	const INSET_X = 140;
	const INSET_Y = 100;
	const MIN_ZOOM = 0.4;
	const MAX_ZOOM = 1.6;

	const isPhone = () => matchMedia('(max-width: 48rem)').matches;
	const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

	// Each project's card button, by id: one set on the canvas, one in the phone list.
	// Only one set is showing at a time.
	const cards = {};
	const phoneCards = {};
	const cardOf = (id) => (isPhone() ? phoneCards[id] : cards[id]);

	// The popup: opening, closing, stepping, its web address and the back button
	const projects = new ProjectPopup(() => items, cardOf);
	$effect(() => {
		open = !!projects.current;
	});

	// Phones: one plain list, in quadrant order (worked out from x and y)
	const phoneList = $derived(
		[
			{ left: true, top: true },
			{ left: false, top: true },
			{ left: true, top: false },
			{ left: false, top: false }
		].flatMap((q) => items.filter((t) => t.x < 50 === q.left && t.y < 50 === q.top).sort((a, b) => a.y - b.y))
	);

	// The card being pointed at, or null. Keyboard focus plots a card too, but not the focus
	// put back on a card when its popup closes after a click.
	let plotted = $state(null);

	// Where a card's point sits on the matrix, in pixels
	const px = (item) => INSET_X + (item.x / 100) * (WIDTH - 2 * INSET_X);
	const py = (item) => INSET_Y + (item.y / 100) * (HEIGHT - 2 * INSET_Y);

	// The words beside each axis mark while a card is pointed at, from where it sits
	const howMade = (item) =>
		item.x < 35 ? 'mostly hand-drawn' : item.x > 65 ? 'mostly technical' : 'somewhere in between';
	const whyMade = (item) => (item.y < 50 ? 'built for work' : 'built for fun');

	// ---- Looking around: the matrix is moved by (x, y) and scaled by zoom ----
	let view = $state({ x: 0, y: 0, zoom: 1 });
	let viewport;
	let gliding = $state(false); // eases the + and − zooms; dragging always follows straight away
	let dragging = $state(false);

	// The free space beside the margin and above the footer, where the matrix should sit
	function freeSpace() {
		const side = document.querySelector('.side')?.getBoundingClientRect();
		const left = (side?.right ?? 0) + 24;
		const top = 56;
		const bottom = innerHeight - 56;
		return { left, top, width: Math.max(200, innerWidth - left - 24), height: Math.max(200, bottom - top) };
	}

	// Start slightly zoomed out, the whole matrix fitting the free space, with room for the
	// labels that stick out past its ends
	function home() {
		const free = freeSpace();
		// A little closer than a perfect fit, so the cards are a good size; the ends of the axes
		// can sit just past the edges, and dragging brings them in
		const zoom = clamp(Math.min(free.width / (WIDTH + 180), free.height / (HEIGHT + 60)) * 1.25, MIN_ZOOM, 1);
		view = {
			zoom,
			x: free.left + free.width / 2 - (WIDTH / 2) * zoom,
			y: free.top + free.height / 2 - (HEIGHT / 2) * zoom
		};
	}

	// Back to the view the page opens with, gliding there (used when chaos mode closes)
	export function reset() {
		gliding = !calm();
		home();
		setTimeout(() => (gliding = false), 300);
	}

	const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

	// Zoom by a factor, keeping the point (cx, cy) on screen where it is
	// Never let the matrix be dragged (or scrolled) right off the screen: at least a quarter of
	// it, or 240px, always stays in view, so the canvas can't end up empty
	function keep(v) {
		const w = WIDTH * v.zoom;
		const h = HEIGHT * v.zoom;
		const mx = Math.min(w / 4, 240);
		const my = Math.min(h / 4, 240);
		return {
			...v,
			x: clamp(v.x, mx - w, innerWidth - mx),
			y: clamp(v.y, my - h, innerHeight - my)
		};
	}

	function zoomAt(factor, cx, cy) {
		const zoom = clamp(view.zoom * factor, MIN_ZOOM, MAX_ZOOM);
		const k = zoom / view.zoom;
		view = keep({ zoom, x: cx - (cx - view.x) * k, y: cy - (cy - view.y) * k });
	}

	// The + and − buttons zoom round the middle of the free space
	function zoomButton(factor) {
		const free = freeSpace();
		gliding = !calm();
		zoomAt(factor, free.left + free.width / 2, free.top + free.height / 2);
		setTimeout(() => (gliding = false), 300);
	}

	// Dragging: pressing starts it, but it only counts as a drag once the pointer has moved a
	// few pixels, so a click on a card still opens it
	let press = null;
	let justDragged = false;

	function onpointerdown(e) {
		justDragged = false;
		if (e.button !== 0 || e.target.closest('.zoom, .chip')) return;
		press ={ id: e.pointerId, x: e.clientX, y: e.clientY, vx: view.x, vy: view.y };
	}

	function onpointermove(e) {
		if (!press || e.pointerId !== press.id) return;
		const dx = e.clientX - press.x;
		const dy = e.clientY - press.y;
		if (!dragging) {
			if (Math.hypot(dx, dy) < 5) return;
			dragging = true;
			plotted = null;
			viewport.setPointerCapture(e.pointerId);
		}
		view = keep({ ...view, x: press.vx + dx, y: press.vy + dy });
	}

	function onpointerup() {
		if (dragging) justDragged = true;
		press = null;
		dragging = false;
	}

	// A drag ends with a click on whatever was under the pointer; that click is swallowed
	function onclickcapture(e) {
		if (!justDragged) return;
		justDragged = false;
		e.stopPropagation();
		e.preventDefault();
	}

	// Trackpad and mouse wheel move the canvas; with Ctrl (a trackpad pinch) they zoom
	function onwheel(e) {
		e.preventDefault();
		if (e.ctrlKey) zoomAt(Math.exp(-e.deltaY * 0.01), e.clientX, e.clientY);
		else view = keep({ ...view, x: view.x - e.deltaX, y: view.y - e.deltaY });
	}

	// Tabbing to a card that's off screen brings it into view
	function onfocusin(e) {
		const card = e.target.closest('.card');
		if (!card) return;
		const box = card.getBoundingClientRect();
		const free = freeSpace();
		let { x, y } = view;
		if (box.left < free.left) x += free.left - box.left;
		if (box.right > free.left + free.width) x -= box.right - (free.left + free.width);
		if (box.top < free.top) y += free.top - box.top;
		if (box.bottom > free.top + free.height) y -= box.bottom - (free.top + free.height);
		if (x !== view.x || y !== view.y) {
			gliding = !calm();
			view = { ...view, x, y };
			setTimeout(() => (gliding = false), 300);
		}
	}

	onMount(() => {
		home();
		// The wheel has to be able to stop the page from scrolling, so it can't be passive
		viewport.addEventListener('wheel', onwheel, { passive: false });
		return () => viewport.removeEventListener('wheel', onwheel);
	});
</script>

<!-- The arrow on the matrix labels. One drawing, turned to point each way, so all four match. -->
{#snippet arrow(turn)}
	<svg class="arrow" viewBox="0 0 12 12" style:transform="rotate({turn}deg)">
		<path d="M1 6h10M7 2l4 4-4 4" />
	</svg>
{/snippet}

<!-- One project card: the picture, with its name in a white box underneath -->
{#snippet card(item, store)}
	<button
		type="button"
		class="card"
		bind:this={store[item.id]}
		aria-label="Open {plain(item.title)}"
		onclick={() => projects.open(item)}
	>
		<div class="thumb">
			<Media src={item.thumb || item.media} alt="" calm />
		</div>
		<p class="name"><Title text={item.title} /></p>
	</button>
{/snippet}

<!-- While the popup is open, the canvas behind can't be clicked or tabbed into -->
<div class="projects" inert={!!projects.current}>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="viewport"
		class:dragging
		bind:this={viewport}
		{onpointerdown}
		{onpointermove}
		{onpointerup}
		onpointercancel={onpointerup}
		onclickcapture={onclickcapture}
		{onfocusin}
	>
		<div
			class="world"
			class:gliding
			style:width="{WIDTH}px"
			style:height="{HEIGHT}px"
			style:transform="translate({view.x}px, {view.y}px) scale({view.zoom})"
		>
			<!-- A faint grid of little plus signs behind everything -->
			<svg class="pluses" aria-hidden="true" width={WIDTH * 3} height={HEIGHT * 3}>
				<defs>
					<pattern id="plus" width="44" height="44" patternUnits="userSpaceOnUse">
						<path d="M22 17.5v9M17.5 22h9" />
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill="url(#plus)" />
			</svg>

			<section
				class="matrix"
				aria-label="Projects placed from hand-drawn to technical, and from build for work to build for fun"
			>
				<!-- The two axes, their labels in boxes at the ends, and the oval where they cross.
				     The labels on the plotted card's side turn dark. -->
				<div class="axis across" aria-hidden="true"></div>
				<div class="axis down" aria-hidden="true"></div>
				<span class="axis-label top" class:lit={plotted && plotted.y < 50} aria-hidden="true">{@render arrow(-90)} Build for work</span>
				<span class="axis-label bottom" class:lit={plotted && plotted.y >= 50} aria-hidden="true">{@render arrow(90)} Build for fun</span>
				<span class="axis-label left" class:lit={plotted && plotted.x < 50} aria-hidden="true">{@render arrow(180)} Hand-drawn</span>
				<span class="axis-label right" class:lit={plotted && plotted.x >= 50} aria-hidden="true">Technical {@render arrow(0)}</span>
				<span class="oval" aria-hidden="true">The intersection of<br />art and technology</span>

				<!-- Where the pointed-at card sits: a small pink square on each axis, with a few words -->
				<div class="marks" aria-hidden="true">
					{#each items as item (item.id)}
						{@const on = plotted?.id === item.id}
						<span class="tick across" class:on style:left="{px(item)}px" style:top="{HEIGHT / 2}px">
							<span class="tick-label">{howMade(item)}</span>
						</span>
						<span class="tick down" class:on style:left="{WIDTH / 2}px" style:top="{py(item)}px">
							<span class="tick-label">{whyMade(item)}</span>
						</span>
					{/each}
				</div>

				<ul class:plotting={plotted}>
					{#each items as item (item.id)}
						<li
							style:left="{px(item)}px"
							style:top="{py(item)}px"
							class:plotted={plotted?.id === item.id}
							onpointerenter={() => !dragging && (plotted = item)}
							onpointerleave={() => plotted?.id === item.id && (plotted = null)}
							onfocusin={(e) => e.target.matches(':focus-visible') && (plotted = item)}
							onfocusout={() => plotted?.id === item.id && (plotted = null)}
						>
							{@render card(item, cards)}
						</li>
					{/each}
				</ul>
			</section>
		</div>

		<!-- Top right: a reminder that the canvas moves -->
		<p class="chip" aria-hidden="true"><span class="mark">✥</span> Drag to explore</p>

		<!-- Bottom right: zoom in and out -->
		<div class="zoom" role="group" aria-label="Zoom">
			<button type="button" onclick={() => zoomButton(1.25)} aria-label="Zoom in" disabled={view.zoom >= MAX_ZOOM}>+</button>
			<button type="button" onclick={() => zoomButton(0.8)} aria-label="Zoom out" disabled={view.zoom <= MIN_ZOOM}>−</button>
		</div>
	</div>

	<!-- Phones only: the same projects in one plain list -->
	<div class="stacked">
		<ul>
			{#each phoneList as item (item.id)}
				<li>{@render card(item, phoneCards)}</li>
			{/each}
		</ul>
	</div>
</div>

{#if projects.current}
	<ProjectPanel
		bind:this={projects.panel}
		project={projects.current}
		origin={projects.thumbOf}
		top={56}
		step={projects.step}
		position={projects.position}
		onclosed={projects.closed}
	/>
{/if}

<style>
	/* The window onto the canvas: fills the screen, and takes the drag */
	.viewport {
		position: absolute;
		inset: 0;
		overflow: hidden;
		touch-action: none;
		cursor: grab;
		user-select: none;
	}

	.viewport.dragging {
		cursor: grabbing;
	}

	.world {
		position: absolute;
		top: 0;
		left: 0;
		transform-origin: 0 0;
	}

	.world.gliding {
		transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
	}

	/* The plus grid reaches well past the matrix, so the desk never looks empty at the edges */
	.pluses {
		position: absolute;
		left: -100%;
		top: -100%;
		pointer-events: none;
	}

	.pluses path {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 22%, transparent);
		stroke-width: 1;
	}

	.matrix {
		position: absolute;
		inset: 0;
	}

	/* Thin text-colour axes, crossing in the middle */
	.axis {
		position: absolute;
		background: var(--text);
	}

	.axis.across {
		left: 0;
		right: 0;
		top: 50%;
		height: 1px;
	}

	.axis.down {
		top: 0;
		bottom: 0;
		left: 50%;
		width: 1px;
	}

	/* The labels: boxed at the ends of the axes, on the desk colour, grey until their side is plotted.
	   Sizes on the canvas are a little bigger than on the pages, because it opens zoomed out. */
	.axis-label {
		position: absolute;
		z-index: 1;
		display: inline-flex;
		align-items: center;
		gap: 0.4em;
		padding: 0.4rem 0.8rem;
		border: 1px solid var(--text);
		background: var(--desk);
		font-size: var(--type-body);
		color: var(--muted);
		white-space: nowrap;
		transition: color 0.25s ease;
	}

	.axis-label.lit {
		color: var(--text);
	}

	.arrow {
		width: 0.85em;
		height: 0.85em;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.3;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.axis-label.top {
		top: 0;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.axis-label.bottom {
		bottom: 0;
		left: 50%;
		transform: translate(-50%, 50%);
	}

	.axis-label.left {
		left: 0;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.axis-label.right {
		right: 0;
		top: 50%;
		transform: translate(50%, -50%);
	}

	/* "The intersection of art and technology", in capitals in an oval where the axes cross */
	.oval {
		position: absolute;
		left: 50%;
		top: 50%;
		z-index: 1;
		padding: 0.7rem 1.5rem;
		border: 1px solid var(--text);
		border-radius: 50%;
		background: var(--desk);
		transform: translate(-50%, -50%);
		font-size: var(--type-label);
		line-height: 1.4;
		letter-spacing: 0.06em;
		text-align: center;
		text-transform: uppercase;
		white-space: nowrap;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	/* Cards: 230px wide, centred on their point */
	.matrix li {
		position: absolute;
		z-index: 2;
		width: 260px;
		transform: translate(-50%, -50%);
		transition: opacity 0.3s ease;
	}

	/* While one card is plotted, the others fade right back */
	.plotting li:not(.plotted) {
		opacity: 0.2;
	}

	.matrix li.plotted {
		z-index: 4;
	}

	/* Cards are buttons, reset to look like plain cards */
	.card {
		display: block;
		width: 100%;
		padding: 0;
		border: 0;
		background: none;
		font: inherit;
		color: inherit;
		text-align: left;
		cursor: pointer;
	}

	.viewport.dragging .card {
		cursor: grabbing;
	}

	.card:focus-visible {
		outline: 2px solid var(--text);
		outline-offset: 4px;
	}

	/* The picture on white, and the name in its own white box under it.
	   Pointing at the card draws a pink outline round both. */
	.thumb {
		aspect-ratio: 4 / 3;
		overflow: hidden;
		background: var(--bg);
		outline: 2px solid transparent;
		transition: outline-color 0.15s ease;
	}

	.thumb :global(img),
	.thumb :global(video),
	.thumb :global(.placeholder) {
		width: 100%;
		height: 100%;
		aspect-ratio: auto;
		object-fit: cover;
	}

	.name {
		display: inline-block;
		margin: 0.5rem 0 0;
		padding: 0.3rem 0.6rem;
		background: var(--bg);
		outline: 2px solid transparent;
		font-family: var(--display);
		font-size: var(--type-body);
		font-weight: 500;
		letter-spacing: var(--display-spacing);
		line-height: 1.3;
		white-space: nowrap;
		transition: outline-color 0.15s ease;
	}

	.card:hover .thumb,
	.card:hover .name {
		outline-color: var(--pink);
	}

	/* The marks for the pointed-at card: a small pink square where it sits on each axis,
	   with a few deep pink words beside it (under the across axis, right of the down one) */
	.marks {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.tick {
		position: absolute;
		z-index: 5; /* above the pointed-at card, which can sit right on an axis */
		width: 12px;
		height: 12px;
		margin: -6px 0 0 -6px;
		background: var(--pink);
		opacity: 0;
		transform: scale(0.4);
		transition:
			transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
			opacity 0.2s ease;
	}

	.tick.on {
		opacity: 1;
		transform: none;
	}

	.tick-label {
		position: absolute;
		padding: 0 0.3em;
		background: var(--desk);
		font-size: var(--type-label);
		line-height: 1.4;
		color: var(--pink-deep);
		white-space: nowrap;
	}

	.across .tick-label {
		top: calc(100% + 0.5rem);
		left: 50%;
		transform: translateX(-50%);
	}

	.down .tick-label {
		top: 50%;
		left: calc(100% + 0.5rem);
		transform: translateY(-50%);
	}

	/* "✥ Drag to explore", top right on a white chip */
	.chip {
		position: absolute;
		top: 1.5rem;
		right: 1.5rem;
		margin: 0;
		padding: 0.4rem 0.75rem;
		background: var(--bg);
		font-size: var(--type-meta);
		pointer-events: none;
	}

	.mark {
		color: var(--pink-deep);
	}

	/* + and −: two white squares, one on the other, above the footer on the right */
	.zoom {
		position: absolute;
		right: 1.5rem;
		bottom: 8rem;
		display: grid;
	}

	.zoom button {
		display: grid;
		place-items: center;
		width: 36px;
		height: 36px;
		padding: 0;
		border: 1px solid var(--text);
		background: var(--bg);
		font: inherit;
		font-size: 1.1rem;
		color: var(--text);
		cursor: pointer;
		transition: background-color 0.15s ease;
	}

	.zoom button + button {
		border-top: 0;
	}

	.zoom button:hover:not(:disabled) {
		background: var(--pink-soft);
	}

	.zoom button:disabled {
		color: var(--muted);
		cursor: default;
	}

	.zoom button:focus-visible {
		position: relative;
		outline: 2px solid var(--text);
		outline-offset: 2px;
	}

	/* The phone list stays hidden on bigger screens */
	.stacked {
		display: none;
	}

	/* Phones: no room for the canvas, so the cards stack in one list */
	@media (max-width: 48rem) {
		.viewport {
			display: none;
		}

		.stacked {
			display: block;
			padding: 1.5rem 1.25rem 7rem;
		}

		.stacked ul {
			display: grid;
			gap: 2rem;
		}

		.name {
			font-size: var(--type-small);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.thumb,
		.name,
		.tick,
		.matrix li,
		.axis-label,
		.zoom button {
			transition: none;
		}
	}
</style>
