// src/store/slices/authSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import {
  signupUserThunk,
  loginUserThunk,
  verifyOtpThunk,
  logoutUserThunk,
} from "../thunks/authThunks";
import type { User, ApiUser } from "../types/auth";
import { mapApiUserToStoreUser } from "../types/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  otpRequired: boolean;
  pendingEmail: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  otpRequired: false,
  pendingEmail: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // LOGIN
    builder
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = mapApiUserToStoreUser(action.payload.user as ApiUser);
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.otpRequired = false;
        state.pendingEmail = null;
        state.error = null;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Login failed";
        state.isAuthenticated = false;
      });

    // SIGNUP
    builder
      .addCase(signupUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUserThunk.fulfilled, (state, action) => {
  state.loading = false;
  state.token = action.payload.token;
  state.otpRequired = action.payload.message === "OTP sent to email";
  state.isAuthenticated = false;
  state.pendingEmail = action.payload.user?.email ?? null; // <-- use nested user.email
  state.error = null;
})
      .addCase(signupUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Sign up failed";
        state.otpRequired = false;
      });

    // VERIFY OTP
    builder
      .addCase(verifyOtpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtpThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.user) {
          state.user = mapApiUserToStoreUser(action.payload.user as ApiUser);
        }
        if ((action.payload as any).token) {
          state.token = (action.payload as any).token;
          state.isAuthenticated = true;
        }
        state.otpRequired = false;
        state.pendingEmail = null;
        state.error = null;
      })
      .addCase(verifyOtpThunk.rejected, (state, action) => {
        state.loading = false;
        // e.g. "Invalid OTP" from rejectWithValuep
        state.error = (action.payload as string) ?? "OTP verification failed";
        // keep otpRequired true so the user stays on OTP screen
        state.otpRequired = true;
      });

    // LOGOUT
    builder
      .addCase(logoutUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.otpRequired = false;
        state.pendingEmail = null;
        state.error = null;
      })
      .addCase(logoutUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Logout failed";
      });
  },
});

export default authSlice.reducer;
