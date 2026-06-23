import { useEffect, useState } from "react";
import type { Message } from "@/types/Message";
import { disconnectSocket, getSocket } from "@/socket";
import api from "@/services/roomService";
import { toast } from "sonner";

function useRoomSocket(roomId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const socket = getSocket();

  function appendMessage(message: Message) {
    setMessages((prev) => {
      const alreadyAdded = prev.some(
        (existing) =>
          existing.id === message.id ||
          (existing.senderId === message.senderId &&
            existing.content === message.content &&
            Math.abs(existing.timestamp - message.timestamp) < 3000),
      );

      if (alreadyAdded) {
        return prev;
      }

      return [...prev, message];
    });
  }

  async function fetchRoomUserCount(roomId: string) {
    try {
      const response = await api.getRoomUserCount(roomId);
      console.log("Fetched count user:", response);
      setUserCount(response);
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  }

  useEffect(() => {
    if (!roomId) return;

    api
      .joinRoom(roomId)
      .then(() => {
        setConnected(true);
        socket.emit("joinRoom", roomId);
      })
      .catch(() => setConnected(false));

    // back should check if last heartbeat was received within 10 seconds, if not, disconnect the socket and set connected to false
    const heartbeatInterval = setInterval(() => {
      socket.emit("heartbeat", { roomId: roomId });
    }, 3000);

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onError = (error: unknown) =>
      console.error("WebSocket error:", error);

    const onUserJoined = () => {
      fetchRoomUserCount(roomId);
      appendMessage({
        id: `system-${Date.now()}`,
        sender: "System",
        senderId: "system",
        content: "A user has joined the room.",
        timestamp: Date.now(),
      });
      toast.success("A user has joined the room.");
    };

    const onUserLeft = () => {
      fetchRoomUserCount(roomId);
      appendMessage({
        id: `system-${Date.now()}`,
        sender: "System",
        senderId: "system",
        content: "A user has left the room.",
        timestamp: Date.now(),
      });
    };

    const onNewMessage = (message: Message) => {
      appendMessage(message);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("error", onError);
    socket.on("userJoined", onUserJoined);
    socket.on("userLeft", onUserLeft);
    socket.on("newMessage", onNewMessage);

    return () => {
      clearInterval(heartbeatInterval);
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("error", onError);
      socket.off("userJoined", onUserJoined);
      socket.off("userLeft", onUserLeft);
      socket.off("newMessage", onNewMessage);
      disconnectSocket();
    };
  }, [roomId, socket]);

  return { connected, userCount, messages, setMessages, appendMessage };
}

export default useRoomSocket;
