import { useEffect, useState } from "react";
import "../App.css";
import RoomService from "../services/roomService";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Room } from "../types/Room";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

function Rooms() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomUrl, setNewRoomUrl] = useState(
    "https://www.youtube.com/embed/CNsghpC7Aig",
  );

  useEffect(() => {
    async function loadRooms() {
      const response = await RoomService.getRooms();
      setRooms(response);
    }

    loadRooms();
  }, []);

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
    <Card className="flex flex-col w-screen h-screen border border-gray-300 rounded-lg shadow-md p-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-4">Rooms</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Create a room</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold mb-2">
                Create a room
              </DialogTitle>
              <DialogDescription className="flex flex-col gap-2">
                Create and join your own room. Once created, it will be
                available for others to join. You can also share the room link
                with your friends.
              </DialogDescription>
            </DialogHeader>
            <form className="flex flex-col gap-2">
              <FieldGroup>
                <Field>
                  <FieldLabel>Room Name:</FieldLabel>
                  <Input
                    type="text"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                  ></Input>
                </Field>
                <Field>
                  <FieldLabel>Video URL (YouTube embed link):</FieldLabel>
                  <Input
                    type="text"
                    value={newRoomUrl}
                    onChange={(e) => setNewRoomUrl(e.target.value)}
                  ></Input>
                </Field>

                <Button
                  variant="outline"
                  type="button"
                  onClick={handleCreateRoom}
                >
                  Create Room
                </Button>
              </FieldGroup>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        {rooms.length > 0 ? (
          <ul className="grid grid-cols-3 gap-4 w-screen p-4">
            {rooms.map((room: Room) => (
              <Card
                key={room.id}
                className="w-9/10 flex-col mt-4 mb-4 border border-gray-300 rounded-lg shadow-md  p-4"
              >
                <CardHeader>
                  <CardTitle>{room.name}</CardTitle>
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
                <CardFooter className="flex flex-row gap-1 justify-between">
                  <p>
                    Room owner: <i>Unknown</i>
                  </p>
                  <p>Current member watching: {room.memberCount}</p>
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
