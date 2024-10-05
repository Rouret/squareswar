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

//make the canvas fill the screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const socket = io("http://localhost:3000");

let playerId: string = "";
let currentPlayerState: Player;
let gameState: GameState = {
  players: {},
};
const sendEvent = (event: string, data: any) =>
  socket.emit(event, {
    playerId: playerId,
    type: "move",
    ...data,
  });

// Connect to server and receive the player ID
socket.on("connect", () => {
  console.log("Connected to the server");
  if (!socket.id) {
    throw new Error("Player ID not received");
  }
  playerId = socket.id;
  console.log(`Player ID: ${playerId}`);

  socket.on("server:game:update", (newGameState: GameState) => {
    gameState = newGameState;
    const potentialCurrentPlayer = gameState.players[playerId];
    if (!potentialCurrentPlayer) {
      throw new Error("Player not found in game state");
    }

    currentPlayerState = potentialCurrentPlayer;
  });
});

//keyboard input
const keys: Record<string, string> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
};

document.addEventListener("keydown", (event) => {
  if (event.key in keys) {
    sendEvent("event:move", { name: keys[event.key] });
  }
});

const UILoop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //draw player at the center of the screen
  const centerX = canvas.width / 2 - 25;
  const centerY = canvas.height / 2 - 25;
  ctx.fillStyle = "white";
  ctx.fillRect(centerX, centerY, 25, 25);
  //draw position at the top of the player
  ctx.font = "15px Arial";
  ctx.fillStyle = "white";
  ctx.fillText(
    `x: ${currentPlayerState.position.x} y: ${currentPlayerState.position.y}`,
    centerX,
    centerY - 30
  );

  //draw other players if fit screen
  const midWidth = canvas.width / 2;
  const midHeight = canvas.height / 2;
  const playersToDraw = Object.values(gameState.players)
    .filter((player) => player.id !== playerId)
    .filter(
      (player) =>
        Math.abs(currentPlayerState.position.x - player.position.x) <
          midWidth &&
        Math.abs(currentPlayerState.position.y - player.position.y) < midHeight
    );

  for (const player of playersToDraw) {
    const playerX =
      centerX + (player.position.x - currentPlayerState.position.x);
    const playerY =
      centerY + (player.position.y - currentPlayerState.position.y);
    ctx.fillStyle = "red";
    ctx.fillRect(playerX, playerY, 25, 25);

    ctx.font = "15px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(
      `x: ${player.position.x} y: ${player.position.y}`,
      playerX,
      playerY - 30
    );
  }

  requestAnimationFrame(UILoop);
};

setInterval(() => {
  if (gameState && currentPlayerState) {
    UILoop();
  }
}, 100);
