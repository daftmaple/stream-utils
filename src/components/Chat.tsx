import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { ChatUserstate } from "tmi.js";

interface ChatProps {
  userstate: ChatUserstate;
  message: string;
  // Delay hiding in seconds
  slideOutDelay?: number;
}

export function Chat({ userstate, message, slideOutDelay = 5 }: ChatProps) {
  const [slideOut, setSlideOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSlideOut(true);
    }, slideOutDelay * 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [slideOutDelay]);

  const renderMessage = () => {
    const finalString = message.split(" ");

    const emotes = Object.fromEntries(
      Object.entries(userstate.emotes ?? {}).map(([emote, replaceLocation]) => {
        const [startRange, endRange] = replaceLocation[0].split("-");
        const textToReplace = message.substring(
          Number(startRange),
          Number(endRange) + 1
        );

        return [textToReplace, emote];
      })
    );

    console.log(emotes);

    const finalMessage = finalString.map((text, index) => {
      if (emotes[text]) {
        const emoteUrl = `https://static-cdn.jtvnw.net/emoticons/v1/${emotes[text]}/1.0`;
        return (
          <React.Fragment key={index}>
            <img className="inline" src={emoteUrl} alt={text} />{" "}
          </React.Fragment>
        );
      }

      return <React.Fragment key={index}>{text} </React.Fragment>;
    });

    return finalMessage;
  };

  const baseClasses =
    "border-0 border-solid bg-gray-500/75 rounded border-teal-400 p-2 text-slate-100";

  const combinedClasses = clsx(baseClasses, {
    "animate-slideIn": !slideOut,
    "animate-slideOut": slideOut,
  });

  return (
    <div className={combinedClasses}>
      <b>{userstate["display-name"]}</b>: {renderMessage()}
    </div>
  );
}
