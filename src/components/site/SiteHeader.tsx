import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

const links: Array<{ to: string; label: string }> = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/experience", label: "Experience" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-4 z-30 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-[#0a0a1a]/70 px-5 py-3 backdrop-blur-xl">
          {/* logo */}
          <NavLink to="/" className="group flex items-center gap-2.5">
            <div className="relative grid h-8 w-8 place-items-center rounded-lg">
              <div className="absolute inset-0 animate-gradient rounded-lg bg-gradient-to-r from-[#00c8ff] via-[#7c3aed] to-[#ff3278] bg-[length:200%_auto] opacity-60 transition group-hover:opacity-100" />
              <span className="relative text-xs font-bold text-white">RB</span>
            </div>
            <span className="text-sm font-medium text-white/80">
              Ronald Barnhart
            </span>
          </NavLink>

          {/* desktop nav */}
          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  clsx(
                    "relative rounded-lg px-3.5 py-1.5 text-[13px] transition",
                    isActive
                      ? "text-white"
                      : "text-white/40 hover:text-white/70",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-lg bg-white/[0.08]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative">{l.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 transition hover:bg-white/[0.06] hover:text-white md:hidden"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>
      </header>

      {/* mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-20 z-30 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a1a]/95 p-3 backdrop-blur-xl md:hidden"
          >
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    "block rounded-xl px-4 py-3 text-sm transition",
                    isActive
                      ? "bg-white/[0.06] text-white"
                      : "text-white/50 hover:bg-white/[0.03] hover:text-white",
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
