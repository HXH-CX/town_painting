import sharp from 'sharp'
import { mkdirSync, writeFileSync, statSync } from 'node:fs'

const SCENES = {
  zhenhe: ['overview', 'bridge', 'lane'],
  shiomi: ['overview', 'slope', 'seawall'],
  zhongya: ['overview', 'plaza', 'riverside'],
}
const STYLES = ['cinematic', 'watercolor', 'pixel']
const WIDTHS = [480, 960, 1600]
const CROP_BOTTOM = 28
const AVIF_LIMIT = 300 * 1024

mkdirSync('public/img/lqip', { recursive: true })
const manifest = {}

for (const [town, scenes] of Object.entries(SCENES)) {
  mkdirSync(`public/img/${town}`, { recursive: true })
  for (const scene of scenes) {
    for (const style of STYLES) {
      const src = `assets-src/${town}/${scene}.${style}.png`
      const meta = await sharp(src).metadata()
      const base = sharp(src).extract({ left: 0, top: 0, width: meta.width, height: meta.height - CROP_BOTTOM })
      const key = `${town}/${scene}/${style}`
      const sizes = {}
      for (const w of WIDTHS) {
        const stem = `img/${town}/${scene}-${style}-${w}`
        let avif = await base.clone().resize(w).avif({ quality: 60, effort: 6 }).toBuffer()
        if (avif.length > AVIF_LIMIT) {
          avif = await base.clone().resize(w).avif({ quality: 48, effort: 6 }).toBuffer()
        }
        const webp = await base.clone().resize(w).webp({ quality: 72 }).toBuffer()
        writeFileSync(`public/${stem}.avif`, avif)
        writeFileSync(`public/${stem}.webp`, webp)
        const entry = { avif: `${stem}.avif`, webp: `${stem}.webp` }
        if (w === 960) {
          const jpg = await base.clone().resize(w).jpeg({ quality: 78 }).toBuffer()
          writeFileSync(`public/${stem}.jpg`, jpg)
          entry.jpg = `${stem}.jpg`
        }
        sizes[w] = entry
        if (w === 1600) {
          const m = await sharp(avif).metadata()
          manifest[key] = { w: m.width, h: m.height, sizes }
        }
      }
      const lqip = await base.clone().resize(32).webp({ quality: 50 }).toBuffer()
      const lqipPath = `img/lqip/${town}-${scene}-${style}.webp`
      writeFileSync(`public/${lqipPath}`, lqip)
      manifest[key].lqip = lqipPath
      const kb = Math.round(statSync(`public/img/${town}/${scene}-${style}-1600.avif`).size / 1024)
      console.log(key, `avif1600 ${kb}KB`)
    }
  }
}

writeFileSync('src/data/generated/manifest.json', JSON.stringify(manifest, null, 2))
await sharp('assets-src/zhenhe/overview.cinematic.png')
  .resize(1200, 630, { fit: 'cover' })
  .jpeg({ quality: 82 })
  .toFile('public/og.jpg')
console.log('manifest entries:', Object.keys(manifest).length)