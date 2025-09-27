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
import { getStoredAuth } from "../../utils/authToken";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  otpRequired: boolean;
  pendingEmail: string | null;
}

const stored = typeof window !== "undefined" ? getStoredAuth() : { token: null, user: null };

const initialState: AuthState = {
  user: stored.user ? mapApiUserToStoreUser(stored.user as ApiUser) : null,
  token: stored.token,
  loading: false,
  error: null,
  isAuthenticated: !!stored.token,
  otpRequired: false,
  pendingEmail: null,
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initFromStorage(state) {
      const { token, user } = getStoredAuth();
      state.token = token;
      state.user = user ? mapApiUserToStoreUser(user as ApiUser) : null;
      state.isAuthenticated = !!token;
    },
    clearError(state) {
      state.error = null;
    },
  },
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
        // don't toggle otpRequired here; this is a pure login path
      });

    // SIGNUP (Send OTP) — NO token, set otpRequired + pendingEmail
    builder
      .addCase(signupUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUserThunk.fulfilled, (state, action) => {
        state.loading = false;

        // support multiple backend payload shapes
        const anyPayload = action.payload as any;
        const message: string | undefined = anyPayload?.message;
        const pendingEmailFromPayload: string | null =
          anyPayload?.pendingEmail ??
          anyPayload?.user?.email ??
          anyPayload?.email ??
          null;

        // mark that we should show the OTP screen
        state.otpRequired =
          typeof message === "string"
            ? /otp/i.test(message) // "OTP sent to email"
            : true; // default to true if server didn't send a message, because we called signup

        state.pendingEmail = pendingEmailFromPayload;

        // explicitly do NOT authenticate here
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(signupUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Sign up failed";
        state.otpRequired = false; // keep user on signup form when send-OTP fails
        state.pendingEmail = null;
      });

    // VERIFY OTP — set token/user if returned
    builder
      .addCase(verifyOtpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtpThunk.fulfilled, (state, action) => {
        state.loading = false;

        const anyPayload = action.payload as any;

        if (anyPayload?.user) {
          state.user = mapApiUserToStoreUser(anyPayload.user as ApiUser);
        }
        if (anyPayload?.token) {
          state.token = anyPayload.token;
          state.isAuthenticated = true;
        } else {
          // if no token returned (unexpected), remain unauthenticated
          state.isAuthenticated = false;
        }

        state.otpRequired = false;
        state.pendingEmail = null;
        state.error = null;
      })
      .addCase(verifyOtpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "OTP verification failed";
        // stay on OTP screen so user can retry
        state.otpRequired = true;
      });

    // LOGOUT — clear everything immediately (UI updates instantly)
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
        // We still consider the user logged out (thunk clears local auth in finally)
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.otpRequired = false;
        state.pendingEmail = null;
        state.error = (action.payload as string) ?? "Logout failed";
      });
  },
});

export const { initFromStorage,clearError } = authSlice.actions;
export default authSlice.reducer;
