import type { Hotspot } from '../data/types'

interface Props {
  hotspot: Hotspot
  onSelect: (h: Hotspot) => void
}

export default function HotspotButton({ hotspot, onSelect }: Props) {
  return (
    <button
      className="hotspot"
      style={{ left: `${hotspot.x * 100}%`, top: `${hotspot.y * 100}%` }}
      onClick={() => onSelect(hotspot)}
      aria-label={hotspot.label}
    >
      <span className="hotspot__ring" aria-hidden="true" />
      <span className="hotspot__label">{hotspot.label}</span>
    </button>
  )
}