import { useEffect, useRef } from "react";

type PhaserGame = { destroy: (removeCanvas: boolean) => void };

/**
 * Mounts the Phaser overworld game on a div ref.
 * Uses client:only="react" so Phaser never runs server-side.
 */
export default function OverworldGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<PhaserGame | null>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    // Dynamic import keeps Phaser out of the SSR bundle
    Promise.all([
      import("phaser"),
      import("../game/config"),
      import("../game/scenes/BedroomScene"),
      import("../game/scenes/ArcadeScene"),
    ]).then(([Phaser, { makeGameConfig }, { BedroomScene }, { ArcadeScene }]) => {
      if (!containerRef.current) return;

      const config = makeGameConfig(Phaser, containerRef.current, [
        BedroomScene,
        ArcadeScene,
      ]);

      gameRef.current = new Phaser.Game(config);
    });

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: "672px",
        aspectRatio: "14 / 10",
        margin: "0 auto",
        imageRendering: "pixelated",
        borderRadius: "4px",
        overflow: "hidden",
        boxShadow: "0 0 0 1px #1f2b22, 0 8px 32px rgba(0,0,0,0.6)",
      }}
    />
  );
}
