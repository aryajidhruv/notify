import { createContext, useContext, useEffect, useRef, useState } from "react";
import * as authApi from "../api/auth";
import { setAccessToken } from "../api/client";

// The shared "box" that holds auth data for the whole app
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { user_id, email } or null
  const [loading, setLoading] = useState(true); // true while we check for an existing session
  const started = useRef(false); // stops the check running twice in dev (React StrictMode)

  // On first load: try to restore the session from the refresh-token cookie

  //Step 1: App Load/Refresh Par (Session Restoration)
  useEffect(() => {
    if (started.current) return; // StrictMode duplicate run stops
    started.current = true;
  
    (async () => {
      try {
        const data = await authApi.refresh(); // 1. Refresh call
        setAccessToken(data.access_token);    // 2. Save new token in RAM
        setUser(await authApi.getMe());       // 3. Load user details
      } catch {
        setUser(null);                        // 4. No session found
      } finally {
        setLoading(false);                    // 5. Loading complete
      }
    })();
  }, []);

 //Step 2: Forced Logout Event Listener
  useEffect(() => {
    const onForcedLogout = () => setUser(null);
    window.addEventListener("auth:logout", onForcedLogout);
    return () => window.removeEventListener("auth:logout", onForcedLogout);
  }, []);

  //Step 3: login() Function
  const login = async (email, password) => {
    const data = await authApi.signin(email, password); // 1. Call signin API
    setAccessToken(data.access_token);                  // 2. Save token to RAM
    setUser(await authApi.getMe());                     // 3. Get user profile
  };

  //Step 4: logout() Function
  const logout = async () => {
    try {
      await authApi.logout(); // Server refresh token clear karta hai
    } catch {
      // Ignore error
    }
    setAccessToken(null);     // RAM clearing
    setUser(null);            // React state clearing
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Shortcut hook: const { user, loading, login, logout } = useAuth();
export const useAuth = () => useContext(AuthContext);