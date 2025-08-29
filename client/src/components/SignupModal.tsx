// src/components/SignupModal.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { signupUserThunk, verifyOtpThunk } from "../store/thunks/authThunks";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../components/ui/input-otp";
import type { SignUpRequest } from "../store/types/auth";

type Props = { onClose: () => void };

export default function SignupModal({ onClose }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const { loading, isAuthenticated, otpRequired, pendingEmail } = useSelector(
    (state: RootState) => state.auth
  );

  const [showPassword, setShowPassword] = useState(false);
  const [credentialsState, setCredentialsState] = useState({
    firstName: "",
    lastName: "",
    mobileNo: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  useEffect(() => {
    // Autofill email on OTP step (optional)
    if (otpRequired && pendingEmail) {
      setCredentialsState((s) => ({ ...s, email: pendingEmail }));
    }
  }, [otpRequired, pendingEmail]);

  // Close after successful verification (optional UX)
  useEffect(() => {
    if (isAuthenticated) onClose();
  }, [isAuthenticated, onClose]);

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    mobileNo: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const validateSignUp = () => {
    const newErrors = {
      firstName: "",
      lastName: "",
      mobileNo: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: "",
    };

    if (!credentialsState.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!credentialsState.lastName.trim())
      newErrors.lastName = "Last name is required";

    if (!/^\d{10}$/.test(credentialsState.mobileNo))
      newErrors.mobileNo = "Enter a valid 10-digit mobile number";
    if (!credentialsState.gender) newErrors.gender = "Select a gender";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentialsState.email))
      newErrors.email = "Enter a valid email";

    const pw = credentialsState.password;
    const pwPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!?])[A-Za-z\d@#$%^&*!?]{8,}$/;
    if (!pw) newErrors.password = "Password is required";
    else if (!pwPattern.test(pw))
      newErrors.password =
        "Password must be 8+ chars with uppercase, lowercase, number & special char";

    if (credentialsState.password !== credentialsState.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignUp()) return;

    const payload: SignUpRequest = {
      firstName: credentialsState.firstName,
      lastName: credentialsState.lastName,
      phone: credentialsState.mobileNo,
      email: credentialsState.email,
      password: credentialsState.password,
      gender: credentialsState.gender,
    };
    dispatch(signupUserThunk(payload));
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      verifyOtpThunk({
        email: credentialsState.email,
        firstName: credentialsState.firstName,
        lastName: credentialsState.lastName,
        phone: credentialsState.mobileNo,
        password: credentialsState.password,
        gender: credentialsState.gender,
        otp: credentialsState.otp,
      })
    );
  };

  return (
    <div className="fixed w-full inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md px-4">
        <Card className="w-full shadow-lg bg-white">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {otpRequired ? "Verify OTP" : "Sign Up"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {otpRequired ? (
              // Inside your OTP step of SignupModal
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="otp-input">
                    Enter OTP sent to your email
                  </Label>
                  <InputOTP
                    id="otp-input"
                    autoFocus
                    maxLength={6}
                    value={credentialsState.otp}
                    onChange={(val) =>
                      setCredentialsState((s) => ({ ...s, otp: val ?? "" }))
                    }
                    onComplete={() => {
                      // Optional: auto-submit when all 6 chars are entered
                      // handleOtpSubmit(new Event("submit") as unknown as React.FormEvent)
                    }}
                    render={({ slots }) => (
                      <InputOTPGroup>
                        {slots.slice(0, 3).map((slot, idx) => (
                          <InputOTPSlot key={`a-${idx}`} {...slot} />
                        ))}
                        <InputOTPSeparator />
                        {slots.slice(3).map((slot, idx) => (
                          <InputOTPSlot key={`b-${idx}`} {...slot} />
                        ))}
                      </InputOTPGroup>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-black text-white hover:bg-gray-700"
                  disabled={loading || credentialsState.otp.length !== 6}
                >
                  Verify OTP
                </Button>
              </form>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <Label>First Name</Label>
                  <Input
                    value={credentialsState.firstName}
                    onChange={(e) =>
                      setCredentialsState((s) => ({
                        ...s,
                        firstName: e.target.value,
                      }))
                    }
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <Label>Last Name</Label>
                  <Input
                    value={credentialsState.lastName}
                    onChange={(e) =>
                      setCredentialsState((s) => ({
                        ...s,
                        lastName: e.target.value,
                      }))
                    }
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">{errors.lastName}</p>
                  )}
                </div>

                <div>
                  <Label>Mobile Number</Label>
                  <Input
                    type="tel"
                    value={credentialsState.mobileNo}
                    onChange={(e) =>
                      setCredentialsState((s) => ({
                        ...s,
                        mobileNo: e.target.value,
                      }))
                    }
                  />
                  {errors.mobileNo && (
                    <p className="text-sm text-red-500">{errors.mobileNo}</p>
                  )}
                </div>

                <div>
                  <Label>Gender</Label>
                  <Select
                    value={credentialsState.gender}
                    onValueChange={(value) =>
                      setCredentialsState((s) => ({ ...s, gender: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className="text-sm text-red-500">{errors.gender}</p>
                  )}
                </div>

                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={credentialsState.email}
                    onChange={(e) =>
                      setCredentialsState((s) => ({
                        ...s,
                        email: e.target.value,
                      }))
                    }
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <Label>Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={credentialsState.password}
                      onChange={(e) =>
                        setCredentialsState((s) => ({
                          ...s,
                          password: e.target.value,
                        }))
                      }
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                <div>
                  <Label>Confirm Password</Label>
                  <Input
                    type="password"
                    value={credentialsState.confirmPassword}
                    onChange={(e) =>
                      setCredentialsState((s) => ({
                        ...s,
                        confirmPassword: e.target.value,
                      }))
                    }
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-black text-white hover:bg-gray-700"
                  disabled={loading}
                >
                  Sign Up
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
