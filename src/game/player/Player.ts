import * as Phaser from "phaser";
import { TILE_SIZE, PALETTE } from "../config";

export type Direction = "up" | "down" | "left" | "right";

const MOVE_DURATION = 160; // ms per tile

/**
 * Player character — grid-based movement with smooth tween interpolation.
 * Sprite is drawn procedurally onto a canvas texture (8 frames: 4 directions × 2 walk frames).
 */
export class Player {
  public sprite: Phaser.GameObjects.Image;
  public tileX: number;
  public tileY: number;
  public facing: Direction = "down";
  public moving = false;

  private scene: Phaser.Scene;
  private readonly textureKey = "player_sprite";
  private walkFrame = 0;

  constructor(scene: Phaser.Scene, tileX: number, tileY: number) {
    this.scene = scene;
    this.tileX = tileX;
    this.tileY = tileY;

    this.createTexture();

    this.sprite = scene.add.image(
      tileX * TILE_SIZE + TILE_SIZE / 2,
      tileY * TILE_SIZE + TILE_SIZE / 2,
      this.textureKey,
      this.getFrame()
    );
    this.sprite.setDepth(10);
  }

  private createTexture() {
    if (this.scene.textures.exists(this.textureKey)) return;

    // 8 frames in a horizontal strip, each 16×16
    const frameW = TILE_SIZE;
    const frameH = TILE_SIZE;
    const numFrames = 8;

    const canvas = this.scene.textures.createCanvas(
      this.textureKey,
      frameW * numFrames,
      frameH
    );
    if (!canvas) return;

    const ctx = (canvas as Phaser.Textures.CanvasTexture).getContext();

    const O = "#" + PALETTE.playerOutline.toString(16).padStart(6, "0");
    const S = "#" + PALETTE.playerSkin.toString(16).padStart(6, "0");
    const T = "#" + PALETTE.playerShirt.toString(16).padStart(6, "0");
    const H = "#" + PALETTE.playerHair.toString(16).padStart(6, "0");
    const P = "#" + PALETTE.playerPants.toString(16).padStart(6, "0");

    // Draw a pixel at (px, py) within the given frame index
    const px = (fi: number, x: number, y: number, col: string) => {
      ctx.fillStyle = col;
      ctx.fillRect(fi * frameW + x, y, 1, 1);
    };

    // Define character pixel data as [x, y, color] triples within a 8×10 grid
    // The character is drawn at y offset +1 so it sits at row 1 within the 16-tall frame

    // Helper: build a "facing down" character
    const makeDown = (walkAlt: boolean): Array<[number, number, string]> => [
      // head
      [2, 0, O],[3, 0, O],[4, 0, O],[5, 0, O],
      [1, 1, O],[6, 1, O],
      [0, 2, O],[7, 2, O],
      [2, 1, S],[3, 1, S],[4, 1, S],[5, 1, S],
      [1, 2, S],[2, 2, S],[3, 2, S],[4, 2, S],[5, 2, S],[6, 2, S],
      // eyes
      [2, 2, O],[5, 2, O],
      // body
      [0, 3, O],[7, 3, O],[1, 3, T],[2, 3, T],[3, 3, T],[4, 3, T],[5, 3, T],[6, 3, T],
      [0, 4, O],[7, 4, O],[1, 4, T],[2, 4, T],[3, 4, T],[4, 4, T],[5, 4, T],[6, 4, T],
      [1, 5, O],[6, 5, O],
      // legs — alternate foot positions for walking
      ...(walkAlt
        ? [[1, 5, P],[2, 5, P],[5, 5, P],[6, 5, P],[1, 6, P],[2, 6, P],[5, 6, P],[6, 6, P],[1, 7, O],[2, 7, O],[5, 7, O],[6, 7, O]] as Array<[number, number, string]>
        : [[2, 5, P],[3, 5, P],[4, 5, P],[5, 5, P],[2, 6, P],[3, 6, P],[4, 6, P],[5, 6, P],[2, 7, O],[3, 7, O],[4, 7, O],[5, 7, O]] as Array<[number, number, string]>
      ),
    ];

    const makeUp = (walkAlt: boolean): Array<[number, number, string]> => [
      // head (hair shown, no eyes)
      [2, 0, O],[3, 0, O],[4, 0, O],[5, 0, O],
      [1, 1, O],[6, 1, O],
      [0, 2, O],[7, 2, O],
      [2, 1, H],[3, 1, H],[4, 1, H],[5, 1, H],
      [1, 2, H],[2, 2, H],[3, 2, H],[4, 2, H],[5, 2, H],[6, 2, H],
      // body
      [0, 3, O],[7, 3, O],[1, 3, T],[2, 3, T],[3, 3, T],[4, 3, T],[5, 3, T],[6, 3, T],
      [0, 4, O],[7, 4, O],[1, 4, T],[2, 4, T],[3, 4, T],[4, 4, T],[5, 4, T],[6, 4, T],
      [1, 5, O],[6, 5, O],
      ...(walkAlt
        ? [[1, 5, P],[2, 5, P],[5, 5, P],[6, 5, P],[1, 6, P],[2, 6, P],[5, 6, P],[6, 6, P],[1, 7, O],[2, 7, O],[5, 7, O],[6, 7, O]] as Array<[number, number, string]>
        : [[2, 5, P],[3, 5, P],[4, 5, P],[5, 5, P],[2, 6, P],[3, 6, P],[4, 6, P],[5, 6, P],[2, 7, O],[3, 7, O],[4, 7, O],[5, 7, O]] as Array<[number, number, string]>
      ),
    ];

    const makeLeft = (walkAlt: boolean): Array<[number, number, string]> => [
      [2, 0, O],[3, 0, O],[4, 0, O],[5, 0, O],
      [1, 1, O],[5, 1, O],
      [0, 2, O],[5, 2, O],
      [2, 1, H],[3, 1, H],[4, 1, H],
      [1, 2, H],[2, 2, S],[3, 2, S],[4, 2, S],
      [2, 2, O], // eye
      // body
      [0, 3, O],[5, 3, O],[1, 3, T],[2, 3, T],[3, 3, T],[4, 3, T],
      [0, 4, O],[5, 4, O],[1, 4, T],[2, 4, T],[3, 4, T],[4, 4, T],
      [0, 5, O],[5, 5, O],
      ...(walkAlt
        ? [[1, 5, P],[2, 5, P],[3, 5, P],[4, 5, P],[1, 6, P],[2, 6, P],[0, 7, O],[1, 7, O],[3, 7, O],[4, 7, O]] as Array<[number, number, string]>
        : [[1, 5, P],[2, 5, P],[3, 5, P],[4, 5, P],[2, 6, P],[3, 6, P],[2, 7, O],[3, 7, O]] as Array<[number, number, string]>
      ),
    ];

    const flipH = (pixels: Array<[number, number, string]>, w = 5): Array<[number, number, string]> =>
      pixels.map(([x, y, col]) => [w - x, y, col] as [number, number, string]);

    const right0 = flipH(makeLeft(false), 7);
    const right1 = flipH(makeLeft(true), 7);

    // Frame order: down0, down1, up0, up1, left0, left1, right0, right1
    const allFrames = [
      makeDown(false),
      makeDown(true),
      makeUp(false),
      makeUp(true),
      makeLeft(false),
      makeLeft(true),
      right0,
      right1,
    ];

    const yOff = 1; // vertical offset within 16px frame
    allFrames.forEach((framePixels, fi) => {
      ctx.clearRect(fi * frameW, 0, frameW, frameH);
      framePixels.forEach(([x, y, col]) => {
        px(fi, x, y + yOff, col);
      });
    });

    (canvas as Phaser.Textures.CanvasTexture).refresh();

    // Register individual frame regions in the texture
    const tex = this.scene.textures.get(this.textureKey);
    for (let i = 0; i < numFrames; i++) {
      tex.add(i, 0, i * frameW, 0, frameW, frameH);
    }
  }

