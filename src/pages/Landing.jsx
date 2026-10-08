import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AlertDemo from "../components/AlertDemo";
import Guide from "../components/Guide";
import Faq from "../components/Faq";

// Header anchor links -> section ids inside the components
const NAV_LINKS = [
  { label: "How it works", href: "#how" },
  { label: "Examples", href: "#examples" },
  { label: "FAQ", href: "#faq" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20">
      <Navbar links={NAV_LINKS} variant="dark" />
      <Hero />

      {/* Main Container - Added overflow protection for mobile screens */}
      <main className="mx-auto max-w-5xl px-4 sm:px-6 overflow-hidden">
        <AlertDemo />
        <Guide />
        <Faq />
      </main>

      {/* Footer - Optimized spacing and responsive typography */}
      <footer className="border-t border-white/10 bg-black">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 sm:py-8 text-xs sm:text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} Notify. Built in Delhi.</p>
          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link to="/signin" className="hover:text-white transition-colors">
              Sign in
            </Link>
            <Link to="/signup" className="hover:text-white transition-colors">
              Sign up
            </Link>
            <a href="mailto:hello@example.com" className="hover:text-white transition-colors">
              Contact
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}