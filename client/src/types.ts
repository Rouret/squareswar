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
