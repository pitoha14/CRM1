import api from "./index";
import { setAccessToken, clearAccessToken } from "./tokenService";
import type {
  UserRegistration,
  AuthData,
  TokenResponse,
  Profile,
  UserRequest, 
} from "../types/types";

export async function registerUser(data: UserRegistration) {
  const response = await api.post<Profile>("/auth/signup", data);
  return response.data; 
}

export async function loginUser(data: AuthData) {
  const response = await api.post<TokenResponse>("/auth/signin", data);
  const { accessToken, refreshToken } = response.data;
  localStorage.setItem("refreshToken", refreshToken);
  setAccessToken(accessToken);
  return response.data;
}

export async function getProfile(): Promise<Profile> {
  const response = await api.get<Profile>("/user/profile");
  return response.data;
}

export async function updateProfile(data: UserRequest): Promise<Profile> {
  const response = await api.put<Profile>("/user/profile", data);
  return response.data;
}


export async function logoutUserApi() {
  try {
    await api.post("/user/logout");
  } finally {
    clearAccessToken();
    localStorage.removeItem("refreshToken");
  }
}