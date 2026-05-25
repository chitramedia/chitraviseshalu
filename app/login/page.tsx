"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  // View state: 'login' | 'signup' | 'otp'
  const [view, setView] = useState<"login" | "signup" | "otp">("login");
  
  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  
  // Verification helper state
  const [registeredUserId, setRegisteredUserId] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [generalSuccess, setGeneralSuccess] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    otp?: string;
  }>({});

  // Local development helpers
  const [devInfo, setDevInfo] = useState<{
    otp?: string;
    verificationLink?: string;
    testMailUrl?: string;
  } | null>(null);

  // Cooldown timer for resending OTP
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Form field validations
  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};
    let isValid = true;

    // Email validation
    if (!email) {
      errors.email = "Email address is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    if (!password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    // Signup specific validation
    if (view === "signup") {
      if (!confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
        isValid = false;
      } else if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
        isValid = false;
      }
    }

    setValidationErrors(errors);
    return isValid;
  };

  // OTP Validation
  const validateOtp = (): boolean => {
    const errors: typeof validationErrors = {};
    let isValid = true;

    if (!otpCode) {
      errors.otp = "Verification code is required";
      isValid = false;
    } else if (!/^\d{6}$/.test(otpCode)) {
      errors.otp = "Verification code must be exactly 6 digits";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  // Clear errors when changing fields or views
  const handleViewChange = (newView: "login" | "signup" | "otp") => {
    setView(newView);
    setGeneralError("");
    setGeneralSuccess("");
    setValidationErrors({});
    setOtpCode("");
    setPassword("");
    setConfirmPassword("");
    setDevInfo(null);
  };

  // Login Handler
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setGeneralError("");
    setGeneralSuccess("");

    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoading(false);
        setGeneralError(error.message);
        return;
      }

      const user = authData?.user;
      if (user) {
        // Check verification status in profiles table
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("is_verified")
          .eq("id", user.id)
          .single();

        if (!profileError && profile && profile.is_verified === false) {
          // If not verified, sign out immediately and show verification prompt
          await supabase.auth.signOut();
          setRegisteredUserId(user.id);
          setView("otp");
          setGeneralSuccess("Your account is registered but email is not verified yet. We have resent/activated your OTP code.");
          setLoading(false);
          
          // Re-trigger sending OTP or just let them enter the OTP they already have
          await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          return;
        }
      }

      setLoading(false);
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setLoading(false);
      setGeneralError(err.message || "An unexpected error occurred during login.");
    }
  }

  // Signup Handler (Creates account and requests OTP/link)
  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setGeneralError("");
    setGeneralSuccess("");
    setDevInfo(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok || data.error) {
        setGeneralError(data.error || "Failed to create account. Please try again.");
        return;
      }

      // Store user ID for OTP verification step
      if (data.userId) {
        setRegisteredUserId(data.userId);
      }

      // Check if developer info is present in local dev mode
      if (data.otp || data.verificationLink) {
        setDevInfo({
          otp: data.otp,
          verificationLink: data.verificationLink,
          testMailUrl: data.testMailUrl,
        });
      }

      // Transition to OTP verification screen
      setView("otp");
      setGeneralSuccess("Account created successfully! Please enter the 6-digit verification code sent to your email.");
      setResendCooldown(60); // 60 seconds cooldown
    } catch (err: any) {
      setLoading(false);
      setGeneralError(err.message || "An error occurred during registration.");
    }
  }

  // Resend OTP handler
  async function handleResendOtp() {
    if (resendCooldown > 0) return;

    setLoading(true);
    setGeneralError("");
    setGeneralSuccess("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok || data.error) {
        setGeneralError(data.error || "Failed to resend verification code.");
        return;
      }

      if (data.otp || data.verificationLink) {
        setDevInfo({
          otp: data.otp,
          verificationLink: data.verificationLink,
          testMailUrl: data.testMailUrl,
        });
      }

      setGeneralSuccess("A new verification code has been sent to your email.");
      setResendCooldown(60);
    } catch (err: any) {
      setLoading(false);
      setGeneralError(err.message || "An error occurred while resending the code.");
    }
  }

  // OTP Verification Submission
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!validateOtp()) return;

    setLoading(true);
    setGeneralError("");
    setGeneralSuccess("");

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp: otpCode,
          userId: registeredUserId,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok || data.error) {
        setGeneralError(data.error || "Verification failed. Please check the code and try again.");
        return;
      }

      // Success: direct to login with success message
      setView("login");
      setGeneralSuccess("Email verified successfully! You can now log in to your account.");
      setOtpCode("");
      setPassword("");
      setDevInfo(null);
    } catch (err: any) {
      setLoading(false);
      setGeneralError(err.message || "An error occurred during verification.");
    }
  }

  // Google Login
  async function handleGoogleLogin() {
    setLoading(true);
    setGeneralError("");

    const origin = typeof window !== "undefined" ? window.location.origin : "";

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/`,
      },
    });

    if (error) {
      setGeneralError(error.message);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#111111] text-white flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md border border-zinc-800/30 bg-[#1A1A1A] rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-pulse"></div>
          <h1 className="text-2xl font-extrabold tracking-wide text-white">
            Chitra Viseshalu
          </h1>
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          {view === "login" && (
            <>
              <h2 className="text-3xl font-extrabold mb-1">Welcome Back</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Login to continue your cinematic journey.
              </p>
            </>
          )}
          {view === "signup" && (
            <>
              <h2 className="text-3xl font-extrabold mb-1">Create Account</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Join our premium community of movie lovers.
              </p>
            </>
          )}
          {view === "otp" && (
            <>
              <h2 className="text-3xl font-extrabold mb-1">Verify Email</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Enter the 6-digit code sent to your inbox.
              </p>
            </>
          )}
        </div>

        {/* Feedback Messages */}
        {generalError && (
          <div className="mb-5 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-2xl text-xs font-semibold leading-relaxed">
            ⚠️ {generalError}
          </div>
        )}
        {generalSuccess && (
          <div className="mb-5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-2xl text-xs font-semibold leading-relaxed">
            ✓ {generalSuccess}
          </div>
        )}

        {/* Login View */}
        {view === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (validationErrors.email) {
                    setValidationErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                className={`w-full bg-[#111111]/80 border ${
                  validationErrors.email ? "border-rose-500" : "border-zinc-800/80"
                } rounded-2xl px-5 py-3.5 outline-none focus:border-white transition duration-300 text-sm`}
              />
              {validationErrors.email && (
                <p className="text-rose-400 text-xs mt-1.5 ml-1">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (validationErrors.password) {
                    setValidationErrors((prev) => ({ ...prev, password: undefined }));
                  }
                }}
                className={`w-full bg-[#111111]/80 border ${
                  validationErrors.password ? "border-rose-500" : "border-zinc-800/80"
                } rounded-2xl px-5 py-3.5 outline-none focus:border-white transition duration-300 text-sm`}
              />
              {validationErrors.password && (
                <p className="text-rose-400 text-xs mt-1.5 ml-1">{validationErrors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-zinc-200 text-[#111111] disabled:opacity-50 py-3.5 rounded-full font-bold transition duration-300 text-sm shadow-md mt-2"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => handleViewChange("signup")}
                className="text-xs text-zinc-400 hover:text-white transition font-medium"
              >
                New here? <span className="underline font-bold">Create Account</span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center py-2">
              <div className="flex-grow border-t border-zinc-800/40"></div>
              <span className="px-4 text-[10px] uppercase text-zinc-500 font-bold">
                or
              </span>
              <div className="flex-grow border-t border-zinc-800/40"></div>
            </div>

            {/* Google OAuth */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full border border-white/20 hover:border-white hover:bg-white/10 text-white disabled:opacity-50 py-3.5 rounded-full font-bold transition duration-300 flex items-center justify-center gap-3 text-sm shadow-sm"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Continue with Google
            </button>
          </form>
        )}

        {/* Signup View */}
        {view === "signup" && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (validationErrors.email) {
                    setValidationErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                className={`w-full bg-[#111111]/80 border ${
                  validationErrors.email ? "border-rose-500" : "border-zinc-800/80"
                } rounded-2xl px-5 py-3.5 outline-none focus:border-white transition duration-300 text-sm`}
              />
              {validationErrors.email && (
                <p className="text-rose-400 text-xs mt-1.5 ml-1">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Create a password (min 6 chars)"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (validationErrors.password) {
                    setValidationErrors((prev) => ({ ...prev, password: undefined }));
                  }
                }}
                className={`w-full bg-[#111111]/80 border ${
                  validationErrors.password ? "border-rose-500" : "border-zinc-800/80"
                } rounded-2xl px-5 py-3.5 outline-none focus:border-white transition duration-300 text-sm`}
              />
              {validationErrors.password && (
                <p className="text-rose-400 text-xs mt-1.5 ml-1">{validationErrors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (validationErrors.confirmPassword) {
                    setValidationErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                  }
                }}
                className={`w-full bg-[#111111]/80 border ${
                  validationErrors.confirmPassword ? "border-rose-500" : "border-zinc-800/80"
                } rounded-2xl px-5 py-3.5 outline-none focus:border-white transition duration-300 text-sm`}
              />
              {validationErrors.confirmPassword && (
                <p className="text-rose-400 text-xs mt-1.5 ml-1">{validationErrors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-zinc-200 text-[#111111] disabled:opacity-50 py-3.5 rounded-full font-bold transition duration-300 text-sm shadow-md mt-2"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => handleViewChange("login")}
                className="text-xs text-zinc-400 hover:text-white transition font-medium"
              >
                Already registered? <span className="underline font-bold">Log In</span>
              </button>
            </div>
          </form>
        )}

        {/* OTP Verification View */}
        {view === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="text-center">
              <span className="text-[11px] font-bold text-zinc-550 uppercase tracking-widest bg-[#111111] px-4 py-1.5 rounded-full border border-zinc-800/35">
                Sent to: {email}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-3 text-center uppercase tracking-wider">
                6-Digit Verification Code
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="000000"
                value={otpCode}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setOtpCode(val);
                  if (validationErrors.otp) {
                    setValidationErrors((prev) => ({ ...prev, otp: undefined }));
                  }
                }}
                className={`w-full bg-[#111111] border ${
                  validationErrors.otp ? "border-rose-500" : "border-zinc-800"
                } rounded-2xl px-4 py-4 outline-none focus:border-white transition duration-300 text-2xl font-mono tracking-[0.75em] text-center`}
              />
              {validationErrors.otp && (
                <p className="text-rose-400 text-xs mt-2 text-center">{validationErrors.otp}</p>
              )}
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white hover:bg-zinc-200 text-[#111111] disabled:opacity-50 py-3.5 rounded-full font-bold transition duration-300 text-sm shadow-md"
              >
                {loading ? "Verifying..." : "Verify & Activate Account"}
              </button>

              <div className="flex items-center justify-between px-2 text-xs">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || loading}
                  className={`font-semibold transition ${
                    resendCooldown > 0
                      ? "text-zinc-550 cursor-not-allowed"
                      : "text-zinc-350 hover:text-white underline"
                  }`}
                >
                  {resendCooldown > 0 ? `Resend Code (${resendCooldown}s)` : "Resend Code"}
                </button>

                <button
                  type="button"
                  onClick={() => handleViewChange("signup")}
                  className="text-zinc-400 hover:text-white underline font-semibold transition"
                >
                  Change Email
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}