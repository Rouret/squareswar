import { io, Socket } from "socket.io-client";
import { GameController } from "../application/GameController";
import { GameState } from "../domain/GameState";

export class SocketService {
  static i: SocketService;
  private socket: Socket;

  constructor(gameController: GameController) {
    this.socket = io("http://localhost:3000");

    this.socket.on("connect", () => {
      console.log("Connected to server");
      gameController.setPlayerId(this.socket.id as string);
    });

    this.socket.on("server:game:update", (newGameState: GameState) => {
      gameController.updateGameState(newGameState);
    });

    SocketService.i = this;
  }

  sendMoveEvent(direction: string) {
    this.socket.emit("event:move", {
      playerId: this.socket.id,
      type: "move",
      name: direction,
    });
  }

  static get _() {
    if (!this.i) {
      throw new Error("SocketService is not initialized");
    }

    return this.i;
  }
}
