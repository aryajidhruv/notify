// src/components/Navbar.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout(); // clears token, cookie and user state
    } finally {
      setLoggingOut(false);
      navigate("/signin", { replace: true });
    }
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        {/* Logo: dashboard when logged in, landing page otherwise */}
        <Link to={user ? "/dashboard" : "/"} className="text-lg font-semibold">
          Notify
        </Link>

        {user && (
          <div className="flex items-center gap-3">
            {/* Hidden on mobile to keep the bar from overflowing */}
            <span className="hidden max-w-[200px] truncate text-sm text-gray-500 sm:block">
              {user.email}
            </span>
            <Button variant="secondary" loading={loggingOut} onClick={handleLogout}>
              Log out
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
}