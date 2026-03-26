import { useMemo, useState } from 'react'
import clsx from 'clsx'
import { getHostname, getWebsitePreviewImageUrl } from '../../lib/websitePreview'

export function WebsitePreview({
  url,
  previewSrc,
  heightClassName = 'h-44',
  className,
}: {
  url: string
  previewSrc?: string
  heightClassName?: string
  className?: string
}) {
  const [failed, setFailed] = useState(false)

  const host = useMemo(() => getHostname(url), [url])
  const img = useMemo(
    () => previewSrc ?? getWebsitePreviewImageUrl(url, 1600),
    [previewSrc, url],
  )

  return (
    <div
      className={clsx(
        'relative overflow-hidden bg-space-950/40',
        heightClassName,
        className,
      )}
    >
      {!failed ? (
        <img
          src={img}
          alt={`Preview of ${host}`}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="absolute inset-0 mt-7 h-full w-full object-cover object-top"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent">
          <div className="px-6 text-center">
            <div className="font-mono text-xs text-white/40">Preview unavailable</div>
            <div className="mt-1 font-mono text-sm text-white/60">{host}</div>
          </div>
        </div>
      )}

      {/* browser chrome */}
      <div className="absolute left-0 right-0 top-0 z-10 flex items-center gap-1.5 border-b border-white/[0.06] bg-[#0c1021]/90 px-3 py-2 backdrop-blur-sm">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]/80" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]/80" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]/80" />
        <span className="ml-2 truncate font-mono text-[11px] text-white/30">{host}</span>
      </div>

      {/* bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-space-950/60 to-transparent" />
    </div>
  )
}
