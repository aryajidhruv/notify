import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";

// Google lands here after the backend has set the refresh-token cookie.
// AuthProvider has already started "refresh -> access token -> load user"
// on page load, so we just wait for it to finish.
export default function AuthCallback() {
  const { user, loading } = useAuth();

  // Still exchanging the cookie for an access token
  if (loading) {
    return (
      <AuthLayout>
        <p role="status" className="animate-pulse text-white/70">
          Signing you in...
        </p>
      </AuthLayout>
    );
  }

  // Success: we have a user
  if (user) return <Navigate to="/dashboard" replace />;

  // Failed (no cookie, expired, refresh error): back to signin with a message
  return (
    <Navigate
      to="/signin"
      replace
      state={{ error: "Google sign-in failed. Please try again." }}
    />
  );
}