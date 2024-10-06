import { Player } from "./Player";
import { Position } from "./Position";
export type MapCell = {
  state: "wall";
  coordinates: Position;
};
export class GameState {
  players: Record<string, Player> = {};
  public map: Array<MapCell> = [];

  addPlayer(player: Player) {
    this.players[player.id] = player;
  }

  updatePlayerPosition(playerId: string, newPosition: Position) {
    const player = this.players[playerId];
    if (player) {
      player.position = newPosition;
    }
  }

  getPlayersNear(playerId: string, rangeX: number, rangeY: number): Player[] {
    const currentPlayer = this.players[playerId];
    if (!currentPlayer) return [];

    return Object.values(this.players)
      .filter((player) => player.id !== playerId)
      .filter(
        (player) =>
          Math.abs(currentPlayer.position.x - player.position.x) < rangeX &&
          Math.abs(currentPlayer.position.y - player.position.y) < rangeY
      );
  }

  updateGameState(newGameState: GameState) {
    this.players = newGameState.players;
    this.map = newGameState.map;
  }
}
