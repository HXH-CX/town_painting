export function getFlag(name: string): boolean {
  const q = `${location.search}&${location.hash.split('?')[1] ?? ''}`
  return new URLSearchParams(q).get(name) === '1'
}

export function motionOK(): boolean {
  return !getFlag('lite') && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

let busy = false
export function isTransitioning(): boolean {
  return busy
}

const EASE = 'cubic-bezier(.22,.61,.36,1)'

function stage(): HTMLElement {
  const el = document.createElement('div')
  el.className = 'transition-stage'
  Object.assign(el.style, { position: 'fixed', inset: '0', zIndex: '50', pointerEvents: 'auto' })
  document.body.appendChild(el)
  return el
}

function cloneSceneMedia(): HTMLElement | null {
  const media = document.querySelector<HTMLElement>('.scene .scene__layer--current')
  if (!media) return null
  const clone = media.cloneNode(true) as HTMLElement
  clone.style.animation = 'none'
  clone.querySelectorAll<HTMLElement>('img, .scene__placeholder').forEach((n) => {
    n.style.animation = 'none'
  })
  return clone
}

function run(overlay: HTMLElement, clone: HTMLElement, keyframes: Keyframe[], duration: number) {
  busy = true
  let done = false
  const cleanup = () => {
    if (done) return
    done = true
    overlay.remove()
    busy = false
  }
  try {
    const anim = clone.animate(keyframes, { duration, easing: EASE, fill: 'forwards' })
    anim.finished.then(cleanup, cleanup)
  } catch {
    cleanup()
    return
  }
  window.setTimeout(cleanup, duration + 150)
}

export function runPushIn(origin: { x: number; y: number }): boolean {
  if (busy || !motionOK()) return false
  const clone = cloneSceneMedia()
  if (!clone) return false
  const overlay = stage()
  overlay.appendChild(clone)
  clone.style.transformOrigin = `${origin.x * 100}% ${origin.y * 100}%`
  run(
    overlay,
    clone,
    [
      { transform: 'scale(1)', filter: 'blur(0px)', opacity: 1, offset: 0 },
      { transform: 'scale(2.2)', filter: 'blur(0px)', opacity: 1, offset: 0.6 },
      { transform: 'scale(2.2)', filter: 'blur(8px)', opacity: 0, offset: 1 },
    ],
    700,
  )
  return true
}

export function runZoomOut(origin: { x: number; y: number }): boolean {
  if (busy || !motionOK()) return false
  const clone = cloneSceneMedia()
  if (!clone) return false
  const overlay = stage()
  overlay.appendChild(clone)
  clone.style.transformOrigin = `${origin.x * 100}% ${origin.y * 100}%`
  run(
    overlay,
    clone,
    [
      { transform: 'scale(1)', filter: 'blur(0px)', opacity: 1, offset: 0 },
      { transform: 'scale(0.45)', filter: 'blur(0px)', opacity: 1, offset: 0.6 },
      { transform: 'scale(0.45)', filter: 'blur(6px)', opacity: 0, offset: 1 },
    ],
    650,
  )
  return true
}

export function runFlipFrom(el: HTMLElement): boolean {
  if (busy || !motionOK()) return false
  const rect = el.getBoundingClientRect()
  const clone = el.cloneNode(true) as HTMLElement
  const overlay = stage()
  Object.assign(clone.style, {
    position: 'absolute',
    inset: '0',
    width: '100%',
    height: '100%',
    aspectRatio: 'auto',
    margin: '0',
    transformOrigin: '0 0',
    animation: 'none',
  })
  overlay.appendChild(clone)
  run(
    overlay,
    clone,
    [
      {
        transform: `translate(${rect.left}px, ${rect.top}px) scale(${rect.width / innerWidth}, ${rect.height / innerHeight})`,
        opacity: 1,
        borderRadius: '14px',
        offset: 0,
      },
      { transform: 'translate(0px, 0px) scale(1, 1)', opacity: 1, borderRadius: '0px', offset: 0.75 },
      { transform: 'translate(0px, 0px) scale(1, 1)', opacity: 0, borderRadius: '0px', offset: 1 },
    ],
    900,
  )
  return true
}