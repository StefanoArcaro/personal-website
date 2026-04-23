# /world — Feedback & Direction

Collected 2026-04-23 from first playable prototype (Phaser v1).

## How graphics work now

All tiles and the player sprite are generated procedurally in code using
Phaser's Graphics API (fillRect/fillCircle). No image files, spritesheets,
or tilemaps are used. This is placeholder-grade and needs to be replaced
with proper pixel art assets.

## Known issues

- **Resolution is too low.** Canvas is 224×160 (14×10 tiles at 16px) scaled
  up — everything looks very chunky. Need to revisit canvas size, tile size,
  and scale factor to find the right balance.
- **Music needs to be replaced.** Current chiptune is a simple generated
  square-wave melody via Web Audio oscillators. Needs a real composed loop
  (or at minimum a much better procedural composition).
- **Graphics need to be replaced.** Procedural colored rectangles → proper
  pixel art tileset and spritesheet. Target aesthetic: Pokémon gen-3/4.
- **Room transition breaks movement.** Going to the arcade and coming back
  to the bedroom stops player movement (input gets stuck or lost during
  scene switch).
- **Interactions are clunky.** No visual feedback about what is interactable.
  Player has to guess which objects respond to Space. Need visual cues
  (e.g., a small prompt icon, highlight, or sparkle when near an
  interactable object).
- **No indication of what to do.** First-time visitors need a gentle nudge
  (controls hint is tiny and easy to miss).

## Direction

- The contrast between the polished main site and the pixel-art /world is
  the whole vibe. The world should feel like stepping into a different medium.
- Gen-3/4 Pokémon aesthetic is the north star for art style.
- Keep it playful and discoverable — reward curiosity, don't explain everything.
- This is early alpha. The foundation (movement, scenes, dialog, audio toggle)
  is in place; now it needs real art, real music, and interaction polish.
