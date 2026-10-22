<script>
	import { formatDate } from '$lib/posts.js';
	let { data } = $props();
</script>

<svelte:head>
	<title>Blog · shivanigans</title>
</svelte:head>

<h1>Blog</h1>
<p class="intro">Notes on things I'm making, updated once a month.</p>

{#if data.posts.length}
	<ul class="post-list">
		{#each data.posts as post}
			<li>
				<a href="/blog/{post.slug}">
					<span class="marker" aria-hidden="true"></span>
					<span class="title">{post.title}</span>
					<time datetime={post.date}>{formatDate(post.date)}</time>
				</a>
			</li>
		{/each}
	</ul>
{:else}
	<p>No posts yet.</p>
{/if}

<style>
	/* The blog's titles are in Paper Mono Medium, set a little tighter */
	h1 {
		margin-bottom: 1.25rem;
		font-family: var(--mono);
		font-size: min(var(--type-title), 3.25rem);
		font-weight: 500;
	}

	.intro {
		margin: 0;
		font-size: var(--type-small);
	}

	/* Posts start 32px below the intro, a line above the list and between posts */
	.post-list {
		list-style: none;
		padding: 0;
		margin: 2rem 0 0;
		border-top: 1px solid var(--line);
	}

	.post-list li + li {
		border-top: 1px solid var(--line);
	}

	/* Pink square, the title, and the date pushed to the right */
	.post-list a {
		display: flex;
		align-items: baseline;
		gap: 0 0.9rem;
		padding: 0.8rem 0;
		text-decoration: none;
	}

	.post-list a:focus-visible {
		outline: 2px solid var(--text);
		outline-offset: 2px;
	}

	.marker {
		flex: none;
		width: 0.6rem;
		height: 0.6rem;
		background: var(--marker);
		align-self: center;
	}

	.title {
		font-size: 1.125rem;
		font-weight: 500;
		letter-spacing: var(--display-spacing);
	}

	time {
		margin-left: auto;
		font-size: var(--type-meta);
		color: var(--muted);
		white-space: nowrap;
	}
</style>
