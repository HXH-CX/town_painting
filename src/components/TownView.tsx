import type { StyleId, Town } from '../data/types'
import { navigate } from '../router'
import SceneView from './SceneView'
import Breadcrumb from './Breadcrumb'
import Dossier from './Dossier'
import Toolbar from './Toolbar'

export default function TownView({ town, style }: { town: Town; style: StyleId }) {
  return (
    <>
      <SceneView
        town={town}
        scene={town.cover}
        style={style}
        onSelect={(h) => h.to && navigate(`/${town.slug}/${h.to}`)}
      />
      <Breadcrumb items={[{ label: '镇在画中', to: '/' }]} />
      <Toolbar town={town} style={style} />
      <Dossier town={town} />
    </>
  )
}