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
    tagline: "AI for the whole business, front desk to back office.",
    description:
      "I help Austin businesses put AI to work: answering customers, chasing quotes, drafting invoices, keeping the schedule, reporting the numbers. Built and run by Ronald Barnhart.",
  },

  person: {
    name: "Ronald Barnhart",
    firstName: "Ronald",
    initials: "RB",
    title: "Founder, AI Baker",
    location: "Austin, TX",
    // Local copy of Ronald's LinkedIn photo; keep the full square composition.
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
    eyebrow: "Austin, TX · AI for local businesses",
    headline: ["Put AI to work", "in your business."],
    sub: "Not a chatbot bolted onto your website. I wire AI into how your business actually runs: the phone, the inbox, the quotes, the invoices, the schedule, the numbers. The busywork gets done. You run the business.",
    trust: "Built and run by one Austin engineer. No agency, no handoffs, no offshore team.",
  },

  pain: {
    heading: "You're the bottleneck, and you know it.",
    body: "Every quote, invoice, follow-up, schedule change, and month-end number runs through you or someone you pay to push paper. Customers wait on you. Money waits on you. The tools that were supposed to help just gave you more tabs to check. Meanwhile the businesses using AI well are quoting faster, collecting sooner, and answering every call.",
    points: [
      {
        title: "Nights spent on paperwork",
        text: "Quotes, invoices, and follow-ups get done after hours, or don't get done.",
      },
      {
        title: "Customers waiting on you",
        text: "Missed calls, slow replies, and quotes that go quiet cost you jobs you already paid to win.",
      },
      {
        title: "Numbers you find out about late",
        text: "Cash, margin, and what's stuck in the pipeline shouldn't be a surprise at tax time.",
      },
    ],
  },

  automate: {
    heading: "Where AI goes to work",
    sub: "Two sides to every business. I automate both, and they talk to each other.",
    groups: [
      {
        key: "front",
        title: "Front of house",
        blurb: "Everything a customer touches.",
        items: [
          { title: "Calls answered, missed calls texted back", text: "Within seconds, in your voice, 24/7. Books the appointment while you're busy." },
          { title: "Inbox and lead replies", text: "Quotes questions, product questions, 'are you open Saturday?' answered on their own. Escalates the rest to you." },
          { title: "Quote and estimate follow-up", text: "Chases every open quote until it's won, lost, or expired. No spreadsheet of who to call back." },
          { title: "Reminders and reviews", text: "Appointment reminders, no-show recovery, and review requests after every finished job." },
        ],
      },
      {
        key: "back",
        title: "Back office",
        blurb: "Everything that happens after the customer says yes.",
        items: [
          { title: "Quotes and invoices drafted for you", text: "From a voice note, site photos, or job notes. You review and send, or let it send." },
          { title: "Scheduling and dispatch", text: "Jobs land on the calendar, crews or staff get their day on their phone, rain and cancellations get rebalanced." },
          { title: "Bookkeeping busywork", text: "Receipts matched to jobs, supplier bills filed, payments reconciled. No double entry." },
          { title: "Numbers in plain English", text: "A weekly note on revenue, margin, cash, and what's stuck, with where each figure came from." },
        ],
      },
    ],
  },

  steps: {
    heading: "How it works",
    sub: "Three steps. The first one is a 20-minute call.",
    items: [
      {
        n: "01",
        title: "I map where the hours go",
        text: "We talk for twenty minutes, then I spend a week watching how work actually flows through your business: what comes in, who touches it, where it stalls. You get a written plan with the automations ranked by payoff.",
      },
      {
        n: "02",
        title: "I build it into your tools",
        text: "Your phone number, inbox, calendar, invoicing, and spreadsheets stay. I connect AI to them so the work gets done where it already lives. If a tool is missing, I set one up.",
      },
      {
        n: "03",
        title: "I run it and report",
        text: "Automations break when nobody owns them. I own them. Each month you get a plain-English report: what ran, what it saved, what's next.",
      },
    ],
  },

  proof: {
    heading: "I've already built this. Twice.",
    sub: "These aren't slide decks. They're live products running real businesses every day, and they're the same engine I set up for you.",
    // TODO: record a 60-second screen capture of the AI doing real work (booking a call, drafting an invoice)
    // and paste the embed URL here to show it above the case studies.
    demoVideoUrl: null as string | null,
    cases: [
      {
        name: "CrewOS",
        url: "https://crewos.site",
        logo: "/apps/crewos.png",
        kicker: "A whole business backend, with AI doing the busywork",
        headline: "Lead to quote to schedule to invoice to payroll, in one system",
        body: "I built the entire operating system a service business runs on. Leads from ads, the website, and the phone land in one pipeline with what each one cost. Quotes go out by text and get signed on a phone. Jobs get scheduled and dispatched. Invoices go out from the field. Crews get paid from the same data. An AI assistant drafts replies, chases quiet leads, and answers questions about the numbers.",
        outcomes: [
          "Every lead, quote, job, and dollar in one place",
          "Quotes sent in minutes, signed from a phone",
          "Automatic text and email follow-up on every open quote",
          "AI that drafts, chases, and explains the numbers. You approve, it executes",
        ],
        accent: "ember" as const,
      },
      {
        name: "stanly.io",
        url: "https://stanly.io",
        logo: "/apps/stanly.png",
        kicker: "AI handling customer conversations at scale",
        headline: "Thousands of customer emails a day, answered and closed by AI",
        body: "When a shopper walks away from an online store, Stanly's AI agents email them, answer objections, look up products and orders, issue a discount if it makes sense, and bring them back to checkout. Every reply is drafted, reviewed by a second AI pass for tone and accuracy, then sent. No human in the loop unless one is needed.",
        outcomes: [
          "Reads and replies to real customer emails on its own",
          "Looks up orders and products, applies discounts, all inside the conversation",
          "Self-checks every message before it goes out",
          "The same brain I point at your phone and inbox",
        ],
        accent: "ink" as const,
      },
    ],
  },

  offer: {
    heading: "One engineer. One flat monthly rate.",
    sub: "No per-seat pricing, no per-call fees, no six-month contract. I find the hours, automate them, and keep it running.",
    name: "AI Operations Retainer",
    // TODO: set the real number, e.g. "$2,500/mo". While null the card says the rate is quoted on the call.
    price: null as string | null,
    setupNote: "First automations live within two weeks. Month-to-month, cancel anytime.",
    includes: [
      "A written map of where your hours go and what to automate first",
      "Customer-facing AI: calls, texts, inbox, quote follow-up, reviews",
      "Back-office AI: quotes, invoices, scheduling, bookkeeping busywork",
      "Works with the phone number, calendar, and tools you already have",
      "A weekly plain-English numbers note, a monthly report of what it saved",
      "Ongoing changes as your business changes, no change orders",
      "Me, by text, when something needs a human",
    ],
    // TODO (your call, not mine): a guarantee converts well but it's a business commitment.
    // Example: "If it hasn't saved you real hours in the first 30 days, month two is free." Hidden while null.
    guarantee: null as string | null,
  },

  about: {
    heading: "Who you'd be working with",
    paragraphs: [
      "I'm Ronald. I've been building software for over eight years, at S&P Global, BambooHR, and a handful of my own companies. The last few of those were AI products that do real work on their own: reading and answering customer email, recovering sales, quoting, scheduling, and keeping the books straight.",
      "I live in Austin. I've watched good local businesses run on late nights, sticky notes, and an owner who can't take a day off. That's fixable now, and I fix it with the same systems I run in my own products.",
      "You won't get an account manager or a sales rep. You'll get me, my number, and a system that does the work.",
    ],
    facts: [
      { label: "Based in", value: "Austin, TX" },
      { label: "Building software", value: "8+ years" },
      { label: "Previously", value: "S&P Global, BambooHR" },
      { label: "Works with", value: "Contractors, clinics, salons, shops, studios, agencies. Anyone with a phone and a back office." },
    ],
  },

  // TODO: add 2 or 3 real quotes from customers. The section stays hidden while this is empty.
  testimonials: [] as Array<{
    quote: string;
    name: string;
    business: string;
    location?: string;
  }>,

  games: {
    heading: "I also ship games.",
    sub: "Mobile games are the hardest software to ship: app-store review, sixty frames a second, players who leave the second something feels off. Same discipline goes into the systems I build for your business.",
    // Official App Store icons, stored locally at public/games/<slug>.png (512px square).
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

  faq: {
    heading: "Questions owners ask",
    items: [
      {
        q: "What can AI actually do in the back office?",
        a: "Anything that's a repeatable decision on top of information you already have. Draft the invoice from the job notes. Match the receipt to the job. Move Thursday's appointments when it rains. Write the weekly numbers note. It won't sign checks or make judgment calls; it does the ninety percent that isn't one.",
      },
      {
        q: "Will customers know they're talking to AI?",
        a: "Yes. It introduces itself as your assistant and never pretends to be you. Customers care that they got a fast, useful reply, not who typed it.",
      },
      {
        q: "What happens when it can't handle something?",
        a: "It says so, tells the customer you'll follow up, and texts you the full context. You reply once and it picks the thread back up. Same for back-office work: anything uncertain lands in a review queue instead of going out.",
      },
      {
        q: "Do I need new software?",
        a: "Usually not. It works with the phone number, calendar, inbox, and invoicing you already use. If something's missing, I set it up as part of the install.",
      },
      {
        q: "Is this only for contractors?",
        a: "No. Contractors are where I started, because I built a whole platform for them. But a clinic, salon, shop, or agency has the same shape: a phone that rings, quotes or bookings to chase, invoices to send, numbers to understand.",
      },
      {
        q: "What does it cost?",
        a: "A flat monthly rate, no per-seat or per-call fees. Book a call and I'll quote it once I know what you want automated.",
      },
    ],
  },

  contact: {
    heading: "Book a 20-minute call",
    sub: "Tell me a little about your business and where the hours go. I'll come back with a plan and a price. Or skip the form and just call or text.",
    success: "Got it. I'll text or email you within one business day.",
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
