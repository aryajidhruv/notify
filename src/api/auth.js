import api from "./client";

// Google login is a full-page redirect, so we only need the URL
export const googleAuthUrl = `${import.meta.env.VITE_API_URL || "/api/v1"}/auth/google`;

// Signup step 1: backend emails a 6-digit OTP to this address
export const sendOtp = (email) =>
  api.post("/auth/signup/send-otp", { email }).then((r) => r.data);

// Signup step 2: check the OTP, returns { status, token }
export const verifyOtp = (email, otp) =>
  api.post("/auth/signup/verify-otp", { email, otp }).then((r) => r.data);

// Signup step 3: create the account using the token from step 2
// Backend returns 200 even on failure, so the caller must check data.status
export const register = (token, email, password) =>
  api
    .post("/auth/signup/register", { token, email, password })
    .then((r) => r.data);

// Signin needs form data (not JSON); the email goes in "username"
export const signin = (email, password) => {
  const form = new URLSearchParams();
  form.append("username", email);
  form.append("password", password);
  return api
    .post("/auth/signin", form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
    .then((r) => r.data); // { access_token, token_type }
};

// Uses the refresh-token cookie to get a new access token (restores a session)
export const refresh = () => api.post("/auth/refresh").then((r) => r.data);

// Who is logged in? Returns { user_id, email }
export const getMe = () => api.get("/usr/me").then((r) => r.data);

// Logout: the server deletes the refresh token and clears the cookie
export const logout = () => api.get("/usr/logout").then((r) => r.data);