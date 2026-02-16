// Load .env locally if available (safe in production).
// In production builds (e.g. Docker runner stage) we don't ship node_modules,
// so this must not hard-fail.
try {
  await import("dotenv/config");
} catch {
  // no-op
}

import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, "dist");
const port = Number(process.env.PORT || 3000);
const host = "0.0.0.0";
const resendApiKey = process.env.RESEND_API_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;
const contactEmail =
  process.env.CONTACT_EMAIL || "professional.burgundy@gmail.com";
const resendFrom =
  process.env.RESEND_FROM || "Portfolio Contact <onboarding@resend.dev>";

const contentType = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8",
  ".woff2": "font/woff2",
};

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

const RESUME_SYSTEM_PROMPT = `You are a resume tailoring expert. You will receive Ronald Barnhart's full resume and a job description. Your job is to tailor his resume to maximize relevance for the specific role while remaining truthful — do not fabricate experience, skills, or accomplishments.

Here is Ronald's full resume:

---
Ronald Barnhart
Senior Product Engineer (0→1, AI, & Mobile)
Austin, TX | (330) 814-4605 | ronald@aibaker.io
linkedin.com/in/ronaldbarnhart | github.com/AgentBurgundy | aibaker.io

Professional Summary:
Senior Product Engineer with 8+ years of experience specializing in greenfield (0→1) development and shipping user-centric products. A full-stack builder (React/Node/Postgres) who moves fast, sweats the UX details, and builds high-scale systems. Proven ability to architect event-driven backends processing millions of daily requests while delivering intuitive, premium frontend experiences.

Featured Shipments (Projects):

Stanly.io | Founder & Lead Engineer
Mission: Automated, agent-led abandoned cart recovery for e-commerce.
- Agentic Architecture: Engineered an autonomous agent workflow that processes incoming email replies using a ReAct (Reason + Act) pattern.
- Tool Use & Orchestration: Built a system where the agent autonomously executes Shopify API calls (product lookups, dynamic discount generation) to resolve customer objections without human intervention.
- Self-Correction: Implemented a multi-step "Draft-Review-Send" pipeline where a secondary LLM layer audits drafted responses for tone and accuracy before delivery.
- Scale: Handles a high-throughput event pipeline processing millions of webhooks and thousands of automated agent interactions daily.

vldt.ai (Validate AI) | Founder & Lead Engineer
Mission: Automate the startup validation process using Generative AI.
- Build: Engineered a full-stack engine that ingests user ideas and autonomously generates comprehensive design docs, competitor analyses, and landing page flows.
- Tech: Next.js, OpenAI API (Chain-of-Thought prompting), Postgres, Tailwind.

Wellspring | Mobile Developer
Mission: A consumer-facing React Native app for iOS and Android.
- Build: Shipped a calm, high-performance mobile experience with a focus on smooth animations, offline-first capabilities, and fast iteration cycles based on real user feedback.
- Tech: React Native, Expo, Node.js backend.

PracticeInterview.ai | Product Engineer
Mission: Create a realistic interview simulator using voice-to-voice AI.
- Build: Integrated OpenAI Whisper for real-time speech transcription and GPT-4 for dynamic context generation, achieving a conversational latency of <800ms.
- UX: Designed a seamless "hands-free" user interface that mimics the pressure and flow of a real interview environment.

Professional Experience:

BambooHR | Senior Front End Software Engineer | Austin, TX (Remote) | May 2022 – Present
- Product Impact: Lead engineer on critical customer-facing HR workflows. Focused on high-fidelity UX implementation and performance, reducing load times by 25% through code-splitting and asset optimization.
- Developer Experience: Spearheaded the internal adoption of AI tools (Copilot, Cursor), creating a "bias for action" culture that increased shipping velocity across the team.
- Systems Scale: Architected reusable UI primitives and component libraries that ensure design consistency across a massive enterprise application.

Tensure Consulting | Senior Software Engineer | Austin, TX | May 2021 – May 2022
- Greenfield Architecture: Acted as the technical lead for 0→1 enterprise builds. Translated ambiguous client needs into concrete technical specs and shipped full-stack solutions on Google Cloud.
- Mentorship: Established CI/CD pipelines and code quality standards, mentoring junior engineers on writing clean, reliable TypeScript.

S&P Global Market Intelligence | Software Engineer II | Richmond, VA | Dec 2018 – May 2021
- Data Visualization: Built complex, high-performance financial charting tools using D3.js and React for high-volume data feeds.
- Reliability: Implemented end-to-end testing strategies (Cypress) that improved deployment confidence and reduced regression bugs by 40%.

Hyland | Software Developer | Westlake, OH | Jun 2017 – Nov 2018
- Contributed to enterprise content management systems, building automation frameworks that reduced manual testing time by 50%.

Technical Skills:
- Core Stack: TypeScript, JavaScript (ES6+), React, Next.js (App Router), Node.js, HTML/CSS.
- Scale & Infra: Redis (BullMQ), PostgreSQL, Google Cloud (Pub/Sub), Docker, Terraform, Serverless functions.
- Mobile: React Native, Expo, iOS/Android deployment.
- AI Engineering: OpenAI API (GPT-4, Whisper), LangChain, Vector Embeddings, Prompt Engineering.
- Tools: Git, GitHub Actions, Figma (Design Systems), Vercel.
---

Instructions:
1. Rewrite the professional summary to highlight the aspects most relevant to the target job.
2. Reorder and selectively emphasize featured shipments that are most relevant. Include 2-4 shipments. Adjust bullet points to emphasize relevant skills.
3. Rewrite experience bullets to emphasize skills and achievements most relevant to the job. Keep all 4 positions but adjust emphasis.
4. Reorder and emphasize skills most relevant to the role.
5. Keep all content truthful — you may rephrase, reorder, and emphasize, but never invent.

Return a JSON object with this exact structure:
{
  "summary": "tailored professional summary string",
  "featuredShipments": [
    {
      "name": "Project Name",
      "role": "Role Title",
      "mission": "One-line mission",
      "bullets": ["bullet 1", "bullet 2"]
    }
  ],
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "location": "City, State",
      "when": "Date Range",
      "bullets": ["bullet 1", "bullet 2"]
    }
  ],
  "skills": {
    "Category Name": ["skill1", "skill2"]
  }
}

Return ONLY the JSON object, no markdown formatting or extra text.`;

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(
      req.url || "/",
      `http://${req.headers.host || "localhost"}`,
    );
    const pathname = decodeURIComponent(url.pathname);

    // Small health endpoint for debugging
    if (pathname === "/api/health" && req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          ok: true,
          port,
          resendConfigured: Boolean(resendApiKey),
          contactEmail,
          resendFrom,
        }),
      );
      return;
    }

    // API endpoint for contact form (supports OPTIONS + POST)
    if (pathname === "/api/contact") {
      // CORS (safe defaults; keeps dev/proxy + prod happy)
      const origin = req.headers.origin;
      res.setHeader("Access-Control-Allow-Origin", origin || "*");
      res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.setHeader("Access-Control-Max-Age", "86400");

      if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
      }

      if (req.method !== "POST") {
        res.writeHead(405, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ success: false, message: "Method Not Allowed" }),
        );
        return;
      }

      if (!resendApiKey) {
        // eslint-disable-next-line no-console
        console.warn(
          "RESEND_API_KEY not set. Contact form will not send emails.",
        );
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            success: false,
            message:
              "Contact form is not configured. Please set RESEND_API_KEY in your .env file.",
          }),
        );
        return;
      }

      try {
        const raw = await readBody(req, 200_000);
        let data;
        try {
          data = JSON.parse(raw || "{}");
        } catch {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ success: false, message: "Invalid JSON body" }),
          );
          return;
        }

        // Validate required fields
        if (!data.name || !data.email || !data.message) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              success: false,
              message: "Missing required fields",
            }),
          );
          return;
        }

        // Proxy request to Resend
        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: resendFrom,
            to: [contactEmail],
            reply_to: data.email,
            subject: `Portfolio Contact: ${data.name}`,
            html: `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
              <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
              <h3>Message:</h3>
              <p>${escapeHtml(data.message).replace(/\n/g, "<br>")}</p>
            `,
            text: `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}

Message:
${data.message}
            `.trim(),
          }),
        });

        if (!resendResponse.ok) {
          const errorJson = await resendResponse.json().catch(() => null);
          const errorText = errorJson
            ? null
            : await resendResponse.text().catch(() => null);
          const errorMessage =
            errorJson?.message ||
            errorJson?.error?.message ||
            errorJson?.error ||
            errorText ||
            `Failed to send email (${resendResponse.status})`;

          // eslint-disable-next-line no-console
          console.error("Resend API error:", {
            status: resendResponse.status,
            statusText: resendResponse.statusText,
            error: errorJson || errorText,
          });

          res.writeHead(502, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: false, message: errorMessage }));
          return;
        }

        const resendResult = await resendResponse.json().catch(() => ({}));
        // eslint-disable-next-line no-console
        console.log("Email sent successfully:", resendResult);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            success: true,
            message: "Message sent successfully! I'll get back to you soon.",
          }),
        );
        return;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Contact API error:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            success: false,
            message:
              err instanceof Error
                ? err.message
                : "Server error processing request",
          }),
        );
        return;
      }
      return;
    }

    // API endpoint for resume generation
    if (pathname === "/api/resume/generate") {
      const origin = req.headers.origin;
      res.setHeader("Access-Control-Allow-Origin", origin || "*");
      res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.setHeader("Access-Control-Max-Age", "86400");

      if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
      }

      if (req.method !== "POST") {
        res.writeHead(405, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ success: false, message: "Method Not Allowed" }),
        );
        return;
      }

      if (!openaiApiKey) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            success: false,
            message: "OPENAI_API_KEY is not configured.",
          }),
        );
        return;
      }

      try {
        const raw = await readBody(req, 500_000);
        let data;
        try {
          data = JSON.parse(raw || "{}");
        } catch {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ success: false, message: "Invalid JSON body" }),
          );
          return;
        }

        if (!data.jobDescription || typeof data.jobDescription !== "string") {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              success: false,
              message: "Missing jobDescription field",
            }),
          );
          return;
        }

        const openaiResponse = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${openaiApiKey}`,
            },
            body: JSON.stringify({
              model: "gpt-4o",
              temperature: 0.7,
              response_format: { type: "json_object" },
              messages: [
                {
                  role: "system",
                  content: RESUME_SYSTEM_PROMPT,
                },
                {
                  role: "user",
                  content: `Here is the job description I'm applying for:\n\n${data.jobDescription}`,
                },
              ],
            }),
          },
        );

        if (!openaiResponse.ok) {
          const errBody = await openaiResponse.text().catch(() => "");
          // eslint-disable-next-line no-console
          console.error("OpenAI API error:", openaiResponse.status, errBody);
          res.writeHead(502, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              success: false,
              message: `OpenAI API error (${openaiResponse.status})`,
            }),
          );
          return;
        }

        const openaiResult = await openaiResponse.json();
        const content = openaiResult.choices?.[0]?.message?.content;
        if (!content) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              success: false,
              message: "No content in OpenAI response",
            }),
          );
          return;
        }

        let resume;
        try {
          resume = JSON.parse(content);
        } catch {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              success: false,
              message: "Failed to parse AI response as JSON",
            }),
          );
          return;
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, resume }));
        return;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Resume API error:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            success: false,
            message:
              err instanceof Error
                ? err.message
                : "Server error processing request",
          }),
        );
        return;
      }
    }

    // basic security hardening for path traversal
    if (pathname.includes("..")) {
      res.writeHead(400);
      res.end("Bad Request");
      return;
    }

    // static file resolution
    const requested = pathname === "/" ? "/index.html" : pathname;
    const candidate = path.join(distDir, requested);

    if (await exists(candidate)) {
      const ext = path.extname(candidate).toLowerCase();
      const body = await readFile(candidate);
      res.writeHead(200, {
        "Content-Type": contentType[ext] || "application/octet-stream",
        "Cache-Control":
          ext === ".html" ? "no-cache" : "public, max-age=31536000, immutable",
      });
      res.end(body);
      return;
    }

    // SPA fallback (React Router)
    const indexPath = path.join(distDir, "index.html");
    const body = await readFile(indexPath);
    res.writeHead(200, { "Content-Type": contentType[".html"] });
    res.end(body);
  } catch (err) {
    res.writeHead(500);
    res.end("Server error");
    // eslint-disable-next-line no-console
    console.error(err);
  }
});

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

server.listen(port, host, () => {
  // eslint-disable-next-line no-console
  console.log(`Portfolio server listening on http://${host}:${port}`);
  // eslint-disable-next-line no-console
  console.log(
    `Contact API: ${Boolean(resendApiKey) ? "configured" : "NOT configured"} → ${contactEmail} (from: ${resendFrom})`,
  );
});

function readBody(req, maxBytes) {
  return new Promise((resolve, reject) => {
    let body = "";
    let bytes = 0;
    req.on("data", (chunk) => {
      bytes += chunk.length;
      if (bytes > maxBytes) {
        reject(new Error("Request body too large"));
        req.destroy();
        return;
      }
      body += chunk.toString("utf8");
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}
