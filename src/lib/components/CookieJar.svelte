<script>
	// The cookie jar from Figma (Cookie Jar simplified.svg). Visitors take cookies by clicking them.
	// Just for fun: nothing is saved and no data is collected.

	// Each cookie: its biscuit shape, then its chocolate chips.
	// Each shape is [x, y, width, height, rotation], copied from the Figma export.
	const cookies = [
		{
			body: [92.7, 195.14, 31.47, 10.99, 'rotate(-8.78 92.7 195.14)'],
			chips: [
				[68.2, 196.91, 2, 1.5, 'rotate(-8.78 68.2 196.91)'],
				[80.13, 202.14, 2, 1.5, 'rotate(-8.78 80.13 202.14)'],
				[105.38, 192.17, 2, 1.5, 'rotate(-8.78 105.38 192.17)'],
				[122.75, 188.47, 1.25, 1, 'rotate(-8.78 122.75 188.47)'],
				[76.63, 187.91, 2.25, 1.5, 'rotate(75.53 76.63 187.91)'],
				[92.08, 191.19, 1.5, 1, 'rotate(-8.78 92.08 191.19)'],
				[95.97, 182, 1.75, 1.5, 'rotate(-8.78 95.97 182)'],
				[114.53, 183.19, 2.25, 1, 'rotate(5.22 114.53 183.19)']
			]
		},
		{
			body: [42.62, 179.66, 31.47, 15.03, 'rotate(-8.78 42.62 179.66)'],
			chips: [
				[18.01, 180.7, 2, 2.05, 'rotate(-8.78 18.01 180.7)'],
				[30.33, 188.47, 2, 2.05, 'rotate(-8.78 30.33 188.47)'],
				[55.25, 176.32, 2, 2.05, 'rotate(-8.78 55.25 176.32)'],
				[72.57, 172.27, 1.25, 1.37, 'rotate(-8.78 72.57 172.27)'],
				[1.81, 1.51, 1.81, 1.51, 'matrix(0.22 0.97 -0.96 0.28 26.37 166.44)'],
				[38.16, 175.51, 1.5, 1.37, 'rotate(-8.78 38.16 175.51)'],
				[64.2, 182.66, 0.62, 0.88, 'rotate(-8.78 64.2 182.66)'],
				[44.01, 163.74, 1.75, 2.05, 'rotate(-8.78 44.01 163.74)'],
				[2.3, 1.35, 2.3, 1.35, 'matrix(0.98 0.17 -0.03 1 61.75 162.88)']
			]
		},
		{
			body: [113.44, 146.28, 29.86, 12.19, 'rotate(-71.45 113.44 146.28)'],
			chips: [
				[103.95, 167.59, 1.9, 1.66, 'rotate(-71.45 103.95 167.59)'],
				[114.62, 160.17, 1.9, 1.66, 'rotate(-71.45 114.62 160.17)'],
				[116.31, 134.24, 1.9, 1.66, 'rotate(-71.45 116.31 134.24)'],
				[120.61, 117.94, 1.18, 1.11, 'rotate(-71.45 120.61 117.94)'],
				[1.47, 1.42, 1.47, 1.42, 'matrix(0.97 0.24 -0.21 0.98 97.25 154.89)'],
				[108.63, 148.44, 1.42, 1.11, 'rotate(-71.45 108.63 148.44)'],
				[123.81, 143.31, 1.42, 1.11, 'rotate(-71.45 123.81 143.31)'],
				[124.55, 129.12, 0.59, 0.71, 'rotate(-71.45 124.55 129.12)'],
				[102.65, 138.85, 1.66, 1.66, 'rotate(-71.45 102.65 138.85)'],
				[2.16, 1.1, 2.16, 1.1, 'matrix(0.57 -0.82 0.86 0.51 109.41 123.44)']
			]
		},
		{
			body: [28.13, 133.12, 29.86, 12.19, 'rotate(54.93 28.13 133.12)'],
			chips: [
				[16.61, 112.84, 1.9, 1.66, 'rotate(54.93 16.61 112.84)'],
				[16.25, 125.83, 1.9, 1.66, 'rotate(54.93 16.25 125.83)'],
				[36.12, 142.57, 1.9, 1.66, 'rotate(54.93 36.12 142.57)'],
				[1.47, 1.42, 1.47, 1.42, 'matrix(-0.77 0.64 -0.67 -0.75 30.8 114.97)'],
				[29.25, 127.97, 1.42, 1.11, 'rotate(54.93 29.25 127.97)'],
				[35.35, 152.25, 0.59, 0.71, 'rotate(54.93 35.35 152.25)'],
				[40.51, 128.84, 1.66, 1.66, 'rotate(54.93 40.51 128.84)'],
				[2.16, 1.1, 2.16, 1.1, 'matrix(0.32 0.95 -0.92 0.39 48.91 143.42)']
			]
		},
		{
			body: [72.3, 146.05, 32.99, 12.19, 'rotate(54.93 72.3 146.05)'],
			chips: [
				[59.38, 123.78, 2.09, 1.66, 'rotate(54.93 59.38 123.78)'],
				[59.64, 137.66, 2.09, 1.66, 'rotate(54.93 59.64 137.66)'],
				[81.03, 156.56, 2.09, 1.66, 'rotate(54.93 81.03 156.56)'],
				[1.47, 1.57, 1.47, 1.57, 'matrix(-0.76 0.65 -0.66 -0.75 74.17 126.76)'],
				[73.2, 140.59, 1.57, 1.11, 'rotate(54.93 73.2 140.59)'],
				[80.71, 166.87, 0.65, 0.71, 'rotate(54.93 80.71 166.87)'],
				[84.9, 142.08, 1.83, 1.66, 'rotate(54.93 84.9 142.08)'],
				[2.36, 1.1, 2.36, 1.1, 'matrix(0.35 0.94 -0.93 0.37 94.3 158.1)']
			]
		},
		{
			body: [84.97, 104.11, 32.99, 7.61, 'rotate(-3.89 84.97 104.11)'],
			chips: [
				[59.28, 104.47, 2.09, 1.04, 'rotate(-3.89 59.28 104.47)'],
				[71.1, 108.52, 2.09, 1.04, 'rotate(-3.89 71.1 108.52)'],
				[98.51, 102.5, 2.09, 1.04, 'rotate(-3.89 98.51 102.5)'],
				[0.93, 1.57, 0.93, 1.57, 'matrix(0.22 0.98 -0.99 0.13 69.76 97.26)'],
				[80.87, 101.97, 1.57, 0.69, 'rotate(-3.89 80.87 101.97)'],
				[107.01, 105.79, 0.65, 0.44, 'rotate(-3.89 107.01 105.79)'],
				[88.42, 96, 1.83, 1.04, 'rotate(-3.89 88.42 96)'],
				[2.32, 0.72, 2.32, 0.72, 'matrix(1 0.1 -0.29 0.96 106.95 95.68)']
			]
		}
	];

	// Shown one at a time when a cookie is taken. Edit freely.
	const messages = [
		'Cookie taken! 🍪 The only tracking here is crumbs.',
		'Enjoy! No data was harmed in the making of this cookie.',
		'Yum. Zero calories, zero cookies stored on your device.',
		'Take one, no consent form required.',
		'Freshly baked, never tracked.'
	];

	const hintText = 'Psst, take a cookie 🍪';
	const emptyText = 'The jar’s empty. Thanks for visiting!';

	// Which cookies have been taken
	let taken = $state(cookies.map(() => false));
	let message = $state('');
	let timer;

	const empty = $derived(taken.every(Boolean));

	function take(i) {
		if (taken[i]) return;
		taken[i] = true;
		message = messages[Math.floor(Math.random() * messages.length)];
		clearTimeout(timer);
		timer = setTimeout(() => (message = ''), 2200);
	}

	function refill() {
		taken = cookies.map(() => false);
		message = '';
	}
