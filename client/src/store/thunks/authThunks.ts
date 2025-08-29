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

// Signup (request OTP)
export const signupUserThunk = createAsyncThunk<
  SignUpResponse, // what your API returns on signup (e.g., { message, otpSent, email? })
  SignUpRequest,
  { rejectValue: string }
>("auth/signup", async (userData, { rejectWithValue }) => {
  try {
    const response = await signupUser(userData);
    return response;
  } catch (error) {
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
      const response = await verifyOtp(email, otp, firstName, lastName, phone, password, gender);
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
    await logoutUser();
    // local cleanup is also done in slice on fulfilled
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
    return rejectWithValue("An unexpected error occurred");
  }
});
