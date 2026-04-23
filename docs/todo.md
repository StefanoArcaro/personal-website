# Todo

Living checklist for `stefanoarcaro.com`. Split by owner. For the higher-level plan see [`spec.md`](spec.md); for palette tokens see [`palette.md`](palette.md).

Legend: `[x]` done · `[ ]` pending · `[~]` later / deferred

---

## Stefano

### Done (2026-04-22)

- [x] Picked the primary palette: **forest / moss dark**
- [x] Picked a backup palette: **warm charcoal + terracotta** (saved in `docs/palette.md`)
- [x] Approved scaffolding approach (Astro at repo root, vanilla CSS + tokens, React integration, no Tailwind, no Phaser yet)

### Pending — content

Order is "most visible first" so you can see the site come alive as you go.

- [ ] Tire-kick the running site at http://localhost:4321 — click every link, hover every button, hit a 404.
- [ ] Rewrite the hero tagline in `src/pages/index.astro` so it sounds like you.
- [ ] Fill in the `entries` array at the top of `src/pages/work.astro` with 3–5 real roles / projects / education items.
- [ ] Rewrite the elluminate case-study copy (further down in `src/pages/work.astro` — "The problem" / "What I built" / "What shipped"). Delete the whole `<section id="elluminate">` if you'd rather put it elsewhere.
- [ ] Confirm handles + email at the top of `src/pages/contact.astro` (`email`, `linkedin`, `github` constants). Tweak the lede paragraph if needed.
- [ ] Drop your CV as `public/cv.pdf` — the `/contact` download link already points at it.
- [ ] `git init && git add . && git commit -m "Initial scaffold"` once the content feels close.

### Pending — later / when ready to go public

- [~] Register `stefanoarcaro.com` at Cloudflare Registrar (wholesale ~$10/yr). DNS auto-lands on Cloudflare.
- [~] Create a Cloudflare Pages project pointed at this repo: build `npm run build`, output `dist`, Node 22.
- [~] Add `stefanoarcaro.com` as a custom domain in the Pages UI. First deploy goes to `*.pages.dev` while you settle in.
- [~] Decide on a light theme (optional — spec leaves it as post-v1).

---

## Claude

### Done (2026-04-22)

**Palette exploration**
- [x] Built `tmp/palettes.html` — six dark palettes side-by-side, same mock landing page, hover states, pixel sprite in each.
- [x] Recorded both chosen + backup palette tokens in `docs/palette.md`.
- [x] Updated `docs/spec.md` build plan to reflect the palette decision.

**Foundations**
- [x] Scaffolded Astro 6 at repo root (minimal template, TypeScript strict).
- [x] Added `@astrojs/react` for future islands.
- [x] Added `@astrojs/sitemap` — sitemap generated on build.
- [x] Renamed package to `stefanoarcaro-website`, set `private: true`.
- [x] Wired `site: "https://stefanoarcaro.com"` in `astro.config.mjs`.

**Design system**
- [x] `src/styles/tokens.css` — palette, type scale, spacing, radii, motion.
- [x] `src/styles/global.css` — reset, base, font loading via Google Fonts, `prefers-reduced-motion` respect.
- [x] Inter + Space Grotesk + JetBrains Mono loaded with `display=swap`.

**Layouts + components**
- [x] `src/layouts/Base.astro` — `<html>`/`<head>`/`<body>` shell.
- [x] `src/layouts/Page.astro` — `Base` + nav + centered container.
- [x] `src/components/Nav.astro` — logo, work, contact, "for recruiters →" with animated underlines.
- [x] `src/components/TrainerSprite.astro` — 8×10 pixel character, styled from palette tokens.

**Pages**
- [x] `src/pages/index.astro` — hero, CTA with sprite in portal button, "skim the work" ghost link.
- [x] `src/pages/work.astro` — vertical timeline (`entries` array) + `<details>` case-study panel scaffold.
- [x] `src/pages/contact.astro` — email / LinkedIn / GitHub / CV link list, "preferred" pill on email.
- [x] `src/pages/world.astro` — portal teaser, bobbing sprite, pixel grid, back link (no Phaser yet).
- [x] `src/pages/404.astro` — "Wrong turn." with link home + to the overworld.

**Static assets + meta**
- [x] Replaced default Astro favicon with pixel-trainer `favicon.svg` in the forest palette.
- [x] `public/_headers` — security headers + cache rules for Cloudflare Pages.
- [x] `public/robots.txt` pointing at the sitemap.

**Verification + docs**
- [x] Clean `astro build` — all 5 routes + sitemap generate without errors.
- [x] Switched package manager from npm to pnpm for consistency with Stefano's other projects (lockfile: `pnpm-lock.yaml`).
- [x] Hit every route on the dev server (200 / 200 / 200 / 200 / 404).
- [x] Updated `README.md` with stack, routes table, layout, deploy flow, current status.
- [x] This todo file.

### Pending

**Next sessions (blocked on Stefano's content or explicit ask)**

- [ ] Phaser overworld v1: `/world` as a real scene with keyboard movement, collisions, and room transitions for **bedroom** + **arcade** (per `spec.md` §"The overworld (v1)"). Waits until you want to start it.
- [ ] Wire up bedroom interactions: bookshelf, desk-computer, wall posters, inert bed (shipped off per spec).
- [ ] Wire up arcade cabinets with posters of games; reserve one slot for a real playable mini-game (post-v1).
- [ ] Audio toggle — chiptune loop, off by default.

**Polish passes (as needed)**

- [ ] Motion pass across the main site once real content is in place — gentle entrance animations, scroll reveals if they feel right.
- [ ] Lighthouse / perf audit and fixes.
- [ ] Second case-study panel if a second project deserves one.
- [ ] Easter eggs: konami code, secret room, or a smarter 404. Collect ideas as they come.

**Deferred / post-v1** (per spec)

- [~] `@astrojs/cloudflare` + `output: "server"` — only if we ever need SSR (forms, dynamic OG, auth).
- [~] Office + travel-map rooms.
- [~] Dream mini-game when interacting with the bed.
- [~] Light theme variant.
- [~] Writing / "now" page if inspired.
