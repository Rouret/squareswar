import { Position } from "./Position";

export interface Player {
  id: string;
  position: Position;
  velocity: Position;
}
