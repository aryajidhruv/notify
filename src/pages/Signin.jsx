import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { googleAuthUrl } from "../api/auth";
import AuthLayout from "../components/AuthLayout";
import Button from "../components/Button";
import Input from "../components/Input";

// Responsive glass card matching Signup: p-5 on mobile, p-8 on larger screens
const CARD =
  "w-full max-w-md rounded-2xl border border-white/15 bg-white/[0.06] p-5 sm:p-8 text-white shadow-2xl backdrop-blur-[2px] " +
  "[&_label]:text-white/80 " +
  "[&_input]:border-white/20 [&_input]:bg-white/5 [&_input]:text-white [&_input]:caret-white " +
  "[&_input]:placeholder:text-white/40";

// Action buttons with touch-friendly heights and text scaling
const PRIMARY =
  "w-full rounded-full! bg-white! text-black! hover:bg-white/90! text-sm sm:text-base py-2.5 sm:py-3";
const SECONDARY =
  "w-full rounded-full! border! border-white/25! bg-transparent! text-white! hover:bg-white/10! text-sm sm:text-base py-2.5 sm:py-3";

function getErrorMessage(err) {
  if (!err.response) return "Can't reach the server. Check your connection.";

  const { status, data } = err.response;
  if (status === 401) return "Incorrect email or password.";
  if (status === 429) return "Too many attempts. Please wait a bit and try again.";

  if (typeof data?.detail === "string") return data.detail;
  if (Array.isArray(data?.detail)) return data.detail.map((d) => d.msg).join(", ");

  return "Something went wrong. Please try again.";
}

export default function Signin() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(location.state?.error || "");;
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  if (user) return <Navigate to={redirectTo} replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className={CARD}>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-xs sm:text-sm text-white/60">Sign in to manage your alerts.</p>

        <form onSubmit={handleSubmit} className="mt-5 sm:mt-6 space-y-4">
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs sm:text-sm text-red-200 break-words"
            >
              {error}
            </div>
          )}

          <Button type="submit" loading={loading} className={PRIMARY}>
            Sign in
          </Button>
        </form>

        <div className="my-4 sm:my-5 flex items-center gap-3 text-xs text-white/40">
          <span className="h-px flex-1 bg-white/15" />
          or
          <span className="h-px flex-1 bg-white/15" />
        </div>

        <Button
          type="button"
          variant="secondary"
          className={SECONDARY}
          onClick={() => (window.location.href = googleAuthUrl)}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
          </svg>
          <span>Continue with Google</span>
        </Button>

        <p className="mt-5 sm:mt-6 text-center text-xs sm:text-sm text-white/60">
          New here?{" "}
          <Link to="/signup" className="font-medium text-white underline-offset-4 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}