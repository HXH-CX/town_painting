import type { Town } from '../data/types'
import { navigate } from '../router'
import { runFlipFrom } from '../lib/transition'
import { assetFor } from '../data/manifest'

export default function TownCard({ town }: { town: Town }) {
  const asset = assetFor(town.slug, 'overview', 'cinematic')
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
      {asset && (
        <img
          src={import.meta.env.BASE_URL + asset.sizes[960].webp}
          alt=""
          decoding="async"
          style={{ backgroundImage: `url(${import.meta.env.BASE_URL + asset.lqip})` }}
        />
      )}
      <span className="town-card__name">{town.name}</span>
      <span className="town-card__tagline">{town.tagline}</span>
    </button>
  )
}