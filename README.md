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

## Files

- `index.html` — page content (hero, dashboard, about, skills, experience, projects, contact)
- `styles.css` — nude/warm-neutral palette, defined as CSS variables at the top
- `dashboard.js` — heatmap, streak math, category and goal bars, activity feed
- `data/activity.js` — **the file you edit daily**
- `log.sh` — appends a session to the log
- `script.js` — footer year, scroll-spy nav
- `Takudzwa_Vuma_Resume.pdf` — linked from the hero

## Deploy

GitHub Pages is enabled on `main` / root → https://takuvuma.github.io/web-portfolio/
