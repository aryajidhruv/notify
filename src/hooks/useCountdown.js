import { useCallback, useEffect, useState } from "react";

// Turns 75 into "1:15"
export function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function useCountdown() {
  const [endAt, setEndAt] = useState(null); // clock time (ms) when the timer hits zero
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!endAt) return; // no timer running

    // Work out the seconds left from the real clock (no drift)
    const tick = () => {
      const left = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left === 0) setEndAt(null); // finished: stop the interval
    };

    tick(); // update immediately, don't wait one second
    const id = setInterval(tick, 1000);
    return () => clearInterval(id); // cleanup
  }, [endAt]);

  // Start (or restart) a countdown of N seconds
  const start = useCallback((seconds) => setEndAt(Date.now() + seconds * 1000), []);

  // Stop and clear the timer
  const reset = useCallback(() => {
    setEndAt(null);
    setSecondsLeft(0);
  }, []);

  return { secondsLeft, isRunning: secondsLeft > 0, start, reset };
}