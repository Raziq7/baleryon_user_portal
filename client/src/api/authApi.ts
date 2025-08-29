// src/api/authApi.ts
import type {
  SignUpResponse,
  LoginResponse,
  VerifyOtpResponse,
} from "@/store/types/auth";
import api from "../utils/baseUrl";

export const signupUser = async (userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: string;
}) => {
  const response = await api.post<SignUpResponse>("/api/user/auth", {
    ...userData,
    isSignUp: true,
  });
  return response.data;
};

export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  const response = await api.post<LoginResponse>("/api/user/auth", {
    ...credentials,
    isSignUp: false,
  });
  if (typeof window !== "undefined") {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }
  return response.data;
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
  const response = await api.post<VerifyOtpResponse>(
    "/api/user/auth/verify-otp",
    { email, otp, firstName, lastName,mobile: phone, password, gender }
  );
  // optionally persist here
  // if (typeof window !== "undefined") {
  //   if (response.data.token) {
  //     localStorage.setItem("token", response.data.token);
  //   }
  //   if (response.data.user) {
  //     localStorage.setItem("user", JSON.stringify(response.data.user));
  //   }
  // }
  return response.data;
};

export const logoutUser = async () => {
  const token = localStorage.getItem("token");
  await api.post(
    "/api/user/auth/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  console.log("============================");

  localStorage.removeItem("user");
  localStorage.removeItem("token");

  return; // no data needed
};
