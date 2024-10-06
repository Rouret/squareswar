import { GameState } from "./domain/GameState";
import { GameController } from "./application/GameController";
import { SocketService } from "./infra/SocketService";
import { InputHandler } from "./infra/InputHandler";
import { Renderer } from "./presentation/Renderer";

const gameState = new GameState();
const gameController = new GameController(gameState);
const socketService = new SocketService(gameController);
new InputHandler(socketService);
const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
new Renderer(gameController, canvas);
