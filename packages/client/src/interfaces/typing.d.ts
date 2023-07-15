type Draw = {
  ctx: CanvasRenderingContext2D;
  currentPoint: Point;
  prevPoint: Point | null;
};

type Point = { x: number; y: number };

interface UserType {
  id: number;
  rank?: number;
  avatar: string;
  username: string;
  xp?: number;
  games?: number;
  level?: number;
}

interface InGameUser {
  id: number;
  avatar: string;
  username: string;
  points: number;
  rank: number;
}

interface RoomInfo {
  creator: string;
  code: string;
  settings: {
    players: number;
    rounds: number;
  };
  users: UserType[];
}
