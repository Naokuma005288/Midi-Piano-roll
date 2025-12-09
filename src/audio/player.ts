// src/audio/player.ts
import type { MidiSong } from "../types/midi";

export class MidiPlayer {
  private song: MidiSong | null = null;
  private isPlaying = false;
  private startTime = 0;      // 再生開始したときの performance.now()
  private pauseOffset = 0;    // 一時停止までに経過した時間
  private playbackRate = 1.0; // 再生速度

  loadSong(song: MidiSong) {
    this.song = song;
    this.stop();
  }

  play() {
    if (!this.song) return;
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.startTime = performance.now() - this.pauseOffset * 1000;
  }

  pause() {
    if (!this.song) return;
    if (!this.isPlaying) return;
    this.pauseOffset = this.currentTimeSec;
    this.isPlaying = false;
  }

  stop() {
    this.isPlaying = false;
    this.pauseOffset = 0;
  }

  setPlaybackRate(rate: number) {
    this.playbackRate = rate;
  }

  get currentTimeSec(): number {
    if (!this.song) return 0;
    if (!this.isPlaying) return this.pauseOffset;
    const elapsedMs = performance.now() - this.startTime;
    const t = (elapsedMs / 1000) * this.playbackRate;
    return Math.min(t, this.song.durationSec);
  }

  get totalTimeSec(): number {
    return this.song?.durationSec ?? 0;
  }

  get playing(): boolean {
    return this.isPlaying;
  }

  get loadedSong(): MidiSong | null {
    return this.song;
  }
}
