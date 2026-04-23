import * as Phaser from "phaser";
import { CANVAS_WIDTH, PALETTE } from "../config";

/**
 * Corner audio toggle button.
 * Uses the Web Audio API to generate a simple chiptune loop
 * (no external audio files required).
 */
export class AudioToggle {
  private scene: Phaser.Scene;
  private button: Phaser.GameObjects.Text;
  private enabled = false;
  private audioCtx?: AudioContext;
  private gainNode?: GainNode;
  private oscillators: OscillatorNode[] = [];
  private intervalId?: ReturnType<typeof setInterval>;

  // Simple chiptune melody — note frequencies in Hz
  private melody = [
    261.63, 329.63, 392.0, 329.63,
    261.63, 220.0, 261.63, 329.63,
    392.0, 440.0, 392.0, 329.63,
    261.63, 329.63, 261.63, 220.0,
  ];
  private melodyStep = 0;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.button = scene.add.text(CANVAS_WIDTH - 16, 4, "♪", {
      fontFamily: "monospace",
      fontSize: "8px",
      color: "#7a8872",
    });
    this.button.setDepth(200);
    this.button.setInteractive({ useHandCursor: true });
    this.button.on("pointerdown", () => this.toggle());
    this.button.on("pointerover", () =>
      this.button.setStyle({ color: "#d4a574" })
    );
    this.button.on("pointerout", () =>
      this.button.setStyle({
        color: this.enabled ? "#9cb081" : "#7a8872",
      })
    );
  }

  toggle() {
    if (this.enabled) {
      this.stop();
    } else {
      this.start();
    }
  }

  private start() {
    try {
      this.audioCtx = new AudioContext();
      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.value = 0.08;
      this.gainNode.connect(this.audioCtx.destination);
      this.enabled = true;
      this.button.setStyle({ color: "#9cb081" });
      this.playNextNote();
      this.intervalId = setInterval(() => this.playNextNote(), 180);
    } catch {
      // Web Audio not available
    }
  }

  private playNextNote() {
    if (!this.audioCtx || !this.gainNode) return;
    const freq = this.melody[this.melodyStep % this.melody.length];
    this.melodyStep++;

    const osc = this.audioCtx.createOscillator();
    osc.type = "square";
    osc.frequency.value = freq;

    const envGain = this.audioCtx.createGain();
    envGain.gain.setValueAtTime(1, this.audioCtx.currentTime);
    envGain.gain.exponentialRampToValueAtTime(
      0.001,
      this.audioCtx.currentTime + 0.15
    );

    osc.connect(envGain);
    envGain.connect(this.gainNode);
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.15);
  }

  private stop() {
    clearInterval(this.intervalId);
    this.oscillators.forEach((o) => {
      try {
        o.stop();
      } catch {}
    });
    this.oscillators = [];
    this.audioCtx?.close();
    this.audioCtx = undefined;
    this.gainNode = undefined;
    this.enabled = false;
    this.button.setStyle({ color: "#7a8872" });
  }

  destroy() {
    this.stop();
    this.button.destroy();
  }
}
