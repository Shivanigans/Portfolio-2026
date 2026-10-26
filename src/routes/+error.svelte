<script>
	// Shown when a page doesn't exist (404) or something goes wrong. Each one says what happened
	// and gives a way on, so nobody is left at a dead end.
	import { page } from '$app/state';

	const missing = $derived(page.status === 404);
	const heading = $derived(missing ? 'Page not found' : 'Something went wrong');
</script>

<svelte:head>
	<title>{heading} · shivanigans</title>
</svelte:head>

<h1>{heading}</h1>

{#if missing}
	<p>This address doesn’t lead anywhere. The page may have moved, or the link may have a typo in it.</p>
{:else}
	<p>The page didn’t load. Reloading usually sorts it out.</p>
{/if}

<p class="ways">
	Try <a href="/">the home page</a>, <a href="/projects">the projects</a> or
	<a href="/blog">the blog</a>.
</p>

<style>
	.ways {
		margin-top: 0.75rem;
	}
</style>
