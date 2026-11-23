import raw from './generated/manifest.json'

export interface AssetEntry {
  src: string
  w: number
  h: number
  lqip: string
}

const manifest = raw as Record<string, AssetEntry>

export function assetFor(town: string, scene: string, style: string, width = 1600): AssetEntry | undefined {
  return manifest[`${town}/${scene}/${style}/${width}`]
}

export function hasAssets(): boolean {
  return Object.keys(manifest).length > 0
}