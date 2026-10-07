import { useRef } from "react";

export default function OtpInput({
  value, // the code as one string, e.g. "123"
  onChange, // called with the new code string
  length = 6,
  disabled = false,
  error = "", // error text shown under the boxes
}) {
  const refs = useRef([]); // the 6 input elements, so we can move focus

  // Turn "123" into ["1","2","3","","",""] so each box has a value
  const digits = Array.from({ length }, (_, i) => value[i] || "");

  // Typing a digit into box i
  const handleChange = (i, e) => {
    const d = e.target.value.replace(/\D/g, "").slice(-1); // keep only the last digit typed
    if (!d) return; // ignore letters
    const arr = value.split("");
    arr[i] = d;
    onChange(arr.join(""));
    if (i < length - 1) refs.current[i + 1]?.focus(); // move to the next box
  };

  // Backspace and arrow keys
  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (digits[i]) {
        onChange(value.slice(0, i) + value.slice(i + 1)); // delete this digit
      } else if (i > 0) {
        onChange(value.slice(0, i - 1) + value.slice(i)); // delete the previous digit
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
    onChange(pasted);
    refs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  // Clicking a box past the first empty one sends focus back to it (no gaps)
  const handleFocus = (i, e) => {
    if (i > value.length) refs.current[value.length]?.focus();
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