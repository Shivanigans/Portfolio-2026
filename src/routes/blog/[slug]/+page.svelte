<script>
	import { formatDate } from '$lib/posts.js';
	let { data } = $props();
	const Content = $derived(data.content);
</script>

<svelte:head>
	<title>{data.meta.title} · Shivani Singh Ghoshi</title>
	{#if data.meta.summary}<meta name="description" content={data.meta.summary} />{/if}
</svelte:head>

<a href="/blog" class="back">← all posts</a>

<article>
	<header>
		<h1>{data.meta.title}</h1>
		<time datetime={data.meta.date}>{formatDate(data.meta.date)}</time>
	</header>

	<div class="body">
		<Content />
	</div>
</article>

<style>
	.back {
		font-family: var(--mono);
		font-size: 0.9rem;
		color: var(--muted);
		text-decoration: none;
	}

	.back:hover {
		color: var(--pink);
	}

	header {
		margin: 2rem 0 2.5rem;
	}

	/* Same size as every page title (set in app.css), with less space under it for the date */
	h1 {
		margin: 0 0 0.75rem;
	}

	time {
		font-family: var(--mono);
		font-weight: 700;
		font-size: 1rem;
		color: var(--accent);
	}

	/* Everything written in the .md files */
	/* Post text: 16px */
	.body {
		font-size: 1rem;
	}

	.body :global(h2) {
		font-size: 1.6rem;
		margin-top: 3rem;
	}

	.body :global(img) {
		margin: 2rem 0 0.5rem;
		border-radius: 3px;
	}

	.body :global(img + em) {
		display: block;
		font-family: var(--mono);
		font-style: normal;
		font-size: 0.85rem;
		color: var(--muted);
	}

	.body :global(a) {
		text-underline-offset: 3px;
	}

	/* Quotes and asides styled like the highlighted log note in the reference */
	.body :global(blockquote) {
		margin: 2.5rem 0;
		font-family: var(--mono);
		font-size: 1rem;
		color: var(--accent);
	}

	.body :global(blockquote p) {
		display: inline;
		background: var(--highlight);
		box-decoration-break: clone;
		-webkit-box-decoration-break: clone;
		line-height: 1.8;
	}

	.body :global(code) {
		font-family: var(--mono);
		font-size: 0.95em;
	}
</style>
