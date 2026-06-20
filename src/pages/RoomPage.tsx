import { useEffect, useRef, useState } from "react";
import "../App.css";
import Api from "../services/roomService";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Room } from "../types/Room";
import { Button } from "@/components/ui/button";
import { getSocket, disconnectSocket } from "../socket";
import { useNavigate, useParams } from "react-router";
import { toast, Toaster } from "sonner";
import { Input } from "@/components/ui/input";
import RoomService from "../services/roomService";
import { YoutubeIframe } from "@/components/YoutubeIframe";
import { ScrollArea } from "@/components/ui/scroll-area";

function RoomPage() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const socket = getSocket();
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [connected, setConnected] = useState(false);
  const [room, setRoom] = useState<Room>();
  const [newMessage, setNewMessage] = useState("");

  async function joinRoom() {
    try {
      setConnected(false);
      await Api.joinRoom(roomId!);
      setConnected(true);
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
      console.log("Connected to WebSocket server with ID:", socket.id);
    });
  }

  function handleWebSocketDisconnect() {
    socket.on("disconnect", () => {
      setConnected(false);
      console.log("Disconnected from WebSocket server");
    });
  }

  function handleWebSocketError() {
    socket.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  }

  function handleUserJoined() {
    socket.on("userJoined", (roomId: string) => {
      console.log("A User Joined room:", roomId);
      fetchRoom();
      toast.success("A new user has joined the room!");
    });
  }

  function handleUserLeft() {
    socket.on("userLeft", (roomId: string) => {
      console.log("Left room:", roomId);
      fetchRoom();
    });
  }
  function handleNewMessage() {
    socket.on(
      "newMessage",
      (sender: string, content: string, timestamp: number) => {
        console.log("WebSocket - Event Listend - [newMessage]: ", {
          sender,
          content,
          timestamp,
        });
        fetchRoom(); // will need to be optimized, to only fetch messages, not the whole room data, but for now it's ok
        toast(`New message from ${sender}: ${content}`);
      },
    );
  }

  function handleJoinRoom() {
    // will not be needed, i'll handle on websocket event
    console.log("Joining room via WebSocket:", roomId);
    socket.emit("joinRoom", roomId);
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
    const scrollArea = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]",
    );
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [room?.messages]);

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
    }
    init();
    connectToWebsocket();
    handleWebSocketConnect();
    handleWebSocketDisconnect();
    handleWebSocketError();
    handleUserJoined();
    handleUserLeft();
    handleNewMessage();
    handleJoinRoom();

    return () => {
      socketOffs();
      clearInterval(interval);
    };
  }, []);

  function leaveRoom() {
    navigate("/rooms");
  }

  function handleMessageSend() {
    if (!newMessage.trim()) {
      toast.error("Message cannot be empty");
      return;
    }
    if (newMessage.length > 500) {
      toast.error("Message cannot exceed 500 characters");
      return;
    }
    console.log("Sending message to room via WebSocket:", roomId, newMessage);
    RoomService.sendMessage(roomId!, newMessage);
    fetchRoom(); // will need to be optimized, to only fetch messages, not the whole room data, but for now it's ok
    setNewMessage("");
  }
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Room: {room?.name}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-row gap-4 h-3/5">
        <div className="flex h-full w-4/5 items-center justify-center rounded border">
          <YoutubeIframe url={room?.videoUrl || ""} />
        </div>
        <div className="flex flex-col rounded h-full w-1/5 border p-4">
          <ScrollArea
            className="flex-1 min-h-0"
            type="hover"
            ref={scrollAreaRef}
          >
            {room?.messages?.map((message) => (
              <div key={message.id} className="border p-2 rounded">
                <strong>{message.sender}</strong>: {message.content}
                <div className="text-xs text-gray-500">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
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
      <CardFooter className="flex flex-col justify-between items-center ">
        <span>
          Websocket state : {connected ? "🟢 Connected" : "🔴 Disconnected"}
        </span>
        <span>Users in room: {room?.memberCount}</span>
        <Button variant="outline" className="w-full" onClick={leaveRoom}>
          Leave Room
        </Button>
      </CardFooter>
      <Toaster />
    </Card>
  );
}

export default RoomPage;
