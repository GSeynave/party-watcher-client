import type { Message } from "./Message";

export type Room = {
  id: string;
  name: string;
  videoUrl: string;
  description: string;
  memberCount: number;
  messages: Message[];
};
