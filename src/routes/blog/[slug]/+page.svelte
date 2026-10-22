<script>
	// A blog post: "← Blog · date · read time", the title in Paper Mono, then the post.
	// Its footnotes, if it has any, sit in the margin (see src/lib/posts.js), and under the post on phones.
	import Arrow from '$lib/components/Arrow.svelte';
	import { formatDate } from '$lib/posts.js';
	let { data } = $props();
	const Content = $derived(data.content);
</script>

<svelte:head>
	<title>{data.meta.title} · Shivani Singh Ghoshi</title>
	{#if data.meta.summary}<meta name="description" content={data.meta.summary} />{/if}
</svelte:head>

<article>
	<header>
		<p class="meta">
			<a href="/blog" class="back"><Arrow dir="left" /> Blog</a>
			<span aria-hidden="true">·</span>
			<time datetime={data.meta.date}>{formatDate(data.meta.date)}</time>
			<span aria-hidden="true">·</span>
			<span>{data.minutes} min read</span>
		</p>
		<h1>{data.meta.title}</h1>
	</header>

	<div class="body">
		<Content />
	</div>

	<!-- Phones have no margin, so the footnotes go under the post -->
	{#if data.footnotes.length}
		<ol class="phone-footnotes">
			{#each data.footnotes as footnote, i}
				<li><span class="number">{i + 1}</span> {footnote}</li>
			{/each}
		</ol>
	{/if}
</article>

<style>
	/* "← Blog · 1 Oct 2026 · 4 min read": small, grey, the back link in deep pink */
	.meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		margin: 0 0 1rem;
		font-size: var(--type-meta);
		color: var(--muted);
	}

	.back {
		display: inline-flex;
		align-items: center;
		gap: 0.4em;
		color: var(--pink-deep);
		text-decoration: none;
	}

	.back:hover {
		text-decoration: underline;
	}

	.back:focus-visible {
		outline: 2px solid var(--text);
		outline-offset: 2px;
	}

	/* The post's title: Paper Mono Medium, set a little tighter */
	h1 {
		margin-bottom: 1.5rem;
		font-family: var(--mono);
		font-size: min(var(--type-title), 3.25rem);
		font-weight: 500;
	}

	/* The text keeps to about 620px wide, so lines stay easy to read */
	.body {
		max-width: 620px;
		font-size: var(--type-small);
		line-height: 1.7;
	}

	.body :global(h2) {
		margin-top: 3rem;
	}

	/* Footnote numbers in deep pink */
	.body :global(sup) {
		font-size: 0.65em;
		line-height: 0;
		color: var(--pink-deep);
	}

	.body :global(img) {
		margin: 2rem 0 0.5rem;
	}

	/* Two pictures written one after the other sit side by side */
	.body :global(p:has(> img + img)) {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
		max-width: none;
	}

	.body :global(p:has(> img + img) img) {
		width: 100%;
		margin: 0;
	}

	.body :global(img + em),
	.body :global(p:has(> img + img) + p > em:only-child) {
		display: block;
		font-style: normal;
		font-size: var(--type-meta);
		color: var(--muted);
	}

	.body :global(a) {
		text-underline-offset: 3px;
	}

	/* Quotes and asides: on a yellow highlight (text colour on it, 8.3:1) */
	.body :global(blockquote) {
		margin: 2.5rem 0;
		color: var(--accent);
	}

	.body :global(blockquote p) {
		display: inline;
		background: var(--sun);
		box-decoration-break: clone;
		-webkit-box-decoration-break: clone;
		line-height: 1.8;
	}

	.body :global(code) {
		font-size: 0.95em;
	}

	.phone-footnotes {
		display: none;
	}

	.number {
		color: var(--pink-deep);
	}

	@media (max-width: 48rem) {
		.phone-footnotes {
			display: grid;
			gap: 0.75rem;
			margin: 3rem 0 0;
			padding: 1.25rem 0 0;
			border-top: 1px solid var(--line);
			list-style: none;
			font-size: var(--type-label);
		}
	}
</style>
