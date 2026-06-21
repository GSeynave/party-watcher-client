import { useEffect, useRef, useState } from "react";
import "../App.css";
import { Eye } from "lucide-react";
import Api from "../services/roomService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Room } from "../types/Room";
import { Button } from "@/components/ui/button";
import { getSocket, disconnectSocket } from "../socket";
import { useNavigate, useParams } from "react-router";
import { toast, Toaster } from "sonner";
import { Input } from "@/components/ui/input";
import RoomService from "../services/roomService";
import { YoutubeIframe } from "@/components/YoutubeIframe";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Message } from "@/types/Message";
import { useAuthContext } from "@/context/AuthContext";

function RoomPage() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const socket = getSocket();
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [connected, setConnected] = useState(false);
  const [room, setRoom] = useState<Room>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userCount, setUserCount] = useState(0);

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

  async function joinRoom() {
    try {
      setConnected(false);
      await Api.joinRoom(roomId!);
      setConnected(true);
      console.log("Joined room via API:", roomId);
      socket.emit("joinRoom", roomId);
    } catch (error) {
      console.error("Error fetching room data:", error);
      setConnected(false);
    }
  }
  async function fetchRoom() {
    try {
      const response = await Api.getRoomById(roomId!);
      console.log("Fetched room data:", response);
      setRoom(response);
      setMessages(response.messages);
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  }

  async function fetchRoomUserCount(roomId: string) {
    try {
      const response = await Api.getRoomUserCount(roomId);
      console.log("Fetched count user:", response);
      setUserCount(response);
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  }
  function connectToWebsocket() {
    socket.emit("connection");
  }
  function handleWebSocketConnect() {
    socket.on("connect", () => {
      setConnected(true);
    });
  }

  function handleWebSocketDisconnect() {
    socket.on("disconnect", () => {
      setConnected(false);
    });
  }

  function handleWebSocketError() {
    socket.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  }

  function handleUserJoined() {
    socket.on("userJoined", () => {
      console.log("A new user has joined the room.");
      fetchRoomUserCount(roomId!);
      appendMessage({
        id: `system-join-${Date.now()}`,
        senderId: "system",
        sender: "System",
        content: "A new user has joined the room!",
        timestamp: Date.now(),
      });
      toast.success("A new user has joined the room!");
    });
  }

  function handleUserLeft() {
    socket.on("userLeft", () => {
      fetchRoomUserCount(roomId!);
      appendMessage({
        id: `system-left-${Date.now()}`,
        senderId: "system",
        sender: "System",
        content: "A user has left the room.",
        timestamp: Date.now(),
      });
    });
  }
  function handleNewMessage() {
    socket.on("newMessage", ({ id, senderId, sender, content, timestamp }) => {
      console.log("Received new message via WebSocket:");
      const message: Message = {
        id: id,
        senderId: senderId,
        sender: sender,
        content: content,
        timestamp: timestamp,
      };
      appendMessage(message);
    });
  }

  function socketOffs() {
    console.log("Cleaning up WebSocket event listeners");
    socket.emit("leaveRoom", roomId);
    socket.off("connect");
    socket.off("disconnect");
    socket.off("joinRoom");
    socket.off("userJoined");
    socket.off("userLeft");
    socket.off("heartbeatAck");
    disconnectSocket();
  }

  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector<HTMLDivElement>(
      "[data-slot='scroll-area-viewport']",
    );

    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    socket.on("heartbeatAck", (data) => {
      console.log("WebSocket: ", data.message);
    });

    const interval = setInterval(() => {
      socket.emit("heartbeat", { roomId: roomId });
    }, 3000);

    async function init() {
      if (!roomId) {
        throw new Error("roomId is required in URL parameters");
      }
      await fetchRoom();
      await joinRoom();
      await fetchRoomUserCount(roomId);
    }
    init();
    connectToWebsocket();
    handleWebSocketConnect();
    handleWebSocketDisconnect();
    handleWebSocketError();
    handleUserJoined();
    handleUserLeft();
    handleNewMessage();

    return () => {
      socketOffs();
      clearInterval(interval);
    };
  }, []);

  function leaveRoom() {
    navigate("/rooms");
  }

  async function handleMessageSend() {
    if (!newMessage.trim()) {
      toast.error("Message cannot be empty");
      return;
    }
    if (newMessage.length > 500) {
      toast.error("Message cannot exceed 500 characters");
      return;
    }
    const content = newMessage.trim();
    console.log("Sending message to room via WebSocket:", roomId, content);
    const sent = await RoomService.sendMessage(roomId!, content);

    if (!sent) {
      toast.error("Message could not be sent");
      return;
    }

    appendMessage({
      id: `local-${Date.now()}`,
      senderId: user?.userId ?? "me",
      sender: user?.mail ?? "Me",
      content,
      timestamp: Date.now(),
    });
    setNewMessage("");
  }
  return (
    <Card className="flex h-full min-h-0 flex-col overflow-hidden">
      <CardHeader className="flex shrink-0 flex-row gap-2">
        <CardTitle>Room: {room?.name}</CardTitle>
        <span className="flex flex-row  gap-2 flex-1">
          <Eye />
          <div>{userCount}</div>
          <span className={connected ? "text-green-600" : "text-red-600"}>
            {connected ? "Connected" : "Disconnected"}
          </span>
        </span>
        <div className="flex flex-row gap-2">
          <Button
            variant="outline"
            className="w-full bg-red-500 text-white hover:bg-red-600"
            onClick={leaveRoom}
          >
            Leave Room
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex min-h-0 flex-1 flex-row gap-4 overflow-hidden">
        <div className="flex min-h-0 w-4/5 items-center justify-center rounded border">
          <YoutubeIframe url={room?.videoUrl || ""} />
        </div>
        <div className="flex min-h-0 w-1/5 flex-col rounded border p-4">
          <ScrollArea
            className="min-h-0 flex-1 overflow-hidden"
            type="hover"
            ref={scrollAreaRef}
          >
            <div className="space-y-2 pr-2">
              {messages?.map((message, index) => (
                <div
                  key={`${message.id}-${message.timestamp}-${index}`}
                  className="rounded border p-2"
                >
                  <strong>{message.sender}</strong>: {message.content}
                  <div className="text-xs text-gray-500">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <form
            className="flex flex-col gap-2 mt-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <Input
              type="text"
              value={newMessage}
              placeholder="Type your message here..."
              required
              maxLength={500}
              onChange={(e) => setNewMessage(e.target.value)}
            ></Input>
            <Button
              type="submit"
              variant="outline"
              onClick={handleMessageSend}
              className="w-full"
            >
              Send Message
            </Button>
          </form>
        </div>
      </CardContent>
      <Toaster />
    </Card>
  );
}

export default RoomPage;