  private getFrame(): number {
    const dirBase: Record<Direction, number> = { down: 0, up: 2, left: 4, right: 6 };
    return dirBase[this.facing] + this.walkFrame;
  }

  move(
    dir: Direction,
    blocked: (tx: number, ty: number) => boolean,
    onComplete?: () => void
  ) {
    if (this.moving) return;

    this.facing = dir;
    this.sprite.setFrame(this.getFrame());

    const dx = dir === "right" ? 1 : dir === "left" ? -1 : 0;
    const dy = dir === "down" ? 1 : dir === "up" ? -1 : 0;
    const nextX = this.tileX + dx;
    const nextY = this.tileY + dy;

    if (blocked(nextX, nextY)) {
      return; // Just face the direction
    }

    this.moving = true;
    this.tileX = nextX;
    this.tileY = nextY;
    this.walkFrame = this.walkFrame === 0 ? 1 : 0;

    this.scene.tweens.add({
      targets: this.sprite,
      x: nextX * TILE_SIZE + TILE_SIZE / 2,
      y: nextY * TILE_SIZE + TILE_SIZE / 2,
      duration: MOVE_DURATION,
      ease: "Linear",
      onComplete: () => {
        this.moving = false;
        this.walkFrame = 0;
        this.sprite.setFrame(this.getFrame());
        onComplete?.();
      },
    });
  }

  setTile(tileX: number, tileY: number) {
    this.tileX = tileX;
    this.tileY = tileY;
    this.sprite.setPosition(
      tileX * TILE_SIZE + TILE_SIZE / 2,
      tileY * TILE_SIZE + TILE_SIZE / 2
    );
  }

  getFacingTile(): { x: number; y: number } {
    const dx = this.facing === "right" ? 1 : this.facing === "left" ? -1 : 0;
    const dy = this.facing === "down" ? 1 : this.facing === "up" ? -1 : 0;
    return { x: this.tileX + dx, y: this.tileY + dy };
  }

  destroy() {
    this.sprite.destroy();
  }
}
