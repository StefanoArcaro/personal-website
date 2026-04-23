import * as Phaser from "phaser";
import { TILE_SIZE, PALETTE, BEDROOM_COLS, BEDROOM_ROWS, CANVAS_WIDTH, CANVAS_HEIGHT } from "../config";
import { Player } from "../player/Player";
import { DialogBox } from "../ui/DialogBox";
import { AudioToggle } from "../ui/AudioToggle";

type InteractableTile = {
  tx: number;
  ty: number;
  label: string;
  text: string;
};

// Tile IDs used in the map
const T = {
  FLOOR: 0,
  WALL_TOP: 1,
  WALL_FRONT: 2,
  BED_HEAD: 3,
  BED_FOOT: 4,
  DESK: 5,
  MONITOR: 6,
  SHELF: 7,
  BOOK_ROW: 8,
  POSTER_GAME: 9,
  POSTER_MUSIC: 10,
  POSTER_FILM: 11,
  DOOR: 12,
  DOOR_TOP: 13,
  RUG: 14,
};

export class BedroomScene extends Phaser.Scene {
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
  // (row 0 = top wall)
  private map: number[][] = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [2,7,7,7,7,7,2,9,2,10,2,11,2,2],
    [2,8,8,8,8,8,2,0,2, 0,2, 0,2,2],
    [2,0,0,0,0,0,0,0,0, 0,0, 0,0,2],
    [2,0,0,0,0,0,0,0,0, 0,0, 0,0,2],
    [2,0,14,14,14,0,0,0,0, 0,3, 3,0,2],
    [2,0,14,14,14,0,0,0,0, 0,4, 4,0,2],
    [2,5,5,6,0,0,0,0,0, 0,0, 0,0,2],
    [2,0,0,0,0,0,0,0,0, 0,0, 0,0,2],
    [2,2,2,2,2,2,13,12,13,2,2,2,2,2],
  ];

  constructor() {
    super({ key: "BedroomScene" });
  }

  init(data: { spawnX?: number; spawnY?: number }) {
    (this as any)._spawnX = data.spawnX ?? 6;
    (this as any)._spawnY = data.spawnY ?? 5;
  }

  preload() {
    // All assets are procedural — nothing to load
  }

  create() {
    this.buildMap();
    this.buildInteractables();

    const spawnX = (this as any)._spawnX ?? 6;
    const spawnY = (this as any)._spawnY ?? 5;
    this.player = new Player(this, spawnX, spawnY);

    this.dialog = new DialogBox(this);
    this.audio = new AudioToggle(this);

    // Input
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
    const label = this.add.text(CANVAS_WIDTH / 2, 4, "— Bedroom —", {
      fontFamily: "monospace",
      fontSize: "6px",
      color: "#7a8872",
    });
    label.setOrigin(0.5, 0);
    label.setDepth(50);

    // D-pad hint
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

    for (let row = 0; row < BEDROOM_ROWS; row++) {
      for (let col = 0; col < BEDROOM_COLS; col++) {
        const tileId = this.map[row]?.[col] ?? 0;
        const x = col * TILE_SIZE;
        const y = row * TILE_SIZE;

        this.drawTile(gfx, tileId, x, y);

        // Mark solid tiles
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
        gfx.fillStyle(PALETTE.floor);
        gfx.fillRect(x, y, S, S);
        gfx.fillStyle(PALETTE.floorAlt);
        // subtle checker
        if ((x / S + y / S) % 2 === 0) gfx.fillRect(x + 1, y + 1, S - 2, S - 2);
        break;
      case T.RUG:
        gfx.fillStyle(PALETTE.floor);
        gfx.fillRect(x, y, S, S);
        gfx.fillStyle(0x2d4830);
        gfx.fillRect(x + 1, y + 1, S - 2, S - 2);
        gfx.fillStyle(0x3a6040);
        gfx.fillRect(x + 3, y + 3, S - 6, S - 6);
        break;
      case T.BED_HEAD:
        gfx.fillStyle(PALETTE.floor);
        gfx.fillRect(x, y, S, S);
        gfx.fillStyle(PALETTE.bedFrame);
        gfx.fillRect(x, y, S, S - 4);
        gfx.fillStyle(PALETTE.bedPillow);
        gfx.fillRect(x + 2, y + 2, S - 4, S - 8);
        gfx.fillStyle(PALETTE.woodDark);
        gfx.fillRect(x, y + S - 4, S, 4);
        break;
      case T.BED_FOOT:
        gfx.fillStyle(PALETTE.floor);
        gfx.fillRect(x, y, S, S);
        gfx.fillStyle(PALETTE.bedSheet);
        gfx.fillRect(x, y, S, S - 4);
        gfx.fillStyle(PALETTE.bedFrame);
        gfx.fillRect(x, y, 2, S - 4);
        gfx.fillStyle(PALETTE.bedFrame);
        gfx.fillRect(x + S - 2, y, 2, S - 4);
        gfx.fillStyle(PALETTE.woodDark);
        gfx.fillRect(x, y + S - 4, S, 4);
        break;
      case T.SHELF:
        gfx.fillStyle(PALETTE.wallFront);
        gfx.fillRect(x, y, S, S);
        gfx.fillStyle(PALETTE.shelfBoard);
        gfx.fillRect(x, y + 4, S, 3);
        gfx.fillStyle(PALETTE.shelfBoard);
        gfx.fillRect(x, y + S - 3, S, 3);
        break;
      case T.BOOK_ROW: {
        gfx.fillStyle(PALETTE.wallFront);
        gfx.fillRect(x, y, S, S);
        // Shelf board
        gfx.fillStyle(PALETTE.shelfBoard);
        gfx.fillRect(x, y + 11, S, 2);
        // Books
        const books = [PALETTE.bookA, PALETTE.bookB, PALETTE.bookC, PALETTE.bookD, PALETTE.bookA, PALETTE.bookC];
        let bx = x + 1;
        for (const bcolor of books) {
          const bw = 2;
          gfx.fillStyle(bcolor);
          gfx.fillRect(bx, y + 3, bw, 9);
          bx += bw + 0.5;
          if (bx >= x + S - 1) break;
        }
        break;
      }
      case T.DESK:
        gfx.fillStyle(PALETTE.floor);
        gfx.fillRect(x, y, S, S);
        gfx.fillStyle(PALETTE.woodMid);
        gfx.fillRect(x, y + 5, S, 8);
        gfx.fillStyle(PALETTE.woodLight);
        gfx.fillRect(x, y + 5, S, 2);
        gfx.fillStyle(PALETTE.woodDark);
        gfx.fillRect(x + 1, y + S - 3, 2, 3);
        gfx.fillRect(x + S - 3, y + S - 3, 2, 3);
        break;
      case T.MONITOR:
        gfx.fillStyle(PALETTE.floor);
        gfx.fillRect(x, y, S, S);
        gfx.fillStyle(PALETTE.woodMid);
        gfx.fillRect(x, y + 5, S, 8);
        gfx.fillStyle(PALETTE.woodLight);
        gfx.fillRect(x, y + 5, S, 2);
        // Monitor on desk
        gfx.fillStyle(PALETTE.monitorDark);
        gfx.fillRect(x + 2, y, S - 4, 7);
        gfx.fillStyle(PALETTE.screenGlow);
        gfx.fillRect(x + 3, y + 1, S - 6, 4);
        // tiny text lines on screen
        gfx.fillStyle(PALETTE.monitorDark);
        gfx.fillRect(x + 3, y + 2, S - 8, 1);
        gfx.fillRect(x + 3, y + 4, 4, 1);
        break;
      case T.POSTER_GAME:
        gfx.fillStyle(PALETTE.wallFront);
        gfx.fillRect(x, y, S, S);
        gfx.fillStyle(PALETTE.posterBorder);
        gfx.fillRect(x + 2, y + 2, S - 4, S - 4);
        gfx.fillStyle(PALETTE.posterBg);
        gfx.fillRect(x + 3, y + 3, S - 6, S - 6);
        gfx.fillStyle(PALETTE.posterText);
        gfx.fillRect(x + 4, y + 5, S - 8, 1); // game controller shape
        gfx.fillRect(x + 5, y + 4, 1, 3);
        gfx.fillRect(x + 10, y + 5, 1, 1);
        gfx.fillRect(x + 11, y + 4, 1, 3);
        break;
      case T.POSTER_MUSIC:
        gfx.fillStyle(PALETTE.wallFront);
        gfx.fillRect(x, y, S, S);
        gfx.fillStyle(PALETTE.posterBorder);
        gfx.fillRect(x + 2, y + 2, S - 4, S - 4);
        gfx.fillStyle(PALETTE.posterBg);
        gfx.fillRect(x + 3, y + 3, S - 6, S - 6);
        // Music note shape
        gfx.fillStyle(PALETTE.bookB);
        gfx.fillRect(x + 7, y + 4, 2, 6);
        gfx.fillRect(x + 4, y + 4, 4, 2);
        gfx.fillRect(x + 5, y + 8, 3, 3);
        break;
      case T.POSTER_FILM:
        gfx.fillStyle(PALETTE.wallFront);
        gfx.fillRect(x, y, S, S);
        gfx.fillStyle(PALETTE.posterBorder);
        gfx.fillRect(x + 2, y + 2, S - 4, S - 4);
        gfx.fillStyle(PALETTE.posterBg);
        gfx.fillRect(x + 3, y + 3, S - 6, S - 6);
        // Film strip look
        gfx.fillStyle(PALETTE.doorKnob);
        gfx.fillRect(x + 4, y + 4, S - 8, S - 8);
        gfx.fillStyle(PALETTE.monitorDark);
        gfx.fillRect(x + 4, y + 4, 2, 2);
        gfx.fillRect(x + 4, y + 8, 2, 2);
        gfx.fillRect(x + 10, y + 4, 2, 2);
        gfx.fillRect(x + 10, y + 8, 2, 2);
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
        gfx.fillCircle(x + S - 4, y + S / 2, 1);
        break;
      default:
        gfx.fillStyle(PALETTE.floor);
        gfx.fillRect(x, y, S, S);
    }
  }

  private isSolid(id: number): boolean {
    return [T.WALL_TOP, T.WALL_FRONT, T.BED_HEAD, T.BED_FOOT, T.SHELF, T.BOOK_ROW, T.POSTER_GAME, T.POSTER_MUSIC, T.POSTER_FILM, T.DESK, T.MONITOR, T.DOOR_TOP].includes(id);
  }

  private buildInteractables() {
    this.interactables = [
      // Bookshelf row — tiles (1,1)-(5,1) are shelf/book tiles, interact from row 2
      { tx: 1, ty: 2, label: "bookshelf", text: "A shelf full of books.\nCurrently reading: Thinking, Fast and Slow." },
      { tx: 2, ty: 2, label: "bookshelf", text: "A shelf full of books.\nCurrently reading: Thinking, Fast and Slow." },
      { tx: 3, ty: 2, label: "bookshelf", text: "A shelf full of books.\nCurrently reading: Thinking, Fast and Slow." },
      { tx: 4, ty: 2, label: "bookshelf", text: "A shelf full of books.\nCurrently reading: Thinking, Fast and Slow." },
      { tx: 5, ty: 2, label: "bookshelf", text: "A shelf full of books.\nCurrently reading: Thinking, Fast and Slow." },
      // Desk
      { tx: 1, ty: 8, label: "desk", text: "Your trusty workstation.\nThe terminal is still open." },
      { tx: 2, ty: 8, label: "desk", text: "Your trusty workstation.\nThe terminal is still open." },
      // Monitor
      { tx: 3, ty: 8, label: "monitor", text: "The screen glows. Claude Code is running.\nAlways." },
      // Bed
      { tx: 10, ty: 6, label: "bed", text: "zzz... not now." },
      { tx: 11, ty: 6, label: "bed", text: "zzz... not now." },
      // Posters (face them from row 2)
      { tx: 7, ty: 2, label: "poster", text: "A poster of FFIX.\n\"You are not alone. Not anymore.\"" },
      { tx: 9, ty: 2, label: "poster", text: "A poster of Burial — Untrue.\nStatic hiss and city lights." },
      { tx: 11, ty: 2, label: "poster", text: "A poster of 2001: A Space Odyssey.\nDave... I'm afraid." },
    ];
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

    // Space/Enter — interact
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

    // Movement
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
    if (tx < 0 || ty < 0 || tx >= BEDROOM_COLS || ty >= BEDROOM_ROWS) return true;
    return this.solidTiles.has(`${tx},${ty}`);
  }

  private checkTransition() {
    // Door tile (DOOR=12) is at col=7, row=9 — the only walkable door tile
    if (this.player.tileY === 9 && this.player.tileX === 7) {
      this.transitionTo("ArcadeScene", 2, 2);
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
