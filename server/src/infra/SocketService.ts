import { Server, Socket } from "socket.io";
import { GameState } from "../domain/GameState";
import type { Queue } from "domain/Queue";
import type { MoveEvent } from "types";

export class SocketService {
  private io: Server;
  public gameState: GameState;

  constructor(io: Server, gameState: GameState, queue: Queue) {
    this.io = io;
    this.gameState = gameState;
    this.io.on("connection", (socket: Socket) => {
      console.log(`User connected: ${socket.id}`);
      gameState.addPlayer(socket.id);

      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        gameState.removePlayer(socket.id);
        io.emit("server:game:update", gameState);
      });

      socket.on("event:move", (data: MoveEvent) => {
        queue.addEvent(data);
      });
    });
  }

  emitGameState() {
    this.io.emit("server:game:update", this.gameState);
  }
}
