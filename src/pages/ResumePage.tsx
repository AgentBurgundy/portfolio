import { useState } from "react";
import { Button } from "../components/ui/Button";
import clsx from "clsx";

interface TailoredResume {
  summary: string;
  featuredShipments: Array<{
    name: string;
    role: string;
    mission: string;
    bullets: string[];
  }>;
  experience: Array<{
    title: string;
    company: string;
    location: string;
    when: string;
    bullets: string[];
  }>;
  skills: Record<string, string[]>;
}

type Status = "idle" | "generating" | "done" | "error";

export function ResumePage() {
  const [jobDescription, setJobDescription] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [resume, setResume] = useState<TailoredResume | null>(null);
  const handleGenerate = async () => {
    if (!jobDescription.trim()) return;
    setStatus("generating");
    setError("");
    setResume(null);

    try {
      const res = await fetch("/api/resume/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setError(data.message || "Failed to generate resume");
        return;
      }

      setResume(data.resume);
      setStatus("done");
    } catch {
      setStatus("error");
      setError("Network error. Make sure the server is running.");
    }
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <>
      {/* Normal page view (hidden during print) */}
      <div className="space-y-6 print:hidden">
        <header className="relative overflow-hidden pixel-border pixel-corners bg-white/[0.03] p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/14 via-transparent to-neon-violet/18 opacity-70" />
          <div className="relative">
            <h1 className="font-pixel text-[14px] text-white">
              Resume Customizer
            </h1>
            <p className="mt-3 max-w-3xl text-white/70">
              Paste a job description below to generate a tailored resume
              optimized for that specific role. Download it as a PDF to apply.
            </p>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* LEFT: Input */}
          <div className="space-y-4 lg:col-span-5">
            <div className="pixel-border pixel-corners bg-white/[0.03] p-6">
              <h2 className="font-pixel text-[11px] text-white/90">
                Job Description
              </h2>
              <p className="mt-2 font-mono text-xs text-white/50">
                Paste the full job posting here
              </p>
              <textarea
                rows={16}
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                disabled={status === "generating"}
                className={clsx(
                  "mt-4 pixel-border pixel-corners w-full resize-none bg-space-950/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 transition",
                  status === "generating" && "opacity-50 cursor-not-allowed",
                )}
              />
              <Button
                className="mt-4 w-full"
                onClick={handleGenerate}
                disabled={status === "generating" || !jobDescription.trim()}
              >
                {status === "generating" ? "Generating..." : "Generate Resume"}
              </Button>
            </div>

            {error && (
              <div className="pixel-border pixel-corners bg-red-500/10 border-red-500/30 p-4">
                <div className="font-mono text-xs text-red-400">{error}</div>
              </div>
            )}
          </div>

          {/* RIGHT: Preview */}
          <div className="lg:col-span-7">
            <div className="pixel-border pixel-corners bg-white/[0.03] p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="font-pixel text-[11px] text-white/90">
                  Preview
                </h2>
                {resume && (
                  <button
                    onClick={handleDownloadPDF}
                    className="font-mono text-sm text-neon-cyan hover:text-white transition"
                  >
                    Download PDF
                  </button>
                )}
              </div>

              {status === "idle" && (
                <div className="mt-8 flex flex-col items-center justify-center py-16 text-center">
                  <div className="font-pixel text-[11px] text-white/30">
                    No resume generated yet
                  </div>
                  <p className="mt-3 max-w-md font-mono text-sm text-white/40">
                    Paste a job description and click "Generate Resume" to
                    create a tailored resume.
                  </p>
                </div>
              )}

              {status === "generating" && (
                <div className="mt-8 flex flex-col items-center justify-center py-16 text-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-neon-cyan/30 border-t-neon-cyan" />
                  <div className="mt-4 font-pixel text-[11px] text-white/50">
                    Tailoring resume...
                  </div>
                  <p className="mt-2 font-mono text-xs text-white/35">
                    This takes about 10-15 seconds
                  </p>
                </div>
              )}

              {status === "error" && (
                <div className="mt-8 flex flex-col items-center justify-center py-16 text-center">
                  <div className="font-pixel text-[11px] text-red-400/70">
                    Generation failed
                  </div>
                  <p className="mt-3 max-w-md font-mono text-sm text-white/40">
                    Check that OPENAI_API_KEY is set and try again.
                  </p>
                </div>
              )}

              {resume && status === "done" && <ResumePreview resume={resume} />}
            </div>
          </div>
        </div>
      </div>

      {/* Print-only view: clean resume layout */}
      {resume && (
        <div className="hidden print:block">
          <ResumePrintView resume={resume} />
        </div>
      )}
    </>
  );
}

