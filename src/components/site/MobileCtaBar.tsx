import { site } from '../../content/site'
import { PhoneIcon } from './SiteHeader'

/** Sticky bottom bar on phones: owners read this site from a truck. */
export function MobileCtaBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/90 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl md:hidden">
      <div className="flex gap-3">
        <a href={site.person.phoneHref} className="btn-secondary flex-1" aria-label={`Call ${site.person.phone}`}>
          <PhoneIcon className="h-4 w-4" />
          Call
        </a>
        <a href={site.cta.bookingUrl} className="btn-primary flex-[1.6] whitespace-nowrap">
          Book a call
        </a>
      </div>
    </div>
  )
}
