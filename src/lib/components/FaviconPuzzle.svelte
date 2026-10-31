<!--
  FaviconPuzzle: the monogram from the browser tab, cut into nine squares and jumbled.
  Click one square, then another, and the two swap places. Put all nine back and it says so.

  How to use it:
    <FaviconPuzzle />

  Each one of these keeps its own game, so two on a page don't disturb each other.
  The picture is static/favicon-192.png, the same monogram the tab shows.
-->
<script>
	import { onMount } from 'svelte';

	const SIZE = 3; // squares to a side
	const COUNT = SIZE * SIZE;

	// Where each square starts out. A fixed jumble, so the puzzle looks the same the instant
	// the page is drawn as it does a moment later, and nobody sees the answer flash up first.
	// It is shuffled properly as soon as the page comes alive (below).
	const START = [4, 7, 2, 0, 8, 3, 6, 1, 5];

	// slots[n] is the piece now sitting in square n. Solved means every piece is back home.
	let slots = $state([...START]);
	let picked = $state(null); // the square waiting for a partner, or nothing
	const solved = $derived(slots.every((piece, n) => piece === n));

	// Fisher-Yates, and never hand someone a puzzle that is already finished
	function shuffle() {
		const next = [...Array(COUNT).keys()];
		do {
			for (let i = COUNT - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[next[i], next[j]] = [next[j], next[i]];
			}
		} while (next.every((piece, n) => piece === n));
		slots = next;
		picked = null;
	}

	onMount(shuffle);

	// First click picks a square up, second puts it down and the two change places
	function choose(n) {
		if (picked === null) picked = n;
		else if (picked === n) picked = null;
		else {
			const next = [...slots];
			[next[n], next[picked]] = [next[picked], next[n]];
			slots = next;
			picked = null;
		}
	}

	// Which part of the picture a piece shows. The picture is laid over the square at three
	// times its size, so each square can slide a third of it into view.
	const spot = (piece) => `${(piece % SIZE) * 50}% ${Math.floor(piece / SIZE) * 50}%`;

	// "row 2, column 3", so the puzzle can be played by ear as well as by eye
	const place = (n) => `row ${Math.floor(n / SIZE) + 1}, column ${(n % SIZE) + 1}`;
</script>

<div class="puzzle">
	<div class="board" class:solved>
		{#each slots as piece, n (n)}
			<button
				type="button"
				class="piece"
				class:picked={picked === n}
				class:home={piece === n}
				style:background-position={spot(piece)}
				aria-pressed={picked === n}
				aria-label="Piece {piece + 1} of 9, at {place(n)}{piece === n ? ', in its place' : ''}"
				onclick={() => choose(n)}
			></button>
		{/each}
	</div>

	<p class="say" aria-live="polite">
		{#if solved}
			That’s the face. Well done.
		{:else if picked !== null}
			Picked up {place(picked)}. Now choose the square to swap it with.
		{:else}
			Click one square, then another, to swap them.
		{/if}
	</p>

	<button type="button" class="pill-button" onclick={shuffle}>Jumble it again</button>
</div>

<style>
	.puzzle {
		margin: 2rem 0 0;
	}

	/* Nine squares with the page showing between them, so it reads as pieces rather than
	   one picture. Square corners, like everything else on the sheet. */
	.board {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 3px;
		width: min(15rem, 100%);
		aspect-ratio: 1;
		padding: 3px;
		background: var(--line);
	}

	.piece {
		all: unset;
		aspect-ratio: 1;
		background-image: url('/favicon-192.png');
		background-size: 300% 300%;
		background-repeat: no-repeat;
		cursor: pointer;
		transition: outline-color 0.12s ease;
		outline: 2px solid transparent;
		outline-offset: -2px;
	}

	/* The square you've picked up is held in deep pink, the pink that's meant to be read */
	.piece.picked {
		outline-color: var(--pink-deep);
	}

	.piece:hover {
		outline-color: var(--pink);
	}

	.piece:focus-visible {
		outline: 2px solid var(--text);
		outline-offset: -2px;
	}

	/* Finished: the seams close up and the monogram is whole again */
	.board.solved {
		gap: 0;
		padding: 0;
	}

	.say {
		max-width: 34ch;
		margin: 0.75rem 0 1rem;
		font-size: var(--type-meta);
		color: var(--muted);
	}

	/* Nothing moves for anyone who has asked their device for less motion */
	@media (prefers-reduced-motion: reduce) {
		.piece {
			transition: none;
		}
	}
</style>
