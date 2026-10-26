<script>
	// The Revisual Labs booth case study, /projects/revisual-booth.
	//
	// This page has its own design, taken from the Figma frames "Booth graphics", "Stickers"
	// and "Lettering slide". It does not use the shared case study template in
	// src/routes/projects/[id]/+page.svelte.
	//
	// Everything inside .study is in Revisual Labs' fonts (Sora and Gambetta) and their
	// colours (near-black, off-white and one coral). The margin, the tabs and the footer
	// around it stay in the site's own fonts, untouched.
	//
	// The sections run edge to edge of the page column: .study cancels the column's side
	// padding with a negative margin, and each section puts its own padding back.
	import Arrow from '$lib/components/Arrow.svelte';

	const base = '/projects/revisual-booth';

	// The sticker animation runs through once and then stays on its last frame. Two things
	// keep it there, because a GIF on its own is not dependable about this:
	//
	// 1. In the file, the last frame's delay is set to the longest a GIF can hold (about
	//    eleven minutes) so the animation has nothing to loop back to. Taking the looping
	//    block out altogether does not work: Chrome then refuses to animate the GIF at all
	//    and shows a blank first frame, and setting the loop count to 1 makes it clear
	//    itself when it finishes.
	// 2. Here, once the animation has had its 2.2 seconds, the picture is swapped for a
	//    still of the final frame, which settles it for good.
	//
	// It also has to start at the right moment, since it only plays once. The picture begins
	// as that same still and only becomes the animation just before the clip scrolls into
	// view, so the stickers land while they are being looked at rather than somewhere above
	// the screen. With no JavaScript the still simply stays, which is where the animation
	// ends up anyway.
	const still = `${base}/sticker-animation-still.png`;
	const moving = `${base}/sticker-animation.gif`;
	const runLength = 2600; // the animation is 2.17s; the rest is margin

	let frame = $state(still);
	let settle;

	function playOnceInView(node) {
		if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
		if (!('IntersectionObserver' in window)) {
			frame = moving;
			return;
		}
		const watcher = new IntersectionObserver(
			(entries) => {
				if (!entries.some((entry) => entry.isIntersecting)) return;
				frame = moving;
				watcher.disconnect();
			},
			// Fires while the clip is still just below the screen, so the swap itself isn't seen
			{ rootMargin: '0px 0px 80px 0px' }
		);
		watcher.observe(node);
		return {
			destroy() {
				watcher.disconnect();
				clearTimeout(settle);
			}
		};
	}

	// Timed from when the animation has actually loaded, not from when it was asked for,
	// so a slow connection doesn't cut it short
	function onFrameLoad(event) {
		if (!event.currentTarget.src.endsWith('.gif')) return;
		clearTimeout(settle);
		settle = setTimeout(() => (frame = still), runLength);
	}
</script>

<svelte:head>
	<title>Booth graphics and Merch Design · shivanigans</title>
	<meta
		name="description"
		content="Print, play and a little bit of data for Revisual Labs’ booth at VizChitra 2025."
	/>
</svelte:head>

<a class="back" href="/projects"><Arrow dir="left" /> Projects</a>

