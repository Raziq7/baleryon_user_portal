import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { loginUserThunk } from "../../store/thunks/authThunks";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import type { LoginRequest } from "../../store/types/auth";
import { requestPasswordReset, resetPasswordWithOtp } from "../../api/authApi";

// -----------------------
// Small utility functions
// -----------------------
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const pwPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!?])[A-Za-z\d@#$%^&*!?]{8,}$/;

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

// --------------------------------
// Component
// --------------------------------
type LoginFormProps = {
  signupClick: () => void;
  onSuccess?: () => void; // close modal after success
};

type ForgotStep = "email" | "otp" | "reset";

const LoginForm: React.FC<LoginFormProps> = ({ signupClick, onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { error: globalError, loading: globalLoading } = useSelector(
    (state: RootState) => state.auth
  );

  // ----- login state -----
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState<LoginRequest>({
    email: "",
    password: "",
  });
  const [loginErrors, setLoginErrors] = useState({ email: "", password: "" });

  // ----- forgot password state -----
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [fpStep, setFpStep] = useState<ForgotStep>("email");
  const [fpEmail, setFpEmail] = useState("");
  const [fpOtp, setFpOtp] = useState("");
  const [fpNewPw, setFpNewPw] = useState("");
  const [fpConfirmPw, setFpConfirmPw] = useState("");
  const [fpErrors, setFpErrors] = useState<{ email?: string; otp?: string; pw?: string; confirmPw?: string }>({});
  const [fpLoading, setFpLoading] = useState(false);
  const [fpMessage, setFpMessage] = useState<string>("");

  // resend cooldown
  const RESEND_SECONDS = 30;
  const [cooldown, setCooldown] = useState(0);
  useEffect(() => {
    if (!cooldown) return;
    const t = setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  // --------- login handlers ----------
  const validateSignIn = (): boolean => {
    const validationErrors = { email: "", password: "" };

    if (!credentials.email || !emailRegex.test(credentials.email)) {
      validationErrors.email = "Please enter a valid email";
    }
    if (!credentials.password) {
      validationErrors.password = "Password is required";
    }
    setLoginErrors(validationErrors);
    return !Object.values(validationErrors).some(Boolean);
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateSignIn()) return;

    const formData = {
      email: credentials.email.trim(),
      password: credentials.password,
      isSignUp: false,
    };

    const resultAction = await dispatch(loginUserThunk(formData));
    if (loginUserThunk.fulfilled.match(resultAction)) {
      // Local storage is already handled in thunks/api; onSuccess closes the dialog
      onSuccess?.();
    }
  };

  // --------- forgot password handlers ----------
  const goForgot = () => {
    setMode("forgot");
    setFpStep("email");
    setFpEmail(credentials.email || "");
    setFpOtp("");
    setFpNewPw("");
    setFpConfirmPw("");
    setFpErrors({});
    setFpMessage("");
  };

  const validateEmail = () => {
    const e = fpEmail.trim();
    const errs: typeof fpErrors = {};
    if (!e || !emailRegex.test(e)) errs.email = "Enter a valid email";
    setFpErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateOtp = () => {
    const errs: typeof fpErrors = {};
    if (!/^\d{6}$/.test(fpOtp.trim())) errs.otp = "Enter the 6-digit OTP";
    setFpErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateNewPw = () => {
    const errs: typeof fpErrors = {};
    if (!fpNewPw) errs.pw = "Password is required";
    else if (!pwPattern.test(fpNewPw))
      errs.pw = "Min 8 chars with upper, lower, number & special char";
    if (fpNewPw !== fpConfirmPw) errs.confirmPw = "Passwords do not match";
    setFpErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submitEmail = async () => {
    if (!validateEmail()) return;
    setFpLoading(true);
    setFpMessage("");
    try {
      await requestPasswordReset(fpEmail.trim());
      setFpStep("otp");
      setCooldown(RESEND_SECONDS);
      setFpMessage("OTP sent to your email.");
    } catch (err: any) {
      setFpMessage(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setFpLoading(false);
    }
  };

  const resendOtp = async () => {
    if (cooldown > 0) return;
    await submitEmail();
  };

  const submitOtpNext = () => {
    if (!validateOtp()) return;
    setFpStep("reset");
    setFpMessage("");
  };

  const submitReset = async () => {
    if (!validateNewPw()) return;
    setFpLoading(true);
    setFpMessage("");
    try {
      await resetPasswordWithOtp({
        email: fpEmail.trim(),
        otp: fpOtp.trim(),
        newPassword: fpNewPw,
      });
      setFpMessage("Password reset successful. You can now log in.");
      // auto-switch back to login with email prefilled
      setTimeout(() => {
        setMode("login");
        setFpStep("email");
        setCooldown(0);
        setCredentials((s) => ({ ...s, email: fpEmail.trim(), password: "" }));
        setShowPassword(false);
      }, 800);
    } catch (err: any) {
      setFpMessage(err?.response?.data?.message || "Failed to reset password");
    } finally {
      setFpLoading(false);
    }
  };

  // helpful memo
  const canSubmitLogin = useMemo(
    () =>
      !globalLoading &&
      credentials.email.length > 0 &&
      credentials.password.length > 0,
    [globalLoading, credentials]
  );

  // ---------------- render ----------------
  if (mode === "forgot") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Reset Password</h3>
          <button
            className="text-sm underline underline-offset-4"
            onClick={() => setMode("login")}
          >
            Back to Login
          </button>
        </div>

        {fpMessage && (
          <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            {fpMessage}
          </div>
        )}

        {fpStep === "email" && (
          <>
            <div className="grid gap-3">
              <Label htmlFor="fp-email">Registered Email</Label>
              <Input
                id="fp-email"
                type="email"
                placeholder="you@example.com"
                value={fpEmail}
                onChange={(e) => setFpEmail(e.target.value)}
              />
              {fpErrors.email && (
                <p className="text-red-500 text-sm">{fpErrors.email}</p>
              )}
            </div>

            <Button className="w-full" onClick={submitEmail} disabled={fpLoading}>
              {fpLoading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </>
        )}

        {fpStep === "otp" && (
          <>
            <div className="grid gap-3">
              <Label htmlFor="fp-otp">Enter OTP</Label>
              <Input
                id="fp-otp"
                inputMode="numeric"
                placeholder="6-digit code"
                maxLength={6}
                value={fpOtp}
                onChange={(e) => setFpOtp(e.target.value.replace(/\D/g, ""))}
              />
              {fpErrors.otp && (
                <p className="text-red-500 text-sm">{fpErrors.otp}</p>
              )}
              <div className="flex items-center justify-between text-sm">
                <span>OTP sent to {fpEmail}</span>
                <button
                  type="button"
                  onClick={resendOtp}
                  disabled={fpLoading || cooldown > 0}
                  className={`underline underline-offset-4 ${
                    cooldown > 0 ? "text-gray-400 cursor-not-allowed" : ""
                  }`}
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
                </button>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={submitOtpNext}
              disabled={fpLoading || fpOtp.trim().length !== 6}
            >
              Next
            </Button>
          </>
        )}

        {fpStep === "reset" && (
          <>
            <div className="grid gap-3">
              <Label htmlFor="fp-newpw">New Password</Label>
              <PasswordField
                id="fp-newpw"
                value={fpNewPw}
                onChange={(v) => setFpNewPw(v)}
              />
              {fpErrors.pw && (
                <p className="text-red-500 text-sm">{fpErrors.pw}</p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="fp-confirmpw">Confirm Password</Label>
              <Input
                id="fp-confirmpw"
                type="password"
                value={fpConfirmPw}
                onChange={(e) => setFpConfirmPw(e.target.value)}
              />
              {fpErrors.confirmPw && (
                <p className="text-red-500 text-sm">{fpErrors.confirmPw}</p>
              )}
            </div>

            <Button className="w-full" onClick={submitReset} disabled={fpLoading}>
              {fpLoading ? "Saving..." : "Reset Password"}
            </Button>
          </>
        )}
      </div>
    );
  }

  // ---------------- login UI ----------------
  return (
    <form onSubmit={handleLoginSubmit}>
      {typeof globalError === "string" && (
        <p className="text-red-500 text-sm mb-4">{globalError}</p>
      )}

      <div className="flex flex-col gap-6">
        {/* Email */}
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={credentials.email}
            onChange={(e) =>
              setCredentials((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          {loginErrors.email && (
            <p className="text-red-500 text-sm">{loginErrors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <button
              type="button"
              className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
              onClick={goForgot}
            >
              Forgot your password?
            </button>
          </div>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={credentials.password}
              onChange={(e) =>
                setCredentials((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          {loginErrors.password && (
            <p className="text-red-500 text-sm">{loginErrors.password}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={!canSubmitLogin}>
            {globalLoading ? "Logging in..." : "Login"}
          </Button>
          <button
            type="button"
            onClick={signupClick}
            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
          >
            Don&apos;t have an account? Sign Up
          </button>
        </div>
      </div>
    </form>
  );
};

// -----------------------
// Reusable password field
// -----------------------
const PasswordField: React.FC<{
  id?: string;
  value: string;
  onChange: (v: string) => void;
}> = ({ id, value, onChange }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        placeholder="Strong password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        {show ? <EyeOffIcon /> : <EyeIcon />}
      </button>
      <p className="mt-2 text-[11px] text-gray-500">
        Must be 8+ chars with uppercase, lowercase, number & special char.
      </p>
    </div>
  );
};

export default LoginForm;
