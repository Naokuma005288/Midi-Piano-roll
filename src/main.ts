// src/main.ts
import "./styles/main.css";
import { MidiPlayer } from "./audio/player";
import { PianoRoll } from "./view/piano-roll";
import { loadMidiFromFile } from "./midi/loader";
import { renderTrackList } from "./ui/track-list";
import { setupControls } from "./ui/controls";

async function main() {
  const canvas = document.getElementById("piano-roll-canvas") as HTMLCanvasElement | null;
  const fileInput = document.getElementById("midi-file-input") as HTMLInputElement | null;
  const trackListEl = document.getElementById("track-list") as HTMLElement | null;
  const statusEl = document.getElementById("status") as HTMLElement | null;
  const btnPlay = document.getElementById("btn-play") as HTMLButtonElement | null;
  const btnPause = document.getElementById("btn-pause") as HTMLButtonElement | null;
  const btnStop = document.getElementById("btn-stop") as HTMLButtonElement | null;
  const curTimeLabel = document.getElementById("current-time") as HTMLElement | null;
  const totalTimeLabel = document.getElementById("total-time") as HTMLElement | null;

  if (
    !canvas ||
    !fileInput ||
    !trackListEl ||
    !statusEl ||
    !btnPlay ||
    !btnPause ||
    !btnStop ||
    !curTimeLabel ||
    !totalTimeLabel
  ) {
    console.error("必要な要素が見つかりません");
    return;
  }

  const player = new MidiPlayer();

  // とりあえず起動時はダミーMIDIを読み込む
  const dummyFile = new File([""], "Dummy.mid");
  const dummySong = await loadMidiFromFile(dummyFile);
  player.loadSong(dummySong);
  renderTrackList(trackListEl, dummySong);

  const pianoRoll = new PianoRoll({
    canvas,
    song: dummySong,
    getCurrentTime: () => player.currentTimeSec,
  });

  // コントロールUI
  setupControls({
    player,
    playButton: btnPlay,
    pauseButton: btnPause,
    stopButton: btnStop,
    currentTimeLabel: curTimeLabel,
    totalTimeLabel: totalTimeLabel,
  });

  // ファイル選択
  fileInput.addEventListener("change", async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    statusEl.textContent = `読み込み中: ${file.name}...`;
    try {
      const song = await loadMidiFromFile(file);
      player.loadSong(song);
      renderTrackList(trackListEl, song);
      pianoRoll.setSong(song);
      statusEl.textContent = `読み込み完了: ${song.title}`;
    } catch (e) {
      console.error(e);
      statusEl.textContent = "MIDIの読み込みに失敗しました（まだTODOかも）";
    }
  });

  // 描画ループ
  function loop() {
    pianoRoll.draw();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

main().catch(console.error);
