import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HEIGHTS = [100, 84, 68, 56, 38, 56, 68, 84, 100];

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

const SOURCES = [
  "Government sites",
  "City and council pages",
  "Job and careers pages",
  "Event listings",
  "Company announcements",
];

export default function Hero() {
  const { user, loading } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(id);
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-black text-white pt-10 sm:pt-16 pb-6">
      {/* 1. Main Content Section (Text & CTA Buttons) */}
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-4 text-center">
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-6xl leading-tight">
          Stop refreshing pages. Get an email when it happens.
        </h1>
        <p className="mt-4 max-w-md text-sm sm:text-base text-white/70">
          Paste a link and describe what you're waiting for in one sentence. Notify emails you
          when it shows up.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex min-h-[56px] flex-col items-center gap-3 sm:mt-8">
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

      {/* 2. Column Stage (Bars sit below the content) */}
      <div
        aria-hidden="true"
        className="mx-auto mt-8 flex h-28 sm:h-40 max-w-5xl items-end px-4 pointer-events-none"
      >
        {HEIGHTS.map((h, i) => (
          <div
            key={i}
            className="relative flex-1 border-l border-white/[0.07] bg-gradient-to-b from-neutral-950 to-black transition-[height] duration-1000 ease-out motion-reduce:transition-none"
            style={{
              height: ready ? `${h}%` : "0%",
              transitionDelay: `${Math.abs(i - 4) * 90}ms`,
            }}
          >
            {/* Thin light line on top of each bar */}
            <span
              className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${GLINTS[i]} to-transparent`}
            />
          </div>
        ))}
      </div>

      {/* Inline Animation Style Keyframes (No external CSS required!) */}
      <style>{`
        @keyframes autoScrollSideways {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-auto-scroll {
          display: flex;
          width: max-content;
          animation: autoScrollSideways 18s linear infinite;
        }
        .animate-auto-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* 3. Automatic Sideways Scroll Strip (Strictly BELOW the bars) */}
      <div className="mt-6 border-t border-white/10 pt-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="animate-auto-scroll gap-8 text-xs text-white/40">
          {/* Double array map for seamless 360-degree looping */}
          {[...SOURCES, ...SOURCES].map((s, idx) => (
            <span
              key={`${s}-${idx}`}
              className="flex items-center gap-8 whitespace-nowrap font-medium hover:text-white/80 transition-colors"
            >
              <span>{s}</span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}