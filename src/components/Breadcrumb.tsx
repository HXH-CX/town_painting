import { navigate } from '../router'

interface Props {
  items: { label: string; to: string }[]
  onNavigate?: (to: string) => void
}

export default function Breadcrumb({ items, onNavigate }: Props) {
  return (
    <nav className="breadcrumb" aria-label="路径">
      {items.map((it, i) => (
        <span key={it.to}>
          {i > 0 && <span className="breadcrumb__sep">/</span>}
          <button onClick={() => (onNavigate ?? navigate)(it.to)}>{it.label}</button>
        </span>
      ))}
    </nav>
  )
}