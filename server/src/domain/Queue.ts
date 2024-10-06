import type { Event } from "types";

export class Queue {
  public events: Array<Event> = [];
  private blocked: boolean = false;

  addEvent<T extends Event>(event: T) {
    if (this.blocked) return;
    this.events.push(event);
  }

  block() {
    this.blocked = true;
  }

  unblock() {
    this.blocked = false;
  }

  reset() {
    this.events = [];
  }

  isEmpty() {
    return this.events.length === 0;
  }
}
