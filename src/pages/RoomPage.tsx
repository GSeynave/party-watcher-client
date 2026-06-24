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
    <Card className="flex h-full min-h-0 flex-col rounded-2xl border border-orange-100/70 bg-[#FAF8F5] shadow-sm overflow-hidden">
      {/* 2. Header utilizes soft warm tints instead of stark gray */}
      <CardHeader className="flex shrink-0 flex-row items-center justify-between gap-4 border-b border-orange-100/40 p-4 bg-[#F4EFEA]/60">
        <div className="flex flex-row items-center gap-4 min-w-0">
          <CardTitle className="text-xl font-bold tracking-tight text-stone-800 truncate">
            Room: {room?.name}
          </CardTitle>

          {/* Visual Status Badges styled with warm, earthy hues */}
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1.5 font-medium text-stone-600 bg-white border border-orange-100/50 px-3 py-1 rounded-full shadow-xs">
              <Eye className="w-4 h-4 text-amber-600/80" />
              <span>{userCount}</span>
            </span>

            <span
              className={`flex items-center gap-1.5 font-semibold px-3 py-1 rounded-full border text-xs shadow-xs tracking-wide ${
                connected
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-rose-50 text-rose-800 border-rose-200"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${connected ? "bg-emerald-500 animate-pulse" : "bg-rose-400"}`}
              />
              {connected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>

        <div>
          {/* Leave button uses a warmer, soft rose/terracotta destructive variant */}
          <Button
            variant="destructive"
            className="font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition-colors"
            onClick={() => navigate("/rooms")}
          >
            Leave Room
          </Button>
        </div>
      </CardHeader>

      {/* Main Workspace Layout */}
      <CardContent className="flex min-h-0 flex-1 flex-col lg:flex-row p-0 overflow-hidden bg-stone-900">
        {/* Video Player Container (Immersive warm-dark backdrop) */}
        <div className="flex min-h-0 flex-1 items-center justify-center bg-[#1C1A17] relative aspect-video lg:aspect-auto">
          <YoutubeIframe url={room?.videoUrl || ""} />
        </div>

        {/* Chat Sidebar Container (Styled like a cozy notebook/chat side-panel) */}
        <div className="flex min-h-0 w-full lg:w-[360px] shrink-0 flex-col border-t lg:border-t-0 lg:border-l border-orange-100/50 bg-[#F4EFEA]/80 p-4 shadow-inner">
          <div className="text-xs font-bold text-stone-400 tracking-wider uppercase mb-3 px-1">
            Lounge Chat
          </div>

          <ScrollArea
            className="min-h-0 flex-1 overflow-hidden mb-4"
            type="hover"
            ref={scrollAreaRef}
          >
            <div className="space-y-3 pr-3">
              {messages?.map((message, index) => (
                <div
                  key={`${message.id}-${message.timestamp}-${index}`}
                  className="rounded-xl border border-orange-100/30 bg-white p-3 shadow-xs transition-all hover:border-orange-200/50"
                >
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <span className="text-sm font-bold text-stone-800 truncate">
                      {message.sender}
                    </span>
                    <span className="text-[10px] font-semibold text-stone-400 shrink-0">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-stone-600 break-words leading-relaxed">
                    {message.content}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message input interface */}
          <form
            className="flex flex-col gap-2 pt-3 border-t border-orange-100/40"
            onSubmit={(e) => e.preventDefault()}
          >
            <Input
              type="text"
              value={newMessage}
              placeholder="Say something nice..."
              required
              maxLength={500}
              onChange={(e) => setNewMessage(e.target.value)}
              className="bg-white border-orange-100/70 focus-visible:ring-amber-500 rounded-xl text-stone-800 placeholder-stone-400 shadow-xs"
            />
            <Button
              type="submit"
              onClick={handleMessageSend}
              className="w-full bg-stone-800 hover:bg-stone-700 text-amber-50 font-semibold shadow-xs transition-colors rounded-xl"
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
