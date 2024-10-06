import { SocketService } from "./SocketService";

export class InputHandler {
  private keys: Record<string, string> = {
    z: "up",
    s: "down",
    q: "left",
    d: "right",
  };

  constructor(private socketService: SocketService) {
    this.bindInput();
  }

  private bindInput() {
    document.addEventListener("keypress", (event) => {
      if (event.key in this.keys) {
        this.socketService.sendMoveEvent(this.keys[event.key]);
      }
    });
  }
}
