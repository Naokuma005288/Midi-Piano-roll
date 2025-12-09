// src/midi/loader.ts
import type { MidiSong, MidiTrack, MidiNote } from "../types/midi";

export async function loadMidiFromFile(file: File): Promise<MidiSong> {
  // TODO: 後で本物のMIDIパースを実装する
  // ここでは「ダミーのMIDIデータ」を返す

  console.log("TODO: 実際のMIDIパースを実装する", file.name);

  const notes: MidiNote[] = [];
  // 簡単なCメジャースケールをダミーで作る
  const basePitch = 60; // C4
  const noteLen = 0.5;
  for (let i = 0; i < 16; i++) {
    notes.push({
      pitch: basePitch + (i % 8),
      startSec: i * noteLen,
      durationSec: noteLen * 0.9,
      velocity: 0.8,
      trackIndex: 0,
    });
  }

  const track: MidiTrack = {
    name: "Dummy Track",
    channel: 0,
    notes,
  };

  const song: MidiSong = {
    title: file.name || "Dummy Song",
    tempo: 120,
    durationSec: noteLen * 16,
    tracks: [track],
  };

  return song;
}
