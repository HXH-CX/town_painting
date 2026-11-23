import type { StyleId, Town } from '../data/types'
import { navigate } from '../router'
import { isTransitioning, runPushIn } from '../lib/transition'
import SceneView from './SceneView'
import Breadcrumb from './Breadcrumb'
import Dossier from './Dossier'
import Toolbar from './Toolbar'
import Particles from './Particles'

export default function TownView({ town, style }: { town: Town; style: StyleId }) {
  return (
    <>
      <SceneView
        town={town}
        scene={town.cover}
        style={style}
        onSelect={(h, pos) => {
          if (!h.to || isTransitioning()) return
          runPushIn({ x: pos.left / 100, y: pos.top / 100 })
          navigate(`/${town.slug}/${h.to}`)
        }}
      />
      <Breadcrumb items={[{ label: '镇在画中', to: '/' }]} />
      <Toolbar town={town} style={style} />
      <Particles color="#ffb35c" />
      <Dossier town={town} />
    </>
  )
}