import { Link } from "react-router-dom";

// Same valley shape as the landing hero, static here
const HEIGHTS = [100, 84, 68, 56, 38, 56, 68, 84, 100];

export default function AuthLayout({ children }) {
  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-hidden bg-neutral-800 text-white">
      {/* Soft glow behind the card */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_50%_85%,rgba(186,200,220,0.28),transparent)]"
      />

      {/* Decorative columns along the bottom edge */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 flex h-[40%] items-end"
      >
        {HEIGHTS.map((h, i) => (
          <div
            key={i}
            className="relative flex-1 border-l border-white/15 bg-black"
            style={{ height: `${h}%` }}
          >
            <span className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/70 to-transparent" />
          </div>
        ))}
      </div>

      <header className="mx-auto w-full max-w-5xl px-4 py-5">
        <Link to="/" className="text-lg font-semibold">
          Notify
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 pb-16">{children}</main>
    </div>
  );
}