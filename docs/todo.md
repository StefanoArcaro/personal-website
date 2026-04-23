# Todo

Living checklist for `stefanoarcaro.com`. Split by owner. For the higher-level plan see [`spec.md`](spec.md); for palette tokens see [`palette.md`](palette.md); for world feedback see [`world-feedback.md`](world-feedback.md).

Legend: `[x]` done · `[ ]` pending · `[~]` later / deferred

---

## Stefano

### Done

- [x] Picked the primary palette: **forest / moss dark**
- [x] Picked a backup palette: **warm charcoal + terracotta** (saved in `docs/palette.md`)
- [x] Approved scaffolding approach (Astro at repo root, vanilla CSS + tokens, React integration, no Tailwind)
- [x] Chose hero tagline (understated tone)
- [x] Confirmed contact details (email, LinkedIn, GitHub)
- [x] Provided CV (`public/cv.pdf`)
- [x] Reviewed work timeline entries from CV

### Pending — content

- [ ] Tire-kick the running site at http://localhost:4321 — click every link, hover every button, hit a 404.
- [ ] Review & refine work timeline blurbs (currently draft versions from CV data).
- [ ] Write the elluminate case-study copy ("The problem" / "What I built" / "What shipped").
- [ ] Tweak the contact page lede paragraph if needed.

### Pending — later / when ready to go public

- [~] Register `stefanoarcaro.com` at Cloudflare Registrar (wholesale ~$10/yr). DNS auto-lands on Cloudflare.
- [~] Create a Cloudflare Pages project pointed at this repo: build `pnpm build`, output `dist`, Node 22.
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
- [x] `src/pages/work.astro` — vertical timeline + `<details>` case-study panel scaffold.
- [x] `src/pages/contact.astro` — email / LinkedIn / GitHub / CV link list, "preferred" pill on email.
- [x] `src/pages/world.astro` — Phaser overworld with bedroom + arcade rooms, interactions, audio toggle.
- [x] `src/pages/404.astro` — "Wrong turn." with link home + to the overworld.

**Static assets + meta**
- [x] Replaced default Astro favicon with pixel-trainer `favicon.svg` in the forest palette.
- [x] `public/_headers` — security headers + cache rules + HSTS for Cloudflare Pages.
- [x] `public/robots.txt` pointing at the sitemap.

### Done (2026-04-23)

**Motion pass**
- [x] Fade-up entrance animations on all main pages with staggered delays.
- [x] Scroll-triggered timeline reveals on `/work` via IntersectionObserver.

**Phaser overworld v1**
- [x] Bedroom scene: bookshelf, desk, monitor, bed, posters, rug, door.
- [x] Arcade scene: arcade cabinets, door back to bedroom.
- [x] Grid-based player movement (arrow keys + WASD), room transitions with fade.
- [x] Dialog system with typewriter text reveal.
- [x] Audio toggle (chiptune via Web Audio oscillators).

**Accessibility & SEO**
- [x] OG & Twitter meta tags, canonical URLs, `<meta name="author">`, `<meta name="theme-color">`.
- [x] Skip-to-content link, ARIA labels on nav, `aria-current` on active links.
- [x] `<main id="main-content">` landmarks on all pages.
- [x] HSTS + X-XSS-Protection headers.

**Content collections**
- [x] Extracted work entries to `src/content/work/*.md` with frontmatter + Zod schema.
- [x] `src/content.config.ts` using Astro 6 glob loader.

**Content pass**
- [x] Updated hero tagline and eyebrow (Bremen, understated tone).
- [x] Filled work timeline from CV (ellamind, ML cube, M.Sc., B.Sc.).
- [x] Updated contact details (email, LinkedIn, GitHub).
- [x] Moved CV to `public/cv.pdf`.

**Verification + docs**
- [x] Clean `pnpm build` — all 5 routes + sitemap generate without errors.
- [x] Initial commit pushed to `StefanoArcaro/personal-website` (personal GitHub).
- [x] Second commit with all features pushed.

### Pending

**World improvements** (see `docs/world-feedback.md` for detailed feedback)
- [ ] Fix room transition movement bug (input lost after scene switch).
- [ ] Add interaction indicators (visual cue when near interactable objects).
- [ ] Replace procedural graphics with proper pixel art tileset.
- [ ] Increase resolution / revisit canvas + tile size.
- [ ] Replace generated music with a real chiptune loop.

**Polish passes**
- [ ] Visual review in browser once content is finalized.
- [ ] Elluminate case-study copy (blocked on Stefano).
- [ ] Easter eggs: konami code, secret room, or a smarter 404.

**Deferred / post-v1** (per spec)
- [~] `@astrojs/cloudflare` + `output: "server"` — only if we ever need SSR.
- [~] Office + travel-map rooms.
- [~] Dream mini-game when interacting with the bed.
- [~] Light theme variant.
- [~] Writing / "now" page if inspired.
