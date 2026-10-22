<script>
	// About: the hello and a few words beside the drawing, then work in progress floating
	// underneath. The pictures are in src/lib/about.js.
	import Media from '$lib/components/Media.svelte';
	import { drawing, drawingAlt, wip } from '$lib/about.js';
</script>

<svelte:head>
	<title>About · Shivani Singh Ghoshi</title>
</svelte:head>

<div class="top">
	<div class="intro">
		<h1>Hello, I’m Shivani</h1>
		<p>
			I’m all about making things – especially if they’re thoughtful, human and driven by impact.
		</p>
		<p>I enjoy a good visual pun. I try to take my stupid seriously and my serious, seriously.</p>
		<p><a href="/blog">I recently wrote about what I worked on in September, read here.</a></p>
	</div>

	<div class="drawing">
		<Media src={drawing} alt={drawingAlt} />
	</div>
</div>

<!-- Work in progress, each picture drifting gently on its own -->
<ul class="wip">
	{#each wip as picture, i}
		<li style:--i={i}>
			<Media src={picture.src} alt={picture.alt} />
		</li>
	{/each}
</ul>

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
		font-size: var(--type-label);
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
	}

	.drawing :global(img),
	.drawing :global(.placeholder) {
		width: 100%;
		height: 100%;
		aspect-ratio: auto;
		object-fit: contain; /* the whole drawing, tilted frame and all */
	}

	/* Three pictures in a row, each a little turned, bobbing gently out of step */
	.wip {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
		margin: 2.5rem 0 0;
		padding: 0;
		list-style: none;
	}

	.wip li {
		--turn: calc((var(--i) - 1) * 1deg + 0.5deg);
		transform: rotate(var(--turn));
		animation: drift 7s ease-in-out infinite alternate;
		animation-delay: calc(var(--i) * -2.3s);
	}

	.wip :global(.placeholder) {
		aspect-ratio: 4 / 3;
	}

	@keyframes drift {
		to {
			transform: rotate(calc(var(--turn) * -1)) translateY(-6px);
		}
	}

	@media (max-width: 40rem) {
		.top {
			grid-template-columns: minmax(0, 1fr);
		}

		.drawing {
			max-width: 16rem;
		}
	}

	/* Visitors who turn off motion see the pictures still */
	@media (prefers-reduced-motion: reduce) {
		.wip li {
			animation: none;
		}
	}
</style>
