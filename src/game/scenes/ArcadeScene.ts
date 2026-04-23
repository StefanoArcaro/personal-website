import * as Phaser from "phaser";
import { TILE_SIZE, PALETTE, ARCADE_COLS, ARCADE_ROWS, CANVAS_WIDTH, CANVAS_HEIGHT } from "../config";
import { Player } from "../player/Player";
import { DialogBox } from "../ui/DialogBox";
import { AudioToggle } from "../ui/AudioToggle";

type InteractableTile = {
  tx: number;
  ty: number;
  label: string;
  text: string;
};

const T = {
  FLOOR: 0,
  WALL_TOP: 1,
  WALL_FRONT: 2,
  CABINET_A: 3,  // arcade cabinet (left side)
  CABINET_B: 4,  // arcade cabinet (right side)
  CABINET_SIDE: 5,
  DOOR: 6,
  DOOR_TOP: 7,
  FLOOR_DARK: 8,
  NEON_STRIP: 9,
};

export class ArcadeScene extends Phaser.Scene {
  private player!: Player;
  private dialog!: DialogBox;
  private audio!: AudioToggle;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { up: Phaser.Input.Keyboard.Key; down: Phaser.Input.Keyboard.Key; left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key };
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private enterKey!: Phaser.Input.Keyboard.Key;

  private solidTiles = new Set<string>();
  private interactables: InteractableTile[] = [];
  private transitioning = false;

  // Map: 14 cols × 10 rows
  private map: number[][] = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [2,7,6,7,2,3,3,3,3,2,3,3,3,2],
    [2,0,0,0,2,4,4,4,4,2,4,4,4,2],
    [2,0,0,0,2,5,5,5,5,2,5,5,5,2],
    [2,9,0,9,2,0,0,0,0,2,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,2,3,3,3,3,2,3,3,3,2],
    [2,0,0,0,2,4,4,4,4,2,4,4,4,2],
    [2,0,0,0,2,5,5,5,5,2,5,5,5,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  ];

  constructor() {
    super({ key: "ArcadeScene" });
  }

  init(data: { spawnX?: number; spawnY?: number }) {
    // Store spawn point passed from BedroomScene
    (this as any)._spawnX = data.spawnX ?? 2;
    (this as any)._spawnY = data.spawnY ?? 4;
  }

  create() {
    this.buildMap();
    this.buildInteractables();

    const spawnX = (this as any)._spawnX ?? 2;
    const spawnY = (this as any)._spawnY ?? 4;
    this.player = new Player(this, spawnX, spawnY);

    this.dialog = new DialogBox(this);
    this.audio = new AudioToggle(this);

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.enterKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    // Room label
    const label = this.add.text(CANVAS_WIDTH / 2, 4, "— Arcade —", {
      fontFamily: "monospace",
      fontSize: "6px",
      color: "#7a8872",
    });
    label.setOrigin(0.5, 0);
    label.setDepth(50);

    const hint = this.add.text(4, CANVAS_HEIGHT - 10, "arrows/WASD  ·  space = talk", {
      fontFamily: "monospace",
      fontSize: "5px",
      color: "#3a4e3a",
    });
    hint.setDepth(50);

    // Fade in
    this.cameras.main.fadeIn(300, 0, 0, 0);
  }

  private buildMap() {
    const gfx = this.add.graphics();

    for (let row = 0; row < ARCADE_ROWS; row++) {
      for (let col = 0; col < ARCADE_COLS; col++) {
        const tileId = this.map[row]?.[col] ?? 0;
        const x = col * TILE_SIZE;
        const y = row * TILE_SIZE;

        this.drawTile(gfx, tileId, x, y);

        if (this.isSolid(tileId)) {
          this.solidTiles.add(`${col},${row}`);
        }
      }
    }
  }

