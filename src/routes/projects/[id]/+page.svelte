<script>
	// A project's case study: back to Projects, the title and its line, the details between two
	// lines, then the parts (headings, text, pictures two by two), its links, and the next project.
	// Everything here comes from the project's caseStudy in src/lib/tinkerings.js.
	import Arrow from '$lib/components/Arrow.svelte';
	import Media from '$lib/components/Media.svelte';
	import Title, { plain } from '$lib/components/Title.svelte';
	import { behanceLink } from '$lib/links.js';

	let { data } = $props();

	const study = $derived(data.project.caseStudy);

	// Where "Next project" goes: its own case study, its Behance page, or its popup on Projects
	const nextHref = $derived(
		data.next.caseStudy
			? `/projects/${data.next.id}`
			: data.next.behance
				? data.next.behance.startsWith('http')
					? data.next.behance
					: behanceLink
				: `/projects?project=${data.next.id}`
	);
	const nextOutside = $derived(!data.next.caseStudy && !!data.next.behance);
	const outside = (href) => /^https?:/.test(href);
</script>

<svelte:head>
	<title>{plain(data.project.title)} · shivanigans</title>
	{#if study.intro}<meta name="description" content={study.intro} />{/if}
</svelte:head>

<article>
	<a class="back" href="/projects"><Arrow dir="left" /> Projects</a>

	<h1><Title text={data.project.title} /></h1>
	{#if study.intro}<p class="intro">{study.intro}</p>{/if}

	{#if study.details?.length}
		<dl class="details">
			{#each study.details as row}
				<div>
					<dt>{row.label}</dt>
					<dd>{row.value}</dd>
				</div>
			{/each}
		</dl>
	{/if}

	{#each study.parts ?? [] as part}
		<section class="part">
			{#if part.heading}<h2>{part.heading}</h2>{/if}

			{#each part.text ?? [] as paragraph}
				<p class="text">{paragraph}</p>
			{/each}

			{#if part.images?.length}
				<figure>
					<!-- Always two side by side, never one across the full width -->
					<div class="pair">
						{#each part.images as image}
							<div class="pic">
								<Media src={image.src ?? ''} alt={image.alt ?? ''} />
							</div>
						{/each}
					</div>
					{#if part.caption}<figcaption>{part.caption}</figcaption>{/if}
				</figure>
			{/if}
		</section>
	{/each}

	{#if study.links?.length}
		<p class="links">
			{#each study.links as link}
				<a href={link.href} target={outside(link.href) ? '_blank' : undefined} rel={outside(link.href) ? 'noopener' : undefined}>
					{link.label} <Arrow dir={outside(link.href) ? 'out' : 'right'} />
				</a>
			{/each}
		</p>
	{/if}

	<nav class="next" aria-label="Next project">
		<span class="next-label">Next project</span>
		<a href={nextHref} target={nextOutside ? '_blank' : undefined} rel={nextOutside ? 'noopener' : undefined}>
			<Title text={data.next.title} />
			<Arrow dir={nextOutside ? 'out' : 'right'} />
		</a>
	</nav>
</article>

<style>
	/* "← Projects": deep pink, small */
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
		margin-bottom: 1rem;
	}

	.intro {
		max-width: 46ch;
		margin: 0;
		font-size: var(--type-body);
	}

	/* Role, Type, Data, Status: between two lines, the label in grey */
	.details {
		display: grid;
		gap: 0.3rem;
		margin: 1.5rem 0 0;
		padding: 1rem 0;
		border-block: 1px solid var(--line);
		font-size: var(--type-meta);
	}

	.details div {
		display: grid;
		grid-template-columns: 8rem minmax(0, 1fr);
		gap: 1rem;
	}

	.details dt {
		color: var(--muted);
	}

	.details dd {
		margin: 0;
	}

	.part {
		margin-top: 3.5rem;
	}

	.part:first-of-type {
		margin-top: 1.5rem;
	}

	h2 {
		margin-bottom: 0.75rem;
	}

	.text {
		max-width: 52ch;
		margin: 0;
		font-size: var(--type-label);
	}

	.text + .text {
		margin-top: 0.85rem;
	}

	figure {
		margin: 0;
	}

	.text + figure {
		margin-top: 1.25rem;
	}

	/* Pictures in pairs, 16px apart, cropped to the same shape */
	.pair {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}

	.pic {
		aspect-ratio: 4 / 3;
		overflow: hidden;
		background: var(--greige);
	}

	.pic :global(img),
	.pic :global(video),
	.pic :global(.placeholder) {
		width: 100%;
		height: 100%;
		aspect-ratio: auto;
		object-fit: cover;
	}

	figcaption {
		margin-top: 0.5rem;
		font-size: var(--type-meta);
		color: var(--muted);
	}

	/* The links at the end: underlined, side by side */
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

	/* "Next project" on the left, its name in National Park on the right, a line above */
	.next {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 3.5rem;
		padding-top: 2.5rem;
		border-top: 1px solid var(--text);
	}

	.next-label {
		font-size: var(--type-meta);
		color: var(--muted);
	}

	.next a {
		display: inline-flex;
		align-items: center;
		gap: 0.3em;
		font-family: var(--display);
		font-size: var(--type-section);
		font-weight: 600;
		letter-spacing: var(--display-spacing);
		text-decoration: none;
	}

	a:focus-visible {
		outline: 2px solid var(--text);
		outline-offset: 3px;
	}

	@media (max-width: 40rem) {
		.pair {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
