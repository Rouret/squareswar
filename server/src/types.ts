export type Player = {
  id: string;
  position: Position;
  health: number;
};

export type Position = {
  x: number;
  y: number;
};

export type GameState = {
  players: Record<string, Player>;
};

export type Event = {
  playerId: string;
  type: string;
};

export type MoveEvent = Event & {
  name: "up" | "down" | "left" | "right";
  type: "move";
};
