<script>
	// Shows an image, GIF or video. Videos play silently on a loop.
	// `src` is a file name in static/tinkerings, or a full path starting with '/'.
	// With no src it shows a clearly marked placeholder box.
	let { src = '', alt = '' } = $props();

	const url = $derived(src.startsWith('/') ? src : `/tinkerings/${encodeURIComponent(src)}`);
	const isVideo = $derived(/\.(mp4|webm)$/i.test(src));
</script>

{#if !src}
	<div class="placeholder"><span>PLACEHOLDER image</span></div>
{:else if isVideo}
	<video src={url} autoplay muted loop playsinline aria-label={alt}></video>
{:else}
	<img src={url} {alt} loading="lazy" />
{/if}

<style>
	img,
	video {
		display: block;
		width: 100%;
		height: auto;
	}

	.placeholder {
		aspect-ratio: 16 / 9;
		display: grid;
		place-items: center;
		background: var(--card);
		outline: 1px dashed var(--line);
		outline-offset: -1px;
		font-size: 0.75rem;
		color: var(--muted);
	}
</style>
