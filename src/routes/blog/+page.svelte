<script>
	import { formatDate } from '$lib/posts.js';
	let { data } = $props();
</script>

<svelte:head>
	<title>Blog · Shivani Singh Ghoshi</title>
</svelte:head>

<h1>Blog</h1>
<p class="intro">Notes on things I'm making, updated once a month.</p>

{#if data.posts.length}
	<ul class="post-list">
		{#each data.posts as post, i}
			<li>
				<a href="/blog/{post.slug}">
					<!-- newest post gets the blue square, like "current location" in the reference -->
					<span class="marker" class:latest={i === 0} aria-hidden="true"></span>
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
	/* 12px between the title and the intro line */
	h1 {
		margin-bottom: 0.75rem;
	}

	/* Intro line: 16px */
	.intro {
		margin: 0;
		font-size: 1rem;
	}

	/* Posts start 32px below the intro, with a line under each one.
	   The list (and its lines) runs wider than the text column, to 128px from the
	   right edge of the screen. */
	.post-list {
		width: max(100%, calc(100vw - var(--side) - 100px - 8rem));
		list-style: none;
		padding: 0;
		margin: 2rem 0 0;
		font-family: var(--mono);
		font-size: 1rem;
	}

	.post-list a {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 0 0.6rem;
		padding: 0.7rem 0;
		text-decoration: none;
		border-bottom: 1px solid var(--line);
	}

	.marker {
		width: 0.7rem;
		height: 0.7rem;
		flex-shrink: 0;
		background: var(--muted);
		border: 1px solid var(--text);
		align-self: center;
	}

	.marker.latest {
		background: var(--marker);
	}

	.title {
		font-weight: 700;
	}

	time {
		color: var(--muted);
	}

	/* Phones: the list fits the screen */
	@media (max-width: 48rem) {
		.post-list {
			width: auto;
		}
	}
</style>