  private drawTile(gfx: Phaser.GameObjects.Graphics, id: number, x: number, y: number) {
    const S = TILE_SIZE;
    switch (id) {
      case T.WALL_TOP:
        gfx.fillStyle(PALETTE.wallTop);
        gfx.fillRect(x, y, S, S);
        gfx.fillStyle(PALETTE.wallDark);
        gfx.fillRect(x, y + S - 2, S, 2);
        break;
      case T.WALL_FRONT:
        gfx.fillStyle(PALETTE.wallFront);
        gfx.fillRect(x, y, S, S);
        gfx.fillStyle(PALETTE.wallDark);
        gfx.fillRect(x, y, S, 1);
        break;
      case T.FLOOR:
        gfx.fillStyle(0x0f1a10);
        gfx.fillRect(x, y, S, S);
        // subtle dark grid
        gfx.fillStyle(0x12201a);
        if ((Math.floor(x / S) + Math.floor(y / S)) % 2 === 0) {
          gfx.fillRect(x + 1, y + 1, S - 2, S - 2);
        }
        break;
      case T.FLOOR_DARK:
        gfx.fillStyle(0x0a1208);
        gfx.fillRect(x, y, S, S);
        break;
      case T.NEON_STRIP:
        gfx.fillStyle(0x0f1a10);
        gfx.fillRect(x, y, S, S);
        gfx.fillStyle(0x2a6040);
        gfx.fillRect(x + 2, y + S / 2 - 1, S - 4, 2);
        break;
      case T.CABINET_A: {
        // Top of cabinet - screen and marquee
        gfx.fillStyle(PALETTE.cabinetBody);
        gfx.fillRect(x, y, S, S);
        // Marquee
        gfx.fillStyle(PALETTE.cabinetTrim);
        gfx.fillRect(x, y, S, 3);
        // Screen
        gfx.fillStyle(PALETTE.cabinetScreen);
        gfx.fillRect(x + 1, y + 4, S - 2, 9);
        // Screen glow
        gfx.fillStyle(PALETTE.cabinetGlow);
        gfx.fillRect(x + 2, y + 5, S - 4, 7);
        // Scan lines
        gfx.fillStyle(PALETTE.cabinetScreen);
        for (let sy = y + 6; sy < y + 12; sy += 2) {
          gfx.fillRect(x + 2, sy, S - 4, 1);
        }
        break;
      }
      case T.CABINET_B: {
        // Bottom of cabinet - controls
        gfx.fillStyle(PALETTE.cabinetBody);
        gfx.fillRect(x, y, S, S);
        // Control panel
        gfx.fillStyle(0x1a2015);
        gfx.fillRect(x + 1, y + 2, S - 2, 8);
        // Joystick
        gfx.fillStyle(0x444040);
        gfx.fillCircle(x + 4, y + 6, 2);
        gfx.fillStyle(0x888080);
        gfx.fillCircle(x + 4, y + 5, 1);
        // Buttons
        gfx.fillStyle(PALETTE.cabinetButtons);
        gfx.fillCircle(x + 10, y + 5, 1);
        gfx.fillStyle(0x1a4080);
        gfx.fillCircle(x + 12, y + 7, 1);
        gfx.fillStyle(0x207030);
        gfx.fillCircle(x + 10, y + 9, 1);
        break;
      }
      case T.CABINET_SIDE:
        gfx.fillStyle(0x0d1208);
        gfx.fillRect(x, y, S, S);
        gfx.fillStyle(PALETTE.cabinetBody);
        gfx.fillRect(x + 2, y, S - 2, S);
        break;
      case T.DOOR_TOP:
        gfx.fillStyle(PALETTE.wallFront);
        gfx.fillRect(x, y, S, S);
        gfx.fillStyle(PALETTE.doorFrame);
        gfx.fillRect(x + 2, y + 4, S - 4, S);
        gfx.fillStyle(PALETTE.doorPanel);
        gfx.fillRect(x + 3, y + 5, S - 6, S - 1);
        break;
      case T.DOOR:
        gfx.fillStyle(PALETTE.doorFrame);
        gfx.fillRect(x, y, S, S);
        gfx.fillStyle(PALETTE.doorPanel);
        gfx.fillRect(x + 2, y, S - 4, S);
        gfx.fillStyle(PALETTE.doorKnob);
        gfx.fillCircle(x + 4, y + S / 2, 1);
        break;
      default:
        gfx.fillStyle(0x0f1a10);
        gfx.fillRect(x, y, S, S);
    }
  }

