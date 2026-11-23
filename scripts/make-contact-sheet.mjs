import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

const styles = ['cinematic', 'watercolor', 'pixel']
const scenes = [
  ['zhenhe', 'overview'],
  ['zhenhe', 'bridge'],
  ['zhenhe', 'lane'],
  ['shiomi', 'overview'],
  ['shiomi', 'slope'],
  ['shiomi', 'seawall'],
  ['zhongya', 'overview'],
  ['zhongya', 'plaza'],
  ['zhongya', 'riverside'],
]

mkdirSync('docs/assets', { recursive: true })

for (const style of styles) {
  const tiles = []
  for (const [town, scene] of scenes) {
    const buf = await sharp(`assets-src/${town}/${scene}.${style}.png`)
      .resize(480, 270, { fit: 'cover' })
      .jpeg({ quality: 82 })
      .toBuffer()
    tiles.push(buf)
  }
  const composites = tiles.map((input, i) => ({
    input,
    left: (i % 3) * 480,
    top: Math.floor(i / 3) * 270,
  }))
  await sharp({ create: { width: 1440, height: 810, channels: 3, background: '#111111' } })
    .composite(composites)
    .jpeg({ quality: 85 })
    .toFile(`docs/assets/contact-${style}.jpg`)
  console.log('sheet done:', style)
}