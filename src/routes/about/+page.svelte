<script>
	// About: the hello and a few words, with the drawing beside them. The drawing is in
	// src/lib/about.js.
	import Media from '$lib/components/Media.svelte';
	import { drawing, drawingAlt } from '$lib/about.js';
</script>

<svelte:head>
	<title>About · shivanigans</title>
</svelte:head>

<div class="top">
	<div class="intro">
		<h1>Hello, I’m Shivani</h1>
		<p>
			I’m all about making things – especially if they’re thoughtful, human and driven by impact.
		</p>
		<p>I enjoy a good visual pun. I try to take my stupid seriously and my serious, seriously.</p>
		<p><a href="/blog">I recently wrote about what I worked on in September. Read it here.</a></p>
	</div>

	<div class="drawing">
		<Media src={drawing} alt={drawingAlt} />
	</div>
</div>

<style>
	/* The hello and its words on the left, the drawing on the right */
	.top {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 16rem;
		gap: 2rem;
		align-items: start;
	}

	h1 {
		margin-bottom: 1.25rem;
	}

	.intro p {
		max-width: 48ch;
		margin: 0;
		font-size: var(--type-body);
		line-height: 1.7;
	}

	.intro p + p {
		margin-top: 0.85rem;
	}

	.intro a {
		text-underline-offset: 3px;
	}

	.drawing {
		aspect-ratio: 1;
		overflow: hidden;
		/* The page grey behind the drawing, for the multiply below to blend into */
		background: var(--desk);
	}

	.drawing :global(img),
	.drawing :global(.placeholder) {
		width: 100%;
		height: 100%;
		aspect-ratio: auto;
		object-fit: contain; /* the whole drawing, tilted frame and all */
		/* The drawing is black ink on a white square. Multiply drops that white into the page,
		   so the drawing sits straight on the grey with no box round it. */
		mix-blend-mode: multiply;
	}

	@media (max-width: 40rem) {
		.top {
			grid-template-columns: minmax(0, 1fr);
		}

		.drawing {
			max-width: 16rem;
		}
	}
</style>
