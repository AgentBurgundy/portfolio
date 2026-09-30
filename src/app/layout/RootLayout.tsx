import { Outlet } from 'react-router-dom'
import { SiteHeader } from '../../components/site/SiteHeader'
import { SiteFooter } from '../../components/site/SiteFooter'
import { MobileCtaBar } from '../../components/site/MobileCtaBar'

export function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <SiteHeader />
      <main className="flex-1 pb-24 md:pb-0">
        <Outlet />
      </main>
      <SiteFooter />
      <MobileCtaBar />
    </div>
  )
}
