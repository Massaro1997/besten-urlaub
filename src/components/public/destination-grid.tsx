import Link from 'next/link'
import Image from 'next/image'

const DESTINATION_IMAGES: Record<string, string> = {
  mallorca: '/destinations/mallorca.webp',
  antalya: '/destinations/antalya.webp',
  creta: '/destinations/creta.webp',
  hurghada: '/destinations/hurghada.webp',
  'sharm-el-sheikh': '/destinations/sharm-el-sheikh.webp',
  sardegna: '/destinations/sardegna.webp',
  sicilia: '/destinations/sicilia.webp',
  canarie: '/destinations/canarie.webp',
  mauritius: '/destinations/mauritius.webp',
  thailandia: '/destinations/thailandia.webp',
  istanbul: '/destinations/istanbul.webp',
  marbella: '/destinations/marbella.webp',
  santorini: '/destinations/santorini.webp',
  'bad-griesbach': '/destinations/bad-griesbach.webp',
  nordkroatien: '/destinations/nordkroatien.webp',
  chalkidiki: '/destinations/chalkidiki.webp',
  'lago-di-garda': '/destinations/lago-di-garda.webp',
  fuessen: '/destinations/fuessen.webp',
  'playa-del-carmen': '/destinations/playa-del-carmen.webp',
  rodi: '/destinations/rodi.webp',
  'mont-saint-michel': '/destinations/mont-saint-michel.webp',
  holland: '/destinations/holland.webp',
  'punta-cana': '/destinations/punta-cana.webp',
  corf: '/destinations/corf.webp',
  zypern: '/destinations/zypern.webp',
  sansibar: '/destinations/sansibar.webp',
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
      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a1a3a] tracking-tight">
        Wohin soll es gehen?
      </h2>
      <p className="text-sm text-[#0a1a3a]/50 mt-2">
        Die Destinationen, die gerade alle wollen.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {destinations.map((dest) => {
          const image = DESTINATION_IMAGES[dest.slug] || '/maldives.png'

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
