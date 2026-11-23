import type { Scene, StyleId, Town } from '../data/types'
import { STYLES, STYLE_LABEL } from '../data/styles'
import { navigate, rememberStyle } from '../router'

interface Props {
  town: Town
  street?: Scene
  style: StyleId
}

export default function StyleSwitcher({ town, street, style }: Props) {
  const select = (s: StyleId) => {
    rememberStyle(s)
    navigate(`/${town.slug}${street ? `/${street.slug}` : ''}?style=${s}`, true)
  }

  return (
    <div className="style-switcher" role="group" aria-label="画风切换">
      {STYLES.map((s) => (
        <button key={s} aria-pressed={s === style} onClick={() => select(s)}>
          {STYLE_LABEL[s]}
        </button>
      ))}
    </div>
  )
}