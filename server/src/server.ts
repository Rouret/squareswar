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
const SPEED = 10;
const FRICTION = 0.8; // <1

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
    velocity: { x: 0, y: 0 },
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
      velocity: { x: 0, y: 0 },
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
      switch ((event as MoveEvent).name) {
        case "up":
          player.velocity.y = -SPEED;
          break;
        case "down":
          player.velocity.y = SPEED;
          break;
        case "left":
          player.velocity.x = -SPEED;
          break;
        case "right":
          player.velocity.x = SPEED;
          break;
      }
    }
  }

  // Update player positions based on velocity and apply friction
  for (const playerId in gameState.players) {
    const player = gameState.players[playerId];

    // Apply velocity to position
    player.position.x += player.velocity.x;
    player.position.y += player.velocity.y;

    // Apply friction to gradually stop the player if no input is given
    player.velocity.x *= FRICTION;
    player.velocity.y *= FRICTION;

    // If velocity is very small, stop the player completely
    if (Math.abs(player.velocity.x) < 0.1) {
      player.velocity.x = 0;
    }
    if (Math.abs(player.velocity.y) < 0.1) {
      player.velocity.y = 0;
    }
  }

  // Update IA positions
  for (const playerId in gameState.players) {
    //random 1 to 3
    const random = Math.floor(Math.random() * 3) + 1;
    if (playerId.startsWith("IA") && random === 3) {
      const player = gameState.players[playerId];
      player.position.x += (Math.floor(Math.random() * 3) - 1) * SPEED;
      player.position.y += (Math.floor(Math.random() * 3) - 1) * SPEED;
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
