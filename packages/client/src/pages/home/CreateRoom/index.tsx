import { FC, useState } from "react";
import Typography from "../../../components/ui/Typography";
import Button from "../../../components/ui/Button";
import { CLIENT_URL } from "../../../constants";
import {
  CATEGORIES,
  CHOOSING_WORD_TIME_IN_SECONDS,
  Difficalty,
  PLAYERS_IN_ROOM,
  ROUND_TIME_IN_SECONDS,
} from "../../../constants/game";
import { createRoomCode } from "../../../utils/code";
import { transformToMilliseconds } from "../../../utils/time";
import { GameSettings as GameSettingsInt } from "../../../interfaces/typing";
import GameSettings from "./GameSettings";
import "./style.scss";
import Copable from "../../../components/ui/Copable";

interface CreateRoomProps {
  onCancel: () => void;
  onCreate: (name: GameSettingsInt) => void;
}

const CreateRoom: FC<CreateRoomProps> = ({ onCancel, onCreate }) => {
  const [settings, setSettings] = useState<GameSettingsInt>({
    maxPlayers: PLAYERS_IN_ROOM,
    roundTime: ROUND_TIME_IN_SECONDS,
    choosingWordTime: CHOOSING_WORD_TIME_IN_SECONDS,
    category: CATEGORIES[0],
    difficalty: Difficalty.EASY,
    code: createRoomCode(),
  });

  const handleSettingsChanged = ({ name, value }: { name: string; value: string | number }) => {
    setSettings({
      ...settings,
      [name]: value,
    });
  };

  const handleCreateRoom = () => {
    if (
      !settings.category ||
      !settings.choosingWordTime ||
      !settings.roundTime ||
      !settings.maxPlayers
    )
      return alert("Please fill out all the fields");

    onCreate({
      ...settings,
      maxPlayers: Number(settings.maxPlayers),
      choosingWordTime: transformToMilliseconds(settings.choosingWordTime),
      roundTime: transformToMilliseconds(settings.roundTime),
    });
  };

  return (
    <div className="create-room-container">
      <Typography variant="text-accent" className="text-primary-label">
        To play with friends,send them the code
      </Typography>
      <Typography variant="small-text-main" className="text-secondary-label">
        <Copable value={settings.code}>{settings.code}</Copable>
      </Typography>
      <Typography variant="text-accent" className="text-primary-label">
        Or the link
      </Typography>
      <Typography variant="small-text-main" className="text-secondary-label">
        <Copable value={`${CLIENT_URL}home?room=${settings.code}`}>
          {CLIENT_URL}home?room={settings.code}
        </Copable>
      </Typography>
      <GameSettings settings={settings} onChange={handleSettingsChanged} />
      <div className="buttons-container">
        <Button onClick={handleCreateRoom} title="Create" />
        <Button onClick={onCancel} variant="secondary" title="Cancel" />
      </div>
    </div>
  );
};

export default CreateRoom;
