// src/ui/controls.ts
import type { MidiPlayer } from "../audio/player";

interface ControlsOptions {
  player: MidiPlayer;
  playButton: HTMLButtonElement;
  pauseButton: HTMLButtonElement;
  stopButton: HTMLButtonElement;
  currentTimeLabel: HTMLElement;
  totalTimeLabel: HTMLElement;
}

export function setupControls(opts: ControlsOptions) {
  const {
    player,
    playButton,
    pauseButton,
    stopButton,
    currentTimeLabel,
    totalTimeLabel,
  } = opts;

  playButton.addEventListener("click", () => {
    player.play();
  });

  pauseButton.addEventListener("click", () => {
    player.pause();
  });

  stopButton.addEventListener("click", () => {
    player.stop();
  });

  function updateTimeLabels() {
    const cur = player.currentTimeSec.toFixed(2);
    const total = player.totalTimeSec.toFixed(2);
    currentTimeLabel.textContent = cur;
    totalTimeLabel.textContent = total;
    requestAnimationFrame(updateTimeLabels);
  }

  requestAnimationFrame(updateTimeLabels);
}
