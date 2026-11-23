import { useEffect, useState } from 'react'

export default function ShareButton() {
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!msg) return
    const t = window.setTimeout(() => setMsg(null), 2200)
    return () => window.clearTimeout(t)
  }, [msg])

  const share = async () => {
    try {
      await navigator.clipboard.writeText(location.href)
      setMsg('链接已复制,发给想一起去的人')
    } catch {
      setMsg('复制失败,请手动复制地址栏')
    }
  }

  return (
    <>
      <button className="tool-btn" aria-label="分享当前画面" onClick={share}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="4" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="12" cy="4" r="2" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.3" />
          <path d="M5.8 7.1l4.4-2.2M5.8 8.9l4.4 2.2" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      </button>
      {msg && (
        <div className="toast" role="status">
          {msg}
        </div>
      )}
    </>
  )
}