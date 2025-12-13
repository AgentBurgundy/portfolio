import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '../../components/ui/Button'

type Rock = { x: number; y: number; r: number; vx: number; vy: number }

const W = 640
const H = 360

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

export function AsteroidDodge() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [running, setRunning] = useState(false)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const keys = useRef<{ left: boolean; right: boolean; up: boolean; down: boolean }>({
    left: false,
    right: false,
    up: false,
    down: false,
  })

  const rocks = useMemo<Rock[]>(() => [], [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent, isDown: boolean) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') keys.current.left = isDown
      if (e.key === 'ArrowRight' || e.key === 'd') keys.current.right = isDown
      if (e.key === 'ArrowUp' || e.key === 'w') keys.current.up = isDown
      if (e.key === 'ArrowDown' || e.key === 's') keys.current.down = isDown
      if (e.key === ' ' && isDown) setRunning((r) => !r)
    }
    const down = (e: KeyboardEvent) => onKey(e, true)
    const up = (e: KeyboardEvent) => onKey(e, false)
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = W
    canvas.height = H

    let raf = 0
    let t0 = performance.now()
    let localScore = 0
    let ship = { x: W * 0.22, y: H * 0.5, r: 10 }

    const reset = () => {
      rocks.length = 0
      localScore = 0
      ship = { x: W * 0.22, y: H * 0.5, r: 10 }
      // seed a few
      for (let i = 0; i < 5; i++) spawn(true)
      setScore(0)
    }

    const spawn = (quiet = false) => {
      const r = rand(8, 18)
      const y = rand(r, H - r)
      const x = quiet ? rand(W * 0.55, W) : W + r + rand(0, 120)
      const vx = -rand(90, 180)
      const vy = rand(-25, 25)
      rocks.push({ x, y, r, vx, vy })
    }

    reset()

    const drawShip = () => {
      // Pixel ship
      const x = ship.x
      const y = ship.y

      ctx.save()
      ctx.translate(x, y)
      ctx.imageSmoothingEnabled = false

      // glow
      ctx.fillStyle = 'rgba(34, 211, 238, 0.25)'
      ctx.fillRect(-16, -10, 28, 20)

      // body
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
      ctx.fillRect(-12, -6, 20, 12)
      ctx.fillStyle = 'rgba(167, 139, 250, 0.9)'
      ctx.fillRect(-8, -2, 12, 4)

      // thruster
      ctx.fillStyle = 'rgba(251, 191, 36, 0.95)'
      ctx.fillRect(-16, -2, 4, 4)
      ctx.fillStyle = 'rgba(251, 113, 133, 0.8)'
      ctx.fillRect(-18, -1, 2, 2)

      ctx.restore()
    }

    const drawRock = (r: Rock) => {
      ctx.save()
      ctx.translate(r.x, r.y)
      ctx.imageSmoothingEnabled = false

      const s = Math.floor(r.r)
      // chunky pixel asteroid
      ctx.fillStyle = 'rgba(255,255,255,0.7)'
      ctx.fillRect(-s, -s, s * 2, s * 2)
      ctx.fillStyle = 'rgba(0,0,0,0.22)'
      ctx.fillRect(-s + 3, -s + 3, s * 2 - 6, s * 2 - 6)
      ctx.fillStyle = 'rgba(34,211,238,0.18)'
      ctx.fillRect(-s + 1, -s + 1, s * 2 - 2, 2)

      ctx.restore()
    }

    const collide = (a: { x: number; y: number; r: number }, b: { x: number; y: number; r: number }) => {
      const dx = a.x - b.x
      const dy = a.y - b.y
      return dx * dx + dy * dy <= (a.r + b.r) * (a.r + b.r)
    }

    const tick = (t: number) => {
      const dt = clamp((t - t0) / 1000, 0, 0.05)
      t0 = t

      // background
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = 'rgba(255,255,255,0.02)'
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = 'rgba(255,255,255,0.06)'
      for (let i = 0; i < 40; i++) {
        ctx.fillRect(((i * 97) % W) + ((t / 50) % 7), ((i * 47) % H) + ((t / 80) % 5), 2, 2)
      }

      // HUD
      ctx.fillStyle = 'rgba(255,255,255,0.85)'
      ctx.font = '16px "VT323", monospace'
      ctx.fillText(`SCORE ${Math.floor(localScore)}`, 14, 22)
      ctx.fillStyle = 'rgba(34,211,238,0.8)'
      ctx.fillText(`BEST ${Math.floor(best)}`, 14, 42)
      ctx.fillStyle = 'rgba(255,255,255,0.55)'
      ctx.fillText(running ? 'SPACE: pause' : 'SPACE: start', W - 120, 22)

      if (running) {
        const speed = 210
        const dx = (keys.current.right ? 1 : 0) - (keys.current.left ? 1 : 0)
        const dy = (keys.current.down ? 1 : 0) - (keys.current.up ? 1 : 0)
        ship.x = clamp(ship.x + dx * speed * dt, 24, W - 24)
        ship.y = clamp(ship.y + dy * speed * dt, 24, H - 24)

        // move rocks
        for (const r of rocks) {
          r.x += r.vx * dt
          r.y += r.vy * dt
          if (r.y < r.r) r.y = r.r
          if (r.y > H - r.r) r.y = H - r.r
        }

        // recycle & spawn
        for (let i = rocks.length - 1; i >= 0; i--) {
          if (rocks[i].x < -rocks[i].r - 10) rocks.splice(i, 1)
        }
        while (rocks.length < 7) spawn()

        // scoring
        localScore += dt * 12
        setScore(Math.floor(localScore))

        // collisions
        for (const r of rocks) {
          if (collide(ship, r)) {
            setRunning(false)
            setBest((b) => Math.max(b, Math.floor(localScore)))
            break
          }
        }
      }

      // draw
      for (const r of rocks) drawRock(r)
      drawShip()

      if (!running) {
        ctx.save()
        ctx.fillStyle = 'rgba(255,255,255,0.9)'
        ctx.font = '18px "Press Start 2P", system-ui'
        ctx.textAlign = 'center'
        ctx.fillText('ASTEROID DODGE', W / 2, H / 2 - 12)
        ctx.font = '16px "VT323", monospace'
        ctx.fillStyle = 'rgba(255,255,255,0.65)'
        ctx.fillText('Press SPACE to start/pause', W / 2, H / 2 + 18)
        ctx.restore()
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [best, rocks, running])

  return (
    <div className="pixel-border pixel-corners bg-white/[0.03] p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-pixel text-[11px] text-white/90">Arcade Cabinet</div>
          <div className="mt-1 font-mono text-sm text-white/60">
            Score: <span className="text-white">{score}</span> · Best:{' '}
            <span className="text-white">{best}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setRunning((r) => !r)}>{running ? 'Pause' : 'Start'}</Button>
          <Button
            variant="ghost"
            onClick={() => {
              setRunning(false)
              setScore(0)
            }}
          >
            Reset
          </Button>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-space-950/40">
        <canvas
          ref={canvasRef}
          className="mx-auto block w-full max-w-[820px]"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>

      <div className="mt-3 font-mono text-sm text-white/60">
        Controls: <span className="text-white">Arrow keys</span> (or WASD).{' '}
        <span className="text-white">Space</span> toggles play/pause.
      </div>
    </div>
  )
}

