import { useEffect, useState } from 'react'
import type { Town } from '../data/types'
import { motionOK } from '../lib/transition'

const shownTowns = new Set<string>()

export default function Dossier({ town }: { town: Town }) {
  const [fading, setFading] = useState(false)
  const [gone, setGone] = useState(() => shownTowns.has(town.slug))

  useEffect(() => {
    if (shownTowns.has(town.slug)) return
    shownTowns.add(town.slug)
    const t1 = window.setTimeout(() => setFading(true), 2400)
    const t2 = window.setTimeout(() => setGone(true), motionOK() ? 3100 : 2500)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [town.slug])

  if (gone) return null
  return (
    <aside className={fading ? 'dossier dossier--out' : 'dossier'}>
      <h2>{town.name}</h2>
      <p className="dossier__tagline">{town.tagline}</p>
      <p className="dossier__line">{town.dossier}</p>
    </aside>
  )
}