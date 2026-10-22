---
name: Shivani Singh Ghoshi
description: The portfolio of a product designer who makes: a white sheet on a grey desk, with the logo, tabs and notes in the margin, and the work plotted on a canvas between hand-drawn and technical.
colors:
  paper: "#ffffff"
  desk: "#f6f6f6"
  greige: "#ece8e1"
  text: "#413c3c"
  muted: "color-mix(text 75%, paper)"
  line: "color-mix(text 16%, transparent)"
  sun: "#f9e278"
  brand-pink: "#e963a8"
  pink-deep: "#b8236f"
  pink-soft: "color-mix(brand-pink 30%, paper)"
  on-pink: "#160c28"
  status-green: "#4fbe00"
  status-online-bg: "color-mix(status-green 40%, paper)"
  chaos-vhs: "#1f5bf0"
  chaos-white: "#f4f7ff"
  chaos-navy: "#0a1a55"
  chaos-ink: "#020618"
  chaos-ice: "#cfdcff"
  chaos-tv-grey: "#1a1b1f"
  chaos-split-pink: "rgba(255, 60, 190, 0.85)"
  chaos-split-cyan: "rgba(0, 230, 255, 0.85)"
  chaos-glow: "rgba(200, 215, 255, 0.45)"
  quote-attribution: "#5a5a55"
  cookie-jar-body: "#f3dd57"
  cookie-jar-shine: "#f9ea8d"
  cookie-jar-knob: "#ff00b3"
  cookie-jar-collar: "#fd82b8"
  cookie-biscuit: "#dda751"
  cookie-chip: "#6f510e"
typography:
  title:
    fontFamily: "National Park, system-ui, sans-serif"
    fontSize: "4rem"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.02em"
  section:
    fontFamily: "National Park, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  card-title:
    fontFamily: "National Park, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 600
    letterSpacing: "-0.02em"
  closing-line:
    fontFamily: "National Park, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  notes-heading:
    fontFamily: "National Park, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
  blog-title:
    fontFamily: "Paper Mono, ui-monospace, monospace"
    fontSize: "3.25rem"
    fontWeight: 500
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Paper Mono, ui-monospace, monospace"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
  intro:
    fontFamily: "Paper Mono, ui-monospace, monospace"
    fontSize: "1rem"
    fontWeight: 400
  card-name:
    fontFamily: "Paper Mono, ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 500
  label:
    fontFamily: "Paper Mono, ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.55
  tab:
    fontFamily: "National Park, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    letterSpacing: "-0.02em"
    textTransform: "uppercase"
  meta:
    fontFamily: "Paper Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
  quote:
    fontFamily: "Bellefair, Georgia, serif"
    fontSize: "clamp(1.4rem, 4.2vw, 2.1rem)"
    fontWeight: 400
    lineHeight: 1.28
    letterSpacing: "-0.022em"
  chaos-pixel:
    fontFamily: "VT323, monospace"
    fontSize: "clamp(4rem, 14vw, 8rem)"
    fontWeight: 400
    lineHeight: 0.9
  chaos-mono:
    fontFamily: "DM Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
  sticker-reserved:
    fontFamily: "Honey, Georgia, serif"
    fontSize: "1.75rem"
    fontWeight: 400
rounded:
  none: "0"
  tooltip-pointer: "1px"
  focus: "2px"
  chip: "6px"
  pill: "999px"
spacing:
  sheet-top: "56px"
  sheet-padding-top: "72px"
  sheet-padding-side: "80px"
  side: "230px"
  sheet: "880px"
  logo: "200px"
  logo-to-tabs: "56px"
  tabs-to-notes: "64px"
components:
  tab:
    backgroundColor: "{colors.greige}"
    textColor: "{colors.text}"
    typography: "{typography.tab}"
    width: "140px"
    height: "34px"
  tab-current:
    backgroundColor: "{colors.brand-pink}"
    textColor: "{colors.on-pink}"
    width: "162px"
  filter:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.text}"
    typography: "{typography.meta}"
    rounded: "{rounded.none}"
  filter-chosen:
    backgroundColor: "{colors.brand-pink}"
    textColor: "{colors.on-pink}"
  pill-button:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    height: "40px"
  project-card-boxed:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.none}"
  project-sheet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.text}"
    rounded: "{rounded.none}"
    width: "min(86vw, 860px)"
  story-tooltip:
    backgroundColor: "{colors.pink-deep}"
    textColor: "{colors.paper}"
---

# Design System: Shivani Singh Ghoshi

From the redesign handover agreed on 22 Oct 2026. Tokens live in `src/app.css`; every colour in code is one of its variables.

## Overview

**A sheet of paper on a desk.** The page is a light grey desk. On it, a white sheet starts 56px from the top and runs off the bottom of the screen, with no edge, gap or shadow at the bottom. To its left, in the margin, sit the spinning sticker logo, a stack of tabs tucked against the sheet's edge, and a short handwritten-feeling note for the page. The margin stays put while the sheet scrolls.

