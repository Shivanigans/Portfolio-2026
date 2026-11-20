<script>
	// The CEEW Wrapped 2025 case study, /projects/ceew-wrapped.
	//
	// Built by hand like /projects/revisual-booth, in the site's own fonts and colours, laid
	// out like /projects/ceew-data-illustrations so the two CEEW pages match.
	//
	// The pictures are in static/projects/ceew-wrapped, numbered in page order, kept exactly as
	// they were made. Four of them have their caption drawn along the bottom, so each is shown
	// through a window (see .window below) that leaves that strip out, and the caption is real
	// text underneath instead. The videos use Media, so they play silently on a loop and stay
	// still on their first frame for people who have asked their device for less motion.
	import Arrow from '$lib/components/Arrow.svelte';
	import ToTop from '$lib/components/ToTop.svelte';
	import Media from '$lib/components/Media.svelte';
	import { poojilLink } from '$lib/links.js';

	const base = '/projects/ceew-wrapped';

	// Where each window sits on its picture, in the picture's own pixels: how wide the file is,
	// how far down the window starts, and how tall it is. Each stops in the plain space above
	// the drawn caption.
	const windows = {
		office: { w: 1920, top: 70, h: 875 }, // caption at 960px
		stickers: { w: 960, top: 60, h: 415 }, // caption at 485px
		duck: { w: 1920, top: 70, h: 490 } // caption at 585px
	};
	const frame = ({ w, top, h }) => `--w: ${w}; --top: ${top}; --h: ${h}`;

	// The hero's fan, left to right, in the same order as the original hero slide.
	// n: the slide's number. left, top and width are shares of the fan's box; turn is in
	// degrees; z puts the cover on top, the outer slides at the back.
	const fan = [
		{ n: 3, left: 3, top: 20, width: 24, turn: 6, z: 1 },
		{ n: 6, left: 17, top: 16, width: 27, turn: -10, z: 2 },
		{ n: 1, left: 33, top: 7.5, width: 34, turn: 0, z: 3 },
		{ n: 2, left: 56, top: 16, width: 27, turn: 12, z: 2 },
		{ n: 5, left: 73, top: 20, width: 24, turn: 6, z: 1 }
	];
</script>

<svelte:head>
	<title>CEEW Wrapped 2025 · shivanigans</title>
	<meta
		name="description"
		content="Writing and designing CEEW Wrapped 2025, a highlight reel of the year for CEEW’s newsletter and socials."
	/>
</svelte:head>

