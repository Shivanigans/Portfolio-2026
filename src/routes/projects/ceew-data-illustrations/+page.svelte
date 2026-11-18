<script>
	// The CEEW data illustrations case study, /projects/ceew-data-illustrations.
	//
	// Built by hand like /projects/revisual-booth, but in the site's own fonts and colours,
	// with the shared case study template's headings, back link and links.
	//
	// Context, My role and the thank you note are real text. Every picture is shown exactly as
	// it was made, words and all, from static/projects/ceew-data-illustrations, numbered in page order.
	import Arrow from '$lib/components/Arrow.svelte';
	import ToTop from '$lib/components/ToTop.svelte';
	import { poojilLink } from '$lib/links.js';

	const base = '/projects/ceew-data-illustrations';
	// The book's page on CEEW's site: linked from its name under Context, and at the end
	const publication = 'https://www.ceew.in/publications/local-grids-global-power';
</script>

<svelte:head>
	<title>Data illustrations for CEEW · shivanigans</title>
	<meta
		name="description"
		content="Illustrating and visualising two chapters of Local Grids to Global Power, CEEW’s data-first book on India’s clean energy transition."
	/>
</svelte:head>

<article>
	<a class="back" href="/projects"><Arrow dir="left" /> Projects</a>

	<h1>Data illustrations for CEEW</h1>

	<img
		src="{base}/slide-1-cover.png"
		alt="The cover of Local Grids to Global Power: India’s Energy Transition, by Poojil Tiwari, Neera Majumdar and Arunabha Ghosh. Orange and navy lines pinch together in the middle like an hourglass."
		width="1920"
		height="1242"
		fetchpriority="high"
	/>

	<section class="part">
		<h2>Context</h2>
		<p class="text">
			<a href={publication} target="_blank" rel="noopener">Local Grids to Global Power<span class="visually-hidden"> (opens in a new tab)</span></a> is a CEEW publication by <a href={poojilLink} target="_blank" rel="noopener">Poojil Tiwari<span class="visually-hidden"> (opens in a new tab)</span></a>, Neera Majumdar and
			Arunabha Ghosh. It’s a data-first book which talks about India’s clean energy transition
			through twenty charts.
		</p>
	</section>

	<section class="part">
		<h2>My role</h2>
		<p class="text">
			I illustrated and visualised two chapters in the book end to end: “India is championing
			doorstep delivery of sustainability” and “The energy transition is powering new rural
			enterprises in India”.
		</p>
	</section>

	<div class="slides">
		<img
			class="wide"
			src="{base}/slide-2-chapter-1.png"
			alt="The spread for “India is championing doorstep delivery of sustainability”, with the line beside it: Clean energy is now reaching Indian homes and electricity, solar, LEDs & LPG are now part of everyday household life in rural India. On the right page, an illustrated rural house with rooftop solar, a smart meter, LED lights and an LPG cylinder being delivered, each with its figure: 2.86 crore households electrified since Saubhagya, 25 crore homes that could take rooftop solar, 30 million smart meters, about 370 million LEDs, and 71% of households cooking on LPG."
			width="1920"
			height="1149"
			loading="lazy"
		/>

		<!-- Each spread is followed by its half of the process board, cut in two: one half
		     for each chapter's diagram. -->

		<!-- Above the board, so it's read before the board is. Only shown on phones. -->
		<p class="hint">Scroll sideways to read the notes.</p>
		<!-- Wider than the column, so the handwriting on the sticky notes stays readable.
		     On phones it keeps a readable size and scrolls sideways inside its frame instead. -->
		<div class="wide board">
			<img
				src="{base}/slide-4-part-1.png"
				alt="Process and research for the first chapter: pencil sketches of bulbs, a smart meter, LPG cylinders and a house with rooftop solar, with notes. At first the data points were isolated numbers in an infographic, but the story was about access, so the house became a canvas where each element tells its own story: a cylinder being delivered, solar on the roof, LEDs lit, a smart meter in place."
				width="1920"
				height="1565"
				loading="lazy"
			/>
		</div>

		<img
			class="wide"
			src="{base}/slide-3-chapter-2.png"
			alt="The spread for “The energy transition is powering new rural enterprises in India”, with the line beside it: Decentralised renewable energy (DREs) are already powering rural businesses, and could create millions of livelihoods. In rural India, this wave is being led by women and young users. On the right page, a woman operating a solar dryer, with who uses distributed clean tech: 8 in 10 under 45, about 6 in 10 women. Below, packed circles of dots show the livelihoods each technology could support, from 0.1 million for silk reeling machines to 11.9 million for vertical fodder grow units."
			width="1920"
			height="1058"
			loading="lazy"
		/>

		<div class="wide board">
			<img
				src="{base}/slide-4-part-2.png"
				alt="Process for the second chapter, with notes. The data showed the way: DREs were a rural India story, told in two parts, the present and the potential. The first draft treated the user profile as separate stats with icons, but an illustration humanises it. A packed circle chart shows the market the top technologies could create, kept granular to show the scale of impact. Early drafts, a research chart and a watercolour of a woman watering plants beside solar panels sit around the notes."
				width="1920"
				height="1525"
				loading="lazy"
			/>
		</div>

		<!-- The solar panel illustration goes here, once its file is in the folder -->

		<p class="text">
			I would like to thank <a href={poojilLink} target="_blank" rel="noopener">Poojil Tiwari<span class="visually-hidden"> (opens in a new tab)</span></a> for her guidance, research and words for the respective
			chapters and Juneho Yeo for assistance on the research.
		</p>
	</div>

	<p class="links">
		<a href={publication} target="_blank" rel="noopener">
			View more info on the publication <Arrow dir="out" />
		</a>
	</p>
