import { GameServerConfig } from "domain/GameServerConfig";
import type { Player, Position } from "types";

const MAP_SIZE = 1000;
const CELL_SIZE = 10;
const MAP_CELLS = MAP_SIZE / CELL_SIZE;

type MapCell = {
  state: "wall";
  coordinates: Position;
};
export class GameState {
  public players: Record<string, Player> = {};
  public map: Array<MapCell> = [];

  constructor() {
    for (let index = 0; index < GameServerConfig.game.numberOfAI; index++) {
      this.addPlayer(`IA${index}`);
    }
  }

  public addPlayer(playerId: string) {
    const newPlayer: Player = {
      id: playerId,
      position: { x: 500, y: 500 },
      velocity: { x: 0, y: 0 },
      health: 100,
    };
    this.players[playerId] = newPlayer;
  }

  public removePlayer(playerId: string) {
    delete this.players[playerId];
  }

  public getPlayer(playerId: string): Player | undefined {
    return this.players[playerId];
  }
}
