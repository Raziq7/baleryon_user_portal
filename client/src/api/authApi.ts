// src/api/authApi.ts
import type { SignUpResponse, LoginResponse, VerifyOtpResponse, ApiUser } from "@/store/types/auth";
import api from "../utils/baseUrl";
import { setAuth, clearAuth } from "../utils/authToken";
import { mapApiUserToStoreUser } from "../store/types/auth";

export const signupUser = async (userData: {
  email: string; password: string; firstName: string; lastName: string; phone: string; gender: string;
}) => {
  const { data } = await api.post<SignUpResponse>("/api/user/auth", {
    ...userData,
    isSignUp: true,
  });
  return data; // only message/email expected
};

export const loginUser = async (credentials: { email: string; password: string; }) => {
  const { data } = await api.post<LoginResponse>("/api/user/auth", {
    ...credentials,
    isSignUp: false,
  });
  // Store normalized
  setAuth(data.token, mapApiUserToStoreUser(data.user as ApiUser));
  return data;
};

export const verifyOtp = async (
  email: string,
  otp: string,
  firstName: string,
  lastName: string,
  phone: string,
  password: string,
  gender: string
) => {
  const { data } = await api.post<VerifyOtpResponse>("/api/user/auth/verify-otp", {
    email,
    otp,
    firstName,
    lastName,
    mobile: phone, // server expects 'mobile'
    password,
    gender,
  });
  if (data?.token && data?.user) {
    setAuth(data.token, mapApiUserToStoreUser(data.user as ApiUser));
  }
  return data;
};


// --- Forgot password APIs ---
export const requestPasswordReset = async (email: string) => {
  // server: POST /api/user/auth/password/forgot  => { message: "OTP sent" }
  const { data } = await api.post<{ message: string }>(
    "/api/user/auth/password/forgot",
    { email }
  );
  return data;
};

export const resetPasswordWithOtp = async (args: {
  email: string;
  otp: string;
  newPassword: string;
}) => {
  // server: POST /api/user/auth/password/reset => { message: "Password reset successful" }
  const { data } = await api.post<{ message: string }>(
    "/api/user/auth/password/reset",
    args
  );
  return data;
};


export const logoutUser = async () => {
  try {
    await api.post("/api/user/auth/logout");
  } finally {
    clearAuth();
  }
};
