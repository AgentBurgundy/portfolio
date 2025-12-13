export function SiteFooter() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-10 text-sm text-white/60 sm:px-6 lg:px-8">
        <div className="font-mono">
          Built with React + TypeScript. Styled like a space arcade.
        </div>
        <div className="font-mono">
          © {new Date().getFullYear()} Ronald Barnhart — ship it.
        </div>
      </div>
    </footer>
  )
}

