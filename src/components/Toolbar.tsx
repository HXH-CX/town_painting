import { useState } from 'react'
import type { Scene, StyleId, Town } from '../data/types'
import StyleSwitcher from './StyleSwitcher'
import SoundToggle from './SoundToggle'
import ShareButton from './ShareButton'
import StoryCard from './StoryCard'
import '../styles/toolbar.css'

interface Props {
  town: Town
  street?: Scene
  style: StyleId
}

const ABOUT = {
  title: '关于本作品',
  body: '玩法:点一座镇走进去,点街道推镜入街,点光斑读一句小镇旁白;右上角可切换写实 / 水彩 / 像素三种笔触,分享按钮复制当前画面的深链接。\n声明:全部画面由 AI 图像模型生成;环境音为 WebAudio 程序化合成(水声、风铃、钟声),无外部录音素材。\n本作参加 2026 Qoder 高校创造力大赛。',
}

export default function Toolbar({ town, street, style }: Props) {
  const [about, setAbout] = useState(false)
  return (
    <div className="toolbar">
      <StyleSwitcher town={town} street={street} style={style} />
      <SoundToggle />
      <ShareButton />
      <button className="tool-btn" aria-label="关于本作品" onClick={() => setAbout(true)}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="6.4" stroke="currentColor" strokeWidth="1.3" />
          <path d="M8 7.2v3.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="8" cy="5" r="0.9" fill="currentColor" />
        </svg>
      </button>
      {about && <StoryCard story={ABOUT} onClose={() => setAbout(false)} />}
    </div>
  )
}