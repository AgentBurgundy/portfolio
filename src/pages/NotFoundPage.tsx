import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="pixel-border pixel-corners bg-space-900/40 p-8">
      <div className="font-pixel text-[14px] text-white">404</div>
      <p className="mt-3 text-white/70">This sector of space doesn’t exist.</p>
      <div className="mt-6">
        <Link to="/">
          <Button>Return to base</Button>
        </Link>
      </div>
    </div>
  )
}

