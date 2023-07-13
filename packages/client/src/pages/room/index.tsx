import { FC, useEffect, useState } from "react";
import Canvas from "./canvas";
import { authStore } from "../../store/authStore";
import "./style.scss";

const Room: FC = () => {
  const { userId, username } = authStore((state) => state);
  const [word, setWord] = useState<string>("");
  const [artist, setArtist] = useState<string>("");
  const [time, setTime] = useState<string>("05:00");
  const [round, setRound] = useState<number>(1);
  const [players, setPlayers] = useState<string[]>([]);

  useEffect(() => {
    setWord("carrot");
    setArtist("rodinos");
  }, []);

  return (
    <div className="room-page-container">
      {/* <div className="room-content"> */}
      <Canvas word={word} artistIsPlaying={artist === username} />
      {/* </div> */}
    </div>
  );
};

export default Room;
