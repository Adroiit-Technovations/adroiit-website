"use client";

import { FormEvent, useMemo, useState } from "react";

import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Phone,
  User,
  UserRound,
} from "lucide-react";

import { createBrowserClient } from "@supabase/ssr";
import { Bricolage_Grotesque } from "next/font/google";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
});

type AuthMode = "signin" | "signup" | "forgot";

function getSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value.trim()
  );
}

function normalizePhone(value: string) {
  const input = value.trim();

  if (!input) {
    return "";
  }

  if (input.startsWith("+")) {
    const digits = input
      .slice(1)
      .replace(/\D/g, "");

    return digits ? `+${digits}` : "";
  }

  const digits = input.replace(/\D/g, "");

  if (digits.length === 10) {
    return `+91${digits}`;
  }

  if (
    digits.length === 11 &&
    digits.startsWith("0")
  ) {
    return `+91${digits.slice(1)}`;
  }

  if (
    digits.length === 12 &&
    digits.startsWith("91")
  ) {
    return `+${digits}`;
  }

  return digits ? `+${digits}` : "";
}

function getFriendlyError(message: string) {
  const lower = message.toLowerCase();

  if (
    lower.includes("invalid login credentials")
  ) {
    return "Invalid email/phone number or password.";
  }

  if (
    lower.includes("user already registered")
  ) {
    return "An account already exists with these details. Please sign in instead.";
  }

  if (lower.includes("email not confirmed")) {
    return "Your email address has not been confirmed. Please check your email.";
  }

  if (
    lower.includes("phone") &&
    (lower.includes("confirm") ||
      lower.includes("verification") ||
      lower.includes("verify"))
  ) {
    return "Phone verification is enabled in Supabase. Disable phone confirmation if you do not want OTP verification.";
  }

  if (lower.includes("signup is disabled")) {
    return "New customer registration is currently disabled.";
  }

  if (
    lower.includes(
      "password should be at least"
    )
  ) {
    return "Password must contain at least 6 characters.";
  }

  if (lower.includes("rate limit")) {
    return "Too many attempts. Please wait a moment and try again.";
  }

  if (
    lower.includes(
      "database error saving new user"
    )
  ) {
    return "Supabase could not create the account. Please check your Supabase Auth configuration and database triggers.";
  }

  if (
    lower.includes("email") &&
    lower.includes("required")
  ) {
    return "Please enter a valid email address.";
  }

  return message;
}

