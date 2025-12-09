// src/types/midi.ts

export interface MidiNote {
  pitch: number;        // 0-127 (60 = C4)
  startSec: number;     // 再生開始時間（秒）
  durationSec: number;  // 長さ（秒）
  velocity: number;     // 0-1
  trackIndex: number;
}

export interface MidiTrack {
  name: string;
  channel: number;
  notes: MidiNote[];
  muted?: boolean;
}

export interface MidiSong {
  title: string;
  tempo: number;        // BPM
  durationSec: number;
  tracks: MidiTrack[];
}
