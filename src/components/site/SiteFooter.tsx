export function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-8 text-xs text-white/25 sm:px-6 lg:px-8">
        <span>{'\u00A9'} {new Date().getFullYear()} Ronald Barnhart</span>
        <span>Built with React + TypeScript</span>
      </div>
    </footer>
  )
}
