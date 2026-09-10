# web-portfolio

Personal portfolio for **Takudzwa Vuma** — Identity & Access Management.

Static site: plain HTML, CSS, and JavaScript. No build step, no dependencies.

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000

## Logging daily progress

The home page carries a GitHub-style dashboard — contribution heatmap, streaks,
time-by-category, goal bars, and a recent-sessions feed. It all renders from one
file: `data/activity.js`.

Log a session with the helper script:

```bash
./log.sh entra 90 "Configured a conditional access policy in the lab"
./log.sh cert 45 "SC-300 module 3" https://learn.microsoft.com/...
```

Categories: `entra` `ad` `okta` `cloud` `script` `govern` `genai` `cloudsec` `cert` `read` —
edit or add to them in `IAM_CATEGORIES` at the bottom of `data/activity.js`.

Or edit the file by hand:

```js
window.IAM_LOG = [
  { date: "2026-09-09", minutes: 90, category: "entra",
    title: "Built dynamic groups + conditional access policy" },
];
```

Goals live in `IAM_GOALS` in the same file. Set `current` yourself, or use
`auto: "hours"` to have a goal track logged hours automatically.

Commit and push after logging — the site rebuilds on GitHub Pages.

## Writing a blog post

```bash
./new-post.sh "Tuning conditional access without locking myself out"
```

That creates `posts/<slug>.html` from `posts/_template.html` and registers the
post in `data/posts.js`, which drives the Blog section on the home page. Edit
the HTML (plain paragraphs, headings, lists, and `<pre><code>` blocks all pick
up the site styling), tidy the summary/tags/read time in `data/posts.js`, then
commit and push.

## Adding notes

Notes are grouped into folders shown as folder tiles on the home page.

```bash
./new-note.sh entra-id "Break-glass account must be excluded from CA policies"
```

That appends the note to `notes/entra-id.html` and bumps the folder's count in
`data/notes.js`. Passing a slug that doesn't exist yet creates the folder page
and registers it. Then open the HTML and write the note body.

## Files

- `index.html` — page content (hero, dashboard, about, skills, experience, projects, contact)
- `styles.css` — nude/warm-neutral palette, defined as CSS variables at the top
- `dashboard.js` — heatmap, streak math, category and goal bars, activity feed
- `data/activity.js` — **the file you edit daily**
- `log.sh` — appends a session to the log
- `blog.js` — renders the blog index
- `data/posts.js` — post metadata
- `posts/` — one HTML file per post, plus `_template.html`
- `new-post.sh` — scaffolds a post
- `notes.js` — renders the folder tiles
- `data/notes.js` — folder list and note counts
- `notes/` — one HTML page per folder, plus `_template.html`
- `new-note.sh` — adds a note to a folder
- `script.js` — footer year, scroll-spy nav
- `Takudzwa_Vuma_Resume.pdf` — linked from the hero

## Deploy

GitHub Pages is enabled on `main` / root → https://takuvuma.github.io/web-portfolio/
