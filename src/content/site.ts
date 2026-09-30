/**
 * Every word on aibaker.io lives here. Edit copy, pricing, and links in this
 * file; the components only lay it out.
 *
 * Things to fill in before launch are marked with `TODO`.
 */

export const site = {
  brand: {
    name: "AI Baker",
    domain: "aibaker.io",
    tagline: "Missed calls into booked jobs for Austin contractors.",
    description:
      "AI that answers, texts back, and books the job for Austin contractors and local businesses. Built and run by Ronald Barnhart.",
  },

  person: {
    name: "Ronald Barnhart",
    firstName: "Ronald",
    initials: "RB",
    title: "Founder, AI Baker",
    location: "Austin, TX",
    // TODO: drop a real headshot at public/ronald.jpg (square, ~800px). Falls back to initials until then.
    photo: "/ronald.jpg",
    phone: "(330) 814-4605",
    phoneHref: "tel:+13308144605",
    email: "ronald@aibaker.io",
    linkedin: "https://linkedin.com/in/ronaldbarnhart",
  },

  cta: {
    primary: "Book a 20-min call",
    // TODO: point this at a Calendly/Cal.com/Google appointment link once one exists.
    // Until then it scrolls to the form at the bottom of the page.
    bookingUrl: "#contact",
  },

  hero: {
    eyebrow: "Austin, TX · AI for contractors and local businesses",
    headline: ["Missed calls become", "booked jobs."],
    sub: "I help Austin contractors and local businesses answer every call, text back in seconds, and book the job with AI. It works 24/7, while you're on a roof, under a sink, or with a client.",
    trust: "Built and run by one Austin engineer. No agency, no handoffs, no call center.",
  },

  pain: {
    heading: "Every missed call is a job you paid for and didn't get.",
    body: "You ran the ads. The homeowner found you on Google. They called at 2:14 on a Tuesday, you were on a ladder, and by the time you called back they'd booked the next guy. That happens all day, every day, and nobody on your crew is going to fix it.",
    points: [
      {
        title: "Calls go to voicemail",
        text: "Most people won't leave one. They just call the next name on the list.",
      },
      {
        title: "Quotes sit unanswered",
        text: "You send the estimate, they go quiet, and nobody has time to chase it.",
      },
      {
        title: "After 6 PM, you're closed",
        text: "Storm damage and burst pipes don't keep business hours. Your phone should.",
      },
    ],
  },

  steps: {
    heading: "How it works",
    sub: "Three things happen the moment a call goes unanswered. None of them need you.",
    items: [
      {
        n: "01",
        title: "It texts back in seconds",
        text: "The caller gets a text from your business within seconds of hanging up, in your voice, introduced as your assistant. Not a bot script. A real conversation.",
      },
      {
        n: "02",
        title: "It qualifies and books",
        text: "It asks the questions you'd ask: what's wrong, where, how soon. Then it offers real openings from your calendar and books the job. You get a text with the details.",
      },
      {
        n: "03",
        title: "It follows up until it's won",
        text: "Open quotes get chased. Appointments get reminders. Finished jobs get a review request. You approve the tone once, it runs every time.",
      },
    ],
  },

  proof: {
    heading: "I've already built this. Twice.",
    sub: "These aren't slide decks. They're live products handling real customers every day, and the same engine is what I set up for you.",
    // TODO: record a 60-second screen capture of the AI taking a call and booking a job,
    // upload it (YouTube unlisted / Mux / Loom), and paste the embed URL here to show it above the case studies.
    demoVideoUrl: null as string | null,
    cases: [
      {
        name: "CrewOS",
        url: "https://crewos.site",
        kicker: "Built for a concrete contractor. Now runs any trade.",
        headline: "Lead to signed quote to paid invoice, all from the truck",
        body: "I built the entire operating system a contractor business runs on: every lead from ads, the website, and the phone lands in one pipeline, quotes go out by text and get signed on the customer's phone, and open quotes get chased by automated text and email until they're won or lost. Crews see their day on their phones. Invoices go out from the driveway.",
        outcomes: [
          "Leads from Facebook, Google, and phone in one place, with what each one cost",
          "Quotes sent in minutes, signed from a phone",
          "Automatic text and email follow-up on every open quote",
          "An AI assistant that drafts replies and chases quiet leads",
        ],
        accent: "ember" as const,
      },
      {
        name: "stanly.io",
        url: "https://stanly.io",
        kicker: "AI that closes the sale for online stores",
        headline: "Thousands of customer conversations a day, handled by AI",
        body: "When a shopper walks away from a cart, Stanly's AI agents email them, answer their objections, look up products, issue a discount if it makes sense, and bring them back to checkout. Every reply is drafted, reviewed by a second AI pass for tone and accuracy, then sent. No human in the loop unless one is needed.",
        outcomes: [
          "Reads and replies to real customer emails on its own",
          "Looks up orders and products, applies discounts, all inside the conversation",
          "Self-checks every message before it goes out",
          "Same brain I point at your missed calls",
        ],
        accent: "ink" as const,
      },
    ],
  },

  offer: {
    heading: "One system. One flat monthly rate.",
    sub: "No per-minute pricing, no seats, no six-month contract. I set it up, I run it, you get the jobs.",
    name: "Missed-Call Recovery System",
    // TODO: set the real number, e.g. "$1,500/mo". While null the card says the rate is quoted on the call.
    price: null as string | null,
    setupNote: "Live within two weeks. Month-to-month, cancel anytime.",
    includes: [
      "Instant text-back on every missed call, 24/7",
      "AI voice answering after hours and when you can't pick up",
      "Booking straight into your calendar or CRM",
      "Quote follow-up, appointment reminders, and review requests",
      "Works with your existing phone number and tools",
      "A monthly report: calls caught, jobs booked, revenue recovered",
      "Me, by text, when something needs a human",
    ],
    // TODO (your call, not mine): a guarantee converts well but it's a business commitment.
    // Example: "If it isn't booking jobs in the first 30 days, month two is free." Hidden while null.
    guarantee: null as string | null,
  },

  about: {
    heading: "Who you'd be working with",
    paragraphs: [
      "I'm Ronald. I've been building software for over eight years, at S&P Global, BambooHR, and a handful of my own companies. The last few of those were AI products that talk to customers on their own: reading emails, answering questions, recovering sales, booking work.",
      "I live in Austin. I've watched good contractors lose jobs they'd already paid to get, because the phone rang while they were working. That's a fixable problem, and I fix it with the same systems I run in my own products.",
      "You won't get an account manager or a sales rep. You'll get me, my number, and a system that picks up when you can't.",
    ],
    facts: [
      { label: "Based in", value: "Austin, TX" },
      { label: "Building software", value: "8+ years" },
      { label: "Previously", value: "S&P Global, BambooHR" },
      { label: "Works with", value: "Roofers, plumbers, HVAC, concrete, salons, clinics" },
    ],
  },

  // TODO: add 2 or 3 real quotes from customers. The section stays hidden while this is empty.
  testimonials: [] as Array<{
    quote: string;
    name: string;
    business: string;
    location?: string;
  }>,

  faq: {
    heading: "Questions owners ask",
    items: [
      {
        q: "Will customers know they're talking to AI?",
        a: "Yes. It introduces itself as your assistant and never pretends to be you. Customers care that they got a fast, useful reply, not who typed it.",
      },
      {
        q: "What happens when it can't answer something?",
        a: "It says so, tells the customer you'll follow up, and texts you the full conversation. You reply once and it picks the thread back up.",
      },
      {
        q: "Do I need to change my phone number or software?",
        a: "No. It works with the number you already have and the calendar or CRM you already use. If you don't have one, I'll set one up as part of the install.",
      },
      {
        q: "How long does setup take?",
        a: "Most businesses are live within two weeks. The first week is me learning how you talk to customers and what you need to know before booking. The second is testing with real calls.",
      },
      {
        q: "Is this only for contractors?",
        a: "No. If your business loses money when the phone goes unanswered, this works: roofers, plumbers, HVAC, concrete, fencing, salons, med spas, dental, auto shops.",
      },
      {
        q: "What does it cost?",
        a: "A flat monthly rate, no per-call fees. Book a call and I'll quote it on the spot once I know your call volume.",
      },
    ],
  },

  contact: {
    heading: "Book a 20-minute call",
    sub: "Tell me a little about your business and I'll come back with a plan and a price. Or skip the form and just call or text.",
    success: "Got it. I'll text or email you within one business day.",
  },

  games: {
    heading: "I also ship games.",
    sub: "Mobile games are the hardest software to ship: app-store review, sixty frames a second, players who leave the second something feels off. Same discipline goes into the systems I build for your business.",
    // TODO: drop each app's icon at public/games/<slug>.png (square, 512px). Cards show a styled initial until then.
    items: [
      {
        slug: "cloudhop",
        name: "CLOUDHOP",
        blurb: "Bunny Adventure · iOS",
        url: "https://apps.apple.com/us/app/cloudhop-bunny-adventure/id6813691757" as string | null,
        hue: "sky" as const,
      },
      {
        slug: "emberbound",
        name: "Emberbound",
        blurb: "Endless Descent · iOS",
        url: "https://apps.apple.com/us/app/emberbound-endless-descent/id6811690793" as string | null,
        hue: "ember" as const,
      },
      {
        slug: "wrong-turn-factory",
        name: "Wrong Turn Factory",
        blurb: "iOS",
        url: "https://apps.apple.com/us/app/wrong-turn-factory/id6811652960" as string | null,
        hue: "moss" as const,
      },
    ],
  },

  footer: {
    otherWork: [
      { name: "vldt.ai", url: "https://www.vldt.ai/" },
      { name: "practiceinterview.ai", url: "https://practiceinterview.ai/" },
      { name: "firesaas.dev", url: "https://firesaas.dev/" },
    ],
    github: "https://github.com/AgentBurgundy",
  },
} as const;

export type CaseStudy = (typeof site.proof.cases)[number];
