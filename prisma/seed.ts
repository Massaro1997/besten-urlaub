import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'

function slugify(text: string): string {
  return text.toLowerCase()
    .replace(/[äöüß]/g, (c) => ({ ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' })[c] || c)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Use dynamic import for PrismaPg since it's ESM-compatible
const { PrismaPg } = require('@prisma/adapter-pg') as typeof import('@prisma/adapter-pg')

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const destinations = [
  { name: 'Mallorca', country: 'Spagna', category: 'mare', description: 'Isola più grande delle Baleari, perfetta per turisti tedeschi' },
  { name: 'Canarie', country: 'Spagna', category: 'mare', description: "Arcipelago nell'Atlantico con clima perfetto tutto l'anno" },
  { name: 'Andalusia', country: 'Spagna', category: 'citta', description: 'Regione del sud con Siviglia, Granada, Malaga' },
  { name: 'Sardegna', country: 'Italia', category: 'mare', description: 'Spiagge caraibiche nel Mediterraneo' },
  { name: 'Sicilia', country: 'Italia', category: 'mare', description: 'Cultura, cibo e mare straordinari' },
  { name: 'Calabria', country: 'Italia', category: 'mare', description: 'Costa degli Dei, mare cristallino e prezzi accessibili' },
  { name: 'Südtirol', country: 'Italia', category: 'montagna', description: 'Alto Adige — montagne, wellness e cultura bilingue' },
  { name: 'Lago di Garda', country: 'Italia', category: 'avventura', description: "Il lago più grande d'Italia, sport e relax" },
  { name: 'Antalya', country: 'Turchia', category: 'mare', description: 'Riviera turca, resort tutto incluso a prezzi top' },
  { name: 'Bodrum', country: 'Turchia', category: 'mare', description: 'Costa Egea, vita notturna e boutique hotel' },
  { name: 'Dalaman', country: 'Turchia', category: 'mare', description: 'Ölüdeniz, laguna blu e paragliding' },
  { name: 'Izmir', country: 'Turchia', category: 'citta', description: 'Terza città turca, vicina a Efeso' },
  { name: 'Istanbul', country: 'Turchia', category: 'citta', description: 'Metropoli tra Europa e Asia' },
  { name: 'Creta', country: 'Grecia', category: 'mare', description: 'Isola più grande della Grecia, storia e spiagge' },
  { name: 'Rodi', country: 'Grecia', category: 'mare', description: 'Isola del sole, Dodecaneso' },
  { name: 'Kos', country: 'Grecia', category: 'mare', description: 'Piccola isola greca con spiagge infinite' },
  { name: 'Corfù', country: 'Grecia', category: 'mare', description: 'Isola verde dello Ionio' },
  { name: 'Cairo', country: 'Egitto', category: 'citta', description: 'Piramidi, storia millenaria' },
  { name: 'Hurghada', country: 'Egitto', category: 'mare', description: 'Mar Rosso, snorkeling e diving spettacolari' },
  { name: 'Sharm el-Sheikh', country: 'Egitto', category: 'mare', description: 'Resort sul Mar Rosso, barriera corallina' },
  { name: 'Mauritius', country: 'Mauritius', category: 'mare', description: "Paradiso tropicale nell'Oceano Indiano" },
  { name: 'Thailandia', country: 'Thailandia', category: 'avventura', description: 'La meta long-haul da sogno, spiagge e cultura' },
  { name: 'Bali', country: 'Indonesia', category: 'avventura', description: 'La meta Instagrammabile che vende emozione' },
  { name: 'Marbella', country: 'Spagna', category: 'mare', description: 'Costa del Sol, lusso e vita notturna' },
]

async function main() {
  console.log('Seeding database...')

  for (const dest of destinations) {
    const slug = slugify(dest.name)
    const id = slug

    await prisma.destination.upsert({
      where: { id },
      update: { slug },
      create: { id, slug, ...dest },
    })
  }

  console.log(`Seeded ${destinations.length} destinations`)
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1) })
