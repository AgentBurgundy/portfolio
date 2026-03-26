import { Outlet } from 'react-router-dom'
import { Aurora } from '../../components/canvas/Aurora'
import { SiteHeader } from '../../components/site/SiteHeader'
import { SiteFooter } from '../../components/site/SiteFooter'

export function RootLayout() {
  return (
    <div className="min-h-screen bg-[#050510] text-white selection:bg-cyan-300/20">
      {/* animated aurora blobs */}
      <Aurora />

      {/* grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      <div className="relative z-[2]">
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </div>
  )
}
