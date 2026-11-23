import type { Town } from '../data/types'

export default function Dossier({ town }: { town: Town }) {
  return (
    <aside className="dossier">
      <h2>{town.name}</h2>
      <p className="dossier__tagline">{town.tagline}</p>
      <p className="dossier__line">{town.dossier}</p>
    </aside>
  )
}