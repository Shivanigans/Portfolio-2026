<script>
	// A stack of quote cards, from the Context and subtext experiment.
	// Click or tap the top card for the next one. Swipe left for the next card,
	// right for the one before. The left and right arrow keys work too.
	//
	// quotes: a list of { text, who }. In `text`, a meme goes in curly brackets
	// straight after its word, e.g. 'Uh {umm}, how do I go about doing that?'
	// The meme pictures live in static/tinkerings/context-subtext, one per name.
	let { quotes = [] } = $props();

	// Memes that are cut-outs, so they show whole instead of filling a square
	const cutOuts = ['lowkeyslay', 'ironic'];

	// Splits a quote into plain text and "word + meme" pairs. Each pair stays
	// together on one line, along with any punctuation straight after the meme.
	function parts(text) {
		const out = [];
		const pattern = /(\S+)\s*\{(\w+)\}(\S*)/g;
		let last = 0;
		for (const match of text.matchAll(pattern)) {
			if (match.index > last) out.push({ text: text.slice(last, match.index) });
			out.push({ word: match[1], meme: match[2], after: match[3] });
			last = match.index + match[0].length;
		}
		if (last < text.length) out.push({ text: text.slice(last) });
		return out;
	}

	// order[0] is the card on top. Moving on sends it to the bottom of the pile.
	// svelte-ignore state_referenced_locally
	let order = $state(quotes.map((_, i) => i));
	let busy = false;
	let leaving = $state(-1); // the card flying off the top, while it animates
	let entering = $state(-1); // the card coming back on top, when going back

	const tilt = [0, -2.2, 1.8, -1.2];
	const depthOf = (i) => order.indexOf(i);

	function place(i) {
		if (i === leaving) return 'translate(118%, -6%) rotate(14deg)';
		const d = Math.min(depthOf(i), 3);
		return `translateY(${d * 9}px) rotate(${tilt[d]}deg) scale(${1 - d * 0.025})`;
	}

	function next() {
		if (busy || quotes.length < 2) return;
		busy = true;
		leaving = order[0];
		setTimeout(() => {
			order = [...order.slice(1), order[0]];
			leaving = -1;
			busy = false;
		}, 300);
	}

	function prev() {
		if (busy || quotes.length < 2) return;
		busy = true;
		const back = order[order.length - 1];
		// Start it off to the side, then let it slide back onto the pile
		entering = back;
		leaving = back;
		requestAnimationFrame(() =>
			requestAnimationFrame(() => {
				order = [back, ...order.slice(0, -1)];
				leaving = -1;
				setTimeout(() => {
					entering = -1;
					busy = false;
				}, 340);
			})
		);
	}

	function onkeydown(e) {
		if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
			e.preventDefault();
			next();
		} else if (e.key === 'ArrowLeft') {
			e.preventDefault();
			prev();
		}
	}

	// Swipes on phones and trackpads
	let startX = null;
	let swiped = false;
	function onpointerdown(e) {
		startX = e.clientX;
		swiped = false;
	}
	function onpointerup(e) {
		if (startX === null) return;
		const dx = e.clientX - startX;
		startX = null;
		if (Math.abs(dx) > 40) {
			swiped = true;
			dx < 0 ? next() : prev();
		}
	}
	function onclick() {
		// A swipe also ends in a click, so don't move on twice
		if (swiped) return (swiped = false);
		next();
	}
</script>

<div class="wrap">
	<p class="count" aria-live="polite">{order[0] + 1} / {quotes.length}</p>

	<!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
	<div
		class="stack"
		tabindex="0"
		role="group"
		aria-label="Quote cards. Press the right arrow for the next card."
		{onclick}
		{onkeydown}
		{onpointerdown}
		{onpointerup}
	>
		{#each quotes as quote, i}
			{@const depth = depthOf(i)}
			<article
				class="card"
				class:instant={i === entering && leaving === i}
				style:z-index={i === entering ? quotes.length + 1 : quotes.length - depth}
				style:transform={place(i)}
				style:opacity={depth > 3 && i !== entering ? 0 : 1}
				aria-hidden={depth !== 0}
			>
				<p class="quote">
					{#each parts(quote.text) as part}{#if part.meme}<span class="keep">{part.word}
								<img
									class:whole={cutOuts.includes(part.meme)}
									src="/tinkerings/context-subtext/{part.meme}.jpg"
									alt=""
								/>{part.after}</span
							>{:else}{part.text}{/if}{/each}
				</p>
				<p class="who">{quote.who}</p>
			</article>
		{/each}
	</div>

	<p class="hint">Click the card, swipe it, or use the arrow keys.</p>
</div>

<style>
	.wrap {
		width: min(100%, 34rem);
		margin: 0 auto;
		display: grid;
		gap: 1.25rem;
	}

	.count,
	.hint {
		margin: 0;
		font-size: 0.8rem;
		color: var(--muted);
		text-align: center;
	}

	.count {
		font-variant-numeric: tabular-nums;
	}

	.stack {
		position: relative;
		aspect-ratio: 4 / 3;
		cursor: pointer;
		touch-action: pan-y; /* sideways swipes go to the cards, up and down still scrolls */
		user-select: none;
		outline: none;
	}

	.stack:focus-visible {
		outline: 2px solid var(--text);
		outline-offset: 14px;
		border-radius: 6px;
	}

	.card {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1.6rem;
		padding: clamp(20px, 6%, 48px);
		background: #fdfdfb;
		border-radius: 6px;
		box-shadow:
			0 1px 0 rgba(0, 0, 0, 0.05),
			0 10px 30px -14px rgba(10, 20, 40, 0.45);
		text-align: center;
		transition:
			transform 0.34s cubic-bezier(0.3, 0.7, 0.2, 1),
			opacity 0.25s;
	}

	.card.instant {
		transition: none;
	}

	/* The quotes, in Bellefair */
	.quote {
		margin: 0;
		max-width: 15.5em;
		font-family: 'Bellefair', Georgia, serif;
		font-size: clamp(1.4rem, 4.2vw, 2.1rem);
		line-height: 1.28;
		letter-spacing: -0.022em;
		color: #121212;
		text-wrap: balance;
	}

	/* A word and its meme stay together */
	.keep {
		white-space: nowrap;
	}

	.quote img {
		display: inline;
		width: 1.12em;
		height: 1.12em;
		max-width: none;
		object-fit: cover;
		vertical-align: -0.2em;
		margin: 0 0.06em;
	}

	.quote img.whole {
		object-fit: contain;
	}

	.who {
		margin: 0;
		font-family: 'Bellefair', Georgia, serif;
		font-size: 1rem;
		color: #5a5a55;
	}

	/* Phones: taller cards, so long quotes still fit */
	@media (max-width: 35rem) {
		.stack {
			aspect-ratio: 4 / 5;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.card {
			transition: none;
		}
	}
</style>
