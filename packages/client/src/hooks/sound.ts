import Click from "../assets/sounds/click.wav";
import PointsEarned from "../assets/sounds/points-earned.wav";
import GameStarting from "../assets/sounds/game-starting.wav";
import RoundFinished from "../assets/sounds/round-finished.mp3";

type SoundKey = "click" | "points-earned" | "game-starting" | "round-finished";

export const sounds: Record<SoundKey, string> = {
  click: Click,
  "points-earned": PointsEarned,
  "game-starting": GameStarting,
  "round-finished": RoundFinished,
};

export const useSound = () => {
  const play = (sound: SoundKey) => {
    const audio = new Audio(sounds[sound]);
    audio.volume = 0.5;
    audio.play();
  };
  return { play };
};