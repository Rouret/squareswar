export type Player = {
  id: string;
  position: Position;
  velocity: Vector;
  health: number;
};

export type Position = {
  x: number;
  y: number;
};

export type GameState = {
  players: Record<string, Player>;
};

export type Vector = {
  x: number;
  y: number;
};

export interface Event {
  playerId: string;
  type: string;
}

export interface MoveEvent extends Event {
  name: "up" | "down" | "left" | "right";
  type: "move";
}
