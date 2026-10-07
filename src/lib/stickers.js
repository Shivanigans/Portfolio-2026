// Your sticker images, in src/lib/assets/stickers. To swap one, replace the file
// and keep its name, or change the name below. If a file is missing,
// the yellow placeholder shows instead.
const files = import.meta.glob('/src/lib/assets/stickers/*.{png,svg,webp,jpg,jpeg,gif}', {
	eager: true,
	query: '?url',
	import: 'default'
});

const sticker = (name) =>
	Object.entries(files).find(([path]) => path.split('/').pop().split('.')[0] === name)?.[1];

export const logoImage = sticker('Shivanigans-icon');
// The logo split in two, so only the star spins and the face stays upright
export const logoStar = sticker('Shivanigans-star');
export const logoFace = sticker('Shivanigans-face');
export const awesomeImage = sticker('DFTBA-icon');
