<!--
  BlogMedia: a picture, GIF or video inside a blog post, with its caption under it.

  How to use it, in a post. Either a new picture, kept with the post:
    <BlogMedia name="footer-grass" alt="The tally marks turning into grass" />
    <BlogMedia name="quote-card" alt="A quote card" caption="One of the quote cards Claude made" />

  - `name` is the file's name, without the bit after the dot.
  - `folder` is the folder inside static/blog it lives in (default: the hammer post's).
  - The file goes in static/blog/<folder>/, as .gif, .mp4, .webm, .png, .jpg or .webp.

  Or a picture the site already has somewhere else, so it isn't kept twice over:
    <BlogMedia file="/projects/bouncy-friends/bouncy-friends-4x3.mp4" alt="..." />

  - `file` is the address it's served at, which is its place in static with the "static" off.
  - A `file` given here wins over `name`.

  Either way, a file that isn't there simply doesn't show: no broken picture, no empty box,
  and the caption goes with it. So a post can be written before its pictures are drawn.
  Which files are there is worked out while the site is built, not while someone is reading.
-->
<script>
	import Media from '$lib/components/Media.svelte';

	let { name = '', file = '', alt = '', caption = '', folder = 'hammer' } = $props();

	// Every picture in static, by name. Nothing is loaded here: the list of names is all this
	// needs, so a file that is there can be told apart from one that isn't yet.
	const files = import.meta.glob('/static/**/*.{gif,mp4,webm,png,jpg,jpeg,webp}');
	const names = Object.keys(files);

	// static/blog/hammer/a.gif is served at /blog/hammer/a.gif, so the "/static" comes off
	const served = (path) => path.slice('/static'.length);

	// The web address of the file, or nothing at all if it isn't there
	const src = $derived.by(() => {
		if (file) return names.some((path) => served(path) === file) ? file : '';
		const match = names.find((path) => served(path).replace(/\.[^.]+$/, '') === `/blog/${folder}/${name}`);
		return match ? served(match) : '';
	});
</script>

{#if src}
	<figure>
		<!-- encodeURI, because a few of the site's files have spaces in their names -->
		<Media src={encodeURI(src)} {alt} calm />
		{#if caption}<figcaption>{caption}</figcaption>{/if}
	</figure>
{/if}

<style>
	/* The full width of the reading column, with the same room round it as a picture
	   written straight into a post */
	figure {
		margin: 2rem 0 0;
	}

	/* The caption sits right under the picture, like the ones on the September post */
	figcaption {
		margin-top: 0.5rem;
		font-size: var(--type-meta);
		color: var(--muted);
	}
</style>
