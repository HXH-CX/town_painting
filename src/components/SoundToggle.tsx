import { useState } from 'react'

const SOUND_KEY = 'zzhz.sound'

export default function SoundToggle() {
  const [on, setOn] = useState(() => localStorage.getItem(SOUND_KEY) === '1')

  const toggle = () => {
    const next = !on
    setOn(next)
    localStorage.setItem(SOUND_KEY, next ? '1' : '0')
  }

  return (
    <button className="tool-btn" aria-pressed={on} aria-label={on ? '关闭环境音' : '开启环境音'} onClick={toggle}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M2 6v4h3l4 3V3L5 6H2z" fill="currentColor" />
        {on ? (
          <path d="M11 5.5c1.2 1.4 1.2 3.6 0 5M12.8 4c2 2.3 2 5.7 0 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        ) : (
          <path d="M11 6l4 4M15 6l-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        )}
      </svg>
    </button>
  )
}