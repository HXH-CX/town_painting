import { useState } from 'react'
import type { Hotspot, Scene, StyleId, Town } from '../data/types'
import { navigate } from '../router'
import { runZoomOut } from '../lib/transition'
import { assetFor } from '../data/manifest'
import { coverPos } from '../lib/cover'
import SceneView from './SceneView'
import Breadcrumb from './Breadcrumb'
import StoryCard from './StoryCard'
import Toolbar from './Toolbar'

export default function StreetView({ town, scene, style }: { town: Town; scene: Scene; style: StyleId }) {
  const [active, setActive] = useState<Hotspot | null>(null)
  const other = town.streets.find((s) => s.slug !== scene.slug)
  const goTo = (to: string) => {
    if (to === `/${town.slug}`) {
      const h = town.cover.hotspots.find((x) => x.to === scene.slug)
      const coverAsset = assetFor(town.slug, 'overview', style)
      const aspect = coverAsset ? coverAsset.w / coverAsset.h : innerWidth / innerHeight
      const contain = innerWidth / innerHeight < aspect
      const pos = h
        ? coverPos(h.x, h.y, { w: innerWidth, h: innerHeight }, aspect, contain)
        : { left: 50, top: 50 }
      runZoomOut({ x: pos.left / 100, y: pos.top / 100 })
    }
    navigate(to)
  }
  return (
    <>
      <SceneView town={town} scene={scene} style={style} onSelect={(h) => h.story && setActive(h)} />
      <Breadcrumb
        items={[
          { label: '镇在画中', to: '/' },
          { label: town.name, to: `/${town.slug}` },
        ]}
        onNavigate={goTo}
      />
      <Toolbar town={town} street={scene} style={style} />
      {other && (
        <button className="street-jumper" onClick={() => navigate(`/${town.slug}/${other.slug}`)}>
          去{other.name} →
        </button>
      )}
      {active?.story && <StoryCard story={active.story} onClose={() => setActive(null)} />}
    </>
  )
}