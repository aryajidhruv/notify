// Two looks: solid for main actions, outlined for secondary ones
const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "border border-gray-300 text-gray-700 hover:bg-gray-50",
  };
  
  export default function Button({
    children,
    loading = false, // show spinner + block clicks
    variant = "primary",
    className = "",
    disabled,
    type = "button", // "button" by default so it won't submit a form by accident
    ...rest // onClick, etc.
  }) {
    return (
      <button
        type={type}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}
        {...rest}
      >
        {/* Small spinning circle, only while loading */}
        {loading && (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
            <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="opacity-75" />
          </svg>
        )}
        {children}
      </button>
    );
  }