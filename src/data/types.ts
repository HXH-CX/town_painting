export type StyleId = 'cinematic' | 'watercolor' | 'pixel'

export interface StoryCard {
  title: string
  body: string
}

export interface Hotspot {
  id: string
  label: string
  x: number
  y: number
  to?: string
  story?: StoryCard
}

export interface Scene {
  slug: string
  name: string
  hotspots: Hotspot[]
}

export interface Town {
  slug: string
  name: string
  tagline: string
  dossier: string
  palette: [string, string]
  audio: string
  cover: Scene
  streets: Scene[]
}