<script>
	// The foot of every page: your socials, then the live status line.
	// variant: 'table'   the socials as a table, a few words about each (Home, Projects, case studies, About)
	//          'compact' the socials on one line with pink stars between (not used at the moment)
	//          'bar'     one slim row: along the bottom of the Tinkering canvas, and at the foot of the blog
	import Arrow from '$lib/components/Arrow.svelte';
	import TabStatus from '$lib/TabStatus.svelte';
	import { socials } from '$lib/links.js';

	let { variant = 'table' } = $props();
</script>

{#snippet compact()}
	<p class="socials-line">
		{#each socials as social, i}
			{#if i}<span class="star" aria-hidden="true">✳</span>{/if}
			<a href={social.href} target="_blank" rel="noopener">{social.label} <Arrow dir="out" /></a>
		{/each}
	</p>
{/snippet}

<div class="footer {variant}">
	{#if variant === 'table'}
		<table class="socials">
			<tbody>
				{#each socials as social}
					<tr>
						<th scope="row">
							<a href={social.href} target="_blank" rel="noopener">{social.label} <Arrow dir="out" /></a>
						</th>
						<td>{social.about}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{:else}
		{@render compact()}
	{/if}

	<div class="status">
		<TabStatus />
	</div>
</div>

<style>
	.footer {
		margin-top: auto;
		padding-top: 5rem;
		font-size: var(--type-footer);
	}

	/* The socials table: name on the left, its few words in grey on the right, a line under each row.
	   The lines run the full width of the sheet. */
	.socials {
		width: 100%;
		border-collapse: collapse;
		border-top: 1px solid var(--line);
	}

	.socials tr {
		border-bottom: 1px solid var(--line);
	}

	.socials th,
	.socials td {
		padding: 0.75rem 0;
		text-align: left;
		font-weight: 400;
		vertical-align: baseline;
	}

	.socials th {
		width: 40%;
	}

	.socials td {
		color: var(--muted);
	}

	a {
		display: inline-flex;
		align-items: center;
		gap: 0.35em;
		text-decoration: none;
	}

	a:focus-visible {
		outline: 2px solid var(--text);
		outline-offset: 3px;
	}

	/* Behance ↗ ✳ Instagram ↗ ✳ LinkedIn ↗ */
	.socials-line {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.25rem 0.9rem;
		margin: 0;
	}

	/* The stars are decoration, so they can be the brighter pink */
	.star {
		color: var(--pink);
	}

	/* Space between the socials and the status line */
	.status {
		margin-top: 1.5rem;
	}

	/* The status line sits below the socials */
	.footer :global(footer.tab-status) {
		padding: 1.5rem 0 2.5rem;
	}

	/* Tinkering and the blog: everything on one slim row, on the desk colour, a line along its top.
	   Socials on the left, the status line on the right. 15px text. */
	.bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.3rem 2.5rem;
		padding: calc(0.45rem + 2.5px) 1.5rem; /* 5px taller in all: 2.5px more above and below */
		border-top: 1px solid var(--line);
		background: var(--desk);
		font-size: var(--type-footer);
	}

	.bar .status {
		margin: 0 0 0 auto;
		border: 0;
	}

	/* The status line on one row: its drawing a little over half size, then the words beside it */
	.bar :global(footer.tab-status) {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0;
		font-size: var(--type-footer);
	}

	.bar :global(footer.tab-status .art) {
		zoom: 0.6;
	}

	.bar :global(footer.tab-status .lines) {
		margin: 0;
	}
</style>
