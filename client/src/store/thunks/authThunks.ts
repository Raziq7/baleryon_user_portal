// src/store/thunks/authThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type {
  LoginRequest,
  OtpVerificationData,
  SignUpRequest,
  SignUpResponse,
  LoginResponse,
  VerifyOtpResponse,
} from "../types/auth";
import {
  signupUser,
  loginUser,
  verifyOtp,
  logoutUser,
} from "../../api/authApi";
import { clearAuth } from "../../utils/authToken";

// Signup (request OTP)
// In the thunk
export const signupUserThunk = createAsyncThunk<
  SignUpResponse & { pendingEmail: string },
  SignUpRequest,
  { rejectValue: string }
>("auth/signup", async (userData, { rejectWithValue }) => {
  try {
    const response = await signupUser(userData);
    // response may be either axios.data or a plain object; handle both safely
    const data: any =
      response && (response as any).data ? (response as any).data : response;

    const emailFromResponse =
      data?.user?.email ?? data?.email ?? userData.email; // final fallback: what the user typed

    return {
      ...(data ?? {}), // preserve message or any other fields
      pendingEmail: emailFromResponse,
    };
  } catch (error) {
    console.log(error, "errorerrorerrorerrorerrorerror");
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
    return rejectWithValue("An unexpected error occurred");
  }
});

// Login
export const loginUserThunk = createAsyncThunk<
  LoginResponse, // e.g., { user, token }
  LoginRequest,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await loginUser(credentials);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
    return rejectWithValue("An unexpected error occurred");
  }
});

// Verify OTP
export const verifyOtpThunk = createAsyncThunk<
  VerifyOtpResponse, // e.g., { user, token }
  OtpVerificationData, // { email, otp }
  { rejectValue: string }
>(
  "auth/verifyOtp",
  async (
    { email, otp, firstName, lastName, phone, password, gender },
    { rejectWithValue }
  ) => {
    try {
      const response = await verifyOtp(
        email,
        otp,
        firstName,
        lastName,
        phone,
        password,
        gender
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "OTP verification failed"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

// Logout
export const logoutUserThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("auth/logout", async (_, { rejectWithValue }) => {
  try {
    // Call server (but don't block UI on failure)
    await logoutUser();
  } catch (error) {
    // swallow server errors; still clear local state so UI updates immediately
    if (axios.isAxiosError(error)) {
      // optional: return rejectWithValue(...) if you want a toast
    }
  } finally {
    // Always clear local side
    clearAuth(); // removes token & user from localStorage
  }
});
