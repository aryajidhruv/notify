// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css"; // Tailwind v4 entry
import App from "./App";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Router outside, so auth code can use navigation if it ever needs to */}
    <BrowserRouter>
      {/* Restores the session on load and exposes useAuth() everywhere */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);