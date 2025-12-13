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
  const img = useMemo(() => previewSrc ?? getWebsitePreviewImageUrl(url, 1600), [previewSrc, url])

  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-xl border border-white/10 bg-space-950/40 transition-transform duration-300 will-change-transform group-hover:scale-[1.01]',
        heightClassName,
        className,
      )}
    >
      <div className="scanline absolute inset-0 opacity-60" />

      {!failed ? (
        <img
          src={img}
          alt={`Preview of ${host}`}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className={clsx(
            'absolute inset-0 h-full w-full object-cover opacity-95 mt-8',
            '[filter:saturate(1)_contrast(1.08)]',
          )}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-transparent">
          <div className="px-6 text-center">
            <div className="font-mono text-sm text-white/60">Preview unavailable</div>
            <div className="mt-2 font-pixel text-[11px] text-white/85">{host}</div>
          </div>
        </div>
      )}

      {/* “browser chrome” */}
      <div className="absolute left-0 right-0 top-0 flex items-center gap-2 border-b border-white/10 bg-black/20 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="ml-2 truncate font-mono text-xs text-white/60">{host}</span>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
    </div>
  )
}

