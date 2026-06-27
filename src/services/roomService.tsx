import type { Room } from "@/types/Room";
import axios from "axios";
import { config } from "../utils/config.ts";

const API_BASE_URL = config.SERVER_HOST + "/api/rooms";
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API request error:", error);
    if (error.response && error.response.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
async function getRoomById(roomId: string): Promise<Room> {
  try {
    const response = await axiosInstance.get("/" + roomId);
    return response.data;
  } catch (error) {
    console.error("Error fetching room response:", error);
    throw error;
  }
}

async function getRooms(): Promise<Room[]> {
  try {
    const response = await axiosInstance.get("/");
    return response.data.rooms ?? [];
  } catch (error) {
    console.error("Error fetching room response:", error);
    return [];
  }
}
async function getRoomUserCount(roomId: string): Promise<number> {
  try {
    const response = await axiosInstance.get(`/${roomId}/user-count`);
    return response.data ?? 0;
  } catch (error) {
    console.error("Error fetching room response:", error);
    return 0;
  }
}

async function createRoom(name: string, url: string): Promise<string | null> {
  try {
    const response = await axiosInstance.post(API_BASE_URL, { name, url });
    console.log("Room created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating room:", error);
    return null;
  }
}

async function joinRoom(roomId: string): Promise<void> {
  try {
    await axiosInstance.get(`/${roomId}/join`);
    console.log(`Joined room ${roomId} successfully.`);
  } catch (error) {
    console.error("Error joining room:", error);
  }
}

async function sendMessage(roomId: string, message: string): Promise<boolean> {
  try {
    await axiosInstance.post(`${API_BASE_URL}/${roomId}/message`, {
      roomId,
      message,
    });
    return true;
  } catch (error) {
    console.error("Error while sending message :", error);
    return false;
  }
}
const api = {
  getRoomUserCount,
  getRoomById,
  getRooms,
  createRoom,
  joinRoom,
  sendMessage,
};

export default api;
