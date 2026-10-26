<script>
	// Tinkering: a canvas that fills the screen, with your projects on a 2x2 matrix. The top bar
	// (logo, tabs and Resume) floats on top, from src/routes/+layout.svelte.
	// All project content and positions live in src/lib/tinkerings.js, not here.
	// The canvas and its popup are in src/lib/components/ProjectMatrix.svelte.
	import ChaosCorner from '$lib/components/ChaosCorner.svelte';
	import ProjectMatrix from '$lib/components/ProjectMatrix.svelte';

	let { data } = $props();

	let matrix;
</script>

<svelte:head>
	<title>Tinkering · shivanigans</title>
</svelte:head>

<!-- The canvas speaks for itself, so the page's name is there for screen readers only -->
<h1 class="visually-hidden">Tinkering</h1>

<ProjectMatrix items={data.tinkerings} bind:this={matrix} />

<!-- The reward for scrolling: after about two scrolls, a page corner curls up and leads to chaos mode.
     Leaving chaos mode takes you back to the start of the canvas. -->
<ChaosCorner onclosed={() => matrix?.reset()} />
