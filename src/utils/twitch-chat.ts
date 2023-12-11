import { Client } from "tmi.js";

import {
  TmiMessageDeleted,
  TmiMessage,
  TmiBan,
  TmiTimeout,
  TmiClearChat,
  Transformable,
} from "./types";

/**
 * Transformable<RT> can return either RT or null (in case of failed transform).
 * Hence, TransformReturnType should use ReturnType of the transform method.
 */
type TmiTransformReturnType<T> = T extends Transformable<infer RT>
  ? ReturnType<Transformable<RT>["transform"]>
  : never;

type TmiHandlerType<T> = (args: TmiTransformReturnType<T>) => void;

/**
 * Twitch Chat client
 *
 * Reference: https://dev.twitch.tv/docs/irc/guide
 */
export class TwitchChat {
  private client: Client;

  private messageHandler?: TmiHandlerType<TmiMessage>;

  private timeoutHandler?: TmiHandlerType<TmiTimeout>;

  private banHandler?: TmiHandlerType<TmiBan>;

  private messageDeletedHandler?: TmiHandlerType<TmiMessageDeleted>;

  private clearChatHandler?: TmiHandlerType<TmiClearChat>;

  constructor(private channel: string) {
    this.client = new Client({
      channels: [this.channel],
    });

    this.client.on(`message`, (...args) =>
      this.messageHandler?.(new TmiMessage(...args).transform())
    );

    this.client.on(`timeout`, (...args) =>
      this.timeoutHandler?.(new TmiTimeout(...args).transform())
    );

    this.client.on(`ban`, (...args) =>
      this.banHandler?.(new TmiBan(...args).transform())
    );

    this.client.on(`messagedeleted`, (...args) =>
      this.messageDeletedHandler?.(new TmiMessageDeleted(...args).transform())
    );

    this.client.on(`clearchat`, (arg) =>
      this.clearChatHandler?.(new TmiClearChat(arg))
    );
  }

  public connect() {
    this.client
      .connect()
      .then(() => console.log(`Chat client`, `Connected`))
      .catch(console.error);
    this.client.on(`join`, (channel) => {
      console.log(`Joined channel ${channel}`);
    });
  }

  public disconnect() {
    this.client
      .disconnect()
      .then(() => console.log(`Chat client`, `Disconnected`))
      .catch(console.error);
  }

  public registerMessageHandler(handler: TmiHandlerType<TmiMessage>) {
    this.messageHandler = handler;
  }

  public registerTimeoutHandler(handler: TmiHandlerType<TmiTimeout>) {
    this.timeoutHandler = handler;
  }

  public registerBanHandler(handler: TmiHandlerType<TmiBan>) {
    this.banHandler = handler;
  }

  public registerMessageDeletedHandler(
    handler: TmiHandlerType<TmiMessageDeleted>
  ) {
    this.messageDeletedHandler = handler;
  }

  public registerClearChatHandler(handler: TmiHandlerType<TmiClearChat>) {
    this.clearChatHandler = handler;
  }

  public deregisterHandler() {
    this.messageHandler = undefined;
    this.timeoutHandler = undefined;
    this.banHandler = undefined;
    this.messageDeletedHandler = undefined;
    this.clearChatHandler = undefined;
  }
}
