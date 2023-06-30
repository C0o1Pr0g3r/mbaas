import EventEmitter from "eventemitter3";
import type { User } from "./schemas/user";

class EventLog {
  private eventEmitter: EventEmitter;

  public constructor() {
    this.eventEmitter = new EventEmitter();
  }

  public on(event: "user-registered", handler: (user: User) => void) {
    this.eventEmitter.on(event, handler);
  }

  public off(event: "user-registered", handler: (user: User) => void) {
    this.eventEmitter.off(event, handler);
  }

  public emit(event: "user-registered", user: User) {
    this.eventEmitter.emit(event, user);
  }
}

export const eventLog = new EventLog();
