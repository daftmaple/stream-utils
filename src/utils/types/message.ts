import { ChatUserstate, Events } from "tmi.js";

import { Transformable } from "./transformable";

import { Message } from "./common";

export class TmiMessage implements Transformable<Message> {
  channel: string;

  userstate: ChatUserstate;

  message: string;

  self: boolean;

  constructor(...args: Parameters<Events["message"]>) {
    const [channel, userstate, message, self] = args;
    this.channel = channel;
    this.userstate = userstate;
    this.message = message;
    this.self = self;
  }

  public transform() {
    const msgid = this.userstate[`user-id`];
    const { username } = this.userstate;

    if (!msgid || !username) return null;

    return {
      channel: this.channel,
      username,
      message: this.message,
      "msg-id": msgid,
    };
  }
}
