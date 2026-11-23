import { useEffect, useRef, useState } from 'react'
import type { Hotspot, Scene, StyleId, Town } from '../data/types'
import { STYLE_LABEL } from '../data/styles'
import { assetFor } from '../data/manifest'
import HotspotButton from './Hotspot'
import '../styles/scene.css'

interface Props {
  town: Town
  scene: Scene
  style: StyleId
  onSelect: (h: Hotspot) => void
}

interface Layer {
  style: StyleId
  key: number
}

export default function SceneView({ town, scene, style, onSelect }: Props) {
  const [layers, setLayers] = useState<Layer[]>([{ style, key: 0 }])
  const nextKey = useRef(0)

  useEffect(() => {
    setLayers((prev) =>
      prev[prev.length - 1].style === style ? prev : [...prev.slice(-1), { style, key: ++nextKey.current }],
    )
    const t = window.setTimeout(() => setLayers((prev) => prev.slice(-1)), 450)
    return () => window.clearTimeout(t)
  }, [style])

  const media = (s: StyleId) => {
    const asset = assetFor(town.slug, scene.slug, s)
    return asset ? (
      <img
        src={import.meta.env.BASE_URL + asset.src}
        width={asset.w}
        height={asset.h}
        alt={`${town.name} · ${scene.name}`}
        style={{ backgroundImage: `url(${asset.lqip})` }}
      />
    ) : (
      <span
        className="scene__placeholder"
        style={{ background: `linear-gradient(160deg, ${town.palette[0]}, ${town.palette[1]})` }}
      >
        {scene.name} · {STYLE_LABEL[s]} 占位
      </span>
    )
  }

  return (
    <div className="scene">
      {layers.map((l, i) => (
        <div
          key={l.key}
          className={i === layers.length - 1 && layers.length > 1 ? 'scene__layer scene__layer--enter' : 'scene__layer'}
        >
          {media(l.style)}
        </div>
      ))}
      <div className="scene__hotspots">
        {scene.hotspots.map((h) => (
          <HotspotButton key={h.id} hotspot={h} onSelect={onSelect} />
        ))}
      </div>
    </div>
  )
}