<script module>
	// A title without its *stars* and ^carets^, for labels that screen readers read out.
	// A raised word becomes a word of its own: 'Tooltip^tooltip^' reads "Tooltip tooltip".
	export const plain = (title = '') => title.replace(/\^([^^]+)\^/g, ' $1').replace(/\*/g, '');
</script>

<script>
	// Shows a project title, with any *starred* words in italics and any ^careted^ words raised
	// small, like a superscript
	let { text = '' } = $props();

	const parts = $derived(
		text.split(/(\*[^*]+\*|\^[^^]+\^)/).filter(Boolean).map((part) => ({
			italic: part.startsWith('*') && part.endsWith('*'),
			raised: part.startsWith('^') && part.endsWith('^'),
			words: part.replace(/[*^]/g, '')
		}))
	);
</script>

{#each parts as part}{#if part.italic}<em>{part.words}</em>{:else if part.raised}<sup>{part.words}</sup>{:else}{part.words}{/if}{/each}

<style>
	/* Raised small without pushing the line apart */
	sup {
		font-size: 0.6em;
		line-height: 0;
		vertical-align: 0.75em;
	}
</style>
