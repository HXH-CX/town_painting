import { useSyncExternalStore } from 'react'
import { isEnabled, setEnabled, subscribeAmbience } from '../lib/ambience'

export default function SoundToggle() {
  const on = useSyncExternalStore(subscribeAmbience, isEnabled)

  return (
    <button
      className="tool-btn"
      aria-pressed={on}
      aria-label={on ? '关闭环境音' : '开启环境音'}
      onClick={() => setEnabled(!on)}
    >
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