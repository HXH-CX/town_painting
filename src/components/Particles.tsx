import { motionOK } from '../lib/transition'
import '../styles/particles.css'

const rand = (i: number, n: number) => {
  const x = Math.sin(i * 127.1 + n * 311.7) * 43758.5453
  return x - Math.floor(x)
}

const DOTS = Array.from({ length: 10 }, (_, i) => ({
  left: rand(i, 1) * 100,
  top: 30 + rand(i, 2) * 65,
  size: 3 + rand(i, 3) * 5,
  dur: 9 + rand(i, 4) * 10,
  delay: -rand(i, 5) * 20,
}))

export default function Particles({ color }: { color: string }) {
  if (!motionOK()) return null
  return (
    <div className="particles" aria-hidden="true">
      {DOTS.map((d, i) => (
        <span
          key={i}
          className="particle"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            animationDuration: `${d.dur}s`,
            animationDelay: `${d.delay}s`,
            background: `radial-gradient(circle, ${color}, transparent 70%)`,
          }}
        />
      ))}
    </div>
  )
}