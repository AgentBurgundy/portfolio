import { useEffect, useMemo, useRef } from 'react'

type Star = {
  x: number
  y: number
  z: number
  r: number
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const stars = useMemo<Star[]>(() => {
    const count = 420
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
      z: Math.random(),
      r: Math.random() * 1.25 + 0.25,
    }))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let w = 0
    let h = 0
    let dpr = 1
    let t0 = performance.now()
    const mouse = { x: 0, y: 0 }

    const resize = () => {
      dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1))
      w = Math.floor(window.innerWidth)
      h = Math.floor(window.innerHeight)
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const onMove = (e: PointerEvent) => {
      mouse.x = (e.clientX / Math.max(1, w) - 0.5) * 2
      mouse.y = (e.clientY / Math.max(1, h) - 0.5) * 2
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })

    const draw = (t: number) => {
      const dt = clamp((t - t0) / 1000, 0, 0.05)
      t0 = t

      // Clear
      ctx.clearRect(0, 0, w, h)

      // Camera drift based on pointer (subtle)
      const driftX = mouse.x * 14
      const driftY = mouse.y * 10

      // Speed varies with depth
      const baseSpeed = 0.12

      for (const s of stars) {
        s.z -= dt * (baseSpeed + (1 - s.z) * 0.55)
        if (s.z <= 0) {
          s.z = 1
          s.x = (Math.random() - 0.5) * 2
          s.y = (Math.random() - 0.5) * 2
          s.r = Math.random() * 1.25 + 0.25
        }

        const px = (s.x / s.z) * (w * 0.36) + w / 2 + driftX
        const py = (s.y / s.z) * (h * 0.36) + h / 2 + driftY
        if (px < -50 || px > w + 50 || py < -50 || py > h + 50) continue

        const alpha = clamp(1.05 - s.z, 0.05, 0.9)
        const size = clamp((1.6 - s.z) * s.r, 0.6, 2.4)

        // Slight chroma shift for “arcade” feel
        ctx.fillStyle = `rgba(34, 211, 238, ${alpha * 0.35})`
        ctx.fillRect(px - size * 0.5 + 0.8, py - size * 0.5, size, size)
        ctx.fillStyle = `rgba(167, 139, 250, ${alpha * 0.22})`
        ctx.fillRect(px - size * 0.5 - 0.8, py - size * 0.5, size, size)
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
        ctx.fillRect(px - size * 0.5, py - size * 0.5, size, size)
      }

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
    }
  }, [stars])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 opacity-60"
    />
  )
}

