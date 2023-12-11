import { Events } from "tmi.js";

import { Transformable } from "./transformable";

import { ClearChat } from "./common";

export class TmiClearChat implements Transformable<ClearChat> {
  channel: string;

  constructor(...args: Parameters<Events["clearchat"]>) {
    const [channel] = args;
    this.channel = channel;
  }

  public transform() {
    return {
      channel: this.channel,
    };
  }
}
