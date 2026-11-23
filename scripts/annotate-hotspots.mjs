import sharp from 'sharp'
import { TOWNS } from '../src/data/towns.ts'

const W = 1792
const H = 996
const TW = 480
const TH = 267
const tiles = []

for (const town of TOWNS) {
  for (const scene of [town.cover, ...town.streets]) {
    const marks = scene.hotspots
      .map(
        (h) =>
          `<circle cx="${h.x * TW}" cy="${h.y * TH}" r="8" fill="none" stroke="#ff3355" stroke-width="2.5"/>` +
          `<text x="${h.x * TW + 10}" y="${h.y * TH + 4}" font-size="12" fill="#ff3355" stroke="#000" stroke-width="0.6" font-family="sans-serif">${h.label}</text>`,
      )
      .join('')
    const svg = `<svg width="${TW}" height="${TH}">${marks}</svg>`
    const buf = await sharp(`assets-src/${town.slug}/${scene.slug}.cinematic.png`)
      .extract({ left: 0, top: 0, width: W, height: H })
      .resize(TW, TH, { fit: 'cover' })
      .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
      .jpeg({ quality: 85 })
      .toBuffer()
    tiles.push(buf)
  }
}

const composites = tiles.map((input, i) => ({ input, left: (i % 3) * 480, top: Math.floor(i / 3) * 267 }))
await sharp({ create: { width: 1440, height: 801, channels: 3, background: '#111111' } })
  .composite(composites)
  .jpeg({ quality: 88 })
  .toFile('docs/assets/hotspots-check.jpg')
console.log('hotspots check sheet done')