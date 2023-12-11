import { Events } from "tmi.js";

import { Transformable } from "./transformable";

import { Timeout } from "./common";

export class TmiTimeout implements Transformable<Timeout> {
  channel: string;

  username: string;

  reason: string;

  duration: number;

  constructor(...args: Parameters<Events["timeout"]>) {
    const [channel, username, reason, duration] = args;
    this.channel = channel;
    this.username = username;
    this.reason = reason;
    this.duration = duration;
  }

  public transform() {
    return {
      channel: this.channel,
      username: this.username,
      reason: this.reason,
      duration: this.duration,
    };
  }
}
