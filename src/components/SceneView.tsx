import type { Hotspot, Scene, StyleId, Town } from '../data/types'
import { assetFor } from '../data/manifest'
import HotspotButton from './Hotspot'
import '../styles/scene.css'

interface Props {
  town: Town
  scene: Scene
  style: StyleId
  onSelect: (h: Hotspot) => void
}

export default function SceneView({ town, scene, style, onSelect }: Props) {
  const asset = assetFor(town.slug, scene.slug, style)
  return (
    <div className="scene">
      <div
        className="scene__media"
        style={asset ? undefined : { background: `linear-gradient(160deg, ${town.palette[0]}, ${town.palette[1]})` }}
      >
        {asset ? (
          <img
            src={import.meta.env.BASE_URL + asset.src}
            width={asset.w}
            height={asset.h}
            alt={`${town.name} · ${scene.name}`}
            style={{ backgroundImage: `url(${asset.lqip})` }}
          />
        ) : (
          <span className="scene__placeholder">{scene.name} · 占位</span>
        )}
      </div>
      <div className="scene__hotspots">
        {scene.hotspots.map((h) => (
          <HotspotButton key={h.id} hotspot={h} onSelect={onSelect} />
        ))}
      </div>
    </div>
  )
}