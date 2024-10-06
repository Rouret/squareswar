import {
  handlePlayersMove,
  moveAIs,
  movePlayers,
} from "application/events/PlayerMoveEvent";
import cors from "cors";
import { GameLoop } from "domain/GameLoop";
import { GameState } from "domain/GameState";
import { Queue } from "domain/Queue";
import express from "express";
import { SocketService } from "infra/SocketService";
import { createServer } from "node:http";
import { Server } from "socket.io";
import type { MoveEvent, Player } from "types";

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Game state
const gameState = new GameState();
const queue = new Queue();
const socketService = new SocketService(io, gameState, queue);
const gameLoop = new GameLoop(
  [
    () => {
      if (!queue.isEmpty()) {
        for (const event of queue.events) {
          const player = gameState.getPlayer(event.playerId);
          if (!player || event.type !== "move") {
            continue;
          }
          handlePlayersMove(event as MoveEvent, player);
        }
      }
    },
    () => {
      const allPlayers: Player[] = Object.values(gameState.players);
      const allRealPlayers: Player[] = allPlayers.filter(
        (player) => !player.id.startsWith("IA")
      );
      const allIAs: Player[] = allPlayers.filter((player) =>
        player.id.startsWith("IA")
      );

      movePlayers(allRealPlayers);
      moveAIs(allIAs);
    },
  ],
  queue,
  socketService
);

// Start the server and initialize the game
server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
  gameLoop.start();
});
