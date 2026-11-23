import { useState } from 'react'
import type { Hotspot, Scene, StyleId, Town } from '../data/types'
import { navigate } from '../router'
import { runZoomOut } from '../lib/transition'
import SceneView from './SceneView'
import Breadcrumb from './Breadcrumb'
import StoryCard from './StoryCard'
import Toolbar from './Toolbar'

export default function StreetView({ town, scene, style }: { town: Town; scene: Scene; style: StyleId }) {
  const [active, setActive] = useState<Hotspot | null>(null)
  const other = town.streets.find((s) => s.slug !== scene.slug)
  const goTo = (to: string) => {
    if (to === `/${town.slug}`) {
      const origin = town.cover.hotspots.find((h) => h.to === scene.slug)
      runZoomOut(origin ? { x: origin.x, y: origin.y } : { x: 0.5, y: 0.5 })
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