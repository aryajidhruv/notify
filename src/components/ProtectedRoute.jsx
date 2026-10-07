import { Navigate, useLocation } from 
"react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "./Spinner";

export default function ProtectedRoute({ children }) {
  //Step 1: Context & Location Hooks
  const { user, loading } = useAuth();
  const location = useLocation(); 

  // Step 2: Session Checking Phase (Loading)
  if (loading) return <Spinner size="lg" fullScreen />;

  //Step 3: Not Logged In (Redirect with History)
  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Logged in: show the protected page
  return children;
}