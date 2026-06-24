import { useEffect, useState } from "react";
import "../App.css";
import RoomService from "../services/roomService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Room } from "../types/Room";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { Eye } from "lucide-react";
import CreateRoomForm from "@/components/CreateRoom";

function Rooms() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    async function loadRooms() {
      const response = await RoomService.getRooms();
      setRooms(response);
    }

    loadRooms();
  }, []);

  async function handleJoinRoom(roomId: string) {
    navigate(`/room/${roomId}`);
  }

  return (
    <Card className="flex h-full min-h-0 flex-col rounded-2xl border border-orange-100/70 bg-[#FAF8F5] shadow-sm overflow-hidden">
      <CardHeader className="border-b border-orange-100/40 pb-6 bg-[#F4EFEA]/30 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-3xl font-bold tracking-tight text-stone-800">
              Rooms
            </CardTitle>
            <p className="text-sm text-stone-500 mt-1">
              Join an existing watch party or launch your own.
            </p>
          </div>
          <div className="flex-shrink-0">
            <CreateRoomForm />
          </div>
        </div>
      </CardHeader>

      {/* 2. Main Area Grid Backdrop: A touch deeper warmth */}
      <CardContent className="flex-1 bg-[#F4EFEA]/40 p-6 overflow-y-auto">
        {rooms.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
            {rooms.map((room: Room) => (
              <Card
                key={room.id}
                className="flex flex-col bg-white border border-orange-100/40 rounded-2xl shadow-xs hover:shadow-md hover:border-orange-200/60 transition-all duration-200 overflow-hidden"
              >
                <CardHeader className="flex flex-row justify-between items-start gap-4 p-5 pb-3">
                  <CardTitle className="text-lg font-bold text-stone-800 line-clamp-1">
                    {room.name}
                  </CardTitle>
                  {/* Soft amber member tag */}
                  <div className="flex flex-row gap-1.5 items-center text-sm font-semibold text-amber-800 bg-amber-50 border border-amber-100/70 px-3 py-1 rounded-full whitespace-nowrap shadow-2xs">
                    <Eye className="w-4 h-4 text-amber-600" />
                    <span>{room.memberCount}</span>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col gap-4 p-5 pt-0 flex-1 justify-between">
                  <div className="flex gap-4 items-start">
                    {/* Visual placeholder matching our screen backdrop from the watch page */}
                    <div className="w-2/5 aspect-video bg-[#1C1A17] text-amber-100/60 text-[10px] uppercase tracking-wider font-bold rounded-xl flex items-center justify-center border border-stone-800 shadow-inner shrink-0">
                      <span>Preview</span>
                    </div>
                    <p className="w-3/5 text-sm text-stone-600 line-clamp-3 leading-relaxed">
                      {room.description ?? "No description provided."}
                    </p>
                  </div>

                  {/* Tactile button block to anchor the card layout */}
                  <Button
                    variant="outline"
                    className="w-full mt-2 font-semibold bg-white border-orange-100 hover:bg-[#FAF8F5] text-stone-700 hover:text-stone-900 shadow-2xs rounded-xl transition-all"
                    onClick={() => handleJoinRoom(room.id)}
                  >
                    Join Room
                  </Button>
                </CardContent>
              </Card>
            ))}
          </ul>
        ) : (
          /* Cozy empty state view */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-stone-500 font-medium text-lg">
              No active lounges right now.
            </p>
            <p className="text-stone-400 text-sm mt-1">
              Be the first to spark up a cozy room above!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default Rooms;
