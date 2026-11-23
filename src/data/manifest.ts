import raw from './generated/manifest.json'

export interface SizeEntry {
  avif: string
  webp: string
  jpg?: string
}

export interface AssetEntry {
  w: number
  h: number
  lqip: string
  sizes: Record<string, SizeEntry>
}

const manifest = raw as Record<string, AssetEntry>

export const WIDTHS = [480, 960, 1600]

export function assetFor(town: string, scene: string, style: string): AssetEntry | undefined {
  return manifest[`${town}/${scene}/${style}`]
}

export function srcSetFor(entry: AssetEntry, ext: 'avif' | 'webp'): string {
  return WIDTHS.map((w) => `${import.meta.env.BASE_URL}${entry.sizes[w][ext]} ${w}w`).join(', ')
}

export function hasAssets(): boolean {
  return Object.keys(manifest).length > 0
}