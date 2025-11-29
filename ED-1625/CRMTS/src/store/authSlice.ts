import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Profile } from "../types/types";

interface AuthState {
  accessToken: string | null;
  user: Profile | null;
  isAuth: boolean;
}

const initialState: AuthState = {
  // accessToken больше не берется из localStorage и не сохраняется там.
  accessToken: null, 
  user: null,
  // isAuth будет true только после успешного логина/обновления.
  isAuth: false, 
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ accessToken: string; user: Profile | null }>) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.isAuth = true;
      // localStorage.setItem("accessToken", action.payload.accessToken); // <-- Удалено!
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isAuth = false;
      // localStorage.removeItem("accessToken"); // <-- Удалено!
      localStorage.removeItem("refreshToken"); // <-- Оставлено
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;