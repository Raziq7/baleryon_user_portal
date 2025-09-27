// src/api/authApi.ts
import type { SignUpResponse, LoginResponse, VerifyOtpResponse } from "@/store/types/auth";
import api from "../utils/baseUrl";
import { setAuth, clearAuth } from "../utils/authToken";

export const signupUser = async (userData: {
  email: string; password: string; firstName: string; lastName: string; phone: string; gender: string;
}) => {
  // OTP send step — NO token here
  const { data } = await api.post<SignUpResponse>("/api/user/auth", {
    ...userData,
    isSignUp: true,
  });
  return data; // expect {message: "..."} or similar
};

export const loginUser = async (credentials: { email: string; password: string; }) => {
  const { data } = await api.post<LoginResponse>("/api/user/auth", {
    ...credentials,
    isSignUp: false,
  });
  // store token + user now
  setAuth(data.token, data.user);
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
    mobile: phone,
    password,
    gender,
  });
  // store token + user **after OTP verify succeeds**
  if ((data as any).token) {
    setAuth((data as any).token, (data as any).user);
  }
  return data;
};

export const logoutUser = async () => {
  try {
    await api.post("/api/user/auth/logout");
  } finally {
    clearAuth();
  }
};
