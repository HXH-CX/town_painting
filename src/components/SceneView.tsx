import { useEffect, useRef, useState } from 'react'
import type { Hotspot, Scene, StyleId, Town } from '../data/types'
import { STYLE_LABEL } from '../data/styles'
import { assetFor, srcSetFor } from '../data/manifest'
import { usePreload } from '../hooks/usePreload'
import HotspotButton from './Hotspot'
import { getFlag, motionOK } from '../lib/transition'
import { coverPos, imagePos } from '../lib/cover'
import '../styles/scene.css'

interface Props {
  town: Town
  scene: Scene
  style: StyleId
  onSelect: (h: Hotspot, pos: { left: number; top: number }) => void
}

interface Layer {
  style: StyleId
  key: number
}

export default function SceneView({ town, scene, style, onSelect }: Props) {
  const [layers, setLayers] = useState<Layer[]>([{ style, key: 0 }])
  const nextKey = useRef(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState({ w: 0, h: 0 })
  usePreload(town, scene, style)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    setLayers((prev) =>
      prev[prev.length - 1].style === style ? prev : [...prev.slice(-1), { style, key: ++nextKey.current }],
    )
    const t = window.setTimeout(() => setLayers((prev) => prev.slice(-1)), 450)
    return () => window.clearTimeout(t)
  }, [style])

  const asset = assetFor(town.slug, scene.slug, style)
  const aspect = asset ? asset.w / asset.h : box.w / Math.max(box.h, 1)
  const contain = box.h > 0 && box.w / box.h < aspect

  const media = (s: StyleId) => {
    const a = assetFor(town.slug, scene.slug, s)
    return a ? (
      <picture>
        <source type="image/avif" srcSet={srcSetFor(a, 'avif')} sizes="100vw" />
        <source type="image/webp" srcSet={srcSetFor(a, 'webp')} sizes="100vw" />
        <img
          src={import.meta.env.BASE_URL + (a.sizes[960].jpg ?? a.sizes[960].webp)}
          width={a.w}
          height={a.h}
          alt={`${town.name} · ${scene.name}`}
          decoding="async"
          style={{ backgroundImage: `url(${import.meta.env.BASE_URL + a.lqip})` }}
        />
      </picture>
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
    <div
      ref={rootRef}
      className={`${motionOK() ? 'scene scene--kb' : 'scene'}${contain ? ' scene--contain' : ''}`}
      onClick={(e) => {
        if (!getFlag('debug')) return
        const r = e.currentTarget.getBoundingClientRect()
        const left = ((e.clientX - r.left) / r.width) * 100
        const top = ((e.clientY - r.top) / r.height) * 100
        const p = imagePos(left, top, { w: r.width, h: r.height }, aspect, contain)
        console.log(`[热点坐标] x: ${p.x.toFixed(3)}, y: ${p.y.toFixed(3)}`)
      }}
    >
      {layers.map((l, i) => (
        <div
          key={l.key}
          className={
            i === layers.length - 1
              ? layers.length > 1
                ? 'scene__layer scene__layer--current scene__layer--enter'
                : 'scene__layer scene__layer--current'
              : 'scene__layer'
          }
        >
          {media(l.style)}
        </div>
      ))}
      <div className="scene__hotspots">
        {scene.hotspots.map((h) => (
          <HotspotButton key={h.id} hotspot={h} pos={coverPos(h.x, h.y, box, aspect, contain)} onSelect={onSelect} />
        ))}
      </div>
    </div>
  )
}