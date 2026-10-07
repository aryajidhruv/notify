// src/components/Toast.jsx
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
  } from "react";
  
  const ToastContext = createContext(null);
  let nextId = 0; // simple unique id for each toast
  
  const STYLES = {
    success: "border-green-200 bg-green-50 text-green-800",
    error: "border-red-200 bg-red-50 text-red-800",
  };
  
  export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const timers = useRef(new Map()); // id -> timeout, so we can cancel on dismiss
  
    const dismiss = useCallback((id) => {
      clearTimeout(timers.current.get(id));
      timers.current.delete(id);
      setToasts((list) => list.filter((t) => t.id !== id));
    }, []);
  
    const show = useCallback(
      (message, type, duration) => {
        const id = ++nextId;
        setToasts((list) => [...list, { id, message, type }]);
        timers.current.set(id, setTimeout(() => dismiss(id), duration));
      },
      [dismiss]
    );
  
    // Clear any pending timers if the provider unmounts
    useEffect(() => {
      const map = timers.current;
      return () => map.forEach((timer) => clearTimeout(timer));
    }, []);
  
    // Stable object so consumers don't re-render needlessly
    const toast = useMemo(
      () => ({
        success: (message) => show(message, "success", 4000),
        error: (message) => show(message, "error", 6000),
      }),
      [show]
    );
  
    return (
      <ToastContext.Provider value={toast}>
        {children}
  
        {/* Stack of active toasts */}
        <div
          aria-live="polite"
          className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2 px-4 sm:px-0"
        >
          {toasts.map((t) => (
            <div
              key={t.id}
              role={t.type === "error" ? "alert" : "status"}
              className={`pointer-events-auto flex items-start justify-between gap-3 rounded-lg border p-3 text-sm shadow-md ${STYLES[t.type]}`}
            >
              <span>{t.message}</span>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss"
                className="shrink-0 opacity-60 hover:opacity-100"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </ToastContext.Provider>
    );
  }
  
  export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
    return ctx;
  }