import { FC, useState, useEffect } from "react";
import RoomActions from "./RoomActions";
import LeaderBoard from "./LeaderBoard";
import RecentGames from "./RecentGames";
import Modal from "../../components/ui/Modal";
import JoinRoom from "./JoinRoom";
import { useNavigate, useSearchParams } from "react-router-dom";
import WaitingRoom from "./WaitingRoom";
import Container from "../../components/Container";
import CreateRoom from "./CreateRoom";
import { authStore } from "../../store/authStore";
import { useSocket } from "../../hooks/socket";
import PlayerStats from "../../components/ui/PlayerStats";
import "./style.scss";

export type ModalType = "join-room" | "create-room" | "waiting-room" | "";

const Home: FC = () => {
  const { userId } = authStore((state) => state);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeModal, setActiveModal] = useState<ModalType>("");
  const { socket } = useSocket();

  //useEffect detects for searchParams change and opens the waiting room modal
  useEffect(() => {
    const waitingRoom = searchParams.get("waitingRoom");
    if (waitingRoom) {
      setActiveModal("waiting-room");
    } else {
      setActiveModal("");
    }
  }, [searchParams]);

  //setting modal type for opening specific modal depending on the action
  const handleActionClick = (action: ModalType) => {
    setActiveModal(action);
  };

  //when code is entered we are adding search params in the url
  //the search param is ?waitingRoom=code
  const handleJoinRoom = (code: string) => {
    if (!code) return;
    setSearchParams({
      waitingRoom: code,
    });
  };

  const handleCancelRoomCreation = () => {
    setActiveModal("");
  };

  const handleCreateRoom = (settings: GameSettings) => {
    if (!socket) return;
    socket.emit("create-room", {
      ...settings,
      creator: userId,
    });
    setSearchParams({
      waitingRoom: settings.code,
    });
  };

  const handleLeaveWaitingRoom = () => {
    setSearchParams({});
    socket?.emit("leave-waiting-room", searchParams.get("waitingRoom"));
  };

  const ModalComponents: any = {
    ["join-room"]: {
      title: "JOIN A ROOM",
      component: <JoinRoom onJoinRoom={handleJoinRoom} />,
    },
    ["create-room"]: {
      title: "CREATE A ROOM",
      component: <CreateRoom onCancel={handleCancelRoomCreation} onCreate={handleCreateRoom} />,
    },
    ["waiting-room"]: {
      title: "WAITING ROOM",
      component: <WaitingRoom />,
      onClose: handleLeaveWaitingRoom,
    },
  };

  const handleModalClose = (item: any) => {
    setActiveModal("");
    item?.onClose?.();
  };

  return (
    <Container className="home-page-container">
      <PlayerStats></PlayerStats>
      <Modal
        title={ModalComponents?.[activeModal]?.title}
        isOpen={!!activeModal}
        onClose={() => handleModalClose(ModalComponents?.[activeModal])}
      >
        {ModalComponents?.[activeModal]?.component}
      </Modal>
      <div className="waiting-room-containers">
        <div className="first-row">
          <RoomActions onActionClick={handleActionClick} />
          <LeaderBoard />
        </div>
        <div className="second-row">
          <RecentGames />
        </div>
      </div>
    </Container>
  );
};

export default Home;
