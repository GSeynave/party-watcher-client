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
        {/* Trigger Button: Swapped electric blue for a rich, inviting stone-and-amber accent mix */}
        <Button className="bg-stone-800 hover:bg-stone-700 text-amber-50 font-semibold rounded-xl shadow-xs transition-colors">
          Create a room
        </Button>
      </DialogTrigger>

      {/* Modal Frame: Upgraded to rounded-2xl with our signature warm oatmeal background */}
      <DialogContent className="sm:max-w-[425px] p-6 rounded-2xl border border-orange-100/60 bg-[#FAF8F5] shadow-xl">
        <DialogHeader className="space-y-2 text-left pb-4 border-b border-orange-100/40">
          <DialogTitle className="text-xl font-bold tracking-tight text-stone-800">
            Create a room
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-stone-500">
            Create and join your own room. Once created, it will be available
            for others to join. You can also share the room link with your
            friends.
          </DialogDescription>
        </DialogHeader>

        {/* Form Panel Container */}
        <form className="space-y-6 pt-4">
          {/* NOTE: Ensure that your internal <RoomNameInput /> and <RoomUrlInput /> 
        components inside your codebase carry the `rounded-xl` class to match 
        this smooth-corner style!
      */}
          <FieldGroup className="flex flex-col gap-4">
            <RoomNameInput value={newRoomName} onChange={setNewRoomName} />
            <RoomUrlInput value={newRoomUrl} onChange={setNewRoomUrl} />
          </FieldGroup>

          {/* Footer Submission Action */}
          <div className="flex justify-end pt-1">
            <Button
              type="button"
              onClick={onCreateRoom}
              className="w-full sm:w-auto px-6 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-xl shadow-xs transition-colors"
            >
              Create Room
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateRoomForm;