</article>

<!-- Back to top, on pages at least two screens long -->
<ToTop screens={2} />

<style>
	/* "← Projects", the headings, the text and the links match the shared case study template
	   (src/routes/projects/[id]/+page.svelte) */
	.back {
		display: inline-flex;
		align-items: center;
		gap: 0.4em;
		margin-bottom: 1.25rem;
		font-size: var(--type-meta);
		color: var(--pink-deep);
		text-decoration: none;
	}

	.back:hover {
		text-decoration: underline;
	}

	h1 {
		margin-bottom: 1.5rem;
	}

	img {
		width: 100%;
	}

	.part {
		margin-top: 3.5rem;
	}

	h2 {
		margin-bottom: 0.75rem;
	}

	/* The full width of the column, so each line runs on until it's full rather than
	   breaking off partway across */
	.text {
		margin: 0;
		font-size: var(--type-caption); /* 14px */
		font-weight: 500; /* Paper Mono Medium */
	}

	/* The slides, one under another, as they were made */
	.slides {
		display: grid;
		gap: 2.5rem;
		margin-top: 3.5rem;
	}

	/* ---- The spreads and the process board ---- */
	/* Wider than the reading column, out to the site's page width (--page), so the
	   handwriting is big enough to read, and the spreads sit at the same width as the
	   board. Never wider than the window, less 24px each side. */
	.wide {
		--wide: min(var(--page), 100vw - 48px);
		width: var(--wide);
		max-width: none;
		margin-inline: calc((100% - var(--wide)) / 2);
	}

	/* Only needed on phones, where the board scrolls */
	.hint {
		display: none;
		margin: 0 0 -2rem; /* sits just above the board, not a whole gap away */
		font-size: var(--type-meta);
		color: var(--muted);
	}

	/* ---- The Behance link at the end ---- */
	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 2rem;
		margin: 1.25rem 0 0;
		font-size: var(--type-label);
	}

	.links a {
		display: inline-flex;
		align-items: center;
		gap: 0.35em;
		text-underline-offset: 3px;
	}

	a:focus-visible {
		outline: 2px solid var(--text);
		outline-offset: 3px;
	}

	/* ---- Phones and narrow windows ---- */
	@media (max-width: 48rem) {
		.slides {
			gap: 1.5rem;
		}

		/* At the width of a phone the whole board is too small to read, so it keeps a
		   readable size and scrolls sideways in its frame */
		.board {
			overflow-x: auto;
			overscroll-behavior-x: contain;
		}

		.board img {
			width: 900px;
			max-width: none;
		}

		.hint {
			display: block;
			margin-bottom: -1rem;
		}
	}
</style>
