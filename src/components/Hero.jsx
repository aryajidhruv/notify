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

// Kinds of pages Notify is made for (categories, not partner logos)

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
      {/* Text sits above the columns, in the valley's open space */}
      <div className="relative z-10 mx-auto flex min-h-[680px] max-w-6xl flex-col items-center px-4 pt-20 text-center sm:min-h-[740px] sm:pt-28">
        
      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
  Stop refreshing pages. Get an email when it happens.
</h1>
<p className="mt-5 max-w-md text-base text-white/70">
  Paste a link and describe what you're waiting for in one sentence. Notify emails you
  when it shows up.
</p>

        {/* Fixed height so nothing jumps while the session restores */}
        <div className="mt-8 flex min-h-[72px] flex-col items-center gap-3">
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
                <a href="#example" className="text-sm text-white/60 hover:text-white">
                  See an example
                </a>
              </>
            ))}
        </div>
      </div>

      {/* Column stage (decorative) */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 flex h-[38%] items-end sm:h-[42%]"
      >
        {HEIGHTS.map((h, i) => (
          <div
            key={i}
            className="relative flex-1 border-l border-white/[0.07] bg-linear-to-b from-neutral-950 to-black transition-[height] duration-1000 ease-out motion-reduce:transition-none"
            style={{
              height: ready ? `${h}%` : "0%",
              transitionDelay: `${Math.abs(i - 4) * 90}ms`, // centre first, edges last
            }}
          >
            {/* Thin light line on top of the column */}
            <span
              className={`absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent ${GLINTS[i]} to-transparent`}
            />
          </div>
        ))}
      </div>

      {/* Bottom row, like the logo strip in your reference */}
      <div className="absolute inset-x-0 bottom-6 z-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 text-xs text-white/40">
        {SOURCES.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>
    </section>
  );
}