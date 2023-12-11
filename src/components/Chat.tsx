interface ChatProps {
  username: string;
  message: string;
}

export function Chat({ username, message }: ChatProps) {
  return (
    <div className="border-0 border-solid rounded border-teal-400 m-2">
      {username}: {message}
    </div>
  );
}
