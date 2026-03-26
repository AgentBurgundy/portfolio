import { useEffect, useRef } from 'react'

export function Aurora() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let w = 0
    let h = 0

    const blobs = [
      { x: 0.15, y: 0.15, r: 0.6, color: [0, 200, 255], speed: 0.18, phase: 0 },
      { x: 0.85, y: 0.1, r: 0.65, color: [130, 60, 255], speed: 0.14, phase: 2 },
      { x: 0.5, y: 0.75, r: 0.55, color: [255, 50, 120], speed: 0.2, phase: 4 },
      { x: 0.1, y: 0.7, r: 0.5, color: [255, 120, 30], speed: 0.12, phase: 1.5 },
      { x: 0.75, y: 0.55, r: 0.5, color: [60, 130, 255], speed: 0.16, phase: 3.5 },
    ]

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas!.width = w * dpr
      canvas!.height = h * dpr
      canvas!.style.width = `${w}px`
      canvas!.style.height = `${h}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function draw(t: number) {
      const time = t * 0.001
      ctx!.clearRect(0, 0, w, h)

      for (const b of blobs) {
        const bx = (b.x + Math.sin(time * b.speed + b.phase) * 0.18) * w
        const by = (b.y + Math.cos(time * b.speed * 0.8 + b.phase) * 0.12) * h
        const br = b.r * Math.max(w, h) * 0.7

        const grad = ctx!.createRadialGradient(bx, by, 0, bx, by, br)
        grad.addColorStop(0, `rgba(${b.color[0]},${b.color[1]},${b.color[2]},0.35)`)
        grad.addColorStop(0.4, `rgba(${b.color[0]},${b.color[1]},${b.color[2]},0.12)`)
        grad.addColorStop(1, `rgba(${b.color[0]},${b.color[1]},${b.color[2]},0)`)

        ctx!.fillStyle = grad
        ctx!.fillRect(0, 0, w, h)
      }

      raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0"
    />
  )
}
