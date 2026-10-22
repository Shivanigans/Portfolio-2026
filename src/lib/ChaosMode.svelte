<script>
	// Chaos mode: the hypnosis easter egg, moved here from hypnosis-easter-egg.html.
	// It plays as soon as it appears: the spiral draws out, the trance lines surface word by word
	// with their chimes over a low hum, the spiral slows to a stop, and *snap*: the ending screen
	// with the contact and resume buttons.
	//
	// It's only loaded when the page corner on Tinkerings is pressed (src/lib/components/ChaosCorner.svelte).
	// Its colours, fonts and styles stay inside this file and never touch the rest of the site.
	//
	// audio:   the browser's sound engine, switched on by that press (browsers only allow sound after a tap)
	// onclose: called when it should go away (Esc, or "pretend this never happened")
	//
	// Recording mode: add #record to the page address before opening it. It switches off the
	// heaviest effects so screen recorders get smooth motion.
	import { onMount, tick } from 'svelte';
	import { emailLink, resumeLink } from '$lib/links.js';

	let { audio, onclose } = $props();

	/* ---------- The script, written the way it should be said ----------
	   CHANGE these lines freely.
	     |      a pause, like taking a breath (not shown on screen)
	     ||     a longer pause
	     *word* a stressed word: lingers longer, with a deeper chime (looks the same)
	*/
	const lines = [
		'you are || getting | very || *sleepy*',
		'you want | to give me || a *job*',
		'you want | to *employ* me',
		"you've already | drafted || the *offer* *letter*"
	];

	/* ---------- Pacing (all in milliseconds) ---------- */
	const DRAW_TIME = 5000; // how long the spiral arms take to reach the edges
	const FIRST_LINE = 4600; // when the first word appears
	const WORD = 240; // time for an ordinary word
	const PER_LETTER = 22; // extra time for longer words
	const STRESS = 380; // extra time a stressed word lingers
	const PAUSE = 420; // a "|" pause
	const LONG_PAUSE = 850; // a "||" pause
	const HOLD = 1200; // how long a finished line rests before it fades
	const FADE = 700; // the fade between lines
	const LAST_HOLD = 1800; // how long the last line rests before the spiral stops
	const STOP_TIME = 1400; // how long the spiral takes to slow to a stop
	const STILL = 700; // the moment of stillness before the *snap*

	/* ---------- Spiral ---------- */
	// The spiral is drawn by a small WebGL "shader": a program that runs on the graphics card
	// and decides the colour of every pixel at once, which keeps the motion smooth.
	const MAX_TURN = 10 * Math.PI; // how far out the arms travel (five full turns)
	const SPIN = 0.0005; // starting turn speed (lower = slower)
	const SPIN_BUILD = 2; // how much faster it turns by the last line (0 = steady)

	/* ---------- Sound ---------- */
	const HUM_VOLUME = 0.09; // CHANGE: loudness of the hypnotic hum (0 to about 0.2)
	const CHIME_VOLUME = 0.03; // CHANGE: loudness of the soft chime on each word (0 turns it off)
	const SNAP_VOLUME = 0.9; // CHANGE: loudness of the finger snap

	const FRAGMENT = `
    precision highp float;
    uniform vec2 uRes;
    uniform float uReach;   // how far along the arms have been drawn
    uniform float uRot;     // current rotation
    uniform float uTime;
    uniform float uDim;     // darkens the centre behind the text (0 to 1)
    const float PI = 3.14159265;
    const float START_R = 4.0;   // radius at the very centre
    const float GROWTH = 0.165;  // how quickly the arms widen as they turn
    const float SOFT = 0.09;     // softness of the arm edges (bigger = more blended)
    const vec3 BLUE = vec3(0.122, 0.357, 0.941);   // VHS blue arms
    const vec3 DEEP = vec3(0.05, 0.16, 0.58);      // deeper blue on their inner edge

    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

    void main() {
      vec2 uv = gl_FragCoord.xy / uRes;
      vec3 bg = mix(vec3(0.039, 0.102, 0.333), vec3(0.008, 0.024, 0.094), smoothstep(0.0, 0.8, length(uv - 0.5) * 1.3));

      vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / (max(uRes.x, uRes.y) / 700.0);
      float r = length(p);
      float a = atan(p.y, p.x) - uRot;

      float t = log(max(r, 0.001) / START_R) / GROWTH;
      float w = mod(t - a, PI);
      float band = smoothstep(0.0, SOFT, w) * (1.0 - smoothstep(PI * 0.5 - SOFT, PI * 0.5, w));
      float along = t - w;
      float ahead = uReach - along;
      float drawn = smoothstep(0.0, 0.35, ahead) * smoothstep(-1.5, 0.5, t);

      vec3 colour = mix(DEEP, BLUE, smoothstep(0.0, PI * 0.35, w));
      float tip = band * exp(-max(ahead, 0.0) * 2.2) * smoothstep(-0.3, 0.0, ahead) * step(along, uReach + 0.3);
      colour += vec3(0.75, 0.88, 1.0) * tip * 0.6;

      vec3 c = mix(bg, colour, band * max(drawn, tip) * 0.9);

      // a soft dark patch in the middle, wider than tall, so the text reads clearly
      vec2 q = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
      float patch = 1.0 - smoothstep(0.08, 0.5, length(q * vec2(0.7, 1.3)));
      c = mix(c, c * 0.35, patch * uDim);

      c += (hash(gl_FragCoord.xy + floor(uTime / 60.0)) - 0.5) * 0.1;
      gl_FragColor = vec4(c, 1.0);
    }`;

	const VERTEX = `attribute vec2 pos; void main() { gl_Position = vec4(pos, 0.0, 1.0); }`;

	const recording = location.hash === '#record';

	let root, canvas, text, contactLink;
	let awake = $state(false);
	let muted = $state(false);

	let timers = [];
	let frame = null;
	let buildEnd = 1;
	let stopAt = Infinity;
	let gl = null;
	let uniforms = null;

	/* Sets up WebGL once. If the browser can't do WebGL, the words still play on the dark background. */
	function setUpSpiral() {
		gl = canvas.getContext('webgl', { antialias: false });
		if (!gl) return;
		const compile = (type, src) => {
			const s = gl.createShader(type);
			gl.shaderSource(s, src);
			gl.compileShader(s);
			return s;
		};
		const program = gl.createProgram();
		gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
		gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
		gl.linkProgram(program);
		gl.useProgram(program);
		gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
		const loc = gl.getAttribLocation(program, 'pos');
		gl.enableVertexAttribArray(loc);
		gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
		uniforms = {};
		['uRes', 'uReach', 'uRot', 'uTime', 'uDim'].forEach((n) => (uniforms[n] = gl.getUniformLocation(program, n)));
	}

	function resize() {
		if (!gl) return;
		// in recording mode the spiral is drawn at standard resolution, which is much lighter
		const dpr = recording ? 1 : Math.min(2, window.devicePixelRatio || 1);
		canvas.width = window.innerWidth * dpr;
		canvas.height = window.innerHeight * dpr;
		gl.viewport(0, 0, canvas.width, canvas.height);
	}

	function render(reach, rotation, time, dim) {
		if (!gl) return;
		gl.uniform2f(uniforms.uRes, canvas.width, canvas.height);
		gl.uniform1f(uniforms.uReach, reach);
		gl.uniform1f(uniforms.uRot, rotation);
		gl.uniform1f(uniforms.uTime, time);
		gl.uniform1f(uniforms.uDim, dim);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
	}

	/* The spiral draws outward, turns (speeding up through the lines), then slows to a stop */
	function runSpiral() {
		resize();
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			render(MAX_TURN + 2, 0, 0, 1);
			return;
		}
		const start = performance.now();
		let last = start;
		let rotation = 0;
		function step(now) {
			const elapsed = now - start;
			const p = Math.min(1, elapsed / DRAW_TIME);
			const eased = p * p * (3 - 2 * p);
			const build = Math.max(0, Math.min(1, (elapsed - FIRST_LINE) / (buildEnd - FIRST_LINE)));
			// once it is time to stop, the speed eases down to nothing
			const s = Math.max(0, Math.min(1, (elapsed - stopAt) / STOP_TIME));
			const slow = 1 - s * s * (3 - 2 * s);
			rotation += (now - last) * SPIN * (1 + SPIN_BUILD * build * build) * slow;
			last = now;
			const dim = Math.max(0, Math.min(1, (elapsed - FIRST_LINE + 600) / 800));
			render((MAX_TURN + 2) * eased, rotation, elapsed, dim);
			frame = requestAnimationFrame(step);
		}
		frame = requestAnimationFrame(step);
	}

	function later(fn, ms) {
		timers.push(setTimeout(fn, ms));
	}

	/* ---------- Sound ----------
	   All sounds are made live in the browser (no audio files needed). */
	const sound = (() => {
		let ctx = null;
		let master = null;
		let hum = null;
		let quiet = false;

		// a low, slowly pulsing hum: a few tones slightly out of tune with each other
		function start() {
			ctx = ctx || audio || new (window.AudioContext || window.webkitAudioContext)();
			ctx.resume();
			master = ctx.createGain();
			master.gain.value = quiet ? 0 : 1;
			master.connect(ctx.destination);
			const now = ctx.currentTime;
			const filter = ctx.createBiquadFilter();
			filter.type = 'lowpass';
			filter.frequency.value = 420;
			filter.Q.value = 4;
			const wobble = ctx.createOscillator();
			const wobbleDepth = ctx.createGain();
			wobble.frequency.value = 0.18;
			wobbleDepth.gain.value = 180;
			wobble.connect(wobbleDepth).connect(filter.frequency);
			const level = ctx.createGain();
			level.gain.setValueAtTime(0, now);
			level.gain.linearRampToValueAtTime(HUM_VOLUME, now + 3);
			const tones = [55, 110, 110.7, 165.3].map((freq, i) => {
				const o = ctx.createOscillator();
				o.type = i === 0 ? 'sine' : 'triangle';
				o.frequency.value = freq;
				o.connect(filter);
				o.start();
				return o;
			});
			filter.connect(level).connect(master);
			wobble.start();
			hum = { tones, wobble, level };
		}

		// a soft chime as each word surfaces; stressed words get a lower, longer one
		function word(stressed) {
			if (!ctx || !CHIME_VOLUME) return;
			const now = ctx.currentTime;
			const o = ctx.createOscillator();
			const g = ctx.createGain();
			o.type = 'sine';
			o.frequency.value = stressed ? 523.25 : 783.99;
			g.gain.setValueAtTime(0, now);
			g.gain.linearRampToValueAtTime(stressed ? CHIME_VOLUME * 2 : CHIME_VOLUME, now + 0.02);
			g.gain.exponentialRampToValueAtTime(0.0001, now + (stressed ? 1.4 : 0.6));
			o.connect(g).connect(master);
			o.start(now);
			o.stop(now + 1.5);
		}

		// as the spiral slows, the hum sinks in pitch and fades, like a record winding down
		function windDown(seconds) {
			if (!hum) return;
			const now = ctx.currentTime;
			hum.tones.forEach((o) => {
				o.frequency.setValueAtTime(o.frequency.value, now);
				o.frequency.exponentialRampToValueAtTime(o.frequency.value * 0.5, now + seconds);
			});
			hum.level.gain.setValueAtTime(hum.level.gain.value, now);
			hum.level.gain.linearRampToValueAtTime(0, now + seconds + 0.3);
		}

		function stopHum() {
			if (!hum) return;
			const now = ctx.currentTime;
			const h = hum;
			h.level.gain.cancelScheduledValues(now);
			h.level.gain.setValueAtTime(h.level.gain.value, now);
			h.level.gain.linearRampToValueAtTime(0, now + 0.05);
			setTimeout(() => {
				h.tones.forEach((o) => o.stop());
				h.wobble.stop();
			}, 200);
			hum = null;
		}

		// a finger snap: a very short burst of noise, plus a tiny thump
		function snap() {
			if (!ctx) return;
			stopHum();
			const now = ctx.currentTime;
			const length = Math.floor(ctx.sampleRate * 0.06);
			const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
			const data = buffer.getChannelData(0);
			for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 6);
			const burst = ctx.createBufferSource();
			const tone = ctx.createBiquadFilter();
			const g = ctx.createGain();
			burst.buffer = buffer;
			tone.type = 'bandpass';
			tone.frequency.value = 2200;
			tone.Q.value = 0.9;
			g.gain.value = SNAP_VOLUME;
			burst.connect(tone).connect(g).connect(master);
			burst.start(now);
			const thump = ctx.createOscillator();
			const tg = ctx.createGain();
			thump.frequency.setValueAtTime(180, now);
			thump.frequency.exponentialRampToValueAtTime(60, now + 0.08);
			tg.gain.setValueAtTime(0.25, now);
			tg.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
			thump.connect(tg).connect(master);
			thump.start(now);
			thump.stop(now + 0.12);
		}

		function toggle() {
			quiet = !quiet;
			if (master && ctx) master.gain.setTargetAtTime(quiet ? 0 : 1, ctx.currentTime, 0.05);
			return quiet;
		}

		// once everything has gone quiet, switch the sound engine off
		function shutDown() {
			stopHum();
			const c = ctx;
			ctx = null;
			if (c) setTimeout(() => c.close?.(), 300);
		}

		return { start, word, windDown, snap, stop: stopHum, toggle, shutDown };
	})();

	/* Turns one written line into words with their timings */
	function readLine(line) {
		const words = [];
		let pauseBefore = 0;
		line.split(/\s+/).forEach((token) => {
			if (token === '|') {
				pauseBefore += PAUSE;
				return;
			}
			if (token === '||') {
				pauseBefore += LONG_PAUSE;
				return;
			}
			const stressed = /^\*.*\*$/.test(token);
			words.push({ word: token.replace(/\*/g, ''), stressed, pauseBefore });
			pauseBefore = 0;
		});
		return words;
	}

	function fillLine(words) {
		text.innerHTML = '';
		words.forEach((w, i) => {
			if (i > 0) text.appendChild(document.createTextNode(' '));
			const span = document.createElement('span');
			span.className = 'word' + (w.stressed ? ' is-stressed' : '');
			span.textContent = w.word;
			text.appendChild(span);
		});
		return text.querySelectorAll('.word');
	}

	/* One type size for every line: the size that lets the longest line fit on one line */
	function setTypeSize() {
		const size = Math.min(window.innerWidth * 0.058, 62);
		text.style.fontSize = size + 'px';
		const room = Math.min(window.innerWidth * 0.86, window.innerWidth - 48);
		let widest = 0;
		lines.forEach((line) => {
			fillLine(readLine(line));
			widest = Math.max(widest, text.offsetWidth);
		});
		if (widest > room) text.style.fontSize = (size * room) / widest + 'px';
		text.innerHTML = '';
	}

	/* Plays every line in turn, word by word, at a spoken pace. Returns when the last word lands. */
	function playScript(startAt) {
		let clock = startAt;
		lines.forEach((line, index) => {
			const words = readLine(line);
			let spans = null;
			later(() => {
				spans = fillLine(words);
				text.classList.remove('is-leaving');
			}, clock);
			let t = clock + 50;
			words.forEach((w, i) => {
				t += w.pauseBefore;
				later(() => {
					if (spans) {
						spans[i].classList.add('is-on');
						sound.word(w.stressed);
					}
				}, t);
				t += WORD + w.word.length * PER_LETTER + (w.stressed ? STRESS : 0);
			});
			if (index < lines.length - 1) {
				later(() => text.classList.add('is-leaving'), t + HOLD);
				clock = t + HOLD + FADE;
			} else {
				clock = t;
			}
		});
		return clock;
	}

	function startTrance() {
		setTypeSize();
		sound.start();
		const lastWord = playScript(FIRST_LINE);
		buildEnd = lastWord;
		stopAt = lastWord + LAST_HOLD; // the spiral starts slowing after the last line has rested
		runSpiral();
		later(() => sound.windDown(STOP_TIME / 1000), stopAt);
		later(wakeUp, stopAt + STOP_TIME + STILL);
	}

	/* *snap*: the spiral and text vanish and the buttons appear */
	async function wakeUp() {
		timers.forEach(clearTimeout);
		timers = [];
		if (frame) cancelAnimationFrame(frame);
		frame = null;
		awake = true;
		sound.snap();
		// the skip button has gone, so keyboard focus moves to "contact me"
		await tick();
		contactLink?.focus({ preventScroll: true });
	}

	/* Stops everything: animation, timers and sound */
	function stopAll() {
		timers.forEach(clearTimeout);
		timers = [];
		if (frame) cancelAnimationFrame(frame);
		frame = null;
		stopAt = Infinity;
		sound.shutDown();
	}

	function toggleSound() {
		muted = sound.toggle();
	}

	// Esc closes it from anywhere. Tab stays inside it, going round its buttons.
	function onkeydown(e) {
		if (e.key === 'Escape') {
			e.preventDefault();
			onclose();
			return;
		}
		if (e.key !== 'Tab') return;
		const focusable = [...root.querySelectorAll('button, a[href]')].filter((el) => el.offsetParent !== null);
		if (!focusable.length) {
			e.preventDefault();
			return;
		}
		const first = focusable[0];
		const last = focusable[focusable.length - 1];
		const inside = root.contains(document.activeElement);
		if (e.shiftKey && (document.activeElement === first || !inside)) {
			e.preventDefault();
			last.focus();
		} else if (!e.shiftKey && (document.activeElement === last || !inside)) {
			e.preventDefault();
			first.focus();
		}
	}

	function onresize() {
		if (!awake) resize();
	}

	onMount(() => {
		// Lock the page behind, so only chaos mode is on screen
		const page = document.documentElement;
		const before = page.style.overflow;
		page.style.overflow = 'hidden';

		setUpSpiral();
		startTrance();
		root.focus({ preventScroll: true });

		return () => {
			stopAll();
			gl?.getExtension('WEBGL_lose_context')?.loseContext();
			page.style.overflow = before;
		};
	});
