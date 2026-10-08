const STEPS = [
    {
      title: "Add a page",
      text: "Paste the link to any public page where updates are posted.",
    },
    {
      title: "Say what you're waiting for",
      text: "Write each interest as a plain sentence. No keywords or filters.",
    },
    {
      title: "Get an email",
      text: "We watch the page and email you when something matches.",
    },
  ];
  
  // Each one fits the 5-200 character interest limit
  const EXAMPLES = [
    { topic: "Appointments", text: "Tell me when driving licence renewal appointments open up." },
    { topic: "Jobs", text: "Alert me when a new remote frontend developer role is posted." },
    { topic: "Events", text: "Email me when tickets for the autumn concert go on sale." },
    { topic: "Local services", text: "Let me know when the council announces changes to bin collection days." },
    { topic: "Travel", text: "Notify me when the airline posts a schedule change for my route." },
    { topic: "Schools", text: "Tell me when the school publishes next term's holiday calendar." },
  ];
  export default function Guide() {
    return (
      <>
        {/* A real sequence, so numbered steps are fine here */}
        <section id="how" className="scroll-mt-20 border-t border-white/10 py-16 sm:py-24">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">How it works</h2>
          <ol className="mt-8 grid gap-8 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title} className="border-t border-white/30 pt-4">
                <p className="text-sm text-white/50">Step {i + 1}</p>
                <h3 className="mt-1 text-lg font-medium">{step.title}</h3>
                <p className="mt-2 text-sm text-white/60">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>
  
        {/* Real example sentences show the "plain English" benefit */}
        <section id="examples" className="scroll-mt-20 border-t border-white/10 py-16 sm:py-24">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Things you can ask Notify to watch for
          </h2>
          <p className="mt-3 max-w-xl text-white/60">
            Each interest is one sentence, between 5 and 200 characters. Add as many as you
            like for each page.
          </p>
          <ul className="mt-8 grid gap-x-10 gap-y-6 md:grid-cols-2">
            {EXAMPLES.map((ex) => (
              <li key={ex.topic} className="border-l border-sky-300/50 pl-4">
                <p className="text-sm font-medium">{ex.topic}</p>
                <p className="mt-1 text-white/60">"{ex.text}"</p>
              </li>
            ))}
          </ul>
        </section>
      </>
    );
  }