import { BindStatus } from "../infra/InputHandler";
import { SocketService } from "../infra/SocketService";

export const PlayerEvents = {
  move: (bindStatus: BindStatus) => {
    const prefix = bindStatus.value ? "" : "stop_";
    SocketService._.sendMoveEvent(prefix + bindStatus.name);
  },
  toggleEditMode: (bindStatus: BindStatus) => {
    console.log(bindStatus.value);
  },
};
