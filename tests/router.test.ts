import { describe, expect, it } from 'vitest'
import { parseHash } from '../src/router'

describe('parseHash', () => {
  it('空 hash 回首页', () => {
    expect(parseHash('', 'cinematic')).toEqual({ town: undefined, street: undefined, style: 'cinematic' })
  })

  it('首页路径', () => {
    expect(parseHash('#/', 'cinematic').town).toBeUndefined()
  })

  it('镇路径', () => {
    expect(parseHash('#/zhenhe', 'cinematic')).toMatchObject({ town: 'zhenhe', street: undefined })
  })

  it('街道 + 画风参数', () => {
    expect(parseHash('#/zhenhe/bridge?style=watercolor', 'cinematic')).toEqual({
      town: 'zhenhe',
      street: 'bridge',
      style: 'watercolor',
    })
  })

  it('非法画风回落默认', () => {
    expect(parseHash('#/zhenhe?style=bogus', 'pixel').style).toBe('pixel')
  })

  it('缺省画风使用记忆值', () => {
    expect(parseHash('#/shiomi', 'watercolor').style).toBe('watercolor')
  })

  it('多余路径段忽略', () => {
    expect(parseHash('#/zhenhe/bridge/extra', 'cinematic').street).toBe('bridge')
  })
})