import { GameController } from "../application/GameController";
import { Player } from "../domain/Player";

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private gameController: GameController;

  constructor(gameController: GameController, canvas: HTMLCanvasElement) {
    this.gameController = gameController;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d")!;
    this.initCanvas();
  }

  private initCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    });

    this.renderLoop();
  }

  private renderLoop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const centerX = this.canvas.width / 2 - 25;
    const centerY = this.canvas.height / 2 - 25;
    const currentPlayer =
      this.gameController.gameState.players[this.gameController.playerId];

    const visiblePlayers = this.gameController.getVisiblePlayers(
      this.canvas.width,
      this.canvas.height
    );
    visiblePlayers.forEach((player) => {
      const playerX = centerX + (player.position.x - currentPlayer.position.x);
      const playerY = centerY + (player.position.y - currentPlayer.position.y);
      this.drawPlayer(playerX, playerY, player, "red");
    });

    if (currentPlayer) {
      this.drawPlayer(centerX, centerY, currentPlayer);
    }

    requestAnimationFrame(this.renderLoop.bind(this));
  }

  private drawPlayer(x: number, y: number, player: Player, color = "white") {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, 25, 25);
    this.ctx.font = "15px Arial";
    this.ctx.fillStyle = "white";
    this.ctx.fillText(
      `x: ${player.position.x} y: ${player.position.y}`,
      x,
      y - 30
    );
  }
}
