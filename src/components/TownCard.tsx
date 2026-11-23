import type { Town } from '../data/types'
import { navigate } from '../router'
import { runFlipFrom } from '../lib/transition'

export default function TownCard({ town }: { town: Town }) {
  return (
    <button
      className="town-card"
      style={{ background: `linear-gradient(160deg, ${town.palette[0]}, ${town.palette[1]})` }}
      onClick={(e) => {
        runFlipFrom(e.currentTarget)
        navigate(`/${town.slug}`)
      }}
      aria-label={`进入${town.name}`}
    >
      <span className="town-card__name">{town.name}</span>
      <span className="town-card__tagline">{town.tagline}</span>
    </button>
  )
}