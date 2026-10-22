<!--
  StoryTooltip: a word that opens a tooltip, and that tooltip opens the next one above it,
  and so on, like a stack of speech bubbles. It tells a little story one step at a time.
  It works the same way as the "tooltip tooltip" demos (static/projects/tooltip-tooltip/).

  How to use it:
    <StoryTooltip word="multitudes" steps={['fortitude,', 'gratitude,', 'attitude', 'and vicissitude.']} />

  - `word` is the word people point at on the page.
  - `steps` is the story, one bubble per line, from the one nearest the word to the top.
  - Add more lines to add more steps.

  Pointing at the word opens the first bubble. Pointing at an open bubble opens the next.
  Holding the mouse button down (or Space / Enter) adds a bubble every 180ms.
  Moving away, Esc or clicking elsewhere closes them, one by one from the top.
-->
<script>
	let { word, steps = [] } = $props();

	const OFFSET = 10; // zigzag offset, px
	const STAGGER = 75; // collapse step, ms
	const HOLD_EVERY = 180; // add a bubble this often while held, ms

	let open = $state(0); // how many bubbles are open
	let host;
	let timers = [];
	let holdTimer = null;

	// The first bubble sits straight above the word, then they zigzag right and left
	const dx = (level) => (level === 1 ? 0 : level % 2 === 0 ? OFFSET : -OFFSET);

	function clearTimers() {
		timers.forEach(clearTimeout);
		timers = [];
	}

	// Open bubbles up to `to` (cancels any collapse in progress)
	function grow(to) {
		clearTimers();
		open = Math.max(open, Math.min(steps.length, to));
	}

	// Close from the top down, one step at a time
	function collapse() {
		stopHold();
		clearTimers();
		const step = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : STAGGER;
		for (let n = 0, count = open; n < count; n++) {
			timers.push(setTimeout(() => (open = Math.max(0, open - 1)), n * step));
		}
	}

	function startHold() {
		stopHold();
		grow(open + 1);
		holdTimer = setInterval(() => {
			if (open >= steps.length) return stopHold();
			grow(open + 1);
		}, HOLD_EVERY);
	}

	function stopHold() {
		clearInterval(holdTimer);
		holdTimer = null;
	}

	// Pointing at the word: the first bubble. Pointing at an open bubble: the one above it.
	function onover(e) {
		if (e.pointerType === 'touch') return;
		const tip = e.target.closest('.tip.is-open');
		if (tip) grow(Number(tip.dataset.level) + 1);
		else if (e.target.closest('.word')) grow(1);
	}

	// Pressing the word or a bubble adds one, and keeps adding while held
	function ondown(e) {
		if (!(e.target.closest('.tip.is-open') || e.target.closest('.word'))) return;
		e.preventDefault();
		startHold();
	}

	// Leaving the word and its stack closes it (mouse and pen only)
	function onleave(e) {
		if (e.pointerType !== 'touch') collapse();
	}

	// Clicking anywhere else on the page closes it
	function ondocdown(e) {
		if (open && !host.contains(e.target)) collapse();
	}

	function onkeydown(e) {
		if (e.key === ' ' || e.key === 'Enter') {
			e.preventDefault();
			if (!e.repeat) startHold();
		} else if (e.key === 'Escape') {
			collapse();
		}
	}

	function onkeyup(e) {
		if (e.key === ' ' || e.key === 'Enter') stopHold();
	}
</script>

<!-- Letting go keeps the stack -->
<svelte:window onpointerup={stopHold} onpointercancel={stopHold} />
<svelte:document onpointerdown={ondocdown} />

<!-- Each bubble lives inside the one before it, so they stack upwards -->
{#snippet bubble(i)}
	<span class="tip" class:is-open={open > i} data-level={i + 1} style:--dx="{dx(i + 1)}px" aria-hidden={open <= i}>
		<span class="label">{steps[i]}</span>
		{#if i + 1 < steps.length}{@render bubble(i + 1)}{/if}
	</span>
{/snippet}

<span
	class="host"
	class:is-active={open > 0}
	bind:this={host}
	role="presentation"
	onpointerover={onover}
	onpointerdown={ondown}
	onpointerleave={onleave}
	oncontextmenu={(e) => e.preventDefault()}
>
	<button type="button" class="word" {onkeydown} {onkeyup} onblur={collapse}>{word}</button>
	{#if steps.length}{@render bubble(0)}{/if}
</span>

<style>
	.host {
		--gap: 6px;
		--ease-pop: cubic-bezier(0.34, 1.56, 0.64, 1);
		--ease-out: cubic-bezier(0.4, 0, 1, 1);
		position: relative;
		display: inline-block;
		-webkit-user-select: none;
		user-select: none;
		-webkit-touch-callout: none;
	}

	/* An open stack sits above the text after it */
	.host.is-active {
		z-index: 10;
	}

	/* The word: looks like the text around it, with a dotted underline as a hint */
	.word {
		all: unset;
		font: inherit;
		color: inherit;
		white-space: nowrap;
		text-decoration: underline dotted;
		text-underline-offset: 3px;
		text-decoration-thickness: 1px;
	}

	.word:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: 2px;
		border-radius: 2px;
	}

	/* A bubble: deep pink with white text, 6px corners, popping up out of its pointer */
	.tip {
		--dx: 0px; /* how far it sits from the centre of the one below */
		position: absolute;
		left: 50%;
		bottom: calc(100% + var(--gap));
		translate: calc(-50% + var(--dx)) 0;
		transform-origin: calc(50% - var(--dx)) calc(100% + 5px); /* the pointer's tip */

		min-width: 36px; /* keeps the pointer off the corners on narrow bubbles */
		text-align: center;
		padding: 7px 10px;
		border-radius: 6px;
		/* --tooltip-bg is set in src/app.css. White text needs a deep pink to stay readable. */
		background: var(--tooltip-bg);
		color: var(--card);
		font: 500 13px/1.2 var(--sans);
		font-style: normal;
		white-space: nowrap;
		box-shadow: var(--shadow);
		touch-action: none;

		/* closed */
		opacity: 0;
		scale: 0.6;
		visibility: hidden;
		pointer-events: none;
		transition:
			opacity 130ms var(--ease-out),
			scale 140ms var(--ease-out),
			visibility 0s linear 140ms;
	}

	.tip.is-open {
		opacity: 1;
		scale: 1;
		visibility: visible;
		pointer-events: auto;
		transition:
			opacity 120ms ease-out,
			scale 240ms var(--ease-pop),
			visibility 0s;
	}

	/* The first bubble sits a touch higher, so its pointer clears the word */
	.host > .tip {
		bottom: calc(100% + 8px);
	}

	/* The pointer: a small rotated square on the bottom edge, aimed at the bubble below */
	.tip::after {
		content: '';
		position: absolute;
		left: calc(50% - var(--dx));
		bottom: -3.5px;
		width: 7px;
		height: 7px;
		background: var(--tooltip-bg);
		border-radius: 1px;
		transform: translateX(-50%) rotate(45deg);
	}

	/* An invisible bridge across the gap, so the mouse doesn't "leave" between bubbles */
	.tip::before {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		top: 100%;
		height: calc(var(--gap) + 2px);
	}

	.host > .tip::before {
		height: 10px;
	}

	.label {
		position: relative;
	}

	@media (prefers-reduced-motion: reduce) {
		.tip,
		.tip.is-open {
			scale: 1;
			transition:
				opacity 120ms linear,
				visibility 0s linear 120ms;
		}

		.tip.is-open {
			transition:
				opacity 120ms linear,
				visibility 0s;
		}
	}
</style>
