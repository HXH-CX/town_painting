import type { Hotspot } from '../data/types'

interface Props {
  hotspot: Hotspot
  pos: { left: number; top: number }
  onSelect: (h: Hotspot, pos: { left: number; top: number }) => void
}

export default function HotspotButton({ hotspot, pos, onSelect }: Props) {
  return (
    <button
      className="hotspot"
      style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
      onClick={() => onSelect(hotspot, pos)}
      aria-label={hotspot.label}
    >
      <span className="hotspot__ring" aria-hidden="true" />
      <span className="hotspot__label">{hotspot.label}</span>
    </button>
  )
}