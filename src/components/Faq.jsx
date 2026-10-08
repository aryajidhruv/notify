import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const FAQS = [
  {
    q: "How soon will I get an email?",
    a: "Pages are checked on a schedule, so an email can arrive some time after a notice is posted, not the same second.",
  },
  {
    q: "Which pages work?",
    a: "Public pages that list notices as text or links. Pages behind a login don't work, because Notify can't sign in for you.",
  },
  {
    q: "Is Notify free?",
    a: "Notify is currently free to use during our early access period.",
  },
  {
    q: "What do you do with my data?",
    a: "We store your email, the page links you add, and your interest sentences so we can send you alerts.",
  },
  {
    q: "Does Notify work outside my country?",
    a: "It works with any public page you can open in a browser, in any country.",
  },
];

export default function Faq() {
  const { user } = useAuth();

  return (
    <>
      {/* Native <details> Accordion */}
      <section id="faq" className="scroll-mt-20 border-t border-white/10 px-4 py-12 sm:px-0 sm:py-20">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Questions</h2>
        <div className="mt-8 max-w-2xl divide-y divide-white/10 border-y border-white/10">
          {FAQS.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-sm sm:text-base [&::-webkit-details-marker]:hidden">
                <span className="pr-2">{item.q}</span>
                <span
                  aria-hidden="true"
                  className="text-xl leading-none text-white/40 transition-transform group-open:rotate-45 shrink-0"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-xs sm:text-sm text-white/60 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA Card */}
      <section className="relative my-12 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-10 sm:px-12 sm:py-14 text-center">
        {/* Fixed CSS Gradient syntax */}
        <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/80 to-transparent" />
        <h2 className="mx-auto max-w-lg text-xl font-semibold tracking-tight sm:text-3xl">
          Add your first notice board in two minutes.
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-xs sm:text-sm text-white/60">
          Create an account, paste a link, write what you want to hear about.
        </p>
        <Link
          to={user ? "/dashboard" : "/signup"}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-xs sm:text-sm font-medium text-black hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {user ? "Go to dashboard" : "Get started"}
        </Link>
      </section>
    </>
  );
}