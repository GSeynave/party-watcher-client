import { useCallback, useEffect, useState } from "react";
import "../App.css";
import RoomService from "../services/roomService";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { UserContext } from "../types/UserContext";
import type { Room } from "../types/Room";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router";

type RoomsProps = {
  user?: UserContext;
};

function Rooms({ user }: RoomsProps) {
  const navigate = useNavigate();
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomUrl, setNewRoomUrl] = useState(
    "https://www.youtube.com/embed/CNsghpC7Aig",
  );
  const [rooms, setRooms] = useState<Room[]>([]);

  const fetchRooms = useCallback(async () => {
    try {
      const response = await RoomService.getRooms();
      console.log("Fetched rooms data:", response);
      setRooms(response);
    } catch (error) {
      console.error("Error fetching rooms data:", error);
    }
  }, []);

  useEffect(() => {
    console.log("Rooms component - user:", user);
    void fetchRooms();
  }, [user, fetchRooms]);

  async function handleCreateRoom() {
    console.log("Create room with name:", newRoomName);
    const roomId = await RoomService.createRoom(newRoomName, newRoomUrl);
    if (roomId) {
      navigate(`/room/${roomId}`);
    }
  }

  async function handleJoinRoom(roomId: string) {
    navigate(`/room/${roomId}`);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-4">Rooms</CardTitle>
      </CardHeader>

      <CardContent>
        <h3>Create a room:</h3>
        <form>
          <Label>
            Room Name:
            <Input
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
            ></Input>
          </Label>
          <Label>
            Room URL:
            <Input
              type="text"
              value={newRoomUrl}
              onChange={(e) => setNewRoomUrl(e.target.value)}
            ></Input>
          </Label>
          <Button type="button" onClick={handleCreateRoom}>
            Create Room
          </Button>
        </form>
        <h3>Rooms :</h3>
        {rooms.length > 0 ? (
          <ul>
            {rooms.map((room: Room) => (
              <Card key={room.id} className="flex-col mt-4 mb-4">
                <CardHeader>
                  <CardTitle>{room.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{room.description}</p>
                  <p>Current member watching: {room.memberCount}</p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleJoinRoom(room.id)}
                  >
                    Join Room
                  </Button>
                </CardFooter>
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
