import { useEffect, useRef, useState } from "react";
import "../App.css";
import { Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Room } from "../types/Room";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router";
import { toast, Toaster } from "sonner";
import { Input } from "@/components/ui/input";
import RoomService from "../services/roomService";
import { YoutubeIframe } from "@/components/YoutubeIframe";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthContext } from "@/context/AuthContext";
import useRoomSocket from "@/hooks/useRoomSocket";
import api from "../services/roomService";

function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const [room, setRoom] = useState<Room>();
  const [newMessage, setNewMessage] = useState("");

  const { connected, userCount, messages, setMessages, appendMessage } =
    useRoomSocket(roomId);

  useEffect(() => {
    if (!roomId) return;

    api
      .getRoomById(roomId)
      .then((data) => {
        setRoom(data);
        if (data.messages) setMessages(data.messages);
      })
      .catch((error) => console.error("Error fetching room data:", error));
  }, [roomId, setMessages]);

  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector<HTMLDivElement>(
      "[data-slot='scroll-area-viewport']",
    );

    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages]);

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
    <Card className="flex h-full min-h-0 flex-col rounded">
      <CardHeader className="flex shrink-0 flex-row gap-2">
        <CardTitle>Room: {room?.name}</CardTitle>
        <span className="flex flex-row  gap-2 flex-1 items-center ">
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
            onClick={() => navigate("/rooms")}
          >
            Leave Room
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex min-h-0 flex-1 flex-row gap-4 overflow-hidden">
        <div className="flex min-h-0 w-4/5 items-center justify-center rounded border">
          <YoutubeIframe url={room?.videoUrl || ""} />
        </div>
        <div className="flex min-h-0 w-1/5 flex-col border-l border-gray-400 p-4">
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
