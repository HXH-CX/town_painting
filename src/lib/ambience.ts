const SOUND_KEY = 'zzhz.sound'

interface Voice {
  gain: GainNode
  stops: (() => void)[]
}

let ctx: AudioContext | null = null
let master: GainNode | null = null
let noise: AudioBuffer | null = null
let voice: Voice | null = null
let current: string | null = null
let enabled = typeof localStorage !== 'undefined' && localStorage.getItem(SOUND_KEY) === '1'

const listeners = new Set<() => void>()
function emit() {
  listeners.forEach((l) => l())
}

export function subscribeAmbience(cb: () => void): () => void {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

export function isEnabled(): boolean {
  return enabled
}

export function debugState() {
  return { enabled, current, ctx: ctx?.state ?? null, voice: !!voice }
}

function ensure() {
  if (ctx) {
    void ctx.resume()
    return
  }
  ctx = new AudioContext()
  master = ctx.createGain()
  master.gain.value = 0.9
  master.connect(ctx.destination)
}

function noiseBuffer(): AudioBuffer {
  if (noise) return noise
  const len = ctx!.sampleRate * 2
  noise = ctx!.createBuffer(1, len, ctx!.sampleRate)
  const data = noise.getChannelData(0)
  let last = 0
  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1
    last = (last + 0.02 * white) / 1.02
    data[i] = last * 3.5
  }
  return noise
}

function lfo(freq: number, depth: number, target: AudioParam, stops: (() => void)[]) {
  const osc = ctx!.createOscillator()
  const g = ctx!.createGain()
  osc.frequency.value = freq
  g.gain.value = depth
  osc.connect(g)
  g.connect(target)
  osc.start()
  stops.push(() => osc.stop())
}

function chime(base: number, out: GainNode) {
  const t = ctx!.currentTime
  const freqs = [880, 987.77, 1174.66, 1318.51, 1567.98]
  const f = freqs[Math.floor(Math.random() * freqs.length)] * base
  for (const detune of [-3, 3]) {
    const osc = ctx!.createOscillator()
    const g = ctx!.createGain()
    osc.type = 'sine'
    osc.frequency.value = f
    osc.detune.value = detune
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.05, t + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 2.5)
    osc.connect(g)
    g.connect(out)
    osc.start(t)
    osc.stop(t + 2.6)
  }
}

function bell(out: GainNode) {
  const t = ctx!.currentTime
  const base = 220
  const partials: [number, number][] = [
    [1, 0.11],
    [2.0, 0.055],
    [2.98, 0.03],
    [4.2, 0.016],
  ]
  for (const [ratio, amp] of partials) {
    const osc = ctx!.createOscillator()
    const g = ctx!.createGain()
    osc.type = 'sine'
    osc.frequency.value = base * ratio
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(amp, t + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 5)
    osc.connect(g)
    g.connect(out)
    osc.start(t)
    osc.stop(t + 5.1)
  }
}

function buildVoice(slug: string): Voice {
  const stops: (() => void)[] = []
  const gain = ctx!.createGain()
  gain.gain.value = 0
  gain.connect(master!)
  const src = ctx!.createBufferSource()
  src.buffer = noiseBuffer()
  src.loop = true
  src.start()
  stops.push(() => src.stop())

  const filter = ctx!.createBiquadFilter()
  const bed = ctx!.createGain()
  src.connect(filter)
  filter.connect(bed)
  bed.connect(gain)

  if (slug === 'zhenhe') {
    filter.type = 'lowpass'
    filter.frequency.value = 420
    bed.gain.value = 0.5
    lfo(0.09, 140, filter.frequency, stops)
    const ripple = ctx!.createBiquadFilter()
    ripple.type = 'bandpass'
    ripple.frequency.value = 900
    ripple.Q.value = 1
    const rg = ctx!.createGain()
    rg.gain.value = 0.12
    src.connect(ripple)
    ripple.connect(rg)
    rg.connect(gain)
    lfo(0.06, 250, ripple.frequency, stops)
  } else if (slug === 'shiomi') {
    filter.type = 'lowpass'
    filter.frequency.value = 520
    bed.gain.value = 0.42
    lfo(0.07, 220, filter.frequency, stops)
    const tick = () => {
      chime(1, gain)
      timer = window.setTimeout(tick, 3500 + Math.random() * 5000)
    }
    let timer = window.setTimeout(tick, 1500)
    stops.push(() => window.clearTimeout(timer))
  } else {
    filter.type = 'bandpass'
    filter.frequency.value = 260
    filter.Q.value = 0.6
    bed.gain.value = 0.35
    lfo(0.05, 120, filter.frequency, stops)
    const tick = () => {
      bell(gain)
      timer = window.setTimeout(tick, 16000 + Math.random() * 10000)
    }
    let timer = window.setTimeout(tick, 4000)
    stops.push(() => window.clearTimeout(timer))
  }

  return { gain, stops }
}

function kill(v: Voice, delay: number) {
  window.setTimeout(() => v.stops.forEach((s) => s()), delay)
}

function crossfade(slug: string | null, seconds: number) {
  if (!ctx || !slug) return
  const old = voice
  const v = buildVoice(slug)
  v.gain.gain.setValueAtTime(0, ctx.currentTime)
  v.gain.gain.linearRampToValueAtTime(1, ctx.currentTime + seconds)
  voice = v
  if (old) {
    old.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + seconds)
    kill(old, seconds * 1000 + 100)
  }
}

export function setScene(slug: string | null) {
  current = slug
  if (enabled && ctx && slug) crossfade(slug, 0.6)
}

export function setEnabled(on: boolean) {
  enabled = on
  localStorage.setItem(SOUND_KEY, on ? '1' : '0')
  if (on) {
    ensure()
    crossfade(current, 0.4)
  } else if (voice && ctx) {
    const old = voice
    voice = null
    old.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4)
    kill(old, 500)
    window.setTimeout(() => {
      if (!voice) void ctx?.suspend()
    }, 600)
  }
  emit()
}

if (import.meta.env.DEV && typeof window !== 'undefined') {
  ;(window as Window & { __ambience?: unknown }).__ambience = { debugState, setEnabled, setScene }
}

if (enabled && typeof window !== 'undefined') {
  window.addEventListener(
    'pointerdown',
    () => {
      ensure()
      crossfade(current, 0.4)
    },
    { once: true },
  )
}