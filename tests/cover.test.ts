import { describe, expect, it } from 'vitest'
import { coverPos, imagePos } from '../src/lib/cover'

const ASPECT = 1600 / 896

describe('cover 坐标映射', () => {
  it('中心点在任何容器比例下保持居中', () => {
    for (const box of [
      { w: 1600, h: 900 },
      { w: 400, h: 800 },
      { w: 1440, h: 600 },
    ]) {
      const p = coverPos(0.5, 0.5, box, ASPECT)
      expect(p.left).toBeCloseTo(50, 5)
      expect(p.top).toBeCloseTo(50, 5)
    }
  })

  it('竖屏裁切时边缘热点移出视口', () => {
    const p = coverPos(0.05, 0.5, { w: 400, h: 800 }, ASPECT)
    expect(p.left).toBeLessThan(0)
  })

  it('竖屏 contain 模式下所有热点留在视口内', () => {
    const box = { w: 400, h: 800 }
    for (const [x, y] of [
      [0.05, 0.5],
      [0.17, 0.48],
      [0.84, 0.4],
      [0.95, 0.9],
    ]) {
      const p = coverPos(x, y, box, ASPECT, true)
      expect(p.left).toBeGreaterThanOrEqual(0)
      expect(p.left).toBeLessThanOrEqual(100)
      expect(p.top).toBeGreaterThanOrEqual(0)
      expect(p.top).toBeLessThanOrEqual(100)
    }
  })

  it('contain 模式正反映射可逆', () => {
    const box = { w: 400, h: 800 }
    const p = coverPos(0.17, 0.48, box, ASPECT, true)
    const back = imagePos(p.left, p.top, box, ASPECT, true)
    expect(back.x).toBeCloseTo(0.17, 6)
    expect(back.y).toBeCloseTo(0.48, 6)
  })

  it('正反映射可逆', () => {
    const box = { w: 400, h: 800 }
    for (const [x, y] of [
      [0.2, 0.3],
      [0.5, 0.5],
      [0.84, 0.4],
    ]) {
      const p = coverPos(x, y, box, ASPECT)
      const back = imagePos(p.left, p.top, box, ASPECT)
      expect(back.x).toBeCloseTo(x, 6)
      expect(back.y).toBeCloseTo(y, 6)
    }
  })
})