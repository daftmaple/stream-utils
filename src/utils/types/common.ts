export type Message = {
  channel: string;
  username: string;
  message: string;
  "msg-id": string;
};

export type Timeout = {
  channel: string;
  username: string;
  reason: string;
  duration: number;
};

export type Ban = {
  channel: string;
  username: string;
  reason: string;
};

export type MessageDeleted = {
  channel: string;
  username: string;
  "msg-id": string;
};

export type ClearChat = {
  channel: string;
};