</script>

<svelte:head>
	<!-- VT323 is the pixel CRT font, DM Mono for small text. Only loaded while chaos mode is open. -->
	<link
		href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=VT323&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<svelte:window {onkeydown} {onresize} />

<div
	class="hypno"
	class:is-awake={awake}
	class:is-recording={recording}
	bind:this={root}
	role="dialog"
	aria-modal="true"
	aria-label="Chaos mode"
	tabindex="-1"
>
	<div class="trance">
		<canvas bind:this={canvas} aria-hidden="true"></canvas>
		<p class="trance-text" bind:this={text} aria-live="polite"></p>
	</div>

	<!-- The *snap* screen with the action buttons. Can't be tabbed into until it shows. -->
	<div class="wake" inert={!awake}>
		<h2>*snap*</h2>
		<p>Okay, you're back. Now, about the job.</p>
		<div class="actions">
			<a class="btn btn-contact" href={emailLink} target="_blank" rel="noopener" bind:this={contactLink}>contact me</a>
			<!-- Your resume is on Google Drive, so it opens there in a new tab -->
			<a class="btn btn-resume" href={resumeLink} target="_blank" rel="noopener">download resume</a>
		</div>
		<button type="button" class="close-link" onclick={onclose}>pretend this never happened</button>
	</div>

	<div class="grain" aria-hidden="true"></div>
	<button type="button" class="skip" onclick={wakeUp}>skip the trance</button>
	<button type="button" class="sound-toggle" aria-pressed={muted} onclick={toggleSound}>
		{muted ? 'sound off' : 'sound on'}
	</button>
