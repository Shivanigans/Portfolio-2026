<script>
	// Shows an image, GIF or video. Videos play silently on a loop.
	// `src` is a file name in static/tinkerings, or a full path starting with '/'.
	// With no src it shows an empty box that says "wow so empty".
	// calm: for people who have asked their device for less motion, the video stays
	// still on its first frame instead of playing
	// priority: the picture is the first big thing on screen, so it loads straight away, first
	import { onMount } from 'svelte';

	let { src = '', alt = '', calm = false, priority = false } = $props();

	const url = $derived(src.startsWith('/') ? src : `/tinkerings/${encodeURIComponent(src)}`);
	const isVideo = $derived(/\.(mp4|webm)$/i.test(src));

	let video = $state();
	onMount(() => {
		if (calm && video && matchMedia('(prefers-reduced-motion: reduce)').matches) {
			video.autoplay = false;
			video.pause();
			video.currentTime = 0;
		}
	});
</script>

{#if !src}
	<div class="placeholder"><span>wow so empty</span></div>
{:else if isVideo}
	<video bind:this={video} src={url} autoplay muted loop playsinline aria-label={alt || undefined}></video>
{:else}
	<img src={url} {alt} loading={priority ? 'eager' : 'lazy'} fetchpriority={priority ? 'high' : 'auto'} />
{/if}

<style>
	img,
	video {
		display: block;
		width: 100%;
		height: auto;
	}

	/* A greige box with its label in the middle, until the real picture is in */
	.placeholder {
		aspect-ratio: 4 / 3;
		display: grid;
		place-items: center;
		padding: 1rem;
		background: var(--greige);
		font-size: var(--type-meta);
		text-align: center;
		color: var(--text);
	}
</style>
