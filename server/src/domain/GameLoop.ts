import { GameServerConfig } from "domain/GameServerConfig";
import type { Queue } from "domain/Queue";
import type { SocketService } from "infra/SocketService";
import type { GameState } from "types";

export type GameLoopCallback = (gameState: GameState) => void;
export type GameLoopCallbacks = Array<GameLoopCallback>;

export class GameLoop {
  private running: boolean = false;

  private maxTimeToCompute: number = 0;
  private socketService: SocketService;

  private callbacks: GameLoopCallbacks = [];
  private queue: Queue;

  constructor(
    callbacks: GameLoopCallbacks,
    queue: Queue,
    socketService: SocketService
  ) {
    this.socketService = socketService;
    this.callbacks = callbacks;
    this.maxTimeToCompute = 1000 / GameServerConfig.core.ticks;
    this.queue = queue;
  }

  start() {
    this.running = true;
    this.loop();
  }

  stop() {
    this.running = false;
  }

  private loop() {
    if (!this.running) return;

    const startTime = Date.now();

    // Block the queue for event processing
    this.queue.block();

    // Execute all callbacks for this tick, passing delta and tick number
    for (const callback of this.callbacks) {
      callback(this.socketService.gameState);
    }

    // Reset and unblock the queue after processing
    this.queue.reset();
    this.queue.unblock();

    const endTime = Date.now();

    if (endTime - startTime > this.maxTimeToCompute) {
      console.log("Loop iteration took too long to compute");
    }

    // Schedule the next loop iteration
    const nextLoopDelay = Math.max(
      0,
      this.maxTimeToCompute - (endTime - startTime)
    );

    this.socketService.emitGameState();
    setTimeout(() => this.loop(), nextLoopDelay);
  }
}
