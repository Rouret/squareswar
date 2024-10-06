import { SocketService } from "./SocketService";
type BindStatus = {
  name: string;
  isPressed: boolean;
};
export class InputHandler {
  private keys: Record<string, BindStatus> = {
    z: {
      name: "up",
      isPressed: false,
    },
    s: {
      name: "down",
      isPressed: false,
    },
    q: {
      name: "left",
      isPressed: false,
    },
    d: {
      name: "right",
      isPressed: false,
    },
  };

  constructor(private socketService: SocketService) {
    this.bindInput();
  }

  private bindInput() {
    document.addEventListener("keydown", (event) => {
      if (event.key in this.keys) {
        const bindStatus = this.keys[event.key];

        if (bindStatus.isPressed) return;
        bindStatus.isPressed = true;
        this.socketService.sendMoveEvent(bindStatus.name);
      }
    });

    document.addEventListener("keyup", (event) => {
      if (event.key in this.keys) {
        const bindStatus = this.keys[event.key];
        bindStatus.isPressed = false;
        this.socketService.sendMoveEvent("stop_" + bindStatus.name);
      }
    });
  }
}
