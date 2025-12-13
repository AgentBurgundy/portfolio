import { AsteroidDodge } from '../features/arcade/AsteroidDodge'

export function ArcadePage() {
  return (
    <div className="space-y-6">
      <header className="pixel-border pixel-corners bg-space-900/40 p-6">
        <h1 className="font-pixel text-[14px] text-white">Arcade</h1>
        <p className="mt-3 max-w-3xl text-white/70">
          Tiny pixel mini-game. Arrow keys to move. Survive, rack score, talk about it in interviews.
        </p>
      </header>

      <AsteroidDodge />
    </div>
  )
}

