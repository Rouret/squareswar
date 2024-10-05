import cors from "cors";
import express from "express";
import { createServer } from "node:http";
import { Server, Socket } from "socket.io";
import type { GameState, Player, Event, MoveEvent } from "types";

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Game configuration
const TICKS = 30;
const MAX_TIME_TO_COMPUTE = 1000 / TICKS;
const NB_IA = 2;

// Game state
let gameState: GameState = {
  players: {},
};
let queue: Array<Event> = [];

// Add player to the game
const addPlayer = (socket: Socket): void => {
  const newPlayer: Player = {
    id: socket.id,
    position: { x: 0, y: 0 },
    health: 100,
  };
  gameState.players[socket.id] = newPlayer;
};

// Remove player from the game
const removePlayer = (socket: Socket): void => {
  delete gameState.players[socket.id];
};

// Add IA to the game state
const initializeIAs = (): void => {
  for (let index = 0; index < NB_IA; index++) {
    const newIA: Player = {
      id: `IA${index}`,
      position: { x: 0, y: 0 },
      health: 100,
    };
    gameState.players[newIA.id] = newIA;
  }
};

// Handle incoming socket connections
io.on("connection", (socket: Socket) => {
  console.log(`User connected: ${socket.id}`);
  addPlayer(socket);

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    removePlayer(socket);
    io.emit("server:game:update", gameState);
  });

  socket.on("event:move", (data: MoveEvent) => {
    queue.push(data);
  });
});

// Game loop function
const gameLoop = () => {
  const startTime = Date.now();

  // Process queued events
  if (queue.length > 0) {
    for (const event of queue) {
      const player = gameState.players[event.playerId];
      if (!player || event.type !== "move") {
        continue;
      }

      // Update player position based on move event
      switch ((event as MoveEvent).name) {
        case "up":
          player.position.y -= 1;
          break;
        case "down":
          player.position.y += 1;
          break;
        case "left":
          player.position.x -= 1;
          break;
        case "right":
          player.position.x += 1;
          break;
      }
    }
  }

  // Clear the event queue
  queue = [];

  // Emit updated game state to all clients
  io.emit("server:game:update", gameState);

  const endTime = Date.now();
  const totalComputeTime = endTime - startTime;

  if (totalComputeTime > MAX_TIME_TO_COMPUTE) {
    console.log(`Game loop took too long: ${totalComputeTime}ms`);
  }

  setTimeout(gameLoop, Math.max(0, 1000 / TICKS - totalComputeTime));
};

// Start the server and initialize the game
server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
  initializeIAs();
  console.log("IAs initialized");
  gameLoop();
});
