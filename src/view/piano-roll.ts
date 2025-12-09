// src/view/piano-roll.ts
import type { MidiSong } from "../types/midi";

export interface PianoRollOptions {
  canvas: HTMLCanvasElement;
  song: MidiSong;
  getCurrentTime: () => number;
  minPitch?: number;
  maxPitch?: number;
}

export class PianoRoll {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private song: MidiSong;
  private getCurrentTime: () => number;
  private minPitch: number;
  private maxPitch: number;
  private secToPx = 120;       // 1秒あたりのピクセル
  private keyHeight = 10;      // 1ノート高さ

  constructor(opts: PianoRollOptions) {
    this.canvas = opts.canvas;
    const ctx = this.canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context not available");
    this.ctx = ctx;

    this.song = opts.song;
    this.getCurrentTime = opts.getCurrentTime;
    this.minPitch = opts.minPitch ?? 48;  // C3くらい
    this.maxPitch = opts.maxPitch ?? 84;  // C6くらい

    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  setSong(song: MidiSong) {
    this.song = song;
  }

  private resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width || 1200;
    this.canvas.height = rect.height || 400;
  }

  draw() {
    const { ctx, canvas } = this;
    const current = this.getCurrentTime();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 背景
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const pitchRange = this.maxPitch - this.minPitch + 1;

    // グリッド（音高）
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    for (let p = this.minPitch; p <= this.maxPitch; p++) {
      const y = this.pitchToY(p, pitchRange, canvas.height);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // ノート描画
    for (const [trackIndex, track] of this.song.tracks.entries()) {
      if (track.muted) continue;
      for (const note of track.notes) {
        if (note.pitch < this.minPitch || note.pitch > this.maxPitch) continue;

        const y = this.pitchToY(note.pitch, pitchRange, canvas.height);
        const x = note.startSec * this.secToPx;
        const w = note.durationSec * this.secToPx;
        const h = this.keyHeight * 0.8;

        // トラックごとに色を変える簡易方式
        const hue = (trackIndex * 60) % 360;
        ctx.fillStyle = `hsl(${hue} 70% 55%)`;
        ctx.globalAlpha = 0.9;
        ctx.fillRect(x, y - h, w, h);

        // 縁
        ctx.globalAlpha = 1;
        ctx.strokeStyle = "rgba(0,0,0,0.6)";
        ctx.strokeRect(x, y - h, w, h);
      }
    }

    // 再生ヘッド
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    const headX = current * this.secToPx;
    ctx.beginPath();
    ctx.moveTo(headX, 0);
    ctx.lineTo(headX, canvas.height);
    ctx.stroke();
  }

  private pitchToY(pitch: number, range: number, height: number): number {
    const index = this.maxPitch - pitch; // 高い音を上
    const ratio = index / range;
    return ratio * height;
  }
}
