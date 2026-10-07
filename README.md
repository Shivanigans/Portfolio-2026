# Portfolio (SvelteKit)

## First time setup

1. Unzip this folder somewhere, then open it in VS Code (File → Open Folder).
2. Open the terminal in VS Code (View → Terminal).
3. Type `npm install` and press Enter. This downloads the tools the site needs. Takes a minute.

## Add the Array font

Copy `Array-Regular.woff2` from the walks from life project into `static/fonts`. Until you do, headings fall back to a plain monospace font.

The font's licence doesn't allow sharing the files publicly, so `static/fonts` is kept out of git. If the repo ever goes public, the font still won't be uploaded.

## See the site on your computer

1. In the terminal, type `npm run dev` and press Enter.
2. Open the link it shows (usually http://localhost:5173/blog) in your browser.
3. Leave it running. Changes you save show up in the browser straight away.
4. To stop it, click the terminal and press Ctrl + C.

## Write a new blog post

1. Go to `src/posts`.
2. Make a new file ending in `.md`. The file name becomes the web address, so `water-maps.md` becomes `/blog/water-maps`. Use lowercase and hyphens, no spaces.
3. Start it with the details block, then write below it:

```
---
title: Your post title
date: 2026-11-01
summary: One line that shows in the blog list.
---

Your first paragraph.
```

4. Put images or exported charts in `static/blog`, then add them with `![description](/blog/your-image.png)`.
5. Not ready to publish? Add `draft: true` inside the details block and it stays hidden.

Open `src/posts/sample-post.md` for a cheat sheet of formatting. Delete both placeholder posts when your first real one is ready.

## Where things live

- `src/posts` your blog posts
- `static/blog` blog images
- `src/app.css` colours and fonts (placeholders for now)
- `src/routes/+layout.svelte` nav, monogram and resume link
- `src/routes/blog` blog list and post page layouts