Two voices share the type. National Park, a friendly grotesque, names things: titles, section headings, card titles. Paper Mono does everything else, from body text to tabs, buttons and notes, and gives the site its typed, notebook feel. There are no italics anywhere (National Park has none).

Colour is quiet: warm charcoal text, a greige for tabs and placeholders, the sticker's yellow for "you are here", and pink in two strengths: deep pink for anything that has to be read, brand pink only for decoration.

Tinkerings breaks the sheet: its canvas fills the whole screen, and the margin floats on top of it.

## Colors

- **Paper** (`--bg`, `--card`): the sheet, project panels, boxed cards, the canvas card pictures and labels.
- **Desk** (`--desk`): the page round the sheet and the Tinkerings canvas.
- **Greige** (`--greige`): tabs, picture placeholders.
- **Text** (`--text`, `--ink`): all text, axis lines, the oval and label outlines. 10.9:1 on paper, 10.0:1 on desk, 8.9:1 on greige, 8.4:1 on sun.
- **Muted** (`--muted`): text at 75% into paper, 5.1:1. Captions, dates, tags, card descriptions, the socials' descriptions. Never lighter than this (60 to 65% fails at 3.4 to 3.9:1).
- **Line** (`--line`): text at 16%. Dividers, card outlines, the footer line.
- **Sun** (`--sun`): the away highlight in the status line, the highlight behind blog quotes, and the logo. Never text (1.4:1); text-colour words on it reach 8.3:1.
- **On pink** (`--on-pink`): words on brand pink (the current tab, the chosen filter), 5.4:1.
- **Brand pink** (`--pink`): decoration only: square markers, the stars between socials, hover outlines on cards, the plotting lines on Tinkerings, the dotted line under "multitudes". Never text and never behind text (3.1:1).
- **Deep pink** (`--pink-deep`): pink that can be read, 6.0:1 on paper: the notes heading, back links, button and filter borders, footnote numbers, link hover, the story tooltip fill (white on deep pink, 6.0:1).
- **Pink soft** (`--pink-soft`): the hover fill on buttons, filters and the panel controls.
- **Status green** (`--status-green`): the status line's tally marks, grass tuft and online dot. **Status online background** (`--status-online-bg`, status green mixed 40% into paper): the rectangular highlight behind "online"; "away" uses sun with a text-colour dot.
- **Chaos mode** and **cookie jar** colours live inside those components only.

### Named rules
**Pink you read is deep pink.** Any pink text, or pink border round text, is `--pink-deep`. `--pink` is for marks and outlines that carry no words.

**Pink marks where you are.** Brand pink fills the current tab and the chosen filter, with on-pink words on it; pink soft is the hover. Sun is only ever a background.

## Typography

- **Letter spacing:** -2% (`--tracking`) on everything, in both fonts.
- **National Park** (500 and 600, self-hosted in `static/fonts`, SIL Open Font License), -2% letter spacing wherever it's used: page titles and the home hello (64px, 600; 48px under 64rem, 40px on phones), section headings (28px), card titles on the Projects page (22px), the project panel title (48px), the TL;DR line (48px), "✳ notes", the canvas card names, "Next project".
- **Paper Mono** (400 and 500, self-hosted, SIL Open Font License): everything else except the tabs. Body 15px at line height 1.6, intros 16px, notes and labels 13px, project names on Home cards 14px Medium, captions, dates and tags 12px. Tabs and buttons use Medium.
- **Blog titles** (the Blog heading, post titles in the list, the post page title) are Paper Mono Medium with -2% spacing.
- **Bellefair** stays for the quote cards inside one project (A visual dictionary for my fillers). **VT323** and **DM Mono** load only inside chaos mode and its page corner. **MEG Honey** is declared for sticker lettering but unused, and its file stays out of git.

## Layout

