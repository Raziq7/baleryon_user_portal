// src/store/slices/authSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { signupUserThunk, loginUserThunk, verifyOtpThunk, logoutUserThunk } from "../thunks/authThunks";
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
  reducers: { /* ... */ },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true; state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = mapApiUserToStoreUser(action.payload.user as ApiUser);
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.otpRequired = false;
        state.pendingEmail = null;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Login failed";
      });

    // Do the same mapping anywhere else you set `state.user`:
    builder.addCase(signupUserThunk.fulfilled, (state, action) => {
      console.log(action.payload.user,"useruseruseruseruseruseruser");
      console.log(action.payload?.message,"00000000000000000000000000000");

      
      state.loading = false;
      // state.user = mapApiUserToStoreUser(action.payload.user as ApiUser);
      state.token = action.payload.token;
      state.otpRequired = action.payload?.message == "OTP sent to email" ? true : false ;
      state.isAuthenticated = false;
    });

    builder.addCase(verifyOtpThunk.fulfilled, (state, action) => {
      state.loading = false;
      // if verifyOtp returns a user:
      if (action.payload.user) {
        state.user = mapApiUserToStoreUser(action.payload.user as ApiUser);
      }
      // if verifyOtp also returns a token, set it here too
      if ((action.payload as any).token) {
        state.token = (action.payload as any).token;
        state.isAuthenticated = true;
      }
      state.otpRequired = false;
      state.pendingEmail = null;
    });

    builder.addCase(logoutUserThunk.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.otpRequired = false;
      state.pendingEmail = null;
    });
  },
});

export default authSlice.reducer;
