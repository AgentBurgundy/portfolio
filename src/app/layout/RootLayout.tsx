import { Outlet } from 'react-router-dom'
import { Starfield } from '../../components/canvas/Starfield'
import { SiteHeader } from '../../components/site/SiteHeader'
import { SiteFooter } from '../../components/site/SiteFooter'

export function RootLayout() {
  return (
    <div className="min-h-screen bg-space-950 text-slate-100 selection:bg-cyan-300/20">
      <Starfield />
      <div className="pointer-events-none fixed inset-0 bg-nebula" />
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-[0.08] [background-size:64px_64px]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.08] [background-image:repeating-radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.6)_0,rgba(255,255,255,0.6)_1px,transparent_1px,transparent_3px)]" />

      {/* “planets” */}
      <div className="pointer-events-none fixed -left-32 top-24 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-neon-violet/25 via-neon-cyan/10 to-transparent blur-2xl" />
      <div className="pointer-events-none fixed -right-40 top-[520px] h-[520px] w-[520px] rounded-full bg-gradient-to-br from-neon-pink/18 via-neon-amber/10 to-transparent blur-2xl" />

      <div className="relative">
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </div>
  )
}

