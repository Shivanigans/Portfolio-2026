// use:reveal — makes a piece of the page fade and slide up the first time it scrolls into view.
//
// How it works: when the page opens, it checks whether the piece is already on screen.
// If it is, it's left alone. If not, it's hidden 24px lower (the .waiting class in app.css),
// and the browser is asked to say when about 40% of it has come into view. At that moment
// the class comes off, the piece glides into place, and it stays there.
//
// Use it like this:  <h2 use:reveal>…</h2>
// To start a moment later, e.g. cards just after their heading:  <li use:reveal={0.1}>…</li>
// (the number is the delay in seconds)

export function reveal(node, delay = 0) {
	node.classList.add('reveal');

	// Already on screen when the page opens: show it straight away, no animation
	const box = node.getBoundingClientRect();
	if (box.top < innerHeight && box.bottom > 0) return;

	node.classList.add('waiting');
	if (delay) node.style.transitionDelay = `${delay}s`;

	const watcher = new IntersectionObserver(
		([entry]) => {
			// 40% of it in view, or for something taller than the screen, 40% of the screen filled
			const shown = entry.intersectionRatio >= 0.4 || entry.intersectionRect.height >= innerHeight * 0.4;
			if (!shown) return;
			node.classList.remove('waiting');
			watcher.disconnect();
		},
		{ threshold: [0, 0.1, 0.2, 0.3, 0.4] }
	);
	watcher.observe(node);

	// Once it has arrived, drop the delay so nothing else on it is held back
	// (only its own glide counts, not hover effects on things inside it)
	const arrived = (e) => {
		if (e.target !== node) return;
		node.style.transitionDelay = '';
		node.removeEventListener('transitionend', arrived);
	};
	node.addEventListener('transitionend', arrived);

	return { destroy: () => watcher.disconnect() };
}
