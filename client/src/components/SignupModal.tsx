// src/components/SignupModal.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { signupUserThunk, verifyOtpThunk } from "../store/thunks/authThunks";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "./ui/input-otp";
import type { SignUpRequest } from "../store/types/auth";

// Small inline alert
function ErrorAlert({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700"
    >
      {message}
    </div>
  );
}

type SignupModalProps = {
  onClose: () => void;
  onBackToLogin?: () => void;
};

const RESEND_COOLDOWN_SEC = 45;

const SignupModal: React.FC<SignupModalProps> = ({ onClose, onBackToLogin }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, isAuthenticated, otpRequired, pendingEmail, error } =
    useSelector((state: RootState) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [cooldown, setCooldown] = useState(0);

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

  // derive masked email for OTP screen
  const maskedEmail = useMemo(() => {
    const e = credentialsState.email;
    if (!e || !e.includes("@")) return e;
    const [u, d] = e.split("@");
    const m = u.length <= 2 ? u[0] + "*" : u[0] + "*".repeat(u.length - 2) + u[u.length - 1];
    return `${m}@${d}`;
  }, [credentialsState.email]);

  useEffect(() => {
    if (otpRequired && pendingEmail) {
      setCredentialsState((s) => ({ ...s, email: pendingEmail }));
    }
  }, [otpRequired, pendingEmail]);

  useEffect(() => {
    if (isAuthenticated) onClose();
  }, [isAuthenticated, onClose]);

  useEffect(() => {
    if (!cooldown) return;
    const t = setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    mobileNo: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const clearErrors = () =>
    setErrors({
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

    const firstName = credentialsState.firstName.trim();
    const lastName = credentialsState.lastName.trim();
    const mobileNo = credentialsState.mobileNo.trim();
    const email = credentialsState.email.trim();
    const pw = credentialsState.password;

    if (!firstName) newErrors.firstName = "First name is required";
    if (!lastName) newErrors.lastName = "Last name is required";
    if (!/^[6-9]\d{9}$/.test(mobileNo))
      newErrors.mobileNo = "Enter a valid 10-digit mobile number";
    if (!credentialsState.gender) newErrors.gender = "Select a gender";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Enter a valid email";

    const pwPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!?])[A-Za-z\d@#$%^&*!?]{8,}$/;
    if (!pw) newErrors.password = "Password is required";
    else if (!pwPattern.test(pw))
      newErrors.password =
        "Min 8 chars incl. upper, lower, number & special";

    if (pw !== credentialsState.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const sanitize = (s: string) => s.replace(/\s+/g, " ").trim();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (!validateSignUp()) return;

    const payload: SignUpRequest = {
      firstName: sanitize(credentialsState.firstName),
      lastName: sanitize(credentialsState.lastName),
      phone: credentialsState.mobileNo.trim(),
      email: credentialsState.email.trim().toLowerCase(),
      password: credentialsState.password, // keep exact chars
      gender: credentialsState.gender,
    };
    if (!loading) {
      dispatch(signupUserThunk(payload));
      setCooldown(RESEND_COOLDOWN_SEC); // start initial cooldown after first send
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otp = (credentialsState.otp ?? "").replace(/\D/g, "").trim();
    if (otp.length !== 6) return;

    if (!loading) {
      dispatch(
        verifyOtpThunk({
          email: credentialsState.email.trim().toLowerCase(),
          firstName: sanitize(credentialsState.firstName),
          lastName: sanitize(credentialsState.lastName),
          phone: credentialsState.mobileNo.trim(),
          password: credentialsState.password,
          gender: credentialsState.gender,
          otp,
        })
      );
    }
  };

  const handleResend = () => {
    if (cooldown || loading) return;
    const payload: SignUpRequest = {
      firstName: sanitize(credentialsState.firstName) || "User",
      lastName: sanitize(credentialsState.lastName),
      phone: credentialsState.mobileNo.trim(),
      email: credentialsState.email.trim().toLowerCase(),
      password: credentialsState.password || "Temp@1234", // backend ignores in OTP step
      gender: credentialsState.gender || "other",
    };
    dispatch(signupUserThunk(payload));
    setCooldown(RESEND_COOLDOWN_SEC);
  };

  // restrict OTP to digits
  const onOtpChange = (val?: string) => {
    const onlyDigits = (val ?? "").replace(/\D/g, "").slice(0, 6);
    setCredentialsState((s) => ({ ...s, otp: onlyDigits }));
  };

  return (
    <div className="w-full">
      <Card className="w-full shadow-none border-0">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-2xl font-bold text-left">
            {otpRequired ? "Verify OTP" : "Sign Up"}
          </CardTitle>
        </CardHeader>

        <CardContent className="px-0">
          {error ? (
            <div className="mb-4">
              <ErrorAlert message={error} />
            </div>
          ) : null}

          {otpRequired ? (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="space-y-1">
                <Label htmlFor="otp-email" className="text-sm text-gray-600">
                  We sent a 6-digit code to
                </Label>
                <Input
                  id="otp-email"
                  value={maskedEmail}
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="otp-input">Enter OTP</Label>
                <InputOTP
                  id="otp-input"
                  autoFocus
                  maxLength={6}
                  value={credentialsState.otp}
                  onChange={onOtpChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && credentialsState.otp.length === 6) {
                      e.preventDefault();
                      handleOtpSubmit(e as any);
                    }
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
                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={loading || cooldown > 0}
                    className={`underline underline-offset-4 ${
                      cooldown > 0 ? "text-gray-400" : "text-gray-700 hover:text-black"
                    }`}
                    aria-disabled={cooldown > 0}
                  >
                    {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-gray-800"
                disabled={loading || credentialsState.otp.length !== 6}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <Label>First Name</Label>
                <Input
                  autoComplete="given-name"
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
                  autoComplete="family-name"
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
                  inputMode="numeric"
                  autoComplete="tel"
                  value={credentialsState.mobileNo}
                  onChange={(e) =>
                    setCredentialsState((s) => ({
                      ...s,
                      mobileNo: e.target.value.replace(/[^\d]/g, "").slice(0, 10),
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
                  autoComplete="email"
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
                    autoComplete="new-password"
                    value={credentialsState.password}
                    onChange={(e) =>
                      setCredentialsState((s) => ({
                        ...s,
                        password: e.target.value,
                      }))
                    }
                    className="pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
                {!errors.password && credentialsState.password && (
                  <p className="mt-1 text-xs text-gray-500">
                    Use at least 8 characters incl. upper, lower, number & special
                  </p>
                )}
              </div>

              <div>
                <Label>Confirm Password</Label>
                <Input
                  type="password"
                  autoComplete="new-password"
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
                className="w-full bg-black text-white hover:bg-gray-800"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Footer links inside dialog */}
      <div className="mt-3 flex items-center justify-between">
        {onBackToLogin && (
          <button
            type="button"
            className="text-sm underline underline-offset-4"
            onClick={onBackToLogin}
          >
            Back to Login
          </button>
        )}
        <button
          type="button"
          className="text-sm text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SignupModal;
