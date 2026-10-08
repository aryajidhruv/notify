import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Column heights as % of the stage: tallest at the edges, shortest in the middle (the valley)
const HEIGHTS = [100, 84, 68, 56, 38, 56, 68, 84, 100];

// Light catching the top edge of each column
const GLINTS = [
  "via-sky-300/80",
  "via-white/50",
  "via-white/60",
  "via-amber-200/70",
  "via-white/80",
  "via-amber-200/70",
  "via-white/60",
  "via-white/50",
  "via-sky-300/80",
];

// Kinds of pages Notify is made for
const SOURCES = [
  "Government sites",
  "City and council pages",
  "Job and careers pages",
  "Event listings",
  "Company announcements",
];

export default function Hero() {
  const { user, loading } = useAuth();

  // The one motion on the page: columns rise from the centre outward on load
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(id);
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-black text-white">
      {/* Content Container - Dynamic padding instead of fixed min-heights */}
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-4 pt-12 pb-28 text-center sm:pt-24 sm:pb-36">
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-6xl leading-tight">
          Stop refreshing pages. Get an email when it happens.
        </h1>
        <p className="mt-4 max-w-md text-sm sm:text-base text-white/70">
          Paste a link and describe what you're waiting for in one sentence. Notify emails you
          when it shows up.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex min-h-[64px] flex-col items-center gap-3 sm:mt-8">
          {!loading &&
            (user ? (
              <Link
                to="/dashboard"
                className="rounded-full bg-white px-6 py-2.5 text-sm font-medium text-black hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Go to dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="rounded-full bg-white px-6 py-2.5 text-sm font-medium text-black hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Get started
                </Link>
                <a href="#example" className="text-xs sm:text-sm text-white/60 hover:text-white">
                  See an example
                </a>
              </>
            ))}
        </div>
      </div>

      {/* Column stage (decorative background) */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 flex h-[25%] sm:h-[35%] items-end pointer-events-none"
      >
        {HEIGHTS.map((h, i) => (
          <div
            key={i}
            className="relative flex-1 border-l border-white/[0.07] bg-gradient-to-b from-neutral-950 to-black transition-[height] duration-1000 ease-out motion-reduce:transition-none"
            style={{
              height: ready ? `${h}%` : "0%",
              transitionDelay: `${Math.abs(i - 4) * 90}ms`, // fixed syntax typo
            }}
          >
            {/* Thin light line on top of the column */}
            <span
              className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${GLINTS[i]} to-transparent`}
            />
          </div>
        ))}
      </div>

      {/* Bottom source tags */}
      <div className="absolute inset-x-0 bottom-4 sm:bottom-6 z-10 flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-1 px-4 text-[11px] sm:text-xs text-white/40">
        {SOURCES.map((s) => (
          <span key={s} className="whitespace-nowrap">
            {s}
          </span>
        ))}
      </div>
    </section>
  );
}