</div>

<style>
	/* ---------- Colour palette, for chaos mode only ---------- */
	.hypno {
		--vhs: #1f5bf0; /* the retro VHS blue */
		--white: #f4f7ff;
		--navy: #0a1a55;
		--ink: #020618;
		--ice: #cfdcff;
		--tv-grey: #1a1b1f; /* the dark grey of the ending screen */
		--split-pink: rgba(255, 60, 190, 0.85); /* the colour fringes on the text */
		--split-cyan: rgba(0, 230, 255, 0.85);
	}

	.hypno,
	.hypno :global(*) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	/* ---------- Full-screen overlay ---------- */
	.hypno {
		position: fixed;
		inset: 0;
		z-index: 1000;
		overflow: hidden;
		display: block;
		font-family: 'DM Mono', monospace;
		background: radial-gradient(ellipse at center, var(--navy) 0%, var(--ink) 75%);
	}

	.hypno:focus {
		outline: none;
	}

	.trance {
		position: absolute;
		inset: 0;
		transition: opacity 0.5s ease;
	}

	.hypno.is-awake .trance {
		opacity: 0;
	}

	canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		display: block;
	}

	/* The trance lines: pixel text glowing in the middle of the spiral, all one size */
	.trance-text {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		white-space: nowrap;
		text-align: center;
		font-family: 'VT323', monospace;
		text-transform: uppercase;
		line-height: 1;
		letter-spacing: 0.03em;
		color: var(--white);
		/* pink and cyan fringes like a worn VHS tape, then a soft glow and dark halo so it reads over the arms */
		text-shadow:
			-3px 0 0 var(--split-pink),
			3px 0 0 var(--split-cyan),
			0 0 12px rgba(140, 180, 255, 0.7),
			0 0 22px rgba(2, 6, 24, 0.9),
			0 0 44px rgba(2, 6, 24, 0.8);
		transition: opacity 0.7s ease;
	}

	.trance-text:global(.is-leaving) {
		opacity: 0;
	}

	/* Each word surfaces slowly, out of a blur, like it is being said */
	.trance-text :global(.word) {
		display: inline-block;
		opacity: 0;
		filter: blur(8px);
		transition:
			opacity 1s ease,
			filter 1.1s ease;
	}

	.trance-text :global(.word.is-on) {
		opacity: 1;
		filter: blur(0);
	}

	/* ---------- Recording mode ----------
	   On with #record in the page address. It switches off the heaviest effects so screen
	   recorders get smooth motion: no blur on the words, no full-screen grain layer (the spiral
	   keeps its own grain), a lighter spiral, and no on-screen buttons during the trance. */
	.is-recording .trance-text :global(.word) {
		filter: none;
		transition: opacity 1s ease;
	}

	.is-recording .grain {
		display: none;
	}

	.is-recording .skip,
	.is-recording .sound-toggle {
		display: none;
	}

	.is-recording .trance-text {
		text-shadow:
			-3px 0 0 var(--split-pink),
			3px 0 0 var(--split-cyan),
			0 0 14px rgba(2, 6, 24, 0.9);
	}

	/* Stressed words look the same as the rest; they just linger longer (set in the script) */

	/* The *snap* screen, once the spiral has stopped */
	.wake {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 14px;
		padding: 16px;
		text-align: center;
		color: var(--white);
		background: var(--tv-grey);
		opacity: 0;
		pointer-events: none;
		overflow: hidden;
	}

	/* a little disturbance: scanlines, plus a faint tracking band rolling down the screen */
	.wake::before {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.035) 0 1px, transparent 1px 3px);
	}

	.wake::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		top: -20%;
		height: 14%;
		pointer-events: none;
		background: linear-gradient(
			180deg,
			transparent,
			rgba(255, 255, 255, 0.06) 45%,
			rgba(255, 255, 255, 0.1) 50%,
			rgba(255, 255, 255, 0.06) 55%,
			transparent
		);
		animation: tracking 5s linear infinite;
	}

	.wake > * {
		position: relative;
	}

	.hypno.is-awake .wake h2,
	.hypno.is-awake .wake p {
		animation: tape-skip 7s steps(1) infinite;
	}

	@keyframes tracking {
		from {
			transform: translateY(0);
		}
		to {
			transform: translateY(900%);
		}
	}

	/* every few seconds the text jumps a pixel or two, like a tape losing its place */
	@keyframes tape-skip {
		0%,
		91%,
		95%,
		100% {
			transform: translateX(0);
		}
		92% {
			transform: translateX(-3px);
		}
		93% {
			transform: translateX(2px) skewX(-2deg);
		}
		94% {
			transform: translateX(-1px);
		}
	}

	.hypno.is-awake .wake {
		opacity: 1;
		pointer-events: auto;
		animation: snap 0.3s ease-out;
	}

	@keyframes snap {
		0% {
			opacity: 0;
			filter: brightness(3);
		}
		100% {
			opacity: 1;
			filter: brightness(1);
		}
	}

	.wake h2 {
		font:
			400 clamp(4rem, 14vw, 8rem) / 0.9 'VT323',
			monospace;
		text-transform: uppercase;
		text-shadow:
			-3px 0 0 var(--split-pink),
			3px 0 0 var(--split-cyan),
			0 0 10px rgba(255, 255, 255, 0.8),
			0 0 30px rgba(170, 195, 255, 0.6),
			0 0 60px rgba(120, 160, 255, 0.4);
	}

	.wake p {
		font:
			400 clamp(1.4rem, 3.4vw, 1.9rem) / 1.1 'VT323',
			monospace;
		color: var(--white);
		text-shadow:
			-2px 0 0 var(--split-pink),
			2px 0 0 var(--split-cyan),
			0 0 8px rgba(255, 255, 255, 0.7),
			0 0 22px rgba(170, 195, 255, 0.45);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		justify-content: center;
		margin-top: 8px;
	}

	.btn {
		font:
			400 1.4rem 'VT323',
			monospace;
		text-transform: uppercase;
		text-decoration: none;
		padding: 8px 20px;
		border: 2px solid var(--white);
		transition:
			background 0.15s,
			color 0.15s;
	}

	.btn-contact {
		background: var(--white);
		color: var(--tv-grey);
		box-shadow: 0 0 18px rgba(200, 215, 255, 0.45);
	}

	.btn-contact:hover {
		background: transparent;
		color: var(--white);
	}

	.btn-resume {
		background: transparent;
		color: var(--white);
	}

	.btn-resume:hover {
		background: var(--white);
		color: var(--tv-grey);
	}

	.close-link {
		background: none;
		border: none;
		cursor: pointer;
		margin-top: 6px;
		font:
			400 0.8rem 'DM Mono',
			monospace;
		color: var(--white);
		text-decoration: underline;
		opacity: 0.8;
	}

	/* Keyboard focus shows clearly on the dark screens */
	.btn:focus-visible,
	.close-link:focus-visible,
	.skip:focus-visible,
	.sound-toggle:focus-visible {
		outline: 2px solid var(--white);
		outline-offset: 3px;
	}

	.skip {
		position: absolute;
		top: 16px;
		right: 16px;
		z-index: 5;
		font:
			500 0.75rem 'DM Mono',
			monospace;
		background: rgba(2, 6, 24, 0.5);
		color: var(--ice);
		border: 1px solid var(--ice);
		border-radius: 999px;
		padding: 6px 12px;
		cursor: pointer;
		opacity: 0.7;
	}

	.hypno.is-awake .skip {
		display: none;
	}

	/* Sound on/off, top left */
	.sound-toggle {
		position: absolute;
		top: 16px;
		left: 16px;
		z-index: 5;
		font:
			500 0.75rem 'DM Mono',
			monospace;
		background: rgba(2, 6, 24, 0.5);
		color: var(--ice);
		border: 1px solid var(--ice);
		border-radius: 999px;
		padding: 6px 12px;
		cursor: pointer;
		opacity: 0.7;
	}

	/* Grain: fine noise plus a faint woven texture */
	.grain {
		position: absolute;
		inset: -10%;
		z-index: 4;
		pointer-events: none;
		background-image:
			url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"),
			repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.05) 0 1px, transparent 1px 4px),
			repeating-linear-gradient(-45deg, rgba(0, 0, 0, 0.06) 0 1px, transparent 1px 4px);
		opacity: 0.75;
		mix-blend-mode: overlay;
		animation: jitter 0.5s steps(3) infinite;
	}

	@keyframes jitter {
		0% {
			transform: translate(0, 0);
		}
		33% {
			transform: translate(-2%, 1%);
		}
		66% {
			transform: translate(1%, -2%);
		}
	}

	/* People who turn off motion in their settings get a calm, still version */
	@media (prefers-reduced-motion: reduce) {
		.grain,
		.wake::after,
		.wake h2,
		.wake p {
			animation: none !important;
		}

		.trance-text :global(.word) {
			filter: none;
		}
	}
</style>
