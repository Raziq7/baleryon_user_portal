// src/store/types/auth/index.ts
export interface ApiUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNo: string;
  gender: string;
  createdAt: string;
  updatedAt: string;
}

export interface User extends ApiUser {
  name: string;    // computed for UI
  role?: string;
}

export const mapApiUserToStoreUser = (u: ApiUser): User => {
  const safeFirst = u.firstName ?? "";
  const safeLast  = u.lastName ?? "";
  const full = [safeFirst, safeLast].filter(Boolean).join(" ").trim();
  const fallback = u.email ? u.email.split("@")[0] : "User";
  return {
    ...u,
    name: full || fallback, // never "undefined undefined"
  };
};

// Auth/Request/Response interfaces unchanged:
export interface AuthResponse { token: string; user: ApiUser; }
export interface SignUpRequest { firstName: string; lastName: string; phone: string; email: string; password: string; gender: string; }
export interface SignUpResponse { message: string; token?: string; user?: ApiUser; }
export interface OtpVerificationData { email: string; otp: string; firstName: string; lastName: string; phone: string; password: string; gender: string; }
export interface OtpSubmitResponse { message: string; user: ApiUser; }
export interface ApiErrorResponse { message: string; statusCode: number; error: string; }
export interface LoginRequest { email: string; password: string; }
export interface LoginResponse { message: string; token: string; user: ApiUser; }
export interface VerifyOtpResponse { message: string; token: string; user: ApiUser; }
