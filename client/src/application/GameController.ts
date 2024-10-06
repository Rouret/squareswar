import { GameState } from "../domain/GameState";
import { Player } from "../domain/Player";

export class GameController {
  public gameState: GameState;
  public playerId: string;

  constructor(gameState: GameState) {
    this.gameState = gameState;
    this.playerId = "";
  }

  setPlayerId(playerId: string) {
    this.playerId = playerId;
  }

  updateGameState(newGameState: GameState) {
    this.gameState.updateGameState(newGameState);
  }

  movePlayer(direction: string) {
    const player = this.gameState.players[this.playerId];
    if (!player) return;

    switch (direction) {
      case "up":
        player.position.y -= 5;
        break;
      case "down":
        player.position.y += 5;
        break;
      case "left":
        player.position.x -= 5;
        break;
      case "right":
        player.position.x += 5;
        break;
    }
  }

  getVisiblePlayers(canvasWidth: number, canvasHeight: number): Player[] {
    return this.gameState.getPlayersNear(
      this.playerId,
      canvasWidth / 2,
      canvasHeight / 2
    );
  }
}
