import api from "./index";
import type { UserRegistration, AuthData, TokenResponse, Profile } from "../types/types";

export async function registerUser(data: UserRegistration) {
  return await api.post<Profile>("/auth/signup", data);
}

export async function loginUser(data: AuthData) {
  const response = await api.post<TokenResponse>("/auth/signin", data);
  return response.data;
}

export async function getProfile() {
  const response = await api.get<Profile>("/user/profile");
  return response.data;
}

export async function logoutUserApi() {
  return await api.post("/user/logout");
}