import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// TODO: check every answer below against how the backend really works
const FAQS = [
  {
    q: "How soon will I get an email?",
    a: "Pages are checked on a schedule, so an email can arrive some time after a notice is posted, not the same second. [TODO: add your real check interval]",
  },
  {
    q: "Which pages work?",
    a: "Public pages that list notices as text or links. Pages behind a login don't work, because Notify can't sign in for you. [TODO: confirm how PDF-only or image-only notices behave]",
  },
  {
    q: "Is Notify free?",
    a: "[TODO: state your real pricing, or say it is free during early access]",
  },
  {
    q: "What do you do with my data?",
    a: "We store your email, the page links you add and your interest sentences so we can send you alerts. [TODO: add a privacy page link and your policy]",
  },
  {
    q: "Does Notify work outside my country?",
    a: "It works with any public page you can open in a browser, in any country. [TODO: confirm how pages in other languages are handled]",
  },
];

export default function Faq() {
  const { user } = useAuth();

  return (
    <>
      {/* Native <details>: keyboard and screen-reader friendly with no JS */}
      <section id="faq" className="scroll-mt-20 border-t border-white/10 py-16 sm:py-24">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Questions</h2>
        <div className="mt-8 max-w-2xl divide-y divide-white/10 border-y border-white/10">
          {FAQS.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  aria-hidden="true"
                  className="text-xl leading-none text-white/40 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-white/60">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA, with the same light edge as the hero columns */}
      <section className="relative mb-16 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-14 text-center sm:px-12">
        <span className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-sky-300/80 to-transparent" />
        <h2 className="mx-auto max-w-lg text-2xl font-semibold tracking-tight sm:text-3xl">
          Add your first notice board in two minutes.
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-white/60">
          Create an account, paste a link, write what you want to hear about.
        </p>
        <Link
          to={user ? "/dashboard" : "/signup"}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-medium text-black hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {user ? "Go to dashboard" : "Get started"}
        </Link>
      </section>
    </>
  );
}