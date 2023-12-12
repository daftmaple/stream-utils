import { useCallback, useEffect } from "react";
import { ChatUserstate } from "tmi.js";
import { TmiHandlerType, TwitchChat } from "../utils/twitch-chat";
import { useQueue } from "../utils/hooks";
import { Chat } from "../components/Chat";
import { useParams, useSearchParams } from "react-router-dom";
import clsx from "clsx";

type ChatData = {
  message: string;
  userstate: ChatUserstate;
  timestamp: number;
};

export function Chatbox() {
  const { channel = "twitch" } = useParams();
  const [searchParams] = useSearchParams();

  const { add, queue } = useQueue<ChatData>();

  const messageHandler = useCallback<TmiHandlerType<"message">>(
    (_channel, userstate, message) => {
      add({
        message: message,
        userstate: userstate,
        timestamp: new Date().getTime(),
      });
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

  const baseClasses = "w-[32rem] absolute bottom-3 flex flex-col gap-2";

  const combinedClasses = clsx(baseClasses, {
    ...{ "right-3": true },
    ...(searchParams.get("align") && {
      "right-3": searchParams.get("align") === "right",
      "left-3": searchParams.get("align") === "left",
    }),
  });

  return (
    <div className={combinedClasses}>
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
