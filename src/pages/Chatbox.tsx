import { useCallback, useEffect } from "react";
import { TwitchChat } from "../utils/twitch-chat";
import { Message } from "../utils/types/common";
import { useQueue } from "../utils/hooks";
import { Chat } from "../components/Chat";
import { useParams } from "react-router-dom";

type CallbackHandler<T> = (arg: T | null) => void;

type ChatData = Omit<Message, "channel">;

export function Chatbox() {
  const { channel = "twitch" } = useParams();

  const { add, queue } = useQueue<ChatData>();

  const messageHandler = useCallback<CallbackHandler<Message>>(
    (payload) => {
      // If payload exists and message doesn't start with command trigger, speak the message
      if (payload && !payload.message.startsWith(`!`)) {
        add({
          message: payload.message,
          username: payload.username,
          "msg-id": payload[`msg-id`],
        });
      }
    },
    [add]
  );

  useEffect(() => {
    const client = new TwitchChat(channel);

    client.connect();
    client.registerMessageHandler(messageHandler);

    return () => {
      client.deregisterHandler();
      client.disconnect();
    };
  }, [channel, messageHandler]);

  return (
    <div className="max-w-96 absolute bottom-3 left-3 flex flex-col gap-2">
      {queue.map((item) => (
        <Chat
          username={item.username}
          message={item.message}
          key={item["msg-id"]}
        />
      ))}
    </div>
  );
}
