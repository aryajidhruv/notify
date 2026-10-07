// src/pages/Landing.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const primaryLink =
  "inline-flex items-center justify-center rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors";
const secondaryLink =
  "inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors";

const STEPS = [
  {
    step: "01",
    title: "Add a Notice Board",
    text: "Paste the URL of any official college, university, or organization notice page.",
  },
  {
    step: "02",
    title: "Set Your Preferences",
    text: "Describe what topics, exam dates, or circulars you care about in plain English.",
  },
  {
    step: "03",
    title: "Get Instant Email Alerts",
    text: "Our engine continuously monitors the web and emails you as soon as a relevant update is posted.",
  },
];

const TESTIMONIALS = [
  {
    quote: "I used to check our university site 5 times a day. Notify saved me during exam registration week!",
    name: "Aarav Sharma",
    role: "B.Tech Student",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
  },
  {
    quote: "Got an email alert 10 minutes after a deadline extension circular was uploaded. Game changer.",
    name: "Priya Patel",
    role: "Mathematics Scholar",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
  },
];

export default function Landing() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Hero Section */}
        <section className="py-16 text-center sm:py-20">
          {/* Social Proof Badge */}
          <div className="inline-flex items-center gap-3 rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-xs font-semibold text-gray-700 shadow-xs mb-6">
            <div className="flex -space-x-2">
              <img
                className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
                alt="User"
              />
              <img
                className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100"
                alt="User"
              />
              <img
                className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"
                alt="User"
              />
            </div>
            <span>Trusted by 1,000+ students & professionals</span>
          </div>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Never miss an important notice again
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Notify tracks official notice boards and alerts your email instantly whenever relevant updates, exam schedules, or circulars are released.
          </p>

          <div className="mt-8 flex min-h-[44px] flex-wrap items-center justify-center gap-3">
            {!loading &&
              (user ? (
                <Link to="/dashboard" className={primaryLink}>
                  Go to Dashboard &rarr;
                </Link>
              ) : (
                <>
                  <Link to="/signup" className={primaryLink}>
                    Get Started Free
                  </Link>
                  <Link to="/signin" className={secondaryLink}>
                    Sign in
                  </Link>
                </>
              ))}
          </div>
        </section>

        {/* Excited Hero Image Spotlight */}
        <section className="mb-20 overflow-hidden rounded-2xl border border-gray-200 bg-gray-900 text-white shadow-lg grid md:grid-cols-2 items-center">
          <div className="p-8 sm:p-12 space-y-4">
            <span className="inline-block rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
              Instant Peace of Mind
            </span>
            <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
              Stop constantly refreshing notice boards.
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Join hundreds of users who stopped stressing over missed deadlines, exam dates, and crucial circulars.
            </p>
          </div>
          <div className="relative h-64 md:h-full min-h-[280px]">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800"
              alt="Excited students celebrating receiving timely updates"
              className="absolute inset-0 h-full w-full object-cover object-center filter brightness-95"
            />
          </div>
        </section>

        {/* How It Works */}
        <section className="py-12 border-t border-gray-100">
          <div className="text-center">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Workflow
            </h2>
            <p className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              How Notify Works in 3 Steps
            </p>
          </div>

          <ol className="mt-12 grid gap-6 sm:grid-cols-3">
            {STEPS.map((step) => (
              <li
                key={step.title}
                className="relative rounded-xl border border-gray-200 bg-white p-6 shadow-xs"
              >
                <span className="text-xs font-mono font-bold text-gray-400">
                  {step.step}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* User Excitement & Testimonials */}
        <section className="py-16 border-t border-gray-100">
          <div className="text-center">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Loved by Users
            </h2>
            <p className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              What students & professionals say
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="rounded-xl border border-gray-200 bg-gray-50/50 p-6 space-y-4"
              >
                <p className="text-sm text-gray-700 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-2">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">{t.name}</h4>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action Banner */}
        <section className="my-16 rounded-2xl bg-gray-900 px-6 py-12 text-center text-white sm:px-12">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Ready to automate your notice alerts?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-300">
            Set up your first notice board monitor in less than two minutes.
          </p>
          <div className="mt-6">
            <Link
              to={user ? "/dashboard" : "/signup"}
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {user ? "Go to Dashboard" : "Start Watching Pages"}
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}