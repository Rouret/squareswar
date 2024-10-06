import { PlayerEvents } from "../application/PlayerEvents";
export type BindStatus = {
  name: string;
  value: boolean;
  type: "switch" | "hold";
  callback: (self: BindStatus) => void;
};
export class InputHandler {
  private keys: Record<string, BindStatus> = {
    z: {
      name: "up",
      value: false,
      type: "hold",
      callback: PlayerEvents.move,
    },
    s: {
      name: "down",
      value: false,
      type: "hold",
      callback: PlayerEvents.move,
    },
    q: {
      name: "left",
      value: false,
      type: "hold",
      callback: PlayerEvents.move,
    },
    d: {
      name: "right",
      value: false,
      type: "hold",
      callback: PlayerEvents.move,
    },
    e: {
      name: "toggleEditMode",
      value: false,
      type: "switch",
      callback: PlayerEvents.toggleEditMode,
    },
  };

  constructor() {
    this.bindInput();
  }

  private bindInput() {
    document.addEventListener("keydown", (event) => {
      if (event.key in this.keys) {
        const bindStatus = this.keys[event.key];

        if (bindStatus.type === "switch") {
          bindStatus.value = !bindStatus.value;
        } else {
          bindStatus.value = true;
        }

        bindStatus.callback(bindStatus);
      }
    });

    document.addEventListener("keyup", (event) => {
      if (event.key in this.keys) {
        const bindStatus = this.keys[event.key];
        if (bindStatus.type === "hold") {
          bindStatus.value = false;
          bindStatus.callback(bindStatus);
        }
      }
    });
  }
}
