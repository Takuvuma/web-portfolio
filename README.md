# web-portfolio

Personal portfolio for **Takudzwa Vuma** — Identity & Access Management.

Static site: plain HTML, CSS, and JavaScript. No build step, no dependencies.

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000

## Files

- `index.html` — all page content (hero, about, skills, experience, projects, leadership, contact)
- `styles.css` — nude/warm-neutral palette defined as CSS variables at the top
- `script.js` — footer year, scroll-spy nav highlighting
- `Takudzwa_Vuma_Resume.pdf` — linked from the hero

## Deploy to GitHub Pages

Settings → Pages → Source: `main` branch, `/ (root)`.
