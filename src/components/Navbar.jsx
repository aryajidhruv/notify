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
    ? "rounded-full px-2.5 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm text-white/70 hover:text-white whitespace-nowrap"
    : "rounded-lg px-2.5 py-1.5 text-xs sm:px-3 sm:py-2 sm:text-sm font-medium text-gray-700 hover:bg-gray-100 whitespace-nowrap";
  const getStarted = dark
    ? "rounded-full border border-white/30 px-3 py-1 text-xs sm:px-4 sm:py-1.5 sm:text-sm font-medium text-white hover:bg-white/10 whitespace-nowrap shrink-0"
    : "rounded-lg bg-blue-600 px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm font-medium text-white hover:bg-blue-700 whitespace-nowrap shrink-0";

  return (
    <header className={`sticky top-0 z-40 border-b backdrop-blur ${header}`}>
      <nav
        aria-label="Main"
        className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4"
      >
        <Link to={user ? "/dashboard" : "/"} className="text-base sm:text-lg font-semibold shrink-0">
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

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {user ? (
            <>
              <span
                className={`hidden max-w-[150px] sm:max-w-[200px] truncate text-sm sm:block ${
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