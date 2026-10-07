<script>
	import { formatDate } from '$lib/posts.js';
	let { data } = $props();
</script>

<svelte:head>
	<title>Blog · Shivani Singh Ghoshi</title>
</svelte:head>

<h1>blog</h1>
<p class="intro">Notes on design, data and things I'm making. Roughly once a month.</p>

<p class="label">Posts</p>

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
	h1 {
		font-size: 3.5rem;
		line-height: 1;
		margin: 0 0 1.5rem;
	}

	.intro {
		margin: 0;
	}

	.post-list {
		list-style: none;
		padding: 0;
		margin: 0;
		font-family: var(--mono);
		font-size: 1rem;
	}

	.post-list li {
		border-bottom: 1px solid var(--line);
	}

	.post-list a {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 0 0.6rem;
		padding: 0.7rem 0;
		text-decoration: none;
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

	.post-list a:hover .title {
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	time {
		color: var(--muted);
	}
</style>