<article class="study">
	<!-- 1. Hero: the title on the left, the three-quarter booth render bleeding off the right -->
	<section class="hero dark">
		<p class="logo" aria-label="Revisual Labs">rv<span class="dot">.</span>l</p>

		<div class="hero-row">
			<div class="hero-words">
				<h1>Booth graphics and Merch Design</h1>
				<p class="subline">
					Print, play and a little bit of data for Revisual Labs’ booth at VizChitra 2025
				</p>
			</div>

			<div class="hero-render">
				<img
					src="{base}/booth-three-quarter.png"
					alt="A three-quarter view of the Revisual Labs booth: a printed backdrop and a counter with bowls of stickers."
					width="1717"
					height="2088"
					fetchpriority="high"
				/>
			</div>
		</div>
	</section>

	<!-- 2. Context: the label and the two paragraphs, then the front render with text beside it -->
	<section class="context dark">
		<h2 class="label">Context</h2>
		<div class="context-text">
			<p>
				VizChitra is India’s first data visualisation conference. Its first edition was held in June
				2025, bringing together 500+ professionals from different backgrounds for the love of data
				storytelling and literacy in India.
			</p>
			<p>Revisual Labs had a booth at the conference.</p>
		</div>

		<div class="split split-wide">
			<div class="shot shot-front">
				<img
					src="{base}/booth-front.png"
					alt="The booth seen head on: the lit backdrop above the counter, with the Revisual Labs mark and revisual.co printed across the front."
					width="1458"
					height="1908"
					loading="lazy"
				/>
			</div>
			<div class="beside">
				<p>I designed the booth and merch for Revisual Labs at VizChitra 2025.</p>
				<p>
					The booth served as a window for conversation and for displaying the work RVL does, with
					a few goodies to collect.
				</p>
			</div>
		</div>
	</section>

	<!-- 3. Inspiration: the eye-level render on the left, one paragraph on the right -->
	<section class="inspiration dark">
		<div class="split split-wide">
			<div class="shot shot-eye">
				<img
					src="{base}/booth-eye-level.png"
					alt="The booth at eye level, from the side, showing the full printed backdrop."
					width="2022"
					height="2274"
					loading="lazy"
				/>
			</div>
			<div class="beside">
				<p>
					The booth graphics borrow from their social media series,
					<em class="serif accent">This month in numbers</em>, so the stand felt like an extension
					of what people already knew online
				</p>
			</div>
		</div>
	</section>

	<!-- 4. The coral band that starts the merch half of the page -->
	<section class="band">
		<h2>Merch Design</h2>
	</section>

	<!-- 5. Stickers: the sticker animation, then its heading and line underneath.
	     The animation is cropped to the stickers themselves (see .sticker-clip below).
	     It runs once and stops; people who have asked for less motion never see it move. -->
	<section class="stickers light">
		<div class="sticker-clip" use:playOnceInView>
			<picture>
				<source srcset="{base}/sticker-animation-still.png" media="(prefers-reduced-motion: reduce)" />
				<img
					src={frame}
					onload={onFrameLoad}
					alt="Five stickers appearing one by one: Commit to curiosity, Do it for the plot, the rv.l star, I love bar-hopping, and Feeling axis-tential."
					width="1920"
					height="1080"
					loading="lazy"
				/>
			</picture>
		</div>

		<div class="centred">
			<h2 class="label">For stickers</h2>
			<p>I brainstormed dataviz puns and wordplay, and brought a playful, hand-drawn vibe to their branding.</p>
		</div>
	</section>

	<!-- 6. Lettering: the text on the left, the mug on the right, on a soft grey surface -->
	<section class="lettering light">
		<div class="split split-even">
			<div class="beside">
				<p>And finally, a little something to take home.</p>
				<p>
					<em class="serif accent semibold">I revisualise things</em> is a hand-lettered illustration
					that plays on the Revisual name, with chart doodles tucked around the words.
				</p>
			</div>
			<div class="mug">
				<img
					src="{base}/mug-print.png"
					alt="A white mug printed with the hand-lettered words “I revisualise things”, with small chart doodles around them."
					width="799"
					height="649"
					loading="lazy"
				/>
			</div>
		</div>
		<div class="surface" aria-hidden="true"></div>
	</section>

	<!-- 7. The event photos, scattered like a scrapbook. On phones they become a plain stack. -->
	<section class="photos light">
		<div class="collage">
			<figure class="photo group">
				<img
					src="{base}/team-group-photo.jpg"
					alt="The Revisual Labs team standing together behind the booth at VizChitra."
					loading="lazy"
				/>
			</figure>
			<figure class="photo bowls">
				<img
					src="{base}/sticker-bowls.jpg"
					alt="Bowls of stickers and business cards laid out on the counter."
					loading="lazy"
				/>
			</figure>
			<figure class="photo curiosity">
				<img
					src="{base}/commit-to-curiosity.jpg"
					alt="A hand holding up the “Commit to curiosity” sticker."
					loading="lazy"
				/>
			</figure>
			<figure class="photo backdrop">
				<img
					src="{base}/lit-backdrop.jpg"
					alt="The printed backdrop at the booth, lit from above by three spotlights."
					loading="lazy"
				/>
			</figure>
		</div>
	</section>

	<!-- 8. Thank you -->
	<section class="thanks light">
		<p>
			A big thank you to Gurman Bhatia for the opportunity, Swathi Singh for all the support on
			this and Team RVL who made this experience 10/10 fun!
		</p>
	</section>
