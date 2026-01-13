import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Profile } from "../types/types";

interface AuthState {
  user: Profile | null;
  isAuth: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuth: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<Profile | null>) {
      state.user = action.payload;
      state.isAuth = Boolean(action.payload);
    },
    logout(state) {
      state.user = null;
      state.isAuth = false;
      localStorage.removeItem("refreshToken");
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;