function ResumePreview({ resume }: { resume: TailoredResume }) {
  return (
    <div className="mt-6 space-y-6">
      {/* Summary */}
      <div>
        <div className="font-pixel text-[10px] text-neon-cyan/70 mb-2">
          SUMMARY
        </div>
        <p className="text-sm text-white/80 leading-relaxed">
          {resume.summary}
        </p>
      </div>

      {/* Featured Shipments */}
      {resume.featuredShipments.length > 0 && (
        <div>
          <div className="font-pixel text-[10px] text-neon-cyan/70 mb-3">
            FEATURED SHIPMENTS
          </div>
          <div className="space-y-4">
            {resume.featuredShipments.map((ship) => (
              <div
                key={ship.name}
                className="pixel-border pixel-corners bg-space-900/30 p-4"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-pixel text-[10px] text-white/90">
                    {ship.name}
                  </span>
                  <span className="font-mono text-xs text-white/50">
                    {ship.role}
                  </span>
                </div>
                <div className="mt-1 font-mono text-xs text-neon-cyan/60">
                  {ship.mission}
                </div>
                <ul className="mt-3 space-y-1.5">
                  {ship.bullets.map((b, i) => (
                    <li key={i} className="flex gap-2 text-xs text-white/70">
                      <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-neon-cyan/50" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      <div>
        <div className="font-pixel text-[10px] text-neon-cyan/70 mb-3">
          EXPERIENCE
        </div>
        <div className="space-y-4">
          {resume.experience.map((job) => (
            <div
              key={job.title + job.when}
              className="pixel-border pixel-corners bg-space-900/30 p-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <span className="font-pixel text-[10px] text-white/90">
                    {job.title}
                  </span>
                  <div className="mt-1 font-mono text-xs text-white/50">
                    {job.company} | {job.location}
                  </div>
                </div>
                <span className="font-mono text-xs text-neon-violet/70">
                  {job.when}
                </span>
              </div>
              <ul className="mt-3 space-y-1.5">
                {job.bullets.map((b, i) => (
                  <li key={i} className="flex gap-2 text-xs text-white/70">
                    <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-neon-violet/50" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div>
        <div className="font-pixel text-[10px] text-neon-cyan/70 mb-3">
          SKILLS
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {Object.entries(resume.skills).map(([category, items]) => (
            <div
              key={category}
              className="pixel-border pixel-corners bg-space-900/30 p-3"
            >
              <div className="font-pixel text-[9px] text-white/70">
                {category}
              </div>
              <div className="mt-2 font-mono text-xs text-white/60">
                {items.join(" · ")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResumePrintView({ resume }: { resume: TailoredResume }) {
  return (
    <div className="resume-print">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-3 mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Ronald Barnhart</h1>
        <p className="text-sm text-gray-600 mt-1">
          Senior Product Engineer (0→1, AI, & Mobile)
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Austin, TX | (330) 814-4605 | ronald@aibaker.io |
          linkedin.com/in/ronaldbarnhart | github.com/AgentBurgundy
        </p>
      </div>

      {/* Summary */}
      <div className="mb-4">
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide border-b border-gray-300 pb-1 mb-2">
          Professional Summary
        </h2>
        <p className="text-xs text-gray-700 leading-relaxed">
          {resume.summary}
        </p>
      </div>

      {/* Featured Shipments */}
      {resume.featuredShipments.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide border-b border-gray-300 pb-1 mb-2">
            Featured Shipments (Projects)
          </h2>
          {resume.featuredShipments.map((ship) => (
            <div key={ship.name} className="mb-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-bold text-gray-800">
                  {ship.name}
                </span>
                <span className="text-xs text-gray-500">{ship.role}</span>
              </div>
              <p className="text-xs text-gray-600 italic">{ship.mission}</p>
              <ul className="mt-1 space-y-0.5">
                {ship.bullets.map((b, i) => (
                  <li
                    key={i}
                    className="text-xs text-gray-700 pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400"
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Experience */}
      <div className="mb-4">
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide border-b border-gray-300 pb-1 mb-2">
          Professional Experience
        </h2>
        {resume.experience.map((job) => (
          <div key={job.title + job.when} className="mb-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-bold text-gray-800">
                {job.title}
              </span>
              <span className="text-xs text-gray-500">{job.when}</span>
            </div>
            <p className="text-xs text-gray-600">
              {job.company} | {job.location}
            </p>
            <ul className="mt-1 space-y-0.5">
              {job.bullets.map((b, i) => (
                <li
                  key={i}
                  className="text-xs text-gray-700 pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400"
                >
                  {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div>
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide border-b border-gray-300 pb-1 mb-2">
          Technical Skills
        </h2>
        <div className="space-y-1">
          {Object.entries(resume.skills).map(([category, items]) => (
            <p key={category} className="text-xs text-gray-700">
              <span className="font-bold">{category}:</span> {items.join(", ")}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
