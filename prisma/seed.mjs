import 'dotenv/config'

// Dynamic import for Prisma client
const { PrismaClient } = await import('../src/generated/prisma/client.js')

const prisma = new PrismaClient()

const destinations = [
  // Spagna
  { name: 'Mallorca', country: 'Spagna', category: 'mare', description: 'Isola più grande delle Baleari, perfetta per turisti tedeschi' },
  { name: 'Canarie', country: 'Spagna', category: 'mare', description: "Arcipelago nell'Atlantico con clima perfetto tutto l'anno" },
  { name: 'Andalusia', country: 'Spagna', category: 'citta', description: 'Regione del sud con Siviglia, Granada, Malaga' },
  // Italia
  { name: 'Sardegna', country: 'Italia', category: 'mare', description: 'Spiagge caraibiche nel Mediterraneo' },
  { name: 'Sicilia', country: 'Italia', category: 'mare', description: 'Cultura, cibo e mare straordinari' },
  { name: 'Calabria', country: 'Italia', category: 'mare', description: 'Costa degli Dei, mare cristallino e prezzi accessibili' },
  { name: 'Südtirol', country: 'Italia', category: 'montagna', description: 'Alto Adige — montagne, wellness e cultura bilingue' },
  { name: 'Lago di Garda', country: 'Italia', category: 'avventura', description: "Il lago più grande d'Italia, sport e relax" },
  // Turchia
  { name: 'Antalya', country: 'Turchia', category: 'mare', description: 'Riviera turca, resort tutto incluso a prezzi top' },
  { name: 'Bodrum', country: 'Turchia', category: 'mare', description: 'Costa Egea, vita notturna e boutique hotel' },
  { name: 'Dalaman', country: 'Turchia', category: 'mare', description: 'Ölüdeniz, laguna blu e paragliding' },
  { name: 'Izmir', country: 'Turchia', category: 'citta', description: 'Terza città turca, vicina a Efeso' },
  { name: 'Istanbul', country: 'Turchia', category: 'citta', description: 'Metropoli tra Europa e Asia' },
  // Grecia
  { name: 'Creta', country: 'Grecia', category: 'mare', description: 'Isola più grande della Grecia, storia e spiagge' },
  { name: 'Rodi', country: 'Grecia', category: 'mare', description: 'Isola del sole, Dodecaneso' },
  { name: 'Kos', country: 'Grecia', category: 'mare', description: 'Piccola isola greca con spiagge infinite' },
  { name: 'Corfù', country: 'Grecia', category: 'mare', description: 'Isola verde dello Ionio' },
  // Egitto
  { name: 'Cairo', country: 'Egitto', category: 'citta', description: 'Piramidi, storia millenaria' },
  { name: 'Hurghada', country: 'Egitto', category: 'mare', description: 'Mar Rosso, snorkeling e diving spettacolari' },
  { name: 'Sharm el-Sheikh', country: 'Egitto', category: 'mare', description: 'Resort sul Mar Rosso, barriera corallina' },
  // Mauritius
  { name: 'Mauritius', country: 'Mauritius', category: 'mare', description: "Paradiso tropicale nell'Oceano Indiano" },
  // Extra per strategia video
  { name: 'Thailandia', country: 'Thailandia', category: 'avventura', description: 'La meta long-haul da sogno, spiagge e cultura' },
  { name: 'Bali', country: 'Indonesia', category: 'avventura', description: 'La meta Instagrammabile che vende emozione' },
]

async function main() {
  console.log('Seeding database...')
  for (const dest of destinations) {
    const id = dest.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    await prisma.destination.upsert({
      where: { id },
      update: {},
      create: { id, ...dest },
    })
  }
  console.log(`Seeded ${destinations.length} destinations`)
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
