<script>
	import { plain } from '$lib/components/Title.svelte';
	let { data } = $props();

	const isVideo = (file) => /\.(mp4|webm)$/i.test(file);
	const isExternal = (link) => link.startsWith('http');
	// A file in static/tinkerings, or a full path like '/blog/x.webp'
	const mediaUrl = (file) => (file.startsWith('/') ? file : `/tinkerings/${encodeURIComponent(file)}`);
</script>

<svelte:head>
	<title>Tinkerings · Shivani Singh Ghoshi</title>
	<meta name="description" content={data.intro} />
</svelte:head>

<h1 class="visually-hidden">Tinkerings</h1>

<ul class="gallery">
	{#each data.tinkerings as item}
		<li>
			<svelte:element
				this={item.link ? 'a' : 'div'}
				class="item"
				href={item.link || undefined}
				target={item.link && isExternal(item.link) ? '_blank' : undefined}
				rel={item.link && isExternal(item.link) ? 'noopener' : undefined}
			>
				<div class="thumb" class:placeholder={!item.media}>
					{#if !item.media}
						<span class="empty" aria-hidden="true">Thumbnail</span>
					{:else if isVideo(item.media)}
						<!-- Plays silently on a loop, like a GIF -->
						<video src={mediaUrl(item.media)} autoplay muted loop playsinline aria-label={plain(item.title)}></video>
					{:else}
						<img src={mediaUrl(item.media)} alt={plain(item.title)} loading="lazy" />
					{/if}
				</div>
				<p>
					<span class="visually-hidden">{plain(item.title)}. </span>{item.description}
					<!-- The whole card is already the link, so this just looks like one -->
					{#if item.link && item.linkText}<span class="link-text">{item.linkText}</span>{/if}
				</p>
			</svelte:element>
		</li>
	{/each}
</ul>

<style>
	.gallery {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 5rem;
	}

	.item {
		display: block;
		text-decoration: none;
	}

	/* The card takes the shape of its image or video */
	.thumb {
		background: var(--card);
		border-radius: 6px;
		box-shadow: var(--shadow);
		overflow: hidden;
	}

	.thumb img,
	.thumb video {
		display: block;
		width: 100%;
		height: auto;
	}

	/* Cards with no media yet keep a wide blank frame */
	.thumb.placeholder {
		aspect-ratio: 16 / 9;
		display: grid;
		place-items: center;
	}

	.empty {
		color: var(--ink);
	}

	p {
		margin: 1.3rem 0 0;
		color: var(--ink);
	}

	a.item .thumb {
		transition: box-shadow 0.2s ease, transform 0.2s ease;
	}

	a.item:hover .thumb {
		transform: translateY(-2px);
		box-shadow: 0 4px 14px rgba(65, 60, 50, 0.18);
	}

	.link-text {
		color: var(--muted);
		text-decoration: underline;
		text-decoration-color: currentColor;
		text-underline-offset: 3px;
		white-space: nowrap;
	}

	a.item:focus-visible {
		outline: 2px solid var(--text);
		outline-offset: 6px;
		border-radius: 6px;
	}

	@media (prefers-reduced-motion: reduce) {
		a.item .thumb {
			transition: none;
		}

		a.item:hover .thumb {
			transform: none;
		}
	}
</style>
