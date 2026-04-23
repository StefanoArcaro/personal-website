# stefanoarcaro.com

Personal website for Stefano Arcaro — AI engineer.

See [`docs/spec.md`](docs/spec.md) for the full design brief, [`docs/palette.md`](docs/palette.md) for the chosen + backup palette tokens, and [`docs/todo.md`](docs/todo.md) for the running checklist (split by owner).

## Stack

- [Astro](https://astro.build/) (v6) — static content pages
- [@astrojs/react](https://docs.astro.build/en/guides/integrations-guide/react/) — islands for interactive widgets
- [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/) — `/sitemap-index.xml`
- Vanilla CSS with design tokens in `src/styles/tokens.css`
- Planned: [Phaser](https://phaser.io/) lazy-loaded on `/world` only
- Hosting: Cloudflare Pages (static output — no adapter needed for v1)

## Getting started

Uses [pnpm](https://pnpm.io/) (faster installs, shared store). Install it once globally if you haven't: `brew install pnpm` or `npm i -g pnpm`.

```bash
pnpm install
pnpm dev           # http://localhost:4321
pnpm build         # static output to dist/
pnpm preview       # serve the build locally
```

## Routes

| Path      | Page                                 |
| --------- | ------------------------------------ |
| `/`       | landing — hero + portal button       |
| `/work`   | timeline + elluminate case study     |
| `/contact`| email, LinkedIn, GitHub, CV          |
| `/world`  | portal teaser (Phaser comes later)   |
| `/404`    | custom 404                           |

## Layout

```
.
├── docs/
│   ├── spec.md                    # design brief and decisions
│   └── palette.md                 # chosen palette + backup
├── tmp/
│   └── palettes.html              # palette prototype, for reference
├── public/
│   ├── _headers                   # Cloudflare Pages headers
│   ├── favicon.svg                # pixel trainer
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Nav.astro              # shared nav
│   │   └── TrainerSprite.astro    # 8×10 pixel sprite (uses palette tokens)
│   ├── layouts/
│   │   ├── Base.astro             # <html>/<head>/<body>
│   │   └── Page.astro             # Base + Nav + centered container
│   ├── pages/
│   │   ├── 404.astro
│   │   ├── index.astro            # landing
│   │   ├── work.astro
│   │   ├── contact.astro
│   │   └── world.astro            # teaser (no Phaser yet)
│   └── styles/
│       ├── tokens.css             # palette, type scale, spacing, motion
│       └── global.css             # reset + base
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Deploying to Cloudflare Pages

v1 is fully static. No adapter needed.

1. Register `stefanoarcaro.com` at Cloudflare Registrar; DNS auto-lands on Cloudflare.
2. Cloudflare dashboard → Pages → **Create a project** → connect this GitHub repo.
3. Build command: `pnpm build` · Output directory: `dist` · Node: 22. (Cloudflare detects `pnpm-lock.yaml` automatically.)
4. First deploy goes to `<project>.pages.dev`. Add `stefanoarcaro.com` as a custom domain in the Pages UI; Cloudflare wires the DNS automatically.
5. `public/_headers` applies security + cache headers on deploy.

If we later need SSR (forms, dynamic OG, auth), add [`@astrojs/cloudflare`](https://docs.astro.build/en/guides/integrations-guide/cloudflare/) and switch `output: "server"`.

## Status

Scaffolded: all 5 routes build, landing + work + contact + world + 404 render, palette tokens wired, shared nav, pixel trainer sprite uses the same tokens as the rest of the site (preview of the main-site ↔ `/world` contrast).

Full checklist (done + pending, split by owner) lives in [`docs/todo.md`](docs/todo.md). Short version:
- **Stefano**: fill in real content in `/work` + `/contact`, drop `cv.pdf` into `public/`, first git commit. Domain + hosting come later.
- **Claude**: Phaser overworld (bedroom + arcade), motion + perf polish — on deck when Stefano is ready.