</article>

<style>
	/* ---- The page's own look, kept inside .study so nothing leaks out ---- */
	.study {
		/* Revisual Labs' colours. One coral, used for every highlight on this page. */
		--rv-dark: #0f0f0f;
		--rv-light: #f5f5f5;
		--rv-accent: #ff6865;
		--rv-on-dark: #ffffff;
		--rv-on-light: #0f0f0f;
		/* The two fade bands the renders and the mug sit on */
		--rv-fade-dark: #ececec;
		--rv-fade-light: #d9d9d9;

		/* How tall the grey surface is. The mug does not stand on its top edge, it stands in
		   it: in the design the edge crosses the mug about a quarter of the way up the
		   surface, so the room left under the mug (.lettering's padding-bottom) is three
		   quarters of this, and the last 8% of the mug sits in the grey. */
		--rv-surface: clamp(3.75rem, 7.5vw, 108px);

		--rv-sans: 'Sora', system-ui, sans-serif;
		--rv-serif: 'Gambetta', Georgia, serif;
		/* -2% in Figma: a share of the font size, so it holds at every size */
		--rv-tracking: -0.02em;
		/* How much bigger a Gambetta phrase is set than the Sora around it, so the two read
		   as the same height. Gambetta's lowercase is 0.454 of its em against Sora's 0.534
		   (taken from the fonts' own metrics), and 0.534 / 0.454 is 1.176 — which is the
		   4pt step in the design, written as a ratio so it holds at every text size. */
		--rv-serif-scale: 1.176;
		/* Room down each side of a section, matching the page column's own padding */
		--rv-pad: clamp(1.25rem, 5vw, 64px);

		/* The page column’s own side padding (src/routes/+layout.svelte, .sheet) */
		--rv-column-pad: clamp(1.5rem, 6vw, 80px);

		/* Run the sections out to both edges of the page column */
		margin-inline: calc(-1 * var(--rv-column-pad));
		font-family: var(--rv-sans);
		font-weight: 500;
		letter-spacing: var(--rv-tracking);
		line-height: 1.45;
	}

	.back {
		display: inline-flex;
		align-items: center;
		gap: 0.4em;
		margin-bottom: 2rem;
		font-size: var(--type-label);
		color: var(--pink-deep);
		text-decoration: none;
	}

	.back:hover {
		text-decoration: underline;
	}

	/* The dark half and the light half */
	.dark {
		position: relative;
		background: var(--rv-dark);
		color: var(--rv-on-dark);
	}

	.light {
		position: relative;
		background: var(--rv-light);
		color: var(--rv-on-light);
	}

	section {
		padding: 0 var(--rv-pad);
		overflow: hidden; /* lets a render bleed off the side without scrolling the page */
	}

	/* Every paragraph on this page is Sora Medium at the same size */
	.study p {
		margin: 0 0 1.15em;
		font-size: clamp(0.9375rem, 1.6vw, 1.0625rem);
	}

	.study p:last-child {
		margin-bottom: 0;
	}

	/* A phrase in Gambetta Italic inside a Sora sentence. It keeps the sentence's own letter
	   spacing, and is set larger so the two fonts look the same height side by side (see
	   --rv-serif-scale). line-height: 0 stops the bigger type prising open the one line it
	   sits on: the paragraph's own line spacing carries on evenly through it. */
	.serif {
		font-family: var(--rv-serif);
		font-style: italic;
		font-weight: 500;
		font-size: calc(1em * var(--rv-serif-scale));
		line-height: 0;
	}

	.serif.semibold {
		font-weight: 600;
	}

	.accent {
		color: var(--rv-accent);
	}

	/* The small all-caps labels: CONTEXT, FOR STICKERS */
	.label {
		margin: 0 0 1.1rem;
		font-family: var(--rv-sans);
		font-size: clamp(0.8125rem, 1.4vw, 0.9375rem);
		font-weight: 600;
		letter-spacing: var(--rv-tracking);
		text-transform: uppercase;
		color: inherit;
	}

	/* ---- 1. Hero ---- */
	.hero {
		padding-top: clamp(1.75rem, 4vw, 3rem);
		padding-bottom: clamp(2rem, 5vw, 4rem);
	}

	/* "rv.l": Revisual Labs' mark, set in their own Gambetta Italic with the coral dot.
	   There is no logo file in the assets folder, so it is typeset rather than placed. */
	.logo {
		margin: 0 0 clamp(2rem, 6vw, 4.5rem);
		font-family: var(--rv-serif);
		font-style: italic;
		font-weight: 500;
		font-size: clamp(2rem, 3.5vw, 3rem);
		letter-spacing: 0;
		line-height: 1;
	}

	.logo .dot {
		color: var(--rv-accent);
	}

	.hero-row {
		display: grid;
		grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
		align-items: center;
		gap: clamp(1rem, 2.5vw, 2rem);
	}

	h1 {
		margin: 0 0 clamp(1.25rem, 3vw, 2rem);
		font-family: var(--rv-sans);
		font-size: clamp(1.9rem, 4.2vw, 2.375rem);
		font-weight: 600;
		letter-spacing: var(--rv-tracking);
		line-height: 1.08;
		color: inherit;
		text-wrap: balance;
	}

	/* The one Gambetta line with no letter spacing at all, as in the design */
	.subline {
		font-family: var(--rv-serif);
		font-style: italic;
		font-weight: 400;
		letter-spacing: 0;
		line-height: 1.35;
	}

	.study .subline {
		font-size: clamp(1rem, 2.1vw, 1.375rem);
	}

	/* The render runs off the right edge of the page, as in the design */
	.hero-render {
		margin-right: calc(-1 * var(--rv-pad));
	}

	.hero-render img {
		width: 109%;
		max-width: none;
	}

	/* ---- 2 and 3. The dark sections with a render and text side by side ---- */
	.context {
		padding-bottom: clamp(1.5rem, 4vw, 3rem);
	}

	.context-text {
		max-width: 46rem;
	}

	.inspiration {
		padding-bottom: 0;
	}

	.inspiration .split {
		align-items: end;
	}

	.inspiration .beside {
		align-self: start;
	}

	.split {
		display: grid;
		align-items: start;
		gap: clamp(1rem, 3vw, 2.5rem);
		margin-top: clamp(1.5rem, 4vw, 3rem);
	}

	/* Picture wide, words narrow: the pairing both dark sections use */
	.split-wide {
		grid-template-columns: minmax(0, 1.9fr) minmax(0, 1fr);
	}

	/* The booth renders are a little wider than their column, spilling towards the words the
	   way the counter does in the design */
	.shot img {
		width: 108%;
		max-width: none;
	}

	.beside {
		/* roughly a fifth of the way down the render, as in the design */
		padding-top: clamp(0.5rem, 5vw, 4rem);
	}

	.beside p {
		margin-bottom: 1.4em;
	}

	/* The soft band the renders stand on: the dark background lifting towards light grey.
	   It has to be see-through, not a solid gradient between two dark colours — a solid one
	   paints over the bottom of the render standing in it and hides the booth's floor. */
	.dark::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: clamp(56px, 9vw, 110px);
		background: linear-gradient(
			to top,
			color-mix(in srgb, var(--rv-fade-dark) 13%, transparent),
			transparent
		);
		pointer-events: none;
	}

	/* Only the last dark section carries the band; the ones above run straight on */
	.hero::after,
	.context::after {
		display: none;
	}

	/* ---- 4. The coral band ---- */
	.band {
		padding-top: clamp(3rem, 8vw, 6rem);
		padding-bottom: clamp(3rem, 8vw, 6rem);
		background: var(--rv-accent);
		text-align: center;
	}

	.band h2 {
		margin: 0;
		font-family: var(--rv-sans);
		font-size: clamp(1.75rem, 5.5vw, 3.125rem);
		font-weight: 600;
		letter-spacing: var(--rv-tracking);
		line-height: 1.1;
		color: #ffffff;
	}

	/* ---- 5. Stickers ---- */
	.stickers {
		padding-top: clamp(2.5rem, 6vw, 4.5rem);
		padding-bottom: clamp(2.5rem, 6vw, 4.5rem);
	}

	/* The animation file is the whole 1920x1080 slide, with its heading and line printed
	   into the bottom of it. This window shows only the band the stickers land in, so the
	   words below can be real text in Sora instead of a picture of words. */
	.sticker-clip {
		position: relative;
		aspect-ratio: 1920 / 600;
		overflow: hidden;
		/* The animation file carries its own near-white background. Its four edges are softened
		   away so the window does not read as a pale rectangle on the page. */
		mask-image:
			linear-gradient(to bottom, transparent, #000 7%, #000 93%, transparent),
			linear-gradient(to right, transparent, #000 4%, #000 96%, transparent);
		mask-composite: intersect;
	}

	.sticker-clip picture,
	.sticker-clip img {
		position: absolute;
		top: -30.8%; /* the sticker band sits 185px down the 1080px-tall file */
		left: 0;
		width: 100%;
	}

	.centred {
		max-width: 34rem;
		margin: clamp(1.5rem, 4vw, 2.5rem) auto 0;
		text-align: center;
	}

	/* ---- 6. Lettering ---- */
	.lettering {
		padding-top: clamp(1.5rem, 4vw, 3rem);
		/* Less than the surface is tall, so the mug's base ends up inside the grey */
		padding-bottom: calc(var(--rv-surface) * 0.75);
	}

	.split-even {
		position: relative;
		align-items: center;
		z-index: 1;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
		margin-top: 0;
	}

	/* The mug stands on the grey surface, inside the content area */
	.mug {
		align-self: end;
	}

	.mug img {
		width: 100%;
	}

	/* The soft grey surface the mug stands on, across the bottom of the section */
	.surface {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: var(--rv-surface);
		background: linear-gradient(to bottom, var(--rv-fade-light), var(--rv-light));
	}

	/* ---- 7. The photo collage ---- */
	.photos {
		padding-top: clamp(1.5rem, 4vw, 3rem);
		padding-bottom: clamp(1.5rem, 4vw, 3rem);
	}

	/* The four photos are placed by hand on this box, as shares of its width and height,
	   so the whole arrangement scales with the page instead of sitting at fixed points. */
	.collage {
		position: relative;
		aspect-ratio: 1655 / 1055;
	}

	.photo {
		position: absolute;
		margin: 0;
		padding: 5px; /* the white border round each photo */
		background: #ffffff;
		box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
	}

	.photo img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* The team photo sits in the middle and the other three overlap its corners */
	.group {
		left: 13.6%;
		top: 0;
		width: 61%;
		height: 83%;
		z-index: 1;
	}

	.bowls {
		left: 0;
		top: 52.6%;
		width: 32.3%;
		height: 47%;
		z-index: 2;
	}

	.curiosity {
		left: 75.5%;
		top: 13.7%;
		width: 24.5%;
		height: 41%;
		z-index: 2;
	}

	.backdrop {
		left: 62.5%;
		top: 59.7%;
		width: 29.6%;
		height: 40.3%;
		z-index: 2;
	}

	/* ---- 8. Thank you ---- */
	.thanks {
		padding-bottom: clamp(3rem, 7vw, 5.5rem);
		text-align: center;
	}

	.thanks p {
		max-width: 38rem;
		margin: 0 auto;
	}

	/* ---- Phones and narrow windows ---- */
	@media (max-width: 48rem) {
		/* The page column uses a smaller side padding on phones, so the bleed matches it */
		.study {
			--rv-column-pad: 1.25rem;
		}

		/* Picture and words stack, picture first */
		.hero-row,
		.split-wide,
		.split-even {
			grid-template-columns: minmax(0, 1fr);
		}

		/* Stacked, the words end the dark half instead of standing beside the render, so
		   they need room under them: without it they sit right on the coral band. */
		.inspiration {
			padding-bottom: clamp(2rem, 7vw, 3rem);
		}

		.inspiration .split {
			align-items: start;
		}

		.hero-render,
		.mug {
			margin-right: 0;
		}

		.hero-render img,
		.shot img,
		.mug img {
			width: 100%;
			margin-left: 0;
		}

		/* The mug is sized against the page rather than stretched to fill it: stacked, a
		   full-width mug dwarfs everything around it. It stays over on the right, as in
		   the design. */
		.mug img {
			width: 70%;
			margin-left: auto;
		}

		/* The collage becomes a plain stack, one photo under another */
		.collage {
			aspect-ratio: auto;
			display: grid;
			gap: 1.25rem;
		}

		.photo {
			position: static;
			left: auto;
			top: auto;
			width: 100%;
			height: auto;
			padding: 4px;
		}

		.photo img {
			height: auto;
			aspect-ratio: 4 / 3;
		}
	}
</style>
