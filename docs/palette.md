# Palette

Chosen 2026-04-22 after prototyping 6 dark palettes in `tmp/palettes.html`.

## Primary: Forest / moss dark

Deep green-black base, sage text, tan accent. Earthy, quiet, grown-up. Accent has warmth without going loud.

```css
--bg:         #0d120e;
--surface:    #151e17;
--text:       #d8e2ce;
--muted:      #7a8872;
--accent:     #d4a574;  /* tan */
--accent-ink: #1a1207;  /* for text on accent surfaces */
--border:     #1f2b22;
```

Pixel-sprite colors (for main-site ↔ /world continuity):

```css
--sprite-outline: #0a120c;
--sprite-skin:    #ecd5b8;
--sprite-shirt:   #9cb081;  /* sage — not the accent, deliberately */
```

## Backup: Warm charcoal + terracotta

Kept as a close second — swap in if the forest feels too quiet once real content lands. Italian-film / leather-notebook energy.

```css
--bg:         #14110f;
--surface:    #1d1915;
--text:       #ede2d3;
--muted:      #8a7e6e;
--accent:     #e27148;  /* terracotta */
--accent-ink: #1a0c06;
--border:     #2a2420;
```

Pixel-sprite colors:

```css
--sprite-outline: #120c08;
--sprite-skin:    #f1c89a;
--sprite-shirt:   #e27148;
```

## Typography (locked in during prototyping)

- Body: **Inter** (400/500/600/700)
- Display: **Space Grotesk** (500/600/700) — hero name, headings
- Mono: **JetBrains Mono** (500) — eyebrow labels, small utility text

All free via Google Fonts.