</script>

<div class="cookie-jar">
	<div class="note">
		<p class="hint">
			{#if empty}{emptyText}{:else}{hintText}<br /><span>(no data collected, pinkie promise)</span>{/if}
		</p>
		<svg class="arrow" viewBox="0 0 54 70" aria-hidden="true">
			<path d="M4 4C4 30 10 52 46 62" stroke-dasharray="1 7" />
			<path d="M34 58L47 63.5L41.5 50" />
		</svg>
	</div>

	<div class="jar-wrap">
		<svg class="jar" viewBox="0 0 135 218" role="img" aria-label="A jar of cookies">
			<defs>
				<!-- One soft shadow shared by every chip (Figma exported 45 copies of it) -->
				<filter id="chip-shadow" x="-50%" y="-50%" width="200%" height="200%">
					<feDropShadow dx="0" dy="0.5" stdDeviation="0" flood-color="#000" flood-opacity="0.08" />
				</filter>
			</defs>

			<!-- Jar -->
			<path
				class="body"
				d="M23.2314 73.7162V62.9498H16.7366C14.5293 62.9498 12.7398 61.1604 12.7398 58.953V55.4558C12.7398 53.2484 14.5293 51.459 16.7366 51.459H121.653C123.86 51.459 125.65 53.2484 125.65 55.4558V58.953C125.65 61.1604 123.86 62.9498 121.653 62.9498H113.41V73.6912C113.41 74.7949 114.304 75.6897 115.408 75.6897H116.657C126.59 75.6897 134.643 83.7421 134.643 93.6753V199.341C134.643 209.274 126.59 217.327 116.657 217.327H21.4828C11.5496 217.327 3.49719 209.274 3.49719 199.341V93.4505C3.49719 83.6414 11.449 75.6897 21.258 75.6897C22.3479 75.6897 23.2314 74.8061 23.2314 73.7162Z"
			/>
			<path
				class="shine"
				d="M21.4828 96.6273C21.4828 95.3928 21.7069 92.3346 22.8081 90.3512C24.1888 87.8645 28.4958 86.8362 31.5974 86.4695C32.958 86.3085 34.9145 85.9363 39.7073 85.7631C44.5002 85.5899 52.0651 85.5899 56.4665 85.5338C60.8679 85.4778 61.8765 85.3657 62.8444 85.308C63.8123 85.2502 64.7089 85.2502 72.0913 85.0821C79.4737 84.914 93.3146 84.5778 100.557 84.4326C108.478 84.4572 109.158 84.6831 109.721 84.8529C110.061 84.9106 110.509 84.9106 110.971 84.9106"
			/>

			<!-- Lid: lifts a little when you hover the jar -->
			<g class="lid">
				<path
					class="knob"
					d="M110.662 50.7095V32.9737C110.662 32.4218 110.214 31.9745 109.663 31.9745H72.4423C88.4295 29.7263 89.9297 1.49876 67.6961 1.49878C46.9626 1.4988 47.9618 28.9769 63.4495 31.9745H28.4774C27.9255 31.9745 27.4781 32.4218 27.4781 32.9737V50.7095C27.4781 51.2614 27.9255 51.7087 28.4774 51.7087H35.9714H101.419H109.663C110.214 51.7087 110.662 51.2614 110.662 50.7095Z"
				/>
			</g>
			<rect class="collar" x="35" y="52" width="67" height="17" />

			<!-- Cookies -->
			{#each cookies as cookie, i}
				{#if !taken[i]}
					<g
						class="cookie"
						role="button"
						tabindex="0"
						aria-label="Take a cookie"
						onclick={() => take(i)}
						onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), take(i))}
					>
						{@render oval(cookie.body, 'biscuit')}
						<g filter="url(#chip-shadow)">
							{#each cookie.chips as chip}
								{@render oval(chip, 'chip')}
							{/each}
						</g>
					</g>
				{/if}
			{/each}
		</svg>

		{#if empty}
			<button class="refill" type="button" onclick={refill}>Refill the jar</button>
		{/if}
	</div>

	<p class="toast" class:visible={message} role="status" aria-live="polite">{message}</p>
</div>

{#snippet oval([cx, cy, rx, ry, transform], kind)}
	<ellipse class={kind} {cx} {cy} {rx} {ry} {transform} />
{/snippet}

<style>
	.cookie-jar {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: flex-end;
		gap: 0.5rem;
	}

	.note {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		margin-bottom: 3.5rem;
	}

	.hint {
		margin: 0;
		max-width: 13rem;
		text-align: right;
		font-size: 0.95rem;
		line-height: 1.35;
	}

	.hint span {
		color: var(--muted);
		font-size: 0.85rem;
	}

	.arrow {
		width: 54px;
		height: 70px;
		margin-right: -0.5rem;
		fill: none;
		stroke: var(--line);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.jar-wrap {
		position: relative;
		width: 135px;
	}

	.jar {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}

	/* Colours straight from the Figma file */
	.body {
		fill: #f3dd57;
	}

	.shine {
		fill: none;
		stroke: #f9ea8d;
		stroke-width: 3;
		stroke-linecap: round;
	}

	.knob {
		fill: #ff00b3;
	}

	.collar {
		fill: #fd82b8;
		stroke: #fd82b8;
		stroke-width: 1.5;
	}

	.biscuit {
		fill: #dda751;
		stroke: #dda751;
		stroke-width: 2;
	}

	.chip {
		fill: #6f510e;
		stroke: #6f510e;
		stroke-width: 1;
	}

	.lid {
		transition: transform 0.25s ease;
	}

	.jar-wrap:hover .lid {
		transform: translateY(-6px);
	}

	.cookie {
		cursor: pointer;
		outline: none;
		transition: filter 0.15s ease;
	}

	.cookie:hover,
	.cookie:focus-visible {
		filter: brightness(1.08) drop-shadow(0 0 2px rgba(0, 0, 0, 0.25));
	}

	.refill {
		position: absolute;
		left: 50%;
		bottom: 2.5rem;
		transform: translateX(-50%);
		white-space: nowrap;
		font: inherit;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--text);
		padding: 0.4rem 0.7rem;
		background: var(--card);
		border: 0;
		border-radius: 6px;
		box-shadow: var(--shadow);
		cursor: pointer;
	}

	.toast {
		position: absolute;
		left: 50%;
		top: -2.5rem;
		transform: translate(-50%, 0.5rem);
		margin: 0;
		padding: 0.5rem 0.9rem;
		background: var(--text);
		color: var(--bg);
		border-radius: 6px;
		font-size: 0.9rem;
		white-space: nowrap;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.2s ease, transform 0.2s ease;
	}

	.toast.visible {
		opacity: 1;
		transform: translate(-50%, 0);
	}

	@media (max-width: 48rem) {
		.note {
			margin-bottom: 2.5rem;
		}

		.hint {
			max-width: 9rem;
			font-size: 0.85rem;
		}

		.toast {
			white-space: normal;
			width: max-content;
			max-width: 90vw;
			text-align: center;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.lid,
		.toast {
			transition: none;
		}

		.jar-wrap:hover .lid {
			transform: none;
		}
	}
</style>
