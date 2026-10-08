const WITHOUT = [
    "Open the same pages every day.",
    "Scroll past old posts to find what's new.",
    "Find out about a change after it has already happened.",
  ];
  
  const WITH = [
    "Add each page once.",
    "Say what you care about in one sentence.",
    "Get an email only when something matches.",
  ];
  
  // Filler rows so the mock reads like a real inbox
  const OTHER_MAIL = [
    {
      from: "Calendar",
      subject: "Reminder: Team sync at 3 pm",
      snippet: "Your meeting starts in 30 minutes.",
      time: "8:15",
    },
    {
      from: "Weekly digest",
      subject: "Your reading list for the week",
      snippet: "Five articles you saved are waiting.",
      time: "Mon",
    },
  ];
  
  export default function AlertDemo() {
    return (
      <>
        {/* What you write -> what lands in your inbox */}
        <section
          id="example"
          aria-label="Example alert"
          className="mt-12 sm:mt-16 scroll-mt-20 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-8 md:p-10"
        >
          <div className="grid items-center gap-8 md:grid-cols-2">
            {/* Left Column: Input Example */}
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-white/50">You add</p>
              <p className="mt-2 break-all break-words rounded-lg border border-white/10 bg-black px-3 py-2 font-mono text-xs sm:text-sm text-white/80">
                https://www.example.gov/announcements
              </p>
  
              <p className="mt-4 text-xs sm:text-sm text-white/50">and write</p>
              <p className="mt-2 rounded-lg border border-sky-300/30 bg-sky-300/10 px-3 py-2 text-xs sm:text-sm text-sky-100">
                Tell me when driving licence renewal appointments open up.
              </p>
            </div>
  
            {/* Right Column: Inbox Mock */}
            <div className="min-w-0">
              <p className="inline-flex items-center gap-2 rounded-full border border-sky-300/30 bg-sky-300/10 px-3 py-1 text-xs sm:text-sm font-medium text-sky-100">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-sky-300" />
                You get
              </p>
  
              {/* Dark inbox: the new Notify email on top, opened below */}
              <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl">
                {/* Inbox header */}
                <div className="flex items-center justify-between border-b border-white/10 px-3 sm:px-4 py-2 text-xs text-white/50">
                  <span className="font-medium text-white/80">Inbox</span>
                  <span>1 unread</span>
                </div>
  
                <ul className="divide-y divide-white/10">
                  {/* The new, unread Notify email */}
                  <li className="flex gap-2.5 sm:gap-3 bg-white/[0.06] px-3 sm:px-4 py-3">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sky-300"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="truncate text-xs sm:text-sm font-semibold text-white">Notify</p>
                        <p className="shrink-0 text-[10px] sm:text-xs text-sky-300">Just now</p>
                      </div>
                      <p className="truncate text-xs sm:text-sm font-medium text-white">
                        New announcement: Licence renewal appointments now open
                      </p>
                      <p className="truncate text-[10px] sm:text-xs text-white/50">
                        A new announcement on example.gov matches your interest
                      </p>
                    </div>
                  </li>
  
                  {/* Older mail, dimmed and blurred */}
                  {OTHER_MAIL.map((mail) => (
                    <li
                      key={mail.subject}
                      aria-hidden="true"
                      className="pointer-events-none flex select-none gap-2.5 sm:gap-3 px-3 sm:px-4 py-3 opacity-60 blur-[2px] sm:blur-[3px]"
                    >
                      <span className="h-2 w-2 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="truncate text-xs sm:text-sm text-white">{mail.from}</p>
                          <p className="shrink-0 text-[10px] sm:text-xs text-white/60">{mail.time}</p>
                        </div>
                        <p className="truncate text-xs sm:text-sm text-white">{mail.subject}</p>
                        <p className="truncate text-[10px] sm:text-xs text-white/60">{mail.snippet}</p>
                      </div>
                    </li>
                  ))}
                </ul>
  
                {/* The opened Notify message */}
                <div className="border-t border-white/15 bg-white/[0.04] p-3 sm:p-4">
                  <p className="font-medium text-xs sm:text-sm text-white">
                    New announcement: Licence renewal appointments now open
                  </p>
                  <p className="mt-1 text-[10px] sm:text-xs text-white/50">From Notify</p>
                  <p className="mt-2.5 text-xs sm:text-sm text-white/70 leading-relaxed">
                    A new announcement on example.gov matches your interest:
                    "licence renewal appointments".
                  </p>
                  <span className="mt-3 inline-block rounded-full bg-white px-3.5 py-1.5 text-xs sm:text-sm font-medium text-black">
                    Open page
                  </span>
                </div>
              </div>
  
              <p className="mt-2 text-[10px] sm:text-xs text-white/40">
                Example inbox, not a real announcement.
              </p>
            </div>
          </div>
        </section>
  
        {/* Before / after */}
        <section className="py-12 sm:py-20">
          <h2 className="max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">
            Check once. Hear about it when it matters.
          </h2>
          <div className="mt-6 sm:mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 p-4 sm:p-6">
              <h3 className="text-sm sm:text-base font-medium text-white/50">Without Notify</h3>
              <ul className="mt-3 space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-white/60">
                {WITHOUT.map((line) => (
                  <li key={line} className="flex items-start gap-2">
                    <span className="text-red-400 shrink-0">✕</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-white/25 bg-white/[0.05] p-4 sm:p-6">
              <h3 className="text-sm sm:text-base font-medium text-white">With Notify</h3>
              <ul className="mt-3 space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-white/90">
                {WITH.map((line) => (
                  <li key={line} className="flex items-start gap-2">
                    <span className="text-sky-300 shrink-0">✓</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </>
    );
  }