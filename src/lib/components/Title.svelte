<script module>
	// A title without its *stars*, for labels that screen readers read out
	export const plain = (title = '') => title.replace(/\*/g, '');
</script>

<script>
	// Shows a project title, with any *starred* words in italics
	let { text = '' } = $props();

	const parts = $derived(
		text.split(/(\*[^*]+\*)/).filter(Boolean).map((part) => ({
			italic: part.startsWith('*') && part.endsWith('*'),
			words: part.replace(/\*/g, '')
		}))
	);
</script>

{#each parts as part}{#if part.italic}<em>{part.words}</em>{:else}{part.words}{/if}{/each}
