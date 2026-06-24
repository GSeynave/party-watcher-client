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
    <Card className="flex h-full min-h-0 flex-col rounded">
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-4">Rooms</CardTitle>
        <div className="mb-4">
          <CreateRoomForm />
        </div>
      </CardHeader>

      <CardContent>
        {rooms.length > 0 ? (
          <ul className="grid grid-cols-3 gap-4 w-screen p-4">
            {rooms.map((room: Room) => (
              <Card
                key={room.id}
                className="w-9/10 flex-col mt-4 mb-4 border border-gray-300 rounded-lg shadow-md  p-4"
              >
                <CardHeader className="flex flex-row justify-between items-center">
                  <CardTitle>{room.name}</CardTitle>
                  <div className="flex flex-row gap-2 items-center">
                    <Eye /> {room.memberCount}
                  </div>
                </CardHeader>
                <CardContent className="flex flex-row gap-2">
                  <div className="w-2/5">Img preview.</div>
                  <p className="w-2/5">
                    {room.description ?? "No description provided."}{" "}
                  </p>
                  <Button
                    variant="outline"
                    className="w-1/5"
                    onClick={() => handleJoinRoom(room.id)}
                  >
                    Join Room
                  </Button>
                </CardContent>
              </Card>
            ))}
          </ul>
        ) : (
          <p>No rooms available.</p>
        )}
      </CardContent>
    </Card>
  );
}

export default Rooms;
