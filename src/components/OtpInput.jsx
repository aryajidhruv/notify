import { useRef } from "react";

export default function OtpInput({
  value, // the code as one string, e.g. "123"
  onChange, // called with the new code string
  length = 6,
  disabled = false,
  error = "", // error text shown under the boxes
}) {
  const refs = useRef([]); // the input elements, so we can move focus

  // NEW: always holds the freshest code, even before React re-renders
  const latest = useRef(value);
  latest.current = value; // sync on every render (covers parent resets/clears)

  // NEW: update the ref immediately, then tell the parent
  const update = (next) => {
    latest.current = next;
    onChange(next);
  };

  // Turn "123" into ["1","2","3","","",""] so each box has a value
  const digits = Array.from({ length }, (_, i) => value[i] || "");

  // Typing a digit into box i
  const handleChange = (i, e) => {
    const d = e.target.value.replace(/\D/g, "").slice(-1); // keep only the last digit typed
    if (!d) return; // ignore letters
    const arr = latest.current.split("");
    arr[i] = d;
    update(arr.join("")); // CHANGED: was onChange(...)
    if (i < length - 1) refs.current[i + 1]?.focus(); // move to the next box
  };

  // Backspace and arrow keys
  const handleKeyDown = (i, e) => {
    const v = latest.current; // CHANGED: read from the ref, not the stale prop
    if (e.key === "Backspace") {
      e.preventDefault();
      if (v[i]) {
        update(v.slice(0, i) + v.slice(i + 1)); // delete this digit
      } else if (i > 0) {
        update(v.slice(0, i - 1) + v.slice(i)); // delete the previous digit
        refs.current[i - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && i > 0) {
      refs.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < length - 1) {
      refs.current[i + 1]?.focus();
    }
  };

  // Pasting a full code fills every box
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    update(pasted); // CHANGED: was onChange(pasted)
    refs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  // Clicking a box past the first empty one sends focus back to it (no gaps)
  const handleFocus = (i, e) => {
    const len = latest.current.length; // CHANGED: the fix. Fresh length, not stale value.length
    if (i > len) refs.current[len]?.focus();
    else e.target.select(); // select the digit so typing replaces it
  };

  return (
    <div>
      <div className="flex justify-center gap-2">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => (refs.current[i] = el)}
            value={d}
            disabled={disabled}
            autoFocus={i === 0}
            inputMode="numeric" // number keypad on phones
            autoComplete={i === 0 ? "one-time-code" : "off"}
            aria-label={`Digit ${i + 1}`}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={(e) => handleFocus(i, e)}
            className={`h-12 w-11 rounded-lg border text-center text-lg font-semibold outline-none transition focus:ring-2 disabled:opacity-60 ${
              error
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
            }`}
          />
        ))}
      </div>

      {/* Error message under the boxes */}
      {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
    </div>
  );
}