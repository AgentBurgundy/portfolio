// Load .env locally if available. The Docker runner stage ships no
// node_modules, so this must not hard-fail in production.
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
const contactEmail =
  process.env.CONTACT_EMAIL || "professional.burgundy@gmail.com";
const resendFrom =
  process.env.RESEND_FROM || "aibaker.io <onboarding@resend.dev>";

const contentType = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".woff2": "font/woff2",
};

async function exists(p) {
  try {
    return (await stat(p)).isFile();
  } catch {
    return false;
  }
}

function json(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(
      req.url || "/",
      `http://${req.headers.host || "localhost"}`,
    );
    const pathname = decodeURIComponent(url.pathname);

    if (pathname === "/api/health" && req.method === "GET") {
      json(res, 200, { ok: true, resendConfigured: Boolean(resendApiKey) });
      return;
    }

    if (pathname === "/api/contact") {
      res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
      res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.setHeader("Access-Control-Max-Age", "86400");

      if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
      }
      if (req.method !== "POST") {
        json(res, 405, { success: false, message: "Method Not Allowed" });
        return;
      }
      let data;
      try {
        data = JSON.parse((await readBody(req, 100_000)) || "{}");
      } catch {
        json(res, 400, { success: false, message: "Invalid request body" });
        return;
      }

      const name = str(data.name);
      const business = str(data.business);
      const phone = str(data.phone);
      const email = str(data.email);
      const message = str(data.message);
      const honeypot = str(data.website);

      // Bots fill the hidden field. Pretend it worked so they move on.
      if (honeypot) {
        json(res, 200, { success: true, message: "Sent." });
        return;
      }

      if (!name || (!phone && !email) || !message) {
        json(res, 400, {
          success: false,
          message: "Name, a way to reach you, and a short message are required.",
        });
        return;
      }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        json(res, 400, { success: false, message: "That email doesn't look right." });
        return;
      }

      if (!resendApiKey) {
        console.warn("RESEND_API_KEY not set. Contact form will not send.");
        json(res, 500, {
          success: false,
          message: "The form isn't wired up yet. Call or text me instead.",
        });
        return;
      }

      const subject = `New lead: ${name}${business ? ` (${business})` : ""}`;
      const rows = [
        ["Name", name],
        ["Business", business || "—"],
        ["Phone", phone || "—"],
        ["Email", email || "—"],
      ];

      try {
        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: resendFrom,
            to: [contactEmail],
            ...(email ? { reply_to: email } : {}),
            subject,
            html: `
              <h2>${escapeHtml(subject)}</h2>
              <table cellpadding="4">
                ${rows
                  .map(
                    ([k, v]) =>
                      `<tr><td><strong>${k}</strong></td><td>${escapeHtml(v)}</td></tr>`,
                  )
                  .join("")}
              </table>
              <h3>What's leaking</h3>
              <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
            `,
            text: [
              subject,
              "",
              ...rows.map(([k, v]) => `${k}: ${v}`),
              "",
              "What's leaking:",
              message,
            ].join("\n"),
          }),
        });

        if (!resendResponse.ok) {
          const errBody = await resendResponse.text().catch(() => "");
          console.error("Resend API error:", resendResponse.status, errBody);
          json(res, 502, {
            success: false,
            message: "Couldn't send that. Call or text me instead.",
          });
          return;
        }

        json(res, 200, { success: true, message: "Sent." });
      } catch (err) {
        console.error("Contact API error:", err);
        json(res, 500, {
          success: false,
          message: "Couldn't send that. Call or text me instead.",
        });
      }
      return;
    }

    if (pathname.includes("..")) {
      res.writeHead(400);
      res.end("Bad Request");
      return;
    }

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
    const body = await readFile(path.join(distDir, "index.html"));
    res.writeHead(200, {
      "Content-Type": contentType[".html"],
      "Cache-Control": "no-cache",
    });
    res.end(body);
  } catch (err) {
    res.writeHead(500);
    res.end("Server error");
    console.error(err);
  }
});

function str(v) {
  return typeof v === "string" ? v.trim().slice(0, 5000) : "";
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

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

server.listen(port, host, () => {
  console.log(`aibaker.io listening on http://${host}:${port}`);
  console.log(
    `Contact form: ${resendApiKey ? "configured" : "NOT configured"} → ${contactEmail}`,
  );
});
