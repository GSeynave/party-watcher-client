import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";
async function getTestResponse(): Promise<string> {
  try {
    const response = await axios.get(API_BASE_URL + "/test", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching test response:", error);
    return "Error fetching test response";
  }
}

type LoginData = {
  username: string;
  password: string;
};
type RegisterData = {
  username: string;
  mail: string;
  password: string;
};

type UserContext = {
  userId: string;
  mail: string;
  token: string;
};

async function postRegister(data: RegisterData): Promise<UserContext> {
  return await axios.post(API_BASE_URL + "/auth/register", data);
}

async function postLogin(data: LoginData): Promise<UserContext> {
  return await axios.post(API_BASE_URL + "/auth/login", data, {
    withCredentials: true,
  });
}

async function postMe(): Promise<UserContext> {
  const response = await axios.get(API_BASE_URL + "/users/me", {
    withCredentials: true,
  });
  return response.data;
}
const auth = {
  getTestResponse,

  postRegister,
  postLogin,
  getMe: postMe,
};

export default auth;
