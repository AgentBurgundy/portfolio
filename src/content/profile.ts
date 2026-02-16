export const profile = {
  name: "Ronald Barnhart",
  role: "Product Engineer",
  location: "Austin, TX",
  links: {
    github: "https://github.com/AgentBurgundy?tab=repositories",
    firesaasRepo: "https://github.com/AgentBurgundy/fire-saas",
    vldt: "https://www.vldt.ai/",
    wellspring:
      "https://apps.apple.com/us/app/wellspring-daily-devotionals/id6741737201",
    practiceInterview: "https://practiceinterview.ai/",
    firesaas: "https://firesaas.dev/",
    stanly: "https://stanly.io/",
    website: "https://aibaker.io",
    resume: "/Ronald Barnhart - Resume.pdf",
  },
  highlights: [
    "Customer-facing apps with premium UX",
    "Greenfield 0→1 builds (fast iteration, clean foundations)",
    "Full-stack TypeScript: React + Node + Postgres",
  ],
  featuredProjects: [
    {
      name: "Validate AI (vldt.ai)",
      tagline: "Validate SaaS ideas in minutes with AI",
      kind: "Web app",
      stack: ["TypeScript", "React", "AI", "Product"],
      url: "https://www.vldt.ai/",
      previewImage: "/previews/vldt.png",
      note: "Built end-to-end: product UX, landing flow, and the “ship it” pipeline.",
    },
    {
      name: "FireSaaS (firesaas.dev)",
      tagline: "Open-source framework for Next.js + Firebase apps",
      kind: "Open source",
      stack: ["Next.js", "Firebase", "TypeScript", "SaaS"],
      url: "https://firesaas.dev/",
      previewImage: "/previews/firesaas.png",
      repoUrl: "https://github.com/AgentBurgundy/fire-saas",
      note: "Framework + boilerplate to ship SaaS apps quickly with modern defaults and clean structure.",
    },
    {
      name: "PracticeInterview.ai",
      tagline: "AI mock interviews with your real voice",
      kind: "Web app",
      stack: ["TypeScript", "AI", "Whisper", "ChatGPT"],
      url: "https://practiceinterview.ai/",
      previewImage: "/previews/practiceinterview.png",
      note: "Mock interview platform using voice input (Whisper) so users can answer questions naturally and practice under real conditions.",
    },
    {
      name: "Vericuda Training (training.vericuda.com)",
      tagline: "E-learning platform for manufacturing employees (contract)",
      kind: "Web app",
      stack: ["React", "TypeScript", "Customer-facing", "E-learning"],
      url: "https://training.vericuda.com",
      previewImage: "/previews/vericuda-training.png",
      note: "Contract build for Vericuda: training experience for manufacturing teams with a clean, practical UX.",
    },
    {
      name: "Wellspring",
      tagline: "Daily devotionals (React Native, iOS + Android)",
      kind: "Mobile app",
      stack: ["React Native", "TypeScript", "Mobile", "Subscriptions"],
      url: "https://apps.apple.com/us/app/wellspring-daily-devotionals/id6741737201",
      previewImage: "/previews/wellspring.png",
      note: "Cross-platform experience with a calm, polished interface and strong iteration cadence.",
    },
    {
      name: "Stanly (stanly.io)",
      tagline: "Founder-style abandoned cart recovery",
      kind: "Web app",
      stack: ["React", "TypeScript", "Customer-facing", "Landing"],
      url: "https://stanly.io/",
      previewImage: "/previews/stanly.png",
      note: "Customer-facing landing + product positioning for Stanly. Built to convert and communicate clearly.",
    },
  ],
} as const;

