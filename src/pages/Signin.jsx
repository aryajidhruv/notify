// src/pages/Signin.jsx
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import Input from "../components/Input";
import { googleAuthUrl } from "../api/auth";
// Turn any API error into one readable string
function getErrorMessage(err) {
  if (!err.response) return "Can't reach the server. Check your connection.";

  const { status, data } = err.response;
  if (status === 401) return "Incorrect email or password.";
  if (status === 429) return "Too many attempts. Please wait a bit and try again.";

  // 400 -> detail is a string, 422 -> detail is an array of { msg }
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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1: Smart Destination Tracking
  const redirectTo = location.state?.from?.pathname || "/dashboard";

  // Step 2: Logged-in Guard Check
  if (user) return <Navigate to={redirectTo} replace />;
 // Step 3: Login Form Submission (handleSubmit)
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
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="mt-1 text-sm text-gray-500">Sign in to manage your alerts.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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

          {/* Form-level error (wrong password, cooldown, network) */}
          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <Button type="submit" loading={loading} className="w-full">
            Sign in
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-gray-400">
          <span className="h-px flex-1 bg-gray-200" />
          or
          <span className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Placeholder: backend Google callback returns JSON, not a redirect */}
        <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={() => (window.location.href = googleAuthUrl)} // full redirect, not axios
>  <svg viewBox="0 0 24 24" className="h-5 w-5">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
              </svg>         
 Continue with Google
</Button>

        <p className="mt-6 text-center text-sm text-gray-500">
          New here?{" "}
          <Link to="/signup" className="font-medium underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}