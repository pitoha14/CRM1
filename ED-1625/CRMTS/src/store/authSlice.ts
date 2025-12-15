import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Profile } from "../types/types";

interface AuthState {
  accessToken: string | null;
  user: Profile | null;
  isAuth: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  isAuth: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ accessToken: string; user: Profile | null }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.isAuth = action.payload.user !== null;
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isAuth = false;
      localStorage.removeItem("refreshToken");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;