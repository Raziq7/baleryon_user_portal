// AuthResponse.ts
// src/store/types/auth/User.ts
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
  // keep 'name' for UI convenience; computed from first/last
  name: string;
  role?: string;
}

// small helper to normalize API user -> store user
export const mapApiUserToStoreUser = (u: ApiUser): User => ({
  ...u,
  name: `${u.firstName} ${u.lastName}`.trim(),
});

export interface AuthResponse {
  token: string; // The JWT token returned upon successful login
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileNo: string;
    gender: string;
    createdAt: string;
    updatedAt: string;
  };
}

// SignUpRequest.ts
export interface SignUpRequest {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  gender: string;
}

// SignUpResponse.ts
export interface SignUpResponse {
  message: string;
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileNo: string;
    gender: string;
    createdAt: string;
    updatedAt: string;
  };
}

// Define this inline or create a new file `OtpVerificationData.ts`
export interface OtpVerificationData {
  email: string;
  otp: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  gender: string;
}

// OtpSubmitResponse.ts
export interface OtpSubmitResponse {
  message: string; // Message indicating the result of the OTP verification
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileNo: string;
    gender: string;
    createdAt: string;
    updatedAt: string;
  };
}

// ApiErrorResponse.ts
export interface ApiErrorResponse {
  message: string; // Error message from the server
  statusCode: number; // HTTP status code
  error: string; // Type of error (e.g., "BadRequest", "Unauthorized")
}

// LoginRequest.ts

export interface LoginRequest {
  email: string;
  password: string;
}

// LoginResponse.ts
export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileNo: string;
    gender: string;
    createdAt: string;
    updatedAt: string;
  };
}

// VerifyOtpResponse.ts
// export interface VerifyOtpResponse {
//   message: string;
//   token: string;
//   user: {
//     id: string;
//     firstName: string;
//     lastName: string;
//     email: string;
//     mobileNo: string;
//     gender: string;
//     createdAt: string;
//     updatedAt: string;
//   };
// }

// VerifyOtpResponse.ts
export interface VerifyOtpResponse {
  message: string;
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileNo: string;
    gender: string;
    createdAt: string;
    updatedAt: string;
  };
}
