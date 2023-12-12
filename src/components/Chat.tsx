import { ChatUserstate } from "tmi.js";

interface ChatProps {
  userstate: ChatUserstate;
  message: string;
}

export function Chat({ userstate, message }: ChatProps) {
  return (
    <div className="border-0 border-solid rounded border-teal-400 m-2">
      <b>{userstate["display-name"]}</b>: {message}
    </div>
  );
}
