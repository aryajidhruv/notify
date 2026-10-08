import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";

// links = [{ label, href }]; variant = "light" | "dark"
export default function Navbar({ links = [], variant = "light" }) {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const dark = variant === "dark";

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      setLoggingOut(false);
      navigate("/signin", { replace: true });
    }
  };

  // Style sets for each variant
  const header = dark
    ? "border-white/10 bg-black/80 text-white"
    : "border-gray-200 bg-white/90 text-gray-900";
  const linkStyle = dark
    ? "text-white/60 hover:text-white"
    : "text-gray-600 hover:text-gray-900";
  const signIn = dark
    ? "rounded-full px-3 py-1.5 text-sm text-white/70 hover:text-white"
    : "rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100";
  const getStarted = dark
    ? "rounded-full border border-white/30 px-4 py-1.5 text-sm font-medium text-white hover:bg-white/10"
    : "rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700";

  return (
    <header className={`sticky top-0 z-40 border-b backdrop-blur ${header}`}>
      <nav
        aria-label="Main"
        className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4"
      >
        <Link to={user ? "/dashboard" : "/"} className="text-lg font-semibold">
          Notify
        </Link>

        {links.length > 0 && (
          <ul className="hidden items-center gap-8 text-sm md:flex">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={linkStyle}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span
                className={`hidden max-w-[200px] truncate text-sm sm:block ${
                  dark ? "text-white/60" : "text-gray-500"
                }`}
              >
                {user.email}
              </span>
              <Button variant="secondary" loading={loggingOut} onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            !loading && (
              <>
                <Link to="/signin" className={signIn}>
                  Sign in
                </Link>
                <Link to="/signup" className={getStarted}>
                  Get started
                </Link>
              </>
            )
          )}
        </div>
      </nav>
    </header>
  );
}