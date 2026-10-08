import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendOtp, verifyOtp, register } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import useCountdown, { formatTime } from "../hooks/useCountdown";
import { getNameFromEmail } from "../utils/getName";
import AuthLayout from "../components/AuthLayout";
import Input from "../components/Input";
import Button from "../components/Button";
import OtpInput from "../components/OtpInput";

// --- Settings ---
const OTP_EXPIRY_SEC = 60;
const RESEND_COOLDOWN_SEC = 120;
const PASSWORD_MIN = 8;

const TITLES = {
  1: "Create your account",
  2: "Check your email",
  3: "Choose a password",
};

// Responsive Glass card: p-5 on mobile, p-8 on larger screens
const CARD =
  "w-full max-w-md rounded-2xl border border-white/15 bg-white/[0.06] p-5 sm:p-8 text-white shadow-2xl backdrop-blur-[2px] " +
  "[&_label]:text-white/80 " +
  "[&_input]:border-white/20 [&_input]:bg-white/5 [&_input]:text-white [&_input]:caret-white " +
  "[&_input]:placeholder:text-white/40";

// Action buttons with touch-friendly heights and text scaling
const PRIMARY = "w-full rounded-full! bg-white! text-black! hover:bg-white/90! text-sm sm:text-base py-2.5 sm:py-3";
const SECONDARY =
  "w-full rounded-full! border! border-white/25! bg-transparent! text-white! hover:bg-white/10! text-sm sm:text-base py-2.5 sm:py-3";

function getErrorMessage(err, fallback = "Something went wrong. Please try again.") {
  if (!err.response) return "Can't reach the server. Check your connection.";
  const detail = err.response.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg;
  return fallback;
}

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const expiry = useCountdown();
  const resend = useCountdown();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const requestOtp = async () => {
    setError("");
    setLoading(true);
    try {
      await sendOtp(email.trim());
      setOtp("");
      expiry.start(OTP_EXPIRY_SEC);
      resend.start(RESEND_COOLDOWN_SEC);
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

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    requestOtp();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await verifyOtp(email.trim(), otp);
      setToken(data.token);
      expiry.reset();
      resend.reset();
      setStep(3);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < PASSWORD_MIN) {
      return setError(`Password must be at least ${PASSWORD_MIN} characters.`);
    }
    if (password !== confirm) {
      return setError("Passwords don't match.");
    }

    setLoading(true);
    try {
      const data = await register(token, email.trim(), password);

      if (!data.status) {
        setError(data.message || "Could not create the account.");
        return;
      }

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

  const changeEmail = () => {
    setError("");
    setOtp("");
    expiry.reset();
    resend.reset();
    setStep(1);
  };

  const handleGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <AuthLayout>
      <div className={CARD}>
        {/* Step Progress Bar */}
        <div className="flex gap-1.5" aria-hidden="true">
          {[1, 2, 3].map((n) => (
            <span
              key={n}
              className={`h-1 flex-1 rounded-full transition-colors ${
                n <= step ? "bg-white" : "bg-white/20"
              }`}
            />
          ))}
        </div>
        <p className="mt-3 text-xs sm:text-sm text-white/60">Step {step} of 3</p>
        <h1 className="mt-1 mb-5 sm:mb-6 text-xl sm:text-2xl font-semibold tracking-tight">
          {TITLES[step]}
        </h1>

        {/* Error Banner */}
        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs sm:text-sm text-red-200 break-words"
          >
            {error}
          </div>
        )}

        {/* STEP 1: Email */}
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
            <Button type="submit" loading={loading} className={PRIMARY}>
              Send code
            </Button>

            <div className="flex items-center gap-3 text-xs text-white/40 my-2">
              <div className="h-px flex-1 bg-white/15" />
              or
              <div className="h-px flex-1 bg-white/15" />
            </div>

            <Button type="button" variant="secondary" onClick={handleGoogle} className={SECONDARY}>
              <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
              </svg>
              <span>Continue with Google</span>
            </Button>
          </form>
        )}

        {/* STEP 2: 6-digit Code */}
        {step === 2 && (
          <form onSubmit={handleVerify} className="space-y-4">
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              We sent a 6-digit code to <span className="font-medium text-white break-all">{email}</span>.
            </p>

            <div className="overflow-x-auto py-1">
              <OtpInput value={otp} onChange={setOtp} disabled={loading} />
            </div>

            <p className="text-center text-xs sm:text-sm text-white/60">
              {expiry.isRunning
                ? `Code expires in ${formatTime(expiry.secondsLeft)}`
                : "Code expired. Request a new one."}
            </p>

            <Button
              type="submit"
              loading={loading}
              disabled={otp.length !== 6}
              className={PRIMARY}
            >
              Verify
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={requestOtp}
              disabled={resend.isRunning || loading}
              className={SECONDARY}
            >
              {resend.isRunning ? `Resend in ${formatTime(resend.secondsLeft)}` : "Resend code"}
            </Button>

            <button
              type="button"
              onClick={changeEmail}
              className="w-full text-center text-xs sm:text-sm text-white/60 underline-offset-4 hover:text-white hover:underline"
            >
              Use a different email
            </button>
          </form>
        )}

        {/* STEP 3: Password */}
        {step === 3 && (
          <form onSubmit={handleRegister} className="space-y-4">
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              Almost done, <span className="font-medium text-white">{getNameFromEmail(email)}</span>.
              Choose a password.
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
            <p className="text-xs text-white/50">At least {PASSWORD_MIN} characters.</p>
            <Button type="submit" loading={loading} className={PRIMARY}>
              Create account
            </Button>
          </form>
        )}

        <p className="mt-5 sm:mt-6 text-center text-xs sm:text-sm text-white/60">
          Already have an account?{" "}
          <Link to="/signin" className="font-medium text-white underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}