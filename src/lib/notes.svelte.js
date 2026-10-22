// The note in the margin, under the tabs.
// Each page sets its own in its +page.js, as `note`: a list of short paragraphs. A paragraph
// that starts with a symbol, like '↘ Every walk shares one scale', shows the symbol in pink.
// A page can swap its note while you're on it (Home does, as each section scrolls into view)
// by setting live.text here. It's cleared when you go to another page.
export const live = $state({ text: null });
