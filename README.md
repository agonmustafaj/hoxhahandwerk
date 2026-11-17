# Hoxha Handwerk

Static marketing site for **Hoxha Handwerkerservice** (Renovierung, Trockenbau, Innenausbau).

## Stack

Plain HTML, CSS, and JavaScript — no build step. Multilingual UI via `js/i18n.js`.

## Local preview

Serve the repo root with any static file server, for example:

```bash
python3 -m http.server 5501
```

Or open `index.html` with VS Code Live Server (port `5501` in `.vscode/settings.json`).

## Site pages

- `index.html` — main site
- `impressum.html` — imprint
- `datenschutz.html` — privacy policy

## Cloudflare Pages

This is a **static** site: `index.html` lives at the repo root. There is no `package.json` and no `npm run build`.

`wrangler.toml` sets `pages_build_output_dir = "."` for Wrangler / Pages output.

### One-time dashboard settings (required)

In **Workers & Pages → your project → Settings → Builds & deployments** (or the deploy setup screen):

| Setting | Value |
| --- | --- |
| Framework preset | None / None |
| Root directory | `/` (leave blank / repository root) |
| Build command | leave **blank**, or use `exit 0` |
| Build output directory | `/` or `.` (repo root where `index.html` is) |

Do **not** use `npm run build` unless you leave the dashboard on that preset — the repo includes a minimal `package.json` whose `build` script is `exit 0` so that preset still succeeds.

After saving, retry the deployment (or push a new commit).
