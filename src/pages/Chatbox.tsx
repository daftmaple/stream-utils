import { useCallback, useEffect } from "react";
import { ChatUserstate } from "tmi.js";
import { TmiHandlerType, TwitchChat } from "../utils/twitch-chat";
import { useQueue } from "../utils/hooks";
import { Chat } from "../components/Chat";
import { useParams, useSearchParams } from "react-router-dom";
import clsx from "clsx";

interface ChatData {
  message: string;
  userstate: ChatUserstate;
  timestamp: number;
}

export function Chatbox() {
  const { channel = "twitch" } = useParams();
  const [searchParams] = useSearchParams();

  const { add, remove, queue } = useQueue<ChatData>();

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

  const timeoutHandler = useCallback<TmiHandlerType<"timeout">>(
    (_channel, _username, _reason, _duration, userstate) => {
      remove((queueData) =>
        queueData.filter(
          (value) => value.userstate["user-id"] !== userstate["target-user-id"]
        )
      );
    },
    [remove]
  );

  const banHandler = useCallback<TmiHandlerType<"ban">>(
    (_channel, _username, _reason, userstate) => {
      remove((queueData) =>
        queueData.filter(
          (value) => value.userstate["user-id"] !== userstate["target-user-id"]
        )
      );
    },
    [remove]
  );

  const messageDeletedHandler = useCallback<TmiHandlerType<"messagedeleted">>(
    (_channel, _username, _reason, userstate) => {
      remove((queueData) =>
        queueData.filter(
          (value) => value.userstate.id !== userstate["target-msg-id"]
        )
      );
    },
    [remove]
  );

  useEffect(() => {
    const client = new TwitchChat(channel);

    client.connect();
    client.registerMessageHandler(messageHandler);
    client.registerTimeoutHandler(timeoutHandler);
    client.registerBanHandler(banHandler);
    client.registerMessageDeletedHandler(messageDeletedHandler);

    return () => {
      client.disconnect();
    };
  }, [
    channel,
    banHandler,
    messageDeletedHandler,
    messageHandler,
    timeoutHandler,
  ]);

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
          slideOutDelay={Number(searchParams.get("slideOutDelay")) || 5}
          key={`${item.userstate["user-id"]}-${item.timestamp.toString()}`}
        />
      ))}
    </div>
  );
}
