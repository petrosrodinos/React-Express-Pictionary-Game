import { FC, useState } from "react";
import Typography from "../ui/Typography";
import Avatar from "../ui/Avatar";
import StarLevelImage from "../../assets/player-level-star.png";
import { authStore } from "../../store/authStore";
import { FiSettings } from "react-icons/fi";
import Modal from "../ui/Modal";
import EditProfile from "./EditProfile";
import "./style.scss";

interface PlayerStatsProps {
  style?: React.CSSProperties;
  className?: string;
}

const PlayerStats: FC<PlayerStatsProps> = ({ style, className = "" }) => {
  const { username, level, avatar, points } = authStore((state) => state);
  const [activeModal, setActiveModal] = useState<boolean>(false);
  return (
    <>
      <Modal onClose={() => setActiveModal(false)} isOpen={activeModal}>
        <EditProfile />
      </Modal>
      <div className={`player-stats ${className}`} style={style}>
        <div className="user-stats-row">
          <div className="player-level">
            <div className="star-level">
              <img src={StarLevelImage} className="star-level-image" />
            </div>

            <Typography variant="text-accent" className="level-text">
              {level}
            </Typography>
          </div>
          <span onClick={() => setActiveModal(true)} className="settings-icon">
            <FiSettings />
          </span>
          <Avatar image={avatar} />
          <div className="user-xp">
            <Typography variant="text-main" className="user-xp-text">
              xp:{points}
            </Typography>
          </div>
        </div>
        <div className="user-name">
          <Typography variant="sub-header-main" className="user-name-text">
            {username}
          </Typography>
        </div>
      </div>
    </>
  );
};

export default PlayerStats;
