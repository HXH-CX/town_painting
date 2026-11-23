import { useEffect } from 'react'
import { assetFor } from '../data/manifest'
import { STYLES } from '../data/styles'
import { TOWNS } from '../data/towns'
import type { Scene, StyleId, Town } from '../data/types'
import { getFlag } from '../lib/transition'

export function usePreload(town: Town, scene: Scene, style: StyleId) {
  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (getFlag('lite') || conn?.saveData) return

    const load = (t: string, s: string, st: StyleId) => {
      const a = assetFor(t, s, st)
      if (!a) return
      const img = new Image()
      img.src = import.meta.env.BASE_URL + a.sizes[960].webp
    }

    STYLES.filter((s) => s !== style).forEach((s) => load(town.slug, scene.slug, s))

    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
      cancelIdleCallback?: (h: number) => void
    }
    const neighbors = () => {
      town.streets.filter((s) => s.slug !== scene.slug).forEach((s) => load(town.slug, s.slug, style))
      TOWNS.filter((t) => t.slug !== town.slug).forEach((t) => load(t.slug, 'overview', style))
    }
    const handle = w.requestIdleCallback ? w.requestIdleCallback(neighbors, { timeout: 3000 }) : window.setTimeout(neighbors, 1500)
    return () => {
      if (w.cancelIdleCallback) w.cancelIdleCallback(handle)
      else window.clearTimeout(handle)
    }
  }, [town, scene, style])
}