import api from "./index";
import type {
  UserRegistration,
  AuthData,
  TokenResponse,
  Profile,
  UserRequest,
} from "../types/types";

export async function registerUser(
  data: UserRegistration
): Promise<Profile> {
  const response = await api.post<Profile>("/auth/signup", data);
  return response.data;
}

export async function loginUser(
  data: AuthData
): Promise<TokenResponse> {
  const response = await api.post<TokenResponse>("/auth/signin", data);
  return response.data;
}

export async function getProfile(): Promise<Profile> {
  const response = await api.get<Profile>("/user/profile");
  return response.data;
}

export async function updateProfile(
  data: UserRequest
): Promise<Profile> {
  const response = await api.put<Profile>("/user/profile", data);
  return response.data;
}

export async function logoutUserApi(): Promise<void> {
  await api.post("/user/logout");
}