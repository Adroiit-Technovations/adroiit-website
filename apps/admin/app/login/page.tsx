
"use client";

import {
  FormEvent,
  Suspense,
  useEffect,
  useState,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("access") === "restricted") {
      setError("Access Restricted!");
      setSuccess("");
    }
  }, [searchParams]);

  /**
   * Only allow safe internal application redirects.
   * Default destination for administrators is Store Overview.
   */
  const getSafeRedirectPath = () => {
    const redirectPath = searchParams.get("redirectedFrom");

    if (
      !redirectPath ||
      !redirectPath.startsWith("/") ||
      redirectPath.startsWith("//") ||
      redirectPath.includes("\\")
    ) {
      return "/store";
    }

    try {
      const parsedUrl = new URL(
        redirectPath,
        window.location.origin
      );

      // Reject external destinations.
      if (parsedUrl.origin !== window.location.origin) {
        return "/store";
      }

      // Root and login should always lead to Store Overview.
      if (
        parsedUrl.pathname === "/" ||
        parsedUrl.pathname === "/login"
      ) {
        return "/store";
      }

      // Preserve valid internal destinations.
      return (
        parsedUrl.pathname +
        parsedUrl.search +
        parsedUrl.hash
      );
    } catch {
      return "/store";
    }
  };

  const handleLogin = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading) return;

    setError("");
    setSuccess("");
    setLoading(true);

    const supabase = createClient();

    try {
      // Step 1: Authenticate using Supabase.
      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        setError(loginError.message);
        return;
      }

      // Step 2: Verify the authenticated session.
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error(
          "Authenticated user could not be retrieved:",
          userError
        );

        await supabase.auth.signOut();

        setError(
          "Your session could not be verified. Please try again."
        );

        return;
      }

      // Step 3: Verify administrator privileges.
      const {
        data: isAdmin,
        error: adminError,
      } = await supabase.rpc("is_admin");

      if (adminError) {
        console.error(
          "Admin authorization failed:",
          adminError
        );

        await supabase.auth.signOut();

        setError(
          "Administrator verification failed. Please try again."
        );

        return;
      }

      // Step 4: Reject authenticated non-administrators.
      if (isAdmin !== true) {
        console.warn(
          "Unauthorized admin login attempt:",
          {
            userId: user.id,
            email: user.email,
          }
        );

        await supabase.auth.signOut();

        setError(
          "Access Restricted! You are not authorized to access the administration dashboard."
        );

        setSuccess("");
        return;
      }

      // Step 5: Administrator access granted.
      setError("");
      setSuccess("Access Granted!");

      // Step 6: Redirect to the requested safe page,
      // or Store Overview by default.
      const redirectPath = getSafeRedirectPath();

      router.replace(redirectPath);
      router.refresh();
    } catch (loginError) {
      console.error(
        "Admin login error:",
        loginError
      );

      setError(
        "Something went wrong. Please try again."
      );

      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-4 py-20 text-white">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-6 shadow-2xl sm:p-8">

          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5921c7]/15 text-[#8c52ff]">
              <LockKeyhole
                size={26}
                strokeWidth={1.8}
              />
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Admin Login
            </h1>

            <p className="mt-2 text-sm text-white/50">
              Sign in to access the administration dashboard.
            </p>
          </div>

          {/* Login Form */}
          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* Email */}
            <div>
              <label
                htmlFor="admin-email"
                className="mb-2 block text-sm font-medium text-white/80"
              >
                Email
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 z-10 h-[18px] w-[18px] -translate-y-1/2 text-[#a78bfa] opacity-100"
                />

                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="Enter your email"
                  autoComplete="username"
                  disabled={loading}
                  required
                  className="admin-login-input relative z-0 h-12 w-full rounded-xl border border-white/10 bg-[#111111] pl-11 pr-4 text-sm text-white caret-white outline-none transition placeholder:text-white/30 focus:border-[#5921c7] focus:bg-[#111111] disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="admin-password"
                className="mb-2 block text-sm font-medium text-white/80"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 z-10 h-[18px] w-[18px] -translate-y-1/2 text-[#a78bfa] opacity-100"
                />

                <input
                  id="admin-password"
                  type={
                    showPassword ? "text" : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loading}
                  required
                  className="admin-login-input relative z-0 h-12 w-full rounded-xl border border-white/10 bg-[#111111] pl-11 pr-12 text-sm text-white caret-white outline-none transition placeholder:text-white/30 focus:border-[#5921c7] focus:bg-[#111111] disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  disabled={loading}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-white/50 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm font-medium text-red-500"
              >
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div
                role="status"
                className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-center text-sm font-medium text-green-500"
              >
                {success}
              </div>
            )}

            {/* Sign In */}
            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-[#5921c7] px-5 text-sm font-semibold text-white transition hover:bg-[#6b2fe0] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-7 text-center">
            <p className="text-xs text-white/35">
              Adroiit Technovations
            </p>
          </div>

        </div>
      </div>

      {/* Browser Autofill Styling */}
      <style jsx global>{`
        .admin-login-input,
        .admin-login-input:focus,
        .admin-login-input:hover {
          background-color: #111111 !important;
          color: #ffffff !important;
          -webkit-text-fill-color: #ffffff !important;
          caret-color: #ffffff !important;
        }

        .admin-login-input:-webkit-autofill,
        .admin-login-input:-webkit-autofill:hover,
        .admin-login-input:-webkit-autofill:focus,
        .admin-login-input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px #111111 inset !important;
          box-shadow: 0 0 0 1000px #111111 inset !important;
          -webkit-text-fill-color: #ffffff !important;
          caret-color: #ffffff !important;
          background-color: #111111 !important;
          transition: background-color 999999s ease-in-out 0s;
        }

        .admin-login-input::selection {
          background-color: #5921c7 !important;
          color: #ffffff !important;
        }
      `}</style>
    </main>
  );
}

function LoginFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-4 text-white">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-[#8c52ff]" />
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <AdminLoginContent />
    </Suspense>
  );
}
