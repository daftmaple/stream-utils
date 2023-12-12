import React from "react";
import { ChatUserstate } from "tmi.js";

interface ChatProps {
  userstate: ChatUserstate;
  message: string;
}

export function Chat({ userstate, message }: ChatProps) {
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

  return (
    <div className="border-0 border-solid bg-gray-400/25 rounded border-teal-400 p-2">
      <b>{userstate["display-name"]}</b>: {renderMessage()}
    </div>
  );
}
