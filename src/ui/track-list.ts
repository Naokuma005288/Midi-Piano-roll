// src/ui/track-list.ts
import type { MidiSong } from "../types/midi";

export function renderTrackList(root: HTMLElement, song: MidiSong) {
  root.innerHTML = "";
  song.tracks.forEach((track, index) => {
    const li = document.createElement("li");
    li.className = "track-item";
    li.textContent = `${index + 1}. ${track.name || "Track " + (index + 1)}`;
    root.appendChild(li);
  });
}
