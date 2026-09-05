import fs from 'fs'
import sharp from 'sharp'

const src = 'D:/Work/ONLINE PROJECT/Progetti in Corso/Bester Urlaub/LOGO NUOVO 2026.svg'
let s = fs.readFileSync(src, 'utf8')

// via il fondo bianco a tutta tela
s = s.replace(/<path transform="translate\(0,0\)" fill="rgb\(255,255,255\)" d="M 0 0 L 2048 0 L 2048 2048 L 0 2048 L 0 0 z"\/>/, '')
// preserveAspectRatio="none" deformerebbe il marchio nei box non quadrati
s = s.replace('preserveAspectRatio="none"', 'preserveAspectRatio="xMidYMid meet"')

// bbox reale del disegno, per togliere i margini vuoti
const png = await sharp(Buffer.from(s), { density: 150 }).resize(1024, 1024, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer()
const { info } = await sharp(png).trim({ threshold: 1 }).toBuffer({ resolveWithObject: true })
const k = 2048 / 1024
const x = Math.max(0, Math.round(info.trimOffsetLeft * -1 * k) - 12)
const y = Math.max(0, Math.round(info.trimOffsetTop * -1 * k) - 12)
const w = Math.min(2048 - x, Math.round(info.width * k) + 24)
const h = Math.min(2048 - y, Math.round(info.height * k) + 24)
s = s.replace('viewBox="0 0 2048 2048"', `viewBox="${x} ${y} ${w} ${h}"`)
s = s.replace(/width="\d+" height="\d+"/, `width="${w}" height="${h}"`)

fs.writeFileSync('public/symbol-2026.svg', s)
fs.writeFileSync('public/brand/logo/symbol-2026.svg', s)
console.log('viewBox', x, y, w, h)

// anteprime
await sharp(Buffer.from(s), { density: 200 }).resize(400).png().toFile('D:/tmp/mark-transp.png')
await sharp({ create: { width: 400, height: 400, channels: 4, background: '#0a1a3a' } })
  .composite([{ input: await sharp(Buffer.from(s), { density: 200 }).resize(340).png().toBuffer(), gravity: 'center' }])
  .png().toFile('D:/tmp/mark-navy.png')