  private isSolid(id: number): boolean {
    return [T.WALL_TOP, T.WALL_FRONT, T.CABINET_A, T.CABINET_SIDE, T.DOOR_TOP].includes(id);
  }

  private buildInteractables() {
    // Arcade cabinets — row 2 is cabinet body (CABINET_B), interact from in front
    const cabinetTexts = [
      "INSERT COIN — coming soon.",
      "INSERT COIN — coming soon.",
      "INSERT COIN — coming soon.",
      "INSERT COIN — coming soon.",
    ];

    // Top row cabinets (cols 5-8 and 10-12), interact from row 4
    const topCabinetCols = [5,6,7,8,10,11,12];
    topCabinetCols.forEach((col, i) => {
      this.interactables.push({
        tx: col, ty: 4,
        label: "cabinet",
        text: cabinetTexts[i % cabinetTexts.length],
      });
    });

    // Bottom row cabinets (row 7-8), interact from row 5
    const bottomCabinetCols = [5,6,7,8,10,11,12];
    bottomCabinetCols.forEach((col, i) => {
      this.interactables.push({
        tx: col, ty: 5,
        label: "cabinet",
        text: cabinetTexts[i % cabinetTexts.length],
      });
    });

    // Door — interact from row 2 at col 2
    this.interactables.push({
      tx: 2, ty: 2,
      label: "door",
      text: "The door back to your bedroom.",
    });
  }

  update() {
    if (this.transitioning) return;
    if (this.dialog.isOpen) {
      if (
        Phaser.Input.Keyboard.JustDown(this.spaceKey) ||
        Phaser.Input.Keyboard.JustDown(this.enterKey)
      ) {
        this.dialog.interact();
      }
      return;
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.spaceKey) ||
      Phaser.Input.Keyboard.JustDown(this.enterKey)
    ) {
      const facing = this.player.getFacingTile();
      const match = this.interactables.find(
        (i) => i.tx === facing.x && i.ty === facing.y
      );
      if (match) {
        this.dialog.show(match.text);
        return;
      }
    }

    if (!this.player.moving) {
      if (this.cursors.up.isDown || this.wasd.up.isDown) {
        this.player.move("up", (tx, ty) => this.isBlocked(tx, ty), () => this.checkTransition());
      } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
        this.player.move("down", (tx, ty) => this.isBlocked(tx, ty), () => this.checkTransition());
      } else if (this.cursors.left.isDown || this.wasd.left.isDown) {
        this.player.move("left", (tx, ty) => this.isBlocked(tx, ty), () => this.checkTransition());
      } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
        this.player.move("right", (tx, ty) => this.isBlocked(tx, ty), () => this.checkTransition());
      }
    }
  }

  private isBlocked(tx: number, ty: number): boolean {
    if (tx < 0 || ty < 0 || tx >= ARCADE_COLS || ty >= ARCADE_ROWS) return true;
    return this.solidTiles.has(`${tx},${ty}`);
  }

  private checkTransition() {
    // Door is at col=2, row=1 (DOOR tile). Player walks up onto it.
    if (this.player.tileY === 1 && this.player.tileX === 2) {
      this.transitionTo("BedroomScene", 7, 7);
    }
  }

  private transitionTo(sceneKey: string, spawnX: number, spawnY: number) {
    if (this.transitioning) return;
    this.transitioning = true;
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once("camerafadeoutcomplete", () => {
      this.audio.destroy();
      this.scene.start(sceneKey, { spawnX, spawnY });
    });
  }
}
