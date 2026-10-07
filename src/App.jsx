// src/App.jsx
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />

      {/* Private page: ProtectedRoute redirects to /signin when logged out */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch-all 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}