// src/components/Spinner.jsx

// Ring sizes in Tailwind classes
const SIZES = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-4",
  };
  
  export default function Spinner({ size = "md", fullScreen = false }) {
    const ring = (
      <div
        role="status"
        aria-label="Loading"
        // Gray ring with one dark edge, spun by animate-spin
        className={`${SIZES[size]} animate-spin rounded-full border-gray-300 border-t-gray-900`}
      />
    );
  
    // Full-screen mode centers the ring in the viewport
    if (fullScreen) {
      return <div className="flex min-h-screen items-center justify-center">{ring}</div>;
    }
  
    return ring;
  }