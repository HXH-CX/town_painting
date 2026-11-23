import type { Scene, StyleId, Town } from '../data/types'
import StyleSwitcher from './StyleSwitcher'
import SoundToggle from './SoundToggle'
import ShareButton from './ShareButton'
import '../styles/toolbar.css'

interface Props {
  town: Town
  street?: Scene
  style: StyleId
}

export default function Toolbar({ town, street, style }: Props) {
  return (
    <div className="toolbar">
      <StyleSwitcher town={town} street={street} style={style} />
      <SoundToggle />
      <ShareButton />
    </div>
  )
}