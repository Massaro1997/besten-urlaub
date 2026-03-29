import Link from 'next/link'
import Image from 'next/image'

const DESTINATION_IMAGES: Record<string, string> = {
  mallorca: '/destinations/mallorca.png',
  antalya: '/destinations/antalya.png',
  creta: '/destinations/creta.png',
  hurghada: '/destinations/hurghada.png',
  'sharm-el-sheikh': '/destinations/sharm-el-sheikh.png',
  sardegna: '/destinations/sardegna.png',
  sicilia: '/destinations/sicilia.png',
  canarie: '/destinations/canarie.png',
  mauritius: '/destinations/mauritius.png',
  thailandia: '/destinations/thailandia.png',
  istanbul: '/destinations/istanbul.png',
  marbella: '/destinations/marbella.png',
  santorini: '/destinations/santorini.png',
  'bad-griesbach': '/destinations/bad-griesbach.png',
  nordkroatien: '/destinations/nordkroatien.png',
  chalkidiki: '/destinations/chalkidiki.png',
  'lago-di-garda': '/destinations/lago-di-garda.png',
  fuessen: '/destinations/fuessen.png',
  'playa-del-carmen': '/destinations/playa-del-carmen.png',
  rodi: '/destinations/rodi.png',
  'mont-saint-michel': '/destinations/mont-saint-michel.png',
  holland: '/destinations/holland.png',
  'punta-cana': '/destinations/punta-cana.png',
  corf: '/destinations/corf.png',
  zypern: '/destinations/zypern.png',
}

interface DestinationItem {
  name: string
  country: string
  category: string
  slug: string
  _count: {
    offers: number
  }
}

export function DestinationGrid({ destinations }: { destinations: DestinationItem[] }) {
  return (
    <section id="reiseziele">
      <h2 className="text-2xl font-bold text-[#0a1a3a]">
        Beliebte Reiseziele
      </h2>
      <p className="text-sm text-[#0a1a3a]/60 mt-1">
        Entdecke unsere Top-Destinationen
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {destinations.map((dest) => {
          const image = DESTINATION_IMAGES[dest.slug] || CATEGORY_IMAGES[dest.category] || '/maldives.png'

          return (
            <Link
              key={dest.slug}
              href={`/reiseziel/${dest.slug}`}
              className="relative rounded-2xl overflow-hidden min-h-[160px] sm:min-h-[180px] flex flex-col justify-end group"
            >
              <Image
                src={image}
                alt={dest.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              <div className="relative p-4">
                <span className="text-white font-semibold text-lg leading-tight drop-shadow">
                  {dest.name}
                </span>
                <br />
                <span className="text-white/70 text-sm">
                  {dest.country}
                </span>
                {dest._count.offers > 0 && (
                  <span className="block bg-white/20 backdrop-blur rounded-full px-2.5 py-0.5 text-xs text-white w-fit mt-2">
                    {dest._count.offers} {dest._count.offers === 1 ? 'Angebot' : 'Angebote'}
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
