import { navigate } from '../router'

export default function Breadcrumb({ items }: { items: { label: string; to: string }[] }) {
  return (
    <nav className="breadcrumb" aria-label="路径">
      {items.map((it, i) => (
        <span key={it.to}>
          {i > 0 && <span className="breadcrumb__sep">/</span>}
          <button onClick={() => navigate(it.to)}>{it.label}</button>
        </span>
      ))}
    </nav>
  )
}