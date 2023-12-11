import { DeleteUserstate, Events } from "tmi.js";

import { Transformable } from "./transformable";

import { MessageDeleted } from "./common";

export class TmiMessageDeleted implements Transformable<MessageDeleted> {
  channel: string;

  username: string;

  deletedMessage: string;

  userstate: DeleteUserstate;

  constructor(...args: Parameters<Events["messagedeleted"]>) {
    const [channel, username, deletedMessage, userstate] = args;
    this.channel = channel;
    this.username = username;
    this.deletedMessage = deletedMessage;
    this.userstate = userstate;
  }

  public transform() {
    const msgid = this.userstate[`target-msg-id`];

    if (!msgid) return null;
    return {
      channel: this.channel,
      username: this.username,
      "msg-id": msgid,
    };
  }
}
