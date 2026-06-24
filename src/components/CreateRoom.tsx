import { FieldGroup } from "@/components/ui/field";
import RoomService from "../services/roomService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  RoomNameInput,
  RoomUrlInput,
} from "@/components/InputFields/InputHelper";
import { Button } from "./ui/button";
import { useState } from "react";
import { useNavigate } from "react-router";

function CreateRoomForm() {
  const navigate = useNavigate();
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomUrl, setNewRoomUrl] = useState(
    "https://www.youtube.com/embed/y0sF5xhGreA",
  );
  async function onCreateRoom() {
    console.log("Create room with name:", newRoomName);
    const roomId = await RoomService.createRoom(newRoomName, newRoomUrl);
    if (roomId) {
      navigate(`/room/${roomId}`);
    }
  }
  return (
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
            Create and join your own room. Once created, it will be available
            for others to join. You can also share the room link with your
            friends.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-2">
          <FieldGroup>
            <RoomNameInput value={newRoomName} onChange={setNewRoomName} />
            <RoomUrlInput value={newRoomUrl} onChange={setNewRoomUrl} />

            <Button variant="outline" type="button" onClick={onCreateRoom}>
              Create Room
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateRoomForm;
