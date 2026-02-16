import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { profile } from "../../content/profile";

const links: Array<{ to: string; label: string }> = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/experience", label: "XP" },
  { to: "/resume", label: "Resume" },
  { to: "/arcade", label: "Arcade" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-space-950/60 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <NavLink to="/" className="group flex items-center gap-3">
          <div className="pixel-border pixel-corners grid h-9 w-9 place-items-center bg-white/5">
            <span className="font-pixel text-[10px] tracking-tight text-neon-cyan group-hover:animate-flicker">
              RB
            </span>
          </div>
          <div className="leading-tight">
            <div className="font-pixel text-[10px] text-white/90">
              {profile.name.toUpperCase()}
            </div>
            <div className="font-mono text-sm text-white/60">
              {profile.role.toLowerCase()}
            </div>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                clsx(
                  "pixel-corners px-3 py-2 text-sm transition",
                  "hover:bg-white/5 hover:text-white",
                  isActive ? "bg-white/6 text-white" : "text-white/70",
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
