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
    <div className="min-h-screen bg-black text-white">
      <Navbar links={NAV_LINKS} variant="dark" />
      <Hero />

      <main className="mx-auto max-w-5xl px-4 sm:px-6">
        <AlertDemo />
        <Guide />
        <Faq />
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} Notify. Built in Delhi.</p>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
            <Link to="/signin" className="hover:text-white">Sign in</Link>
            <Link to="/signup" className="hover:text-white">Sign up</Link>
            {/* TODO: replace with your real contact address */}
            <a href="mailto:hello@example.com" className="hover:text-white">Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}