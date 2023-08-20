import { FC, useEffect, useState, useMemo } from "react";
import Canvas from "./Canvas";
import { authStore } from "../../store/authStore";
import Info from "./Info";
import Modal from "../../components/ui/Modal";
import WaitingWord from "./WaitingWord";
import ChoosingWord from "./ChoosingWord";
import GameFinished from "./GameFinished";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../hooks/socket";
import { useParams } from "react-router-dom";
import Chat from "./Chat";
import Container from "../../components/Container";
import NoRoom from "./Message";
import { POINTS_PER_LEVEL } from "../../constants/game";
import { updateUser } from "../../services/user";
import { useMutation } from "react-query";
import { RoomInfo, UserToUpdate } from "../../interfaces/typing";
import "./style.scss";

const Room: FC = () => {
  const { id: roomId } = useParams();
  const { userId, username, avatar, level, xp, updateProfile } = authStore((state) => state);
  const [roomInfo, setRoomInfo] = useState<RoomInfo>({} as RoomInfo);
  const [activeModal, setActiveModal] = useState<keyof typeof ModalComponents | "">();
  const [message, setMessage] = useState<string | null>();
  const { socket } = useSocket();
  const navigate = useNavigate();

  const { mutate: updateUserMutation } = useMutation((user: UserToUpdate) => {
    return updateUser(user);
  });

  useEffect(() => {
    const joinedUser = {
      userId,
      username,
      avatar,
      level,
    };
    socket?.emit("join-room", roomId, joinedUser);
  }, [socket, roomId]);

  useEffect(() => {
    socket?.on("send-info", handleInfoSended);
    socket?.on("word-changed", handleWordChanged);
    socket?.on("round-finished", handleRoundFinished);
    socket?.on("choosing-word-time-finished", handleChoosingWordTimeFinished);
    socket?.on("artist-left", handleArtistLeft);
    socket?.on("all-users-left", handleAllUsersLeft);
    socket?.on("game-finished", handleGameFinished);

    return () => {
      socket?.off("send-info");
      socket?.off("word-changed");
      socket?.off("round-finished");
      socket?.off("choosing-word-time-finished");
      socket?.off("artist-left");
      socket?.off("all-users-left");
      socket?.off("game-finished");

      () => {
        "Are you sure you want to leave?";
      };
    };
  }, [socket]);

  const handleInfoSended = (roomInfo: RoomInfo) => {
    if (!roomInfo) return;
    console.log("get-info", roomInfo);
    setRoomInfo(roomInfo);
    setActiveModal(chooseOption(roomInfo.currentArtist.username));
  };

  const handleWordChanged = (roomInfo: RoomInfo) => {
    console.log("word-changed", roomInfo);
    setRoomInfo(roomInfo);
    setMessage("");
    setActiveModal("");
  };

  const handleRoundFinished = (roomInfo: RoomInfo) => {
    console.log("round-finished", roomInfo);
    setRoomInfo(roomInfo);
    if (roomInfo.message) {
      setMessage(roomInfo.message);
    } else {
      setMessage("The word was " + roomInfo.lastWord);
    }
    if (roomInfo.currentArtist) {
      setActiveModal(chooseOption(roomInfo.currentArtist.username));
    }
  };

  const handleChoosingWordTimeFinished = (roomInfo: RoomInfo) => {
    console.log("choosing-word-time-finished", roomInfo);
    setRoomInfo(roomInfo);
    setActiveModal(chooseOption(roomInfo.currentArtist.username));
    setMessage(`${roomInfo.players[roomInfo.round - 2].username} lost his turn`);
  };

  const handleArtistLeft = (roomInfo: RoomInfo) => {
    console.log("artist-left", roomInfo);
    setRoomInfo(roomInfo);
    if (roomInfo.currentArtist) {
      setActiveModal(chooseOption(roomInfo.currentArtist.username));
    }
    setMessage(`${roomInfo.players[roomInfo.round - 2].username} left the room`);
  };

  const handleAllUsersLeft = (roomInfo: RoomInfo) => {
    console.log("all-users-left", roomInfo);
    setRoomInfo({} as RoomInfo);
    setActiveModal("");
  };

  const handleGameFinished = (roomInfo: RoomInfo) => {
    console.log("game-finished", roomInfo);
    setMessage("The word was " + roomInfo.lastWord);
    setActiveModal("game-finished");
    updateUserInfo();
  };

  const handleWordSelected = (word: string) => {
    socket?.emit("word-selected", roomId, word);
  };

  const handleExit = () => {
    navigate("/home");
  };

  const ModalComponents = {
    "choosing-word": (
      <ChoosingWord
        time={roomInfo.choosingWordTime}
        onWordSelected={handleWordSelected}
        players={roomInfo.players}
        category={roomInfo.category}
        difficalty={roomInfo.difficalty}
        message={message}
      />
    ),
    "waiting-word": (
      <WaitingWord
        message={message}
        time={roomInfo.choosingWordTime}
        artist={roomInfo.currentArtist}
        players={roomInfo?.players}
      />
    ),
    "game-finished": (
      <GameFinished message={message} onExit={handleExit} players={roomInfo?.players} />
    ),
  };

  function chooseTitle(): string {
    if (roomInfo.round >= roomInfo?.players?.length && activeModal === "game-finished")
      return "GAME FINISHED";
    return `ROUND ${roomInfo?.round}/${roomInfo?.players?.length} IS STARTING`;
  }

  function chooseOption(player: string): keyof typeof ModalComponents {
    return player === username ? "choosing-word" : "waiting-word";
  }

  const takeTime = useMemo(() => {
    return roomInfo?.status === "playing" ? roomInfo?.roundTime : 0;
  }, [roomInfo?.status]);

  const updateUserInfo = () => {
    let newPoints = xp + 5;
    let data = {};
    if (newPoints >= POINTS_PER_LEVEL) {
      newPoints = newPoints - POINTS_PER_LEVEL;
      data = { xp: newPoints, level: level + 1 };
      // updateUserMutation({ userId, xp: newPoints, level: level + 1 });
    } else {
      data = { xp: newPoints };
    }
    updateUserMutation(
      {
        userId,
        game: {
          points: 5,
          rank: 2,
        },
        ...data,
      },
      {
        onSuccess: (data) => {
          console.log("updated", data);
          updateProfile({
            xp: data.xp,
            level: data.level,
          });
        },
      }
    );
  };

  // window.onbeforeunload = function () {
  //   if (activeModal === "choosing-word") {
  //     socket?.emit("leave-choosing-word", roomId, userId);
  //   }
  // };

  return (
    <>
      {Object.keys(roomInfo).length != 0 ? (
        <>
          <Modal title={chooseTitle()} isOpen={!!activeModal}>
            {ModalComponents[activeModal || "choosing-word"]}
          </Modal>
          <Container className="room-page-container">
            <Info timer={takeTime} artist={roomInfo?.currentArtist?.username || ""} />
            <div className="canvas-chat-container">
              <Canvas
                canvasData={roomInfo?.drawings}
                socket={socket}
                word={roomInfo?.word}
                currentUserIsPlaying={username === roomInfo?.currentArtist?.username}
              />
              <Chat />
            </div>
          </Container>
        </>
      ) : (
        <Modal title={message ? message : "NO ROOM FOUND OR IT IS FULL"} isOpen={true}>
          <NoRoom />
        </Modal>
      )}
    </>
  );
};

export default Room;
