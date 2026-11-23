import { useState } from 'react'
import type { Hotspot, Scene, StyleId, Town } from '../data/types'
import { navigate } from '../router'
import SceneView from './SceneView'
import Breadcrumb from './Breadcrumb'
import StoryCard from './StoryCard'
import Toolbar from './Toolbar'

export default function StreetView({ town, scene, style }: { town: Town; scene: Scene; style: StyleId }) {
  const [active, setActive] = useState<Hotspot | null>(null)
  const other = town.streets.find((s) => s.slug !== scene.slug)
  return (
    <>
      <SceneView town={town} scene={scene} style={style} onSelect={(h) => h.story && setActive(h)} />
      <Breadcrumb
        items={[
          { label: '镇在画中', to: '/' },
          { label: town.name, to: `/${town.slug}` },
        ]}
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