- **Visually centred:** the 880px sheet sits in the middle of the window, with the 230px margin hanging off its left (an equal empty space balances it on the right). On narrower windows that empty space gives way first, then the sheet shrinks rather than the page scrolling sideways.
- **Sheet:** its top right corner is folded down 44px, like a dog-eared page: the corner shows the desk, the flap is the faintly grey back of the paper with a soft shadow. 56px from the top, 72px padding on top and 80px at the sides (less on narrow windows), at least a screen tall, with the footer pushed to the bottom on short pages.
- **Margin, top to bottom:** the 200px logo, 56px, the tabs, 64px, the note. Sticky while the sheet scrolls.
- **Phones** (under 48rem, not designed yet): the margin becomes a band with a 72px logo and a menu button; the tabs drop down full width; the note is left out (a post's footnotes go under it instead).
- **Tinkerings:** the canvas fills the screen in the desk colour; the margin floats in the same spot on a soft desk-coloured patch; the footer is a slim bar along the bottom.

## Components

### Tabs
HOME, PROJECTS, TINKERINGS, BLOG, ABOUT, RESUME ↗, in National Park Medium capitals at 13px. Greige, no outline, text colour, 140px wide, tucked against the sheet. The current page slides out to 162px in brand pink, its words in on-pink (the dark aubergine, 5.4:1; the text colour would only be 3.1:1); pointing at a tab slides it out to 148px in pink soft. Resume opens the Google Drive resume in a new tab.

### Notes
"✳ notes" in National Park, deep pink, then the page's note in Paper Mono 13px. A paragraph starting with a symbol (↘, ✥) shows the symbol in deep pink. Each page sets its note in its `+page.js`; Home changes its note as the story scrolls past (fading between them). A blog post with footnotes shows "✳ footnotes" instead, numbered in deep pink.

### Footer
Every page: the socials, then the live status line without a divider above it. Home, Projects, case studies and About have the socials table (name ↗ and a few words, a line under each row, the lines running the full width of the sheet); the blog has them on one line with brand pink ✳ between; Tinkerings has everything on one slim row with a line along its top.

### Project cards
4:3 pictures with square corners, on greige until the picture loads. On Home: just the picture, "**Name** | project type" on one line at 14px, the name in Paper Mono SemiBold, the type muted. Home thumbnails are 480px wide; pointing at it draws a 2px brand pink outline round the picture. On Projects: boxed in a 1px line, the title in National Park 22px and the tags (muted, separated by middle dots) under it; the frame turns brand pink on hover. A card opens its case study, its Behance page, or the project popup.

### Buttons and filters
Square corners, text-colour words, a 1px deep pink border, soft pink on hover. A chosen filter is brand pink with on-pink words.

### Case study
"← Projects" in deep pink, the title, one line of intro, the details (Role, Type, Data, Status) between two lines, then the parts: headings, text held to 52ch, and pictures always in pairs, side by side, never one across the full width. Links at the end, then "Next project →" over a text-colour line.

### Project popup
A white sheet up to 860px wide, square corners, from 56px down to the bottom of the screen, over the page faded to the desk colour and blurred. It grows out of the card and shrinks back into it. Top right: 40px square controls outlined in the text colour: ← and → on Tinkerings (also the arrow keys), and ×. A "2 / 8" counter sits above the title on Tinkerings. Pictures first, then the title in National Park, tags, and the text.

### Tinkerings canvas
A 1300 by 940 matrix on a grid of faint plus signs. Thin text-colour axes; labels boxed at their ends (Build for work, Build for fun, Hand-drawn, Technical); "The intersection of art and technology" in an oval where they cross. Cards are 230px: the picture on white, the name in a white box under it, a brand pink outline on hover. Pointing at a card still plots it: the others fade, brand pink lines run to both axes, and its side's labels darken. Drag anywhere (or scroll) to move; + and − zoom (Ctrl + scroll or a pinch too). It opens zoomed to fit the free space beside the margin. "✥ Drag to explore" sits top right. Phones get a plain list.

### Live status line
`src/lib/TabStatus.svelte`, to the 22 Oct 2026 spec. Online: green tally marks in bundles of four uprights and a slash, then "Shivani is **online** and in company of n tabs right now". Away: Shivani's hand-drawn grass tuft, always full, swaying, then "Shivani is **away** from the screen right now". Paper Mono 15px; the tally marks and spacing are 1.5× larger while each stroke keeps its original thickness. The status word sits on a rectangular highlight with a dot (green for online, sun with a text-colour dot for away). Going away the marks sink and the grass rises strand by strand; coming back is the reverse; it never replays on page load, keeps the last count while away, and just swaps states for reduced motion.

### Kept exactly as they were
The logo's spin on Home, the bouncing logo on About, the scroll reveal (fade and slide up once, off for reduced motion), the live status line's behaviour, the multitudes story tooltip, chaos mode and its page corner.

The story tooltip keeps its 6px bubble corners (`chip`), its 1px pointer corners (`tooltip-pointer`) and its one deliberate overshoot: bubbles pop open with `cubic-bezier(0.34, 1.56, 0.64, 1)` over 240ms, exactly as in Shivani's tooltip tooltip demos, so each seems to spring out of the one below. Nothing else on the site bounces. The quote cards and the cookie jar's chips keep their 6px corners too; they belong to those pieces, not to the page furniture, which is square.

## Do's and Don'ts

- **Do** use the variables in `app.css` for every colour; add a named variable before using a new one.
- **Do** keep muted text at 75% or darker, and pink text deep pink.
- **Do** keep pictures in pairs on case studies and posts.
- **Do** give every motion a reduced-motion off switch.
- **Don't** put text on brand pink, or set text in brand pink or sun; sun is only ever a background.
- **Don't** use italics, or any font but National Park and Paper Mono outside the quote cards and chaos mode.
- **Don't** round corners on cards, buttons, tabs or the panel.
- **Don't** use PP Mondwest anywhere, or commit the MEG Honey file.
