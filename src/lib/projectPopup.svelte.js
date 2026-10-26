// The project popup's comings and goings, shared by the Tinkering matrix, the home page
// and the Projects page.
// Each open project gets its own address, e.g. /tinkering?project=walks-from-life, so a link
// to it opens the popup straight away, and the browser's back and forward buttons close
// and reopen it.
//
// Make one while a component is starting up:
//   const projects = new ProjectPopup(() => items, (id) => the card button for that project);
import { onMount, tick, untrack } from 'svelte';
import { page } from '$app/state';
import { pushState, replaceState } from '$app/navigation';
import { popup } from '$lib/popup.svelte.js';

export class ProjectPopup {
	current = $state(null); // the project showing in the popup, or null when closed
	panel = $state(); // the popup itself, so it can be asked to close

	#items;
	#cardOf;

	constructor(items, cardOf) {
		this.#items = items;
		this.#cardOf = cardOf;

		// Let the side panel know, so it steps out of the way while the popup is open
		$effect(() => {
			popup.open = !!this.current;
			return () => (popup.open = false);
		});

		// Opening a link straight to a project, e.g. one someone shared
		onMount(() => {
			const id = new URLSearchParams(location.search).get('project');
			const item = this.#items().find((t) => t.id === id);
			if (item) this.current = item;
		});

		// Browser back and forward buttons. Only reacts when the address actually changes.
		let lastState;
		$effect(() => {
			const id = page.state.project;
			if (id === lastState) return;
			lastState = id;
			untrack(() => {
				if (!id && this.current && this.panel) this.panel.close();
				if (id && !this.current) this.current = this.#items().find((t) => t.id === id) ?? null;
			});
		});
	}

	open = (item) => {
		this.current = item;
		pushState(withProject(item.id), { project: item.id });
	};

	// Where the open project sits in the list, e.g. '2 / 8'
	get position() {
		const items = this.#items();
		return this.current ? `${items.findIndex((t) => t.id === this.current.id) + 1} / ${items.length}` : '';
	}

	// Moves the open popup to the next project (1) or the one before (-1), round the ends.
	// The address follows, without adding to the back button's history.
	step = (dir) => {
		const items = this.#items();
		const at = items.findIndex((t) => t.id === this.current?.id);
		if (at < 0) return;
		const item = items[(at + dir + items.length) % items.length];
		this.current = item;
		// Only mark the address as ours if opening the popup added it, so closing still knows
		// whether to step back or just tidy the address
		replaceState(withProject(item.id), page.state.project ? { project: item.id } : {});
	};

	// Runs after the popup has shrunk back into its card
	closed = async () => {
		const id = this.current.id;
		this.current = null;
		// Tidy the address: step back if we added it, otherwise just clear it
		if (page.state.project) history.back();
		else replaceState(withProject(null), {});
		// Wait until the page behind is clickable again, then put focus back on the card
		await tick();
		this.#cardOf(id)?.focus({ preventScroll: true });
	};

	// The card's picture, which the popup grows out of and shrinks back into
	thumbOf = (id) => this.#cardOf(id)?.querySelector('.thumb');
}

// This page's address with ?project= set to id (or taken off for null), keeping anything else
// already there, like the Projects page's ?tag=
function withProject(id) {
	const params = new URLSearchParams(location.search);
	if (id) params.set('project', id);
	else params.delete('project');
	const query = params.toString();
	return location.pathname + (query ? `?${query}` : '');
}
