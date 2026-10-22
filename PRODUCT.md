# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Hiring managers looking for a product designer.
- Freelance clients who might commission a project.
- Tech employers and recruiters, often skimming quickly for fit.
- Fellow makers: designers, illustrators and curious people who enjoy the tinkerings.

## Product Purpose

The personal portfolio of Shivani Singh Ghoshi (shivanigans), a product designer who makes. It shows her present work. She is open to work and currently freelancing.

Success: a visitor spends time looking at her work. Reaching her (email, resume, LinkedIn) follows from that.

## Positioning

A product designer who makes to think. She builds prototypes, motion pieces and other tinkerings instead of only screens, and she illustrates and sketchnotes to make sense of the world around her.

## Capabilities and Constraints

- Redesign (handover agreed 2026-10-22): a white sheet on a grey desk, the logo, tabs and a per-page note in the margin to its left. Tabs: Home, Projects, Tinkerings, Blog, About, Resume ↗. National Park and Paper Mono only (Bellefair stays in the quote cards, chaos mode keeps its own fonts). Mobile is not designed yet.
- Pages: Home, Projects (with case studies at /projects/<id>), Tinkerings (a full-screen canvas with project popups), Blog, About.
- Home (2026-10-22): the hello, then five sections, each a heading and its project cards (headings, picks and stand-ins in src/lib/home.js). The margin note follows the story as it scrolls: "Currently, I’m" for the first three, "Previously, I turned" for the fourth, "I draw to make sense of the world" for the fifth. Then "TL;DR, I contain multitudes.", the open-to-work line, "View all projects" and "Send email ↗". The socials and the live status line close every page.
- Tinkerings (2026-10-22): the 2x2 matrix on a canvas that fills the screen: drag to move, + and − to zoom. A card grows into the popup, which steps through the projects with ← and →. After about two scrolls, a page corner curls up in the bottom right and leads to chaos mode (src/lib/ChaosMode.svelte, only downloaded when pressed).
- Case studies: a project with a caseStudy in src/lib/tinkerings.js gets its own page, which its card opens. Walks from life is the first, with copy from the agreed mock.
- Home: “multitudes” in the TL;DR line opens a stack of story tooltips on desktops (“fortitude,”, “gratitude,”, “attitude”, “and vicissitude.”), working like Shivani’s tooltip tooltip demos; on phones it is just the word. It has its own project, Tooltip^tooltip^ (shown with the second word raised), whose sheet holds the three demos live (turtles, goodnight, Jack and the beanstalk), credited as originally a prompt from Soren Iverson (https://paste.design/day/12?accent=ff2a8e&density=2).
- Project panels: pictures at the top, two side by side (one picture at half width), then the title row and About. UI experiments show their About only; Footer design’s Tools, Process and Output are kept in tinkerings.js, switched off.
- Card lines: for work done for an organisation, the card line is just the organisation’s name (e.g. CEEW).
- Behance projects (Water portfolio map, CEEW charts and viz) open Behance in a new tab instead of the popup. Water portfolio map links to its Behance project. CEEW charts and viz’s link is still to come; until then its card opens the Behance profile.
- Projects: every project as a boxed card, filtered by tag (/projects?tag=data-viz). In the tabs since the redesign.
- Tags: Product & UX, Data viz, Illustration, UI experiments, Creative coding. Each project has one or two, stored in src/lib/tinkerings.js.
- Only projects already on the site are shown. ECI voter ID redesign, Bottle of Explained Water, Data book illustrations, RVL comics and merch, Sky palette and Chaos mode are planned (Water portfolio map is the UI/UX dashboard case study); Shivani adds them herself. Slice Board stays off until it has a description.
- Fonts: National Park and Paper Mono are SIL Open Font License, self-hosted in static/fonts and tracked in git. MEG Honey is licensed for personal use only and must not be shared in the public repo. PP Mondwest must not be used.

## Brand Commitments

- Name: Shivani Singh Ghoshi. Handle: shivanigans.
- All site copy and project descriptions are written by Shivani. Never write or rewrite them for her (grammar fixes only when asked).
- British English.

## Evidence on Hand

- Tinkerings (src/lib/tinkerings.js): Walks from life; Playing with Motion; Portrait in p5.js; A visual dictionary for my fillers.
- Visual and information design work on Behance: https://www.behance.net/shivanigans
- Blog post: September finds (src/posts/September-finds.md).
- Resume (Google Drive link) in the tabs; email on Home and About; Behance, Instagram and LinkedIn in the footer of every page.
- No product design case studies, testimonials or client names exist yet. Do not invent any.

## Product Principles

1. The work leads. Visitors should reach real projects quickly.
2. Show the making, not just the result.
3. Her voice stays hers.
