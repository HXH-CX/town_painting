import { describe, expect, it } from 'vitest'
import { TOWNS } from '../src/data/towns'
import { STYLES } from '../src/data/styles'
import manifest from '../src/data/generated/manifest.json'

describe('towns 数据完整性', () => {
  it('三镇 slug 唯一', () => {
    const slugs = TOWNS.map((t) => t.slug)
    expect(new Set(slugs).size).toBe(3)
  })

  it('全景热点指向真实街道', () => {
    for (const t of TOWNS) {
      for (const h of t.cover.hotspots) {
        expect(h.to).toBeTruthy()
        expect(t.streets.some((s) => s.slug === h.to)).toBe(true)
      }
    }
  })

  it('街道热点均有故事文案', () => {
    for (const t of TOWNS) {
      for (const s of t.streets) {
        for (const h of s.hotspots) {
          expect(h.story?.title).toBeTruthy()
          expect(h.story?.body).toBeTruthy()
        }
      }
    }
  })

  it('热点坐标归一化 0–1', () => {
    for (const t of TOWNS) {
      for (const s of [t.cover, ...t.streets]) {
        for (const h of s.hotspots) {
          expect(h.x).toBeGreaterThanOrEqual(0)
          expect(h.x).toBeLessThanOrEqual(1)
          expect(h.y).toBeGreaterThanOrEqual(0)
          expect(h.y).toBeLessThanOrEqual(1)
        }
      }
    }
  })

  it('故事卡共 15 条', () => {
    const n = TOWNS.flatMap((t) => t.streets)
      .flatMap((s) => s.hotspots)
      .filter((h) => h.story).length
    expect(n).toBe(15)
  })

  it('素材就绪后每场景三画风全覆盖', () => {
    const keys = Object.keys(manifest)
    if (keys.length === 0) return
    for (const t of TOWNS) {
      for (const s of [t.cover, ...t.streets]) {
        for (const st of STYLES) {
          expect(keys.some((k) => k.startsWith(`${t.slug}/${s.slug}/${st}/`))).toBe(true)
        }
      }
    }
  })
})