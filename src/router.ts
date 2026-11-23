import { STYLES } from './data/styles'
import type { StyleId } from './data/types'

export interface Route {
  town?: string
  street?: string
  style: StyleId
}

const STYLE_KEY = 'zzhz.style'

function storedStyle(): StyleId {
  if (typeof localStorage === 'undefined') return 'cinematic'
  const v = localStorage.getItem(STYLE_KEY)
  return (STYLES as string[]).includes(v ?? '') ? (v as StyleId) : 'cinematic'
}

export function parseHash(hash: string, fallback: StyleId = storedStyle()): Route {
  const [path, query = ''] = hash.replace(/^#/, '').split('?')
  const segs = path.split('/').filter(Boolean)
  const styleParam = new URLSearchParams(query).get('style')
  const style = (STYLES as string[]).includes(styleParam ?? '') ? (styleParam as StyleId) : fallback
  return { town: segs[0], street: segs[1], style }
}

let cachedHash: string | null = null
let cachedRoute: Route = { style: 'cinematic' }

export function getRoute(): Route {
  const h = location.hash
  if (h !== cachedHash) {
    cachedHash = h
    cachedRoute = parseHash(h)
  }
  return cachedRoute
}

const listeners = new Set<() => void>()
function emit() {
  listeners.forEach((l) => l())
}
if (typeof window !== 'undefined') window.addEventListener('hashchange', emit)

export function subscribeRoute(cb: () => void): () => void {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

export function navigate(path: string, replace = false) {
  const url = '#' + (path.startsWith('/') ? path : '/' + path)
  if (replace) {
    history.replaceState(null, '', url)
    cachedHash = null
    emit()
  } else if (location.hash !== url) {
    location.hash = url
  } else {
    emit()
  }
}

export function rememberStyle(style: StyleId) {
  localStorage.setItem(STYLE_KEY, style)
}