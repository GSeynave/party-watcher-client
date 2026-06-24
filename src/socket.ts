// socket.ts
import { io, Socket } from "socket.io-client";
import { config } from "./utils/config";

let socket: Socket | null = null;

export function getSocket(): Socket {
  const API_BASE_URL = config.SERVER_HOST + ":" + config.SERVER_PORT;
  if (!socket) {
    socket = io(API_BASE_URL, { withCredentials: true });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