<article>
	<a class="back" href="/projects"><Arrow dir="left" /> Projects</a>

	<h1>CEEW Wrapped 2025</h1>

	<div class="slides">
		<!-- 1. Five of the slides fanned out, the cover in the middle. Laid out here from the
		     separate slide files, so every slide shows whole, with nothing cut off at the edges. -->
		<figure>
			<div
				class="fan wide"
				role="img"
				aria-label="Five CEEW Wrapped 2025 slides fanned out. The hand-lettered cover sits in the middle, with drawings of a coffee machine, a Raise the bar sign, a Sagarmatha sign and table tennis bats. Around it, slides on the year’s 60 publications, a heat risk chart with 77k+ impressions, the intro, and the 36 blogs."
			>
				{#each fan as card}
					<img
						src="{base}/wrapped-slide-{card.n}.png"
						alt=""
						width="1080"
						height="1350"
						style="--left: {card.left}%; --top: {card.top}%; --width: {card.width}%; --turn: {card.turn}deg; z-index: {card.z}"
						fetchpriority={card.n === 1 ? 'high' : 'auto'}
					/>
				{/each}
			</div>
			<figcaption class="text">
				For CEEW’s year-end newsletter and socials, I wrote and designed <strong>CEEW Wrapped 2025</strong>, a highlight reel of the year sent to 120k+ readers and shared across the&nbsp;organisation.
			</figcaption>
		</figure>

		<!-- 2. The office illustrations -->
		<figure>
			<div class="window wide" style={frame(windows.office)}>
				<Media
					src="{base}/slide-2-office.png"
					alt="Grey pencil drawings of things from the CEEW office: a coffee machine with a CEEW mug, a taped-up Raise the bar sign, a Sagarmatha 8849 meters room sign, and two table tennis bats on a table."
				/>
			</div>
			<figcaption class="text">
				I took a playful, illustrative approach and drew the internal references into the&nbsp;cover.
			</figcaption>
		</figure>

		<!-- 3. The carousel of all the wrapped slides -->
		<div class="wide on-grey">
			<Media
				src="{base}/slide-3.mp4"
				alt="The CEEW Wrapped 2025 slides playing one after another: the hand-lettered cover, then the year in numbers, from 60 publications, 102 op-eds and 36 blogs to a heat risk chart with 77k+ impressions and the What On Earth! comic of the year."
				calm
			/>
		</div>

		<!-- 4. The sticker animation, its line first, so there's a pause between the two videos.
		     It holds on its last frame for a few seconds, so the stickers can be read before
		     it plays again. -->
		<figure>
			<figcaption class="text above">
				For CEEW’s 12th anniversary, I designed climate research based&nbsp;stickers.
			</figcaption>
			<div class="window wide on-grey" style={frame(windows.stickers)}>
				<Media
					src="{base}/slide-4.mp4"
					alt="Six climate pun stickers popping onto the page one by one: 2 degrees 2 much!, Powered by peer review, Don’t hate, mitigate, Solar, so good, Water you waiting for?, and Don’t be fossil-minded."
					calm
					hold={3500}
				/>
			</div>
		</figure>

		<!-- 5. The duck -->
		<figure>
			<div class="window wide" style={frame(windows.duck)}>
				<Media
					src="{base}/slide-5-duck.png"
					alt="A soft toy duck holding a knife, above a label that says: You best be raising the bar."
				/>
			</div>
			<figcaption class="text">
				Big thanks to <a href={poojilLink} target="_blank" rel="noopener">Poojil<span class="visually-hidden"> (opens in a new tab)</span></a> for all the support on this, and Neera for the&nbsp;opportunity!
			</figcaption>
		</figure>
	</div>

	<!-- Turns the videos' cream background (255, 251, 243) into the page grey (246, 246, 246)
	     as they play, by scaling each colour channel. Every other colour moves by at most 4%,
	     too little to see. The videos themselves can't be recoloured without video tools. -->
	<svg class="filters" aria-hidden="true" focusable="false">
		<filter id="cream-to-page-grey" color-interpolation-filters="sRGB">
			<feComponentTransfer>
				<feFuncR type="linear" slope={246 / 255} />
				<feFuncG type="linear" slope={246 / 251} />
				<feFuncB type="linear" slope={246 / 243} />
			</feComponentTransfer>
		</filter>
	</svg>

</article>

<!-- Back to top, on pages at least two screens long -->
<ToTop screens={2} />

<style>
	/* "← Projects", the text and the links match /projects/ceew-data-illustrations and the
	   shared case study template (src/routes/projects/[id]/+page.svelte) */
	.back {
		display: inline-flex;
		align-items: center;
		gap: 0.4em;
		margin-bottom: 1.25rem;
		font-size: var(--type-meta);
		color: var(--pink-deep);
		text-decoration: none;
	}

	h1 {
		margin-bottom: 1.5rem;
	}

	.text {
		margin: 0;
		font-size: var(--type-caption); /* 14px */
		font-weight: 500; /* Paper Mono Medium */
		line-height: 1.7; /* a little more room between lines than the page's 1.6 */
	}

	.text strong {
		font-weight: 600; /* Paper Mono SemiBold */
	}

	/* The pictures and videos, one under another, each the full width of the column */
	.slides {
		display: grid;
		gap: 5rem;
	}

	figure {
		margin: 0;
	}

	/* Each caption sits clear of its picture, and much closer to it than to the next one.
	   (.slides in front, so this wins over .text's margin: 0.) */
	.slides figcaption {
		margin-top: 1.5rem;
		/* Never a single word left alone on the last line: each caption also joins its last
		   two words with a non-breaking space, for browsers without this */
		text-wrap: pretty;
	}

	/* The sticker line, which comes before its animation */
	.slides figcaption.above {
		margin: 0 0 1.5rem;
	}

	.on-grey :global(video) {
		filter: url(#cream-to-page-grey);
	}

	/* The filter's own box takes up no room */
	.filters {
		position: absolute;
		width: 0;
		height: 0;
	}

	/* Wider than the reading column, out to the site's page width (--page), sized like the
	   spreads on /projects/ceew-data-illustrations. Never wider than the window, less 24px
	   each side, so on phones it's the column's width. The captions stay in the column. */
	.wide {
		--wide: min(var(--page), 100vw - 48px);
		width: var(--wide);
		max-width: none;
		margin-inline: calc((100% - var(--wide)) / 2);
	}

	/* ---- The hero's fan of slides ---- */
	/* A box the shape of the fan; each slide is placed on it by share of its size, so the
	   whole fan scales with the column and every slide stays inside it */
	.fan {
		position: relative;
		aspect-ratio: 2 / 1;
	}

	.fan img {
		position: absolute;
		left: var(--left);
		top: var(--top);
		width: var(--width);
		max-width: none;
		border-radius: 6px;
		box-shadow: var(--shadow);
		transform: rotate(var(--turn));
	}

	/* A window onto part of a picture: the shape of the part it shows (--w by --h), with the
	   picture moved up by --top inside it. Everything outside, including the drawn caption,
	   is cut off. top as a percentage is a share of the window's height, so it holds at
	   every width. */
	.window {
		position: relative;
		aspect-ratio: var(--w) / var(--h);
		overflow: hidden;
	}

	.window :global(img),
	.window :global(video) {
		position: absolute;
		left: 0;
		top: calc(var(--top) / var(--h) * -100%);
		width: 100%;
		max-width: none;
	}

	a:focus-visible {
		outline: 2px solid var(--text);
		outline-offset: 3px;
	}

	@media (max-width: 48rem) {
		.slides {
			gap: 3.5rem;
		}

		.slides figcaption {
			margin-top: 1.25rem;
		}

		.slides figcaption.above {
			margin: 0 0 1.25rem;
		}

		.fan img {
			border-radius: 3px;
		}
	}
</style>
