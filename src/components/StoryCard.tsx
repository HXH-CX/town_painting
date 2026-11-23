import { useEffect, useRef } from 'react'
import type { StoryCard as Story } from '../data/types'

export default function StoryCard({ story, onClose }: { story: Story; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="story" role="dialog" aria-modal="true" aria-label={story.title}>
      <div className="story__backdrop" onClick={onClose} />
      <div className="story__card">
        <button ref={closeRef} className="story__close" onClick={onClose} aria-label="关闭">
          ×
        </button>
        <h3>{story.title}</h3>
        <p>{story.body}</p>
      </div>
    </div>
  )
}