export const TILE_SIZE = 16;
export const SCALE = 3;

// Canvas dimensions in tiles
export const BEDROOM_COLS = 14;
export const BEDROOM_ROWS = 10;
export const ARCADE_COLS = 14;
export const ARCADE_ROWS = 10;

export const CANVAS_WIDTH = BEDROOM_COLS * TILE_SIZE;
export const CANVAS_HEIGHT = BEDROOM_ROWS * TILE_SIZE;

// Gen-3/4 palette — forest/dark accents matching the main site
export const PALETTE = {
  // walls / structure
  wallTop: 0x2d3f30,
  wallFront: 0x1f2b22,
  wallDark: 0x151e17,
  floor: 0x1a2b1d,
  floorAlt: 0x1e3021,
  // furniture
  woodDark: 0x3b2a18,
  woodMid: 0x5c4220,
  woodLight: 0x7a5a30,
  bedFrame: 0x4a3520,
  bedSheet: 0x6b8560,
  bedPillow: 0xd8e2ce,
  shelfBoard: 0x5c4220,
  bookA: 0x9cb081,
  bookB: 0xd4a574,
  bookC: 0x7a8872,
  bookD: 0x5a7a60,
  // computer / desk
  monitorDark: 0x0d120e,
  monitorLight: 0x1a2b1d,
  screenGlow: 0x9cb081,
  // accent / decoration
  posterBorder: 0x3b2a18,
  posterBg: 0x1f2b22,
  posterText: 0x9cb081,
  doorFrame: 0x5c4220,
  doorPanel: 0x7a5a30,
  doorKnob: 0xd4a574,
  // arcade
  cabinetBody: 0x1a2010,
  cabinetTrim: 0xd4a574,
  cabinetScreen: 0x050a06,
  cabinetGlow: 0x9cb081,
  cabinetButtons: 0x8b1a1a,
  // player
  playerOutline: 0x0a120c,
  playerSkin: 0xecd5b8,
  playerShirt: 0x9cb081,
  playerHair: 0x3b2a18,
  playerPants: 0x2d3f30,
  // tile border
  tileBorder: 0x0d120e,
} as const;

// Phaser constants — referenced by value, so imported at call time via the
// Phaser module that is already in scope when makeGameConfig is called.
// We accept Phaser as a parameter to avoid a circular import issue.
export function makeGameConfig(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Phaser: any,
  parent: HTMLElement,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scenes: any[]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  return {
    type: Phaser.AUTO,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    pixelArt: true,
    roundPixels: true,
    backgroundColor: "#0d120e",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
    },
    parent,
    scene: scenes,
    audio: {
      disableWebAudio: false,
    },
  };
}
