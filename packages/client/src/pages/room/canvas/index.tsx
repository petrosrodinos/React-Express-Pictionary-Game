import { FC, useState, useEffect } from "react";
import { useDraw } from "../../../hooks/useDraw";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { API_URL } from "../../../constants";
import "./style.scss";

interface CanvasProps {}

const Canvas: FC<CanvasProps> = ({}) => {
  const [color, setColor] = useState<string>("#000");
  const [canvasWidth, setCanvasWidth] = useState(1030);
  const [canvasHeight, setCanvasHeight] = useState(900);
  const { id: documentId } = useParams();
  const [socket, setSocket] = useState<any>();
  const { canvasRef, onMouseDown, clear, drawPixel } = useDraw({ color, emitEvent });

  useEffect(() => {
    const updateCanvasSize = () => {
      const canvasElement = canvasRef.current?.parentNode as HTMLElement;
      if (canvasElement) {
        const { width, height } = canvasElement.getBoundingClientRect();
        setCanvasWidth(width * 0.7);
        setCanvasHeight(height * 0.9);
      }
    };

    window.addEventListener("resize", updateCanvasSize);
    updateCanvasSize();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, []);
  useEffect(() => {
    const s = io(`${API_URL}`);
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket == null) return;

    const handler = (delta: any) => {
      drawPixel(delta);
    };
    socket.on("receive-changes", handler);

    return () => {
      socket.off("receive-changes", handler);
    };
  }, [socket]);

  function emitEvent(data: any) {
    if (!socket) return;
    socket.emit("send-changes", data);
  }

  useEffect(() => {
    if (socket == null) return;

    socket.emit("get-document", documentId);
  }, [socket, documentId]);

  return (
    <div className="canvas-container">
      <div className="canvas-tools">
        <div className="canvas-tools-content"></div>
      </div>
      <canvas
        width={canvasWidth}
        height={canvasHeight}
        ref={canvasRef}
        onMouseDown={onMouseDown}
        className="canvas"
      />
    </div>
  );
};

export default Canvas;
