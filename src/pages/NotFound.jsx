// src/pages/NotFound.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NotFound() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-5xl font-semibold text-gray-300">404</p>
      <h1 className="mt-4 text-xl font-semibold">Page not found</h1>
      <p className="mt-1 text-sm text-gray-500">
        The page you're looking for doesn't exist or was moved.
      </p>

      {/* Send users somewhere that makes sense for their state */}
      <Link
        to={user ? "/dashboard" : "/"}
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700"
      >
        {user ? "Back to dashboard" : "Back to home"}
      </Link>
    </div>
  );
}