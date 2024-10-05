import { io } from "socket.io-client";
import { GameState, Player } from "./types";

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;

if (!canvas) {
  throw new Error("Canvas not found");
}
const ctx = canvas.getContext("2d");
if (ctx === null) {
  throw new Error("Ctx not found");
}

// Make the canvas fill the screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const socket = io("http://localhost:3000");

let gameState: GameState = {
  players: {},
};

// Connect to server and receive the gameState
socket.on("connect", () => {
  socket.on("server:game:update", (newGameState: GameState) => {
    // Here we update the global gameState variable directly
    gameState = newGameState;
  });
});

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

const UILoop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 0,0 is the center of the screen
  for (const player of Object.values(gameState.players)) {
    const x = centerX + player.position.x;
    const y = centerY + player.position.y;

    ctx.fillStyle = "red";
    ctx.fillRect(x, y, 20, 20);
  }

  requestAnimationFrame(UILoop);
};

// Start the rendering loop
UILoop();
