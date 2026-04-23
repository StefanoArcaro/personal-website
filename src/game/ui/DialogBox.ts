import * as Phaser from "phaser";
import { CANVAS_WIDTH, CANVAS_HEIGHT, PALETTE } from "../config";

const BOX_HEIGHT = 48;
const BOX_MARGIN = 6;
const BOX_PADDING = 8;
const TEXT_SIZE = 6;
const CHARS_PER_TICK = 2; // typewriter speed
const TICK_DELAY = 40; // ms

/**
 * Simple dialog box that appears at the bottom of the screen.
 * Supports typewriter text reveal and dismiss on keypress.
 */
export class DialogBox {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private bg: Phaser.GameObjects.Graphics;
  private textObj: Phaser.GameObjects.Text;
  private arrowObj: Phaser.GameObjects.Text;
  private fullText = "";
  private displayedChars = 0;
  private typewriterTimer?: Phaser.Time.TimerEvent;
  private done = false;
  public isOpen = false;
  private onDismiss?: () => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    const y = CANVAS_HEIGHT - BOX_HEIGHT - BOX_MARGIN;
    const x = BOX_MARGIN;
    const w = CANVAS_WIDTH - BOX_MARGIN * 2;

    this.container = scene.add.container(0, 0);
    this.container.setDepth(100);
    this.container.setVisible(false);

    this.bg = scene.add.graphics();
    this.bg.fillStyle(PALETTE.wallDark, 0.95);
    this.bg.lineStyle(1, PALETTE.doorKnob, 1);
    this.bg.fillRoundedRect(x, y, w, BOX_HEIGHT, 3);
    this.bg.strokeRoundedRect(x, y, w, BOX_HEIGHT, 3);

    this.textObj = scene.add.text(
      x + BOX_PADDING,
      y + BOX_PADDING,
      "",
      {
        fontFamily: "monospace",
        fontSize: `${TEXT_SIZE}px`,
        color: "#d8e2ce",
        wordWrap: { width: w - BOX_PADDING * 2 },
        lineSpacing: 2,
      }
    );

    this.arrowObj = scene.add.text(
      x + w - BOX_PADDING - 6,
      y + BOX_HEIGHT - BOX_PADDING - 8,
      "▼",
      {
        fontFamily: "monospace",
        fontSize: `${TEXT_SIZE}px`,
        color: "#d4a574",
      }
    );
    this.arrowObj.setVisible(false);

    this.container.add([this.bg, this.textObj, this.arrowObj]);

    // Blink arrow when done
    scene.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => {
        if (this.done && this.isOpen) {
          this.arrowObj.setVisible(!this.arrowObj.visible);
        }
      },
    });
  }

  show(text: string, onDismiss?: () => void) {
    this.fullText = text;
    this.displayedChars = 0;
    this.done = false;
    this.isOpen = true;
    this.onDismiss = onDismiss;
    this.textObj.setText("");
    this.arrowObj.setVisible(false);
    this.container.setVisible(true);

    this.typewriterTimer?.destroy();
    this.typewriterTimer = this.scene.time.addEvent({
      delay: TICK_DELAY,
      loop: true,
      callback: this.tick,
      callbackScope: this,
    });
  }

  private tick() {
    if (this.displayedChars >= this.fullText.length) {
      this.typewriterTimer?.destroy();
      this.done = true;
      this.arrowObj.setVisible(true);
      return;
    }
    this.displayedChars = Math.min(
      this.displayedChars + CHARS_PER_TICK,
      this.fullText.length
    );
    this.textObj.setText(this.fullText.slice(0, this.displayedChars));
  }

  /** Call on Space/Enter press */
  interact() {
    if (!this.isOpen) return false;
    if (!this.done) {
      // Skip to end
      this.typewriterTimer?.destroy();
      this.displayedChars = this.fullText.length;
      this.textObj.setText(this.fullText);
      this.done = true;
      this.arrowObj.setVisible(true);
      return true;
    }
    // Already done — dismiss
    this.dismiss();
    return true;
  }

  dismiss() {
    this.isOpen = false;
    this.container.setVisible(false);
    this.typewriterTimer?.destroy();
    this.onDismiss?.();
  }

  destroy() {
    this.typewriterTimer?.destroy();
    this.container.destroy();
  }
}
