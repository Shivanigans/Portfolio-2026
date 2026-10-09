<script>
	// Shown when a page doesn't exist (404) or something goes wrong
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.status === 404 ? 'Page not found' : 'Something went wrong'} · Shivani Singh Ghoshi</title>
</svelte:head>

<h1>{page.status === 404 ? 'Page not found' : 'Something went wrong'}</h1>
<p><a href="/">Go back home</a></p>