export const resumeData = {
  name: "Ronald Barnhart",
  title: "Senior Product Engineer (0→1, AI, & Mobile)",
  location: "Austin, TX",
  phone: "(330) 814-4605",
  email: "ronald@aibaker.io",
  linkedin: "linkedin.com/in/ronaldbarnhart",
  github: "github.com/AgentBurgundy",
  website: "aibaker.io",

  summary:
    "Senior Product Engineer with 8+ years of experience specializing in greenfield (0→1) development and shipping user-centric products. A full-stack builder (React/Node/Postgres) who moves fast, sweats the UX details, and builds high-scale systems. Proven ability to architect event-driven backends processing millions of daily requests while delivering intuitive, premium frontend experiences.",

  featuredShipments: [
    {
      name: "Stanly.io",
      role: "Founder & Lead Engineer",
      mission: "Automated, agent-led abandoned cart recovery for e-commerce.",
      bullets: [
        "Agentic Architecture: Engineered an autonomous agent workflow that processes incoming email replies using a ReAct (Reason + Act) pattern.",
        "Tool Use & Orchestration: Built a system where the agent autonomously executes Shopify API calls (product lookups, dynamic discount generation) to resolve customer objections without human intervention.",
        'Self-Correction: Implemented a multi-step "Draft-Review-Send" pipeline where a secondary LLM layer audits drafted responses for tone and accuracy before delivery.',
        "Scale: Handles a high-throughput event pipeline processing millions of webhooks and thousands of automated agent interactions daily.",
      ],
    },
    {
      name: "vldt.ai (Validate AI)",
      role: "Founder & Lead Engineer",
      mission: "Automate the startup validation process using Generative AI.",
      bullets: [
        "Build: Engineered a full-stack engine that ingests user ideas and autonomously generates comprehensive design docs, competitor analyses, and landing page flows.",
        "Tech: Next.js, OpenAI API (Chain-of-Thought prompting), Postgres, Tailwind.",
      ],
    },
    {
      name: "Wellspring",
      role: "Mobile Developer",
      mission: "A consumer-facing React Native app for iOS and Android.",
      bullets: [
        "Build: Shipped a calm, high-performance mobile experience with a focus on smooth animations, offline-first capabilities, and fast iteration cycles based on real user feedback.",
        "Tech: React Native, Expo, Node.js backend.",
      ],
    },
    {
      name: "PracticeInterview.ai",
      role: "Product Engineer",
      mission:
        "Create a realistic interview simulator using voice-to-voice AI.",
      bullets: [
        "Build: Integrated OpenAI Whisper for real-time speech transcription and GPT-4 for dynamic context generation, achieving a conversational latency of <800ms.",
        'UX: Designed a seamless "hands-free" user interface that mimics the pressure and flow of a real interview environment.',
      ],
    },
  ],

  experience: [
    {
      title: "Senior Front End Software Engineer",
      company: "BambooHR",
      location: "Austin, TX (Remote)",
      when: "May 2022 – Present",
      bullets: [
        "Lead engineer on critical customer-facing HR workflows. Focused on high-fidelity UX implementation and performance, reducing load times by 25% through code-splitting and asset optimization.",
        'Spearheaded the internal adoption of AI tools (Copilot, Cursor), creating a "bias for action" culture that increased shipping velocity across the team.',
        "Architected reusable UI primitives and component libraries that ensure design consistency across a massive enterprise application.",
      ],
    },
    {
      title: "Senior Software Engineer",
      company: "Tensure Consulting",
      location: "Austin, TX",
      when: "May 2021 – May 2022",
      bullets: [
        "Acted as the technical lead for 0→1 enterprise builds. Translated ambiguous client needs into concrete technical specs and shipped full-stack solutions on Google Cloud.",
        "Established CI/CD pipelines and code quality standards, mentoring junior engineers on writing clean, reliable TypeScript.",
      ],
    },
    {
      title: "Software Engineer II",
      company: "S&P Global Market Intelligence",
      location: "Richmond, VA",
      when: "Dec 2018 – May 2021",
      bullets: [
        "Built complex, high-performance financial charting tools using D3.js and React for high-volume data feeds.",
        "Implemented end-to-end testing strategies (Cypress) that improved deployment confidence and reduced regression bugs by 40%.",
      ],
    },
    {
      title: "Software Developer",
      company: "Hyland",
      location: "Westlake, OH",
      when: "Jun 2017 – Nov 2018",
      bullets: [
        "Contributed to enterprise content management systems, building automation frameworks that reduced manual testing time by 50%.",
      ],
    },
  ],

  skills: {
    "Core Stack": [
      "TypeScript",
      "JavaScript (ES6+)",
      "React",
      "Next.js (App Router)",
      "Node.js",
      "HTML/CSS",
    ],
    "Scale & Infra": [
      "Redis (BullMQ)",
      "PostgreSQL",
      "Google Cloud (Pub/Sub)",
      "Docker",
      "Terraform",
      "Serverless functions",
    ],
    Mobile: ["React Native", "Expo", "iOS/Android deployment"],
    "AI Engineering": [
      "OpenAI API (GPT-4, Whisper)",
      "LangChain",
      "Vector Embeddings",
      "Prompt Engineering",
    ],
    Tools: ["Git", "GitHub Actions", "Figma (Design Systems)", "Vercel"],
  },
} as const;
