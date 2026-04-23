# Personal Website — Spec (post-interview)

> Captured from the initial scoping interview on 2026-04-22. Living document — revise as prototyping reveals new preferences.

## Who it's for

- **Primary:** potential employers/clients, peers in AI/SWE, future-me.
- **Secondary:** anyone curious who lands on it.

## What it is

A **whole-person site** that works on three levels:

1. **Calling card** — clear identity, credibility, contact.
2. **Portfolio** — work, projects, thinking.
3. **Creative playground** — a place to tinker; the site itself has personality.

## Who Stefano is (for copy / positioning)

- AI engineer. Heavy on agentic coding, strong SWE instincts.
- Background: Master's in ML/CV, 6-month computer vision internship, now at ellamind.
- Interested in (but no production experience with) classical ML/data work.
- Personal interests that might show up: travel/photos, reading/watching/listening, video games.

## Identity & domain

- **Name:** Stefano Arcaro.
- **Canonical domain:** `stefanoarcaro.com` (confirmed available via Verisign RDAP on 2026-04-22). Register at Cloudflare Registrar for wholesale pricing (~$10/yr). Namespace note: a separate Samuel Arcaro owns `sarcaro.com` — full name is the only unambiguous identifier.

## Hosting & stack

- **Stack:** Astro + React islands + Phaser.
  - Astro: nearly-static content pages — fast, minimal JS, great DX for write-ups.
  - React islands: interactive widgets where needed.
  - Phaser: the pokemon-style overworld, lazy-loaded on `/world` only.
- **Hosting:** Cloudflare Pages (free, unlimited bandwidth, one dashboard with the registrar). Vercel is an acceptable alternative if DX becomes the priority.

## Structure

```
/                       Landing: minimal hero, classic nav, "enter the world →" portal,
                        small "for recruiters / for serious people →" meta link.
/work                   Vertical timeline (roles + projects + education).
                        1–2 expandable case-study panels on hero projects.
/contact                Email, LinkedIn, GitHub, downloadable PDF CV.
/world                  Pokemon-style top-down overworld (gen-3/4 vibe).
                        Phaser scene; Tiled tilemaps.
```

- **Writing / now page:** deferred past v1. User dislikes long-form writing — don't commit.

### The overworld (v1)

- Two rooms at launch: **bedroom** + **arcade**. Office and travel-map come post-launch.
- **Bedroom** contains:
  - Bookshelf (click a book → title/author + short take).
  - Desk with a computer (opens "now" panel or routes to work timeline).
  - Wall posters (games/films/music — click for "why I love this" blurb, possibly a Spotify now-playing widget).
  - Bed — **future**: interact to "sleep" → loads a small dream mini-game; wake up exits back to the bedroom. Ship inert for v1; wire up later.
- **Arcade** contains:
  - Multiple arcade cabinets showing posters/screens of games Stefano loves (click → short "why I love this" blurb).
  - One cabinet slot reserved for a **real playable mini-game** (added post-v1 once Stefano picks the game).
- **Audio:** off by default; small speaker icon toggles a chiptune loop. Different tracks per room can come later.

## Design

- **Visual split:**
  - Main site: polished modern — clean typography, generous spacing, smooth micro-animations.
  - `/world`: pixel-art, chiptune, pokemon gen-3/4 tileset aesthetic.
  - The contrast between the two *is* the vibe. "Enter the world" feels like a real portal.
- **Theme:** dark-first. Built with CSS design tokens so a light theme is cheap to add later.
- **Palette:** **forest / moss dark** — deep green-black base, sage text, tan accent. Picked 2026-04-22 after prototyping 6 variants in `tmp/palettes.html`. Warm charcoal + terracotta kept as backup. Tokens + typography in `docs/palette.md`.
- **Voice:** dry wit, understated humor, self-aware. **Show, not tell.** Minimize long-form copy — the site demonstrates personality through interactions, not paragraphs.

## Personality moves

- **"For recruiters / for serious people →"** meta link on the landing page. Self-aware framing (not "fully committed to the bit", not subtle-polite). Routes to the clean `/contact` surface.
- **Overworld as personality zone** — the main container for play, games, reading/watching/listening, travel.
- **Easter eggs** — reserve budget for at least one or two (404 page, konami code, secret room, etc.). Collect ideas during build.

## Build plan (rough)

> Running checklist (split by owner) lives in [`todo.md`](todo.md). This section is the high-level plan only.

1. **Foundations** *(done, except the bits marked ⏳)*
   - ⏳ Register `stefanoarcaro.com` + DNS to Cloudflare.
   - ✅ Scaffold Astro project (repo root, TS strict, React integration, sitemap).
   - ⏳ Deploy skeleton to Cloudflare Pages (static output, no adapter).
   - ✅ Set up design tokens (colors, type scale, spacing, motion) in `src/styles/tokens.css`.
2. **Content surfaces** *(scaffolded with placeholders — blocked on real content)*
   - ✅ Landing page (hero + classic nav + world portal + serious-mode link).
   - ✅ `/work` timeline scaffold + case-study panel structure. ⏳ Real entries + elluminate copy (`TODO(stefano)` markers).
   - ✅ `/contact` with email, LinkedIn, GitHub, PDF CV — ⏳ real handles + `public/cv.pdf`.
   - ✅ `/world` placeholder page (Phaser comes in step 4).
   - ✅ 404 page.
3. **Palette exploration** *(done)*
   - ✅ Prototyped 6 palettes in `tmp/palettes.html`. Picked **forest / moss dark**. Backup: warm charcoal + terracotta. See `docs/palette.md`.
4. **Overworld v1**
   - Build a tiny base tileset (or adapt a CC-licensed one), Phaser scene, keyboard/arrow movement, collisions, room transitions.
   - Ship bedroom + arcade with click interactions.
   - Add audio toggle.
5. **Polish + launch**
   - Motion pass on the main site.
   - Lighthouse/perf audit.
   - First real deploy to `stefanoarcaro.com`.

## Post-v1 backlog

- Add office + travel-map rooms.
- Real playable mini-game in one arcade cabinet.
- Dream mini-game when interacting with the bed.
- Optional: writing index or "now" page if inspired.
- Optional: light theme.
- More easter eggs as they come to mind.
