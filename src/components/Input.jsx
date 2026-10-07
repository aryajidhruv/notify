import { useId } from "react";

export default function Input({
  label,
  error, // error text to show under the field (or empty)
  className = "",
  ...rest // type, value, onChange, placeholder, etc.
}) {
  const id = useId(); // unique id so the label and input are linked

  return (
    <div className={className}>
      {/* Label only renders if one was given */}
      {label && (
        <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        id={id}
        aria-invalid={!!error}
        className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
          error
            ? "border-red-500 focus:ring-red-200" // error look
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-200" // normal look
        }`}
        {...rest}
      />

      {/* Error message under the field */}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}