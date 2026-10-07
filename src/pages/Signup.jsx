import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendOtp, verifyOtp, register } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import useCountdown, { formatTime } from "../hooks/useCountdown";
import { getNameFromEmail } from "../utils/getName";
import Input from "../components/Input";
import Button from "../components/Button";
import OtpInput from "../components/OtpInput";

// --- Settings (guessed from the backend code, easy to change here) ---
const OTP_EXPIRY_SEC = 60; // how long the OTP is valid
const RESEND_COOLDOWN_SEC = 120; // how long until "Resend" unlocks
const PASSWORD_MIN = 8; // backend password rule

// Turns an axios error into a readable message
function getErrorMessage(err, fallback = "Something went wrong. Please try again.") {
  if (!err.response) return "Can't reach the server. Check your connection.";
  const detail = err.response.data?.detail;
  if (typeof detail === "string") return detail; // e.g. "Wrong code..."
  if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg; // 422 validation
  return fallback;
}

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const expiry = useCountdown(); // how long the OTP is valid
  const resend = useCountdown(); // how long until "Resend" unlocks

  const [step, setStep] = useState(1); // 1 = email, 2 = code, 3 = password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [token, setToken] = useState(""); // proof of verified email, from step 2
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(""); // one banner for errors from any step
  const [loading, setLoading] = useState(false);

  // Send (or resend) the OTP. Used by step 1 and by the "Resend" button
  const requestOtp = async () => {
    setError("");
    setLoading(true);
    try {
      await sendOtp(email.trim());
      setOtp("");
      expiry.start(OTP_EXPIRY_SEC); // start the expiry timer
      resend.start(RESEND_COOLDOWN_SEC); // start the resend timer
      setStep(2);
    } catch (err) {
      if (err.response?.status === 409) {
        setError("This email is already registered. Please sign in.");
      } else if (err.response?.status === 429) {
        setError("Too many requests. Please wait before asking for another code.");
      } else {
        setError(getErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 1 submit: email form
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    requestOtp();
  };

  // Step 2 submit: check the code
  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await verifyOtp(email.trim(), otp);
      setToken(data.token); // keep the proof token for step 3
      expiry.reset(); // timers are no longer needed
      resend.reset();
      setStep(3);
    } catch (err) {
      setError(getErrorMessage(err)); // wrong code, expired, too many attempts
    } finally {
      setLoading(false);
    }
  };

  // Step 3 submit: create the account, then sign in automatically
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Check on our side first, so the user gets instant feedback
    if (password.length < PASSWORD_MIN) {
      return setError(`Password must be at least ${PASSWORD_MIN} characters.`);
    }
    if (password !== confirm) {
      return setError("Passwords don't match.");
    }

    setLoading(true);
    try {
      const data = await register(token, email.trim(), password);

      // Backend returns 200 even when registration fails
      if (!data.status) {
        setError(data.message || "Could not create the account.");
        return;
      }

      // Account created: sign in automatically, or fall back to the signin page
      try {
        await login(email.trim(), password);
        navigate("/dashboard", { replace: true });
      } catch {
        navigate("/signin", { replace: true });
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Go back to step 1 and clear everything from step 2
  const changeEmail = () => {
    setError("");
    setOtp("");
    expiry.reset();
    resend.reset();
    setStep(1);
  };

  // Google signup/signin is a full-page redirect, not an axios call.
  // The backend starts the OAuth flow and sends the user to Google.
  const handleGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
          Step {step} of 3
        </p>
        <h1 className="mt-1 mb-6 text-2xl font-bold text-gray-900">Create your account</h1>

        {/* One red banner for errors from any step */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* STEP 1: email (plus Google option) */}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" loading={loading} className="w-full">
              Send code
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <div className="h-px flex-1 bg-gray-200" />
              OR
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Google button */}
            <Button variant="secondary" onClick={handleGoogle} className="w-full">
              <svg viewBox="0 0 24 24" className="h-5 w-5">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
              </svg>
              Continue with Google
            </Button>
          </form>
        )}

        {/* STEP 2: 6-digit code */}
        {step === 2 && (
          <form onSubmit={handleVerify} className="space-y-4">
            <p className="text-sm text-gray-600">
              We sent a 6-digit code to <span className="font-medium">{email}</span>.
            </p>

            <OtpInput value={otp} onChange={setOtp} disabled={loading} />

            <p className="text-center text-sm text-gray-500">
              {expiry.isRunning
                ? `Code expires in ${formatTime(expiry.secondsLeft)}`
                : "Code expired. Request a new one."}
            </p>

            <Button type="submit" loading={loading} disabled={otp.length !== 6} className="w-full">
              Verify
            </Button>

            {/* Resend is locked until the backend's cooldown is over */}
            <Button
              variant="secondary"
              onClick={requestOtp}
              disabled={resend.isRunning || loading}
              className="w-full"
            >
              {resend.isRunning ? `Resend in ${formatTime(resend.secondsLeft)}` : "Resend code"}
            </Button>

            <button
              type="button"
              onClick={changeEmail}
              className="w-full text-center text-sm text-blue-600 hover:underline"
            >
              Use a different email
            </button>
          </form>
        )}

        {/* STEP 3: password */}
        {step === 3 && (
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Name = the part of the email before the @ */}
            <p className="text-sm text-gray-600">
              Almost done, <span className="font-medium">{getNameFromEmail(email)}</span>. Choose a password.
            </p>

            <Input
              label="Password"
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              label="Confirm password"
              type="password"
              required
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            <p className="text-xs text-gray-500">At least {PASSWORD_MIN} characters.</p>
            <Button type="submit" loading={loading} className="w-full">
              Create account
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/signin" className="font-medium text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}