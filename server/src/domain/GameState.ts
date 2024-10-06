import { GameServerConfig } from "domain/GameServerConfig";
import type { Player } from "types";

export class GameState {
  public players: Record<string, Player> = {};

  constructor() {
    for (let index = 0; index < GameServerConfig.game.numberOfAI; index++) {
      this.addPlayer(`IA${index}`);
    }
  }

  public addPlayer(playerId: string) {
    const newPlayer: Player = {
      id: playerId,
      position: { x: 0, y: 0 },
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
