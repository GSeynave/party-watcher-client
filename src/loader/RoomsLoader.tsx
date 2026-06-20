import RoomService from "../services/roomService";

export async function roomsLoader() {
  const response = await RoomService.getRooms();
  return response ?? [];
}
