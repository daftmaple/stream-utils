import { Client, Events } from "tmi.js";

export type TmiHandlerType<T extends keyof Events> = (
  ...args: Parameters<Events[T]>
) => void;

/**
 * Twitch Chat client
 *
 * Reference: https://dev.twitch.tv/docs/irc/guide
 */
export class TwitchChat {
  private client: Client;

  private messageHandler?: TmiHandlerType<"message">;

  private timeoutHandler?: TmiHandlerType<"timeout">;

  private banHandler?: TmiHandlerType<"ban">;

  private messageDeletedHandler?: TmiHandlerType<"messagedeleted">;

  private clearChatHandler?: TmiHandlerType<"clearchat">;

  constructor(private channel: string) {
    this.client = new Client({
      channels: [this.channel],
    });

    this.client.on(`message`, (...args) => this.messageHandler?.(...args));

    this.client.on(`timeout`, (...args) => this.timeoutHandler?.(...args));

    this.client.on(`ban`, (...args) => this.banHandler?.(...args));

    this.client.on(`messagedeleted`, (...args) =>
      this.messageDeletedHandler?.(...args)
    );

    this.client.on(`clearchat`, (...args) => this.clearChatHandler?.(...args));
  }

  public connect() {
    this.client
      .connect()
      .then(() => {
        console.log(`Chat client`, `Connected`);
      })
      .catch(console.error);
    this.client.on(`join`, (channel) => {
      console.log(`Joined channel ${channel}`);
    });
  }

  public disconnect() {
    this.deregisterHandler();
    this.client
      .disconnect()
      .then(() => {
        console.log(`Chat client`, `Disconnected`);
      })
      .catch(console.error);
  }

  public registerMessageHandler(handler: TmiHandlerType<"message">) {
    this.messageHandler = handler;
  }

  public registerTimeoutHandler(handler: TmiHandlerType<"timeout">) {
    this.timeoutHandler = handler;
  }

  public registerBanHandler(handler: TmiHandlerType<"ban">) {
    this.banHandler = handler;
  }

  public registerMessageDeletedHandler(
    handler: TmiHandlerType<"messagedeleted">
  ) {
    this.messageDeletedHandler = handler;
  }

  public registerClearChatHandler(handler: TmiHandlerType<"clearchat">) {
    this.clearChatHandler = handler;
  }

  private deregisterHandler() {
    this.messageHandler = undefined;
    this.timeoutHandler = undefined;
    this.banHandler = undefined;
    this.messageDeletedHandler = undefined;
    this.clearChatHandler = undefined;
  }
}
