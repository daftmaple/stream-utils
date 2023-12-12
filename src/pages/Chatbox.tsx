import { useCallback, useEffect } from "react";
import { ChatUserstate } from "tmi.js";
import { TmiHandlerType, TwitchChat } from "../utils/twitch-chat";
import { useQueue } from "../utils/hooks";
import { Chat } from "../components/Chat";
import { useParams } from "react-router-dom";

type ChatData = {
  message: string;
  userstate: ChatUserstate;
  timestamp: number;
};

export function Chatbox() {
  const { channel = "twitch" } = useParams();

  const { add, queue } = useQueue<ChatData>();

  const messageHandler = useCallback<TmiHandlerType<"message">>(
    (channel, userstate, message) => {
      // If payload exists and message doesn't start with command trigger, speak the message
      if (!message.startsWith(`!`)) {
        console.log(channel, userstate, message);

        add({
          message: message,
          userstate: userstate,
          timestamp: new Date().getTime(),
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
      client.disconnect();
    };
  }, [channel, messageHandler]);

  return (
    <div className="max-w-96 absolute bottom-3 left-3 flex flex-col gap-2">
      {queue.map((item) => (
        <Chat
          userstate={item.userstate}
          message={item.message}
          key={`${item.userstate["user-id"]}-${item.timestamp.toString()}`}
        />
      ))}
    </div>
  );
}