export default function CustomerLoginPage() {
  const [mode, setMode] =
    useState<AuthMode>("signin");

  const [identifier, setIdentifier] =
    useState("");

  const [fullName, setFullName] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const identifierType = useMemo(() => {
    if (!identifier.trim()) {
      return null;
    }

    return isEmail(identifier)
      ? "email"
      : "phone";
  }, [identifier]);

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setErrorMessage("");
    setSuccessMessage("");
    setPassword("");
    setConfirmPassword("");
  }

  function validateForm() {
    const value = identifier.trim();

    if (!value) {
      if (mode === "forgot") {
        return "Please enter your email address.";
      }

      return "Please enter your email address or phone number.";
    }

    if (mode === "forgot") {
      if (!isEmail(value)) {
        return "Password reset is available through email. Please enter your email address.";
      }

      return null;
    }

    if (isEmail(value)) {
      if (!isEmail(value)) {
        return "Please enter a valid email address.";
      }
    } else {
      const phone = normalizePhone(value);

      if (!phone || phone.length < 10) {
        return "Please enter a valid phone number.";
      }
    }

    if (!password) {
      return "Please enter your password.";
    }

    if (password.length < 6) {
      return "Password must contain at least 6 characters.";
    }

    if (mode === "signup") {
      if (!fullName.trim()) {
        return "Please enter your full name.";
      }

      if (fullName.trim().length < 2) {
        return "Please enter your complete name.";
      }

      if (!confirmPassword) {
        return "Please confirm your password.";
      }

      if (password !== confirmPassword) {
        return "Passwords do not match.";
      }
    }

    return null;
  }

  /*
   * Creates or updates the customer's profile.
   *
   * IMPORTANT:
   * The Supabase Auth password is never stored here.
   *
   * customer_profiles should contain customer information only.
   */
  async function createCustomerProfile(
    userId: string,
    name: string,
    email: string | null,
    phone: string | null
  ) {
    const supabase = getSupabaseClient();

    const { error } = await supabase
      .from("customer_profiles")
      .upsert(
        {
          id: userId,
          full_name: name || null,
          email: email || null,
          phone: phone || null,
          updated_at:
            new Date().toISOString(),
        },
        {
          onConflict: "id",
        }
      );

    return error;
  }

  /*
   * Ensures an authenticated customer has a
   * customer profile.
   *
   * This runs after BOTH sign-in and sign-up.
   */
  async function syncCustomerProfile(
    userId: string,
    fallbackName?: string
  ) {
    const supabase = getSupabaseClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error(
        "Unable to retrieve authenticated customer:",
        userError
      );

      return;
    }

    const metadataName =
      typeof user.user_metadata?.full_name ===
      "string"
        ? user.user_metadata.full_name.trim()
        : "";

    const name =
      fallbackName?.trim() ||
      metadataName ||
      "";

    const profileError =
      await createCustomerProfile(
        user.id,
        name,
        user.email ?? null,
        user.phone ?? null
      );

    if (profileError) {
      /*
       * Do not block authentication if the
       * customer profile could not be synchronized.
       *
       * The authentication account itself is
       * still valid.
       */
      console.error(
        "Customer profile synchronization error:",
        profileError
      );
    }
  }

  async function handleSignIn(value: string) {
    const supabase = getSupabaseClient();

    if (isEmail(value)) {
      const { error } =
        await supabase.auth.signInWithPassword({
          email: value,
          password,
        });

      if (error) {
        throw error;
      }
    } else {
      const phone = normalizePhone(value);

      const { error } =
        await supabase.auth.signInWithPassword({
          phone,
          password,
        });

      if (error) {
        throw error;
      }
    }

    /*
     * Authentication succeeded.
     *
     * Synchronize the customer profile so
     * every authenticated store customer has
     * a customer record.
     */
    await syncCustomerProfile();
  }

  async function handleSignup(value: string) {
    const supabase = getSupabaseClient();

    if (isEmail(value)) {
      const { data, error } =
        await supabase.auth.signUp({
          email: value,
          password,
          options: {
            data: {
              full_name: fullName.trim(),
            },
          },
        });

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error(
          "The account could not be created. Please try again."
        );
      }

      /*
       * If Supabase immediately provides a
       * session, create the customer profile.
       */
      if (data.session) {
        const profileError =
          await createCustomerProfile(
            data.user.id,
            fullName.trim(),
            data.user.email ?? value,
            data.user.phone ?? null
          );

        if (profileError) {
          console.error(
            "Customer profile creation error:",
            profileError
          );
        }

        window.location.href = "/store";
        return;
      }

      /*
       * Email confirmation is required.
       */
      setSuccessMessage(
        "Account created successfully. Please confirm your email and then sign in."
      );

      setMode("signin");
      setPassword("");
      setConfirmPassword("");

      return;
    }

    /*
     * Phone signup
     */
    const phone = normalizePhone(value);

    const { data, error } =
      await supabase.auth.signUp({
        phone,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error(
        "The account could not be created. Please try again."
      );
    }

    /*
     * If phone confirmation is disabled,
     * Supabase returns a session immediately.
     */
    if (data.session) {
      const profileError =
        await createCustomerProfile(
          data.user.id,
          fullName.trim(),
          data.user.email ?? null,
          data.user.phone ?? phone
        );

      if (profileError) {
        console.error(
          "Customer profile creation error:",
          profileError
        );
      }

      window.location.href = "/store";
      return;
    }

    setErrorMessage(
      "Supabase is requiring phone confirmation. Disable phone confirmation in Authentication settings to use phone + password without OTP."
    );
  }

  async function handleForgotPassword() {
    const supabase = getSupabaseClient();

    const email = identifier.trim();

    if (!isEmail(email)) {
      throw new Error(
        "Please enter a valid email address."
      );
    }

    const redirectUrl =
      `${window.location.origin}/store/CustomerLogin?mode=reset`;

    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: redirectUrl,
        }
      );

    if (error) {
      throw error;
    }

    setSuccessMessage(
      "If an account exists with this email address, you will receive a password reset link shortly. Please check your inbox and spam folder."
    );
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const validationError =
      validateForm();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setLoading(true);

    try {
      const value = identifier.trim();

      if (mode === "forgot") {
        await handleForgotPassword();
        return;
      }

      if (mode === "signin") {
        await handleSignIn(value);

        /*
         * Customer authentication is successful.
         *
         * Redirect to the Store.
         */
        window.location.href = "/store";
        return;
      }

      await handleSignup(value);
    } catch (error: unknown) {
      console.error(
        "Customer authentication error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      setErrorMessage(
        getFriendlyError(message)
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className={`${bricolage.variable} min-h-screen bg-[#faf9fc] px-5 py-10 text-[#17121f] sm:px-8`}
      style={{
        fontFamily: "var(--font-bricolage)",
      }}
    >
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <div className="w-full max-w-[460px]">
          <div className="rounded-[28px] border border-black/[0.07] bg-white p-6 shadow-[0_20px_60px_rgba(48,16,111,0.08)] sm:p-8">
            {/* Profile Icon */}
            <div className="mb-5 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f1ebff]">
                <UserRound className="h-7 w-7 text-[#5921c7]" />
              </div>
            </div>

            {/* Heading */}
            <div className="mb-7 text-center">
              <h1 className="text-[28px] font-semibold tracking-[-0.035em] text-[#21182d]">
                {mode === "signin"
                  ? "Welcome back"
                  : mode === "signup"
                  ? "Create your account"
                  : "Reset your password"}
              </h1>

              <p className="mx-auto mt-2 max-w-[360px] text-[14px] leading-6 text-[#77717f]">
                {mode === "signin"
                  ? "Sign in to continue to your Adroiit Store account."
                  : mode === "signup"
                  ? "Create your Adroiit Store account using your email or phone number."
                  : "Enter your email address and we will send you a link to reset your password."}
              </p>
            </div>

            {/* Sign In / Sign Up Tabs */}
            {mode !== "forgot" && (
              <div className="mb-7 grid grid-cols-2 rounded-2xl bg-[#f5f3f8] p-1">
                <button
                  type="button"
                  onClick={() =>
                    switchMode("signin")
                  }
                  className={`rounded-xl px-4 py-2.5 text-[14px] font-semibold transition ${
                    mode === "signin"
                      ? "bg-white text-[#5921c7] shadow-sm"
                      : "text-[#77717f] hover:text-[#5921c7]"
                  }`}
                >
                  Sign In
                </button>

                <button
                  type="button"
                  onClick={() =>
                    switchMode("signup")
                  }
                  className={`rounded-xl px-4 py-2.5 text-[14px] font-semibold transition ${
                    mode === "signup"
                      ? "bg-white text-[#5921c7] shadow-sm"
                      : "text-[#77717f] hover:text-[#5921c7]"
                  }`}
                >
                  Sign Up
                </button>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Full Name */}
              {mode === "signup" && (
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-[13px] font-semibold text-[#38313f]"
                  >
                    Full Name
                  </label>

                  <div className="relative">
                    <User className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#9b95a3]" />

                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(event) =>
                        setFullName(
                          event.target.value
                        )
                      }
                      placeholder="Enter your full name"
                      autoComplete="name"
                      className="h-[50px] w-full rounded-xl border border-[#e4e0e8] bg-white pl-11 pr-4 text-[14px] text-[#21182d] outline-none transition placeholder:text-[#aaa4b0] focus:border-[#8c52ff] focus:ring-4 focus:ring-[#8c52ff]/10"
                    />
                  </div>
                </div>
              )}

              {/* Email / Phone */}
              <div>
                <label
                  htmlFor="identifier"
                  className="mb-2 block text-[13px] font-semibold text-[#38313f]"
                >
                  {mode === "forgot"
                    ? "Email Address"
                    : "Email or Phone Number"}
                </label>

                <div className="relative">
                  {mode === "forgot" ||
                  identifierType === "email" ? (
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#9b95a3]" />
                  ) : (
                    <Phone className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#9b95a3]" />
                  )}

                  <input
                    id="identifier"
                    type={
                      mode === "forgot"
                        ? "email"
                        : "text"
                    }
                    value={identifier}
                    onChange={(event) =>
                      setIdentifier(
                        event.target.value
                      )
                    }
                    placeholder={
                      mode === "forgot"
                        ? "Enter your email address"
                        : "Email address or phone number"
                    }
                    autoComplete={
                      mode === "signin"
                        ? "username"
                        : mode === "forgot"
                        ? "email"
                        : "email tel"
                    }
                    className="h-[50px] w-full rounded-xl border border-[#e4e0e8] bg-white pl-11 pr-4 text-[14px] text-[#21182d] outline-none transition placeholder:text-[#aaa4b0] focus:border-[#8c52ff] focus:ring-4 focus:ring-[#8c52ff]/10"
                  />
                </div>

                {mode !== "forgot" &&
                  identifierType === "phone" &&
                  identifier.trim() && (
                    <p className="mt-2 text-[11px] text-[#8a8491]">
                      Phone numbers are automatically formatted
                      for authentication.
                    </p>
                  )}
              </div>

              {/* Password */}
              {mode !== "forgot" && (
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-[13px] font-semibold text-[#38313f]"
                    >
                      Password
                    </label>

                    {mode === "signin" && (
                      <button
                        type="button"
                        onClick={() =>
                          switchMode("forgot")
                        }
                        className="text-[12px] font-semibold text-[#5921c7] transition hover:text-[#4c1cad] hover:underline"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>

                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#9b95a3]" />

                    <input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(event) =>
                        setPassword(
                          event.target.value
                        )
                      }
                      placeholder="Enter your password"
                      autoComplete={
                        mode === "signin"
                          ? "current-password"
                          : "new-password"
                      }
                      className="h-[50px] w-full rounded-xl border border-[#e4e0e8] bg-white pl-11 pr-12 text-[14px] text-[#21182d] outline-none transition placeholder:text-[#aaa4b0] focus:border-[#8c52ff] focus:ring-4 focus:ring-[#8c52ff]/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) => !current
                        )
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[#96909e] transition hover:bg-[#f5f2f8] hover:text-[#5921c7]"
                    >
                      {showPassword ? (
                        <EyeOff className="h-[18px] w-[18px]" />
                      ) : (
                        <Eye className="h-[18px] w-[18px]" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Confirm Password */}
              {mode === "signup" && (
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-[13px] font-semibold text-[#38313f]"
                  >
                    Confirm Password
                  </label>

                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#9b95a3]" />

                    <input
                      id="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(
                          event.target.value
                        )
                      }
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                      className="h-[50px] w-full rounded-xl border border-[#e4e0e8] bg-white pl-11 pr-12 text-[14px] text-[#21182d] outline-none transition placeholder:text-[#aaa4b0] focus:border-[#8c52ff] focus:ring-4 focus:ring-[#8c52ff]/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (current) => !current
                        )
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[#96909e] transition hover:bg-[#f5f2f8] hover:text-[#5921c7]"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-[18px] w-[18px]" />
                      ) : (
                        <Eye className="h-[18px] w-[18px]" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Messages */}
              {errorMessage && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] leading-5 text-red-700">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-[13px] leading-5 text-green-700">
                  {successMessage}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[#5921c7] px-5 text-[14px] font-semibold text-white shadow-[0_8px_20px_rgba(89,33,199,0.2)] transition hover:bg-[#4c1cad] hover:shadow-[0_10px_24px_rgba(89,33,199,0.25)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-[17px] w-[17px] animate-spin" />

                    {mode === "signin"
                      ? "Signing In..."
                      : mode === "signup"
                      ? "Creating Account..."
                      : "Sending Reset Link..."}
                  </>
                ) : mode === "signin" ? (
                  "Sign In"
                ) : mode === "signup" ? (
                  "Create Account"
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>

            {/* Bottom Navigation */}
            <div className="mt-6 text-center text-[13px] text-[#85808c]">
              {mode === "signin" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() =>
                      switchMode("signup")
                    }
                    className="font-semibold text-[#5921c7] hover:underline"
                  >
                    Create one
                  </button>
                </>
              ) : mode === "signup" ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() =>
                      switchMode("signin")
                    }
                    className="font-semibold text-[#5921c7] hover:underline"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Remember your password?{" "}
                  <button
                    type="button"
                    onClick={() =>
                      switchMode("signin")
                    }
                    className="font-semibold text-[#5921c7] hover:underline"
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}