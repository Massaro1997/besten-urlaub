import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Impressum | Bester Urlaub',
  description:
    'Impressum und Angaben gemaess Paragraph 5 TMG fuer Bester Urlaub.',
  robots: { index: true, follow: true },
}

export default function ImpressumPage() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <article className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Badge */}
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#2e75fa] bg-[#2e75fa]/10 px-3 py-1 rounded-full mb-6">
          Rechtliches
        </span>

        <h1 className="text-3xl sm:text-4xl font-bold text-[#0a1a3a] mb-12">
          Impressum
        </h1>

        {/* Angaben gemaess 5 TMG */}
        <Section title="Angaben gem&auml;&szlig; &sect; 5 TMG">
          <p>Massaro Calogero</p>
          <p>Br&uuml;sseler Stra&szlig;e 39</p>
          <p>51149 K&ouml;ln</p>
          <p>Deutschland</p>
          <Spacer />
          <p>
            <strong>Telefon:</strong>{' '}
            <a
              href="tel:+4917682405507"
              className="text-[#2e75fa] hover:underline"
            >
              +49 176 82405507
            </a>
          </p>
          <p>
            <strong>E-Mail:</strong>{' '}
            <a
              href="mailto:info@besterurlaub.com"
              className="text-[#2e75fa] hover:underline"
            >
              info@besterurlaub.com
            </a>
          </p>
        </Section>

        {/* Geschaeftsdaten */}
        <Section title="Gesch&auml;ftsdaten">
          <p>
            <strong>Steuernummer:</strong> 216/5127/5086
          </p>
          <p>
            <strong>Umsatzsteuer-Identifikationsnummer (USt-IdNr.):</strong>{' '}
            DE450276485
          </p>
          <p>
            <strong>Finanzamt:</strong> K&ouml;ln-Porz
          </p>
        </Section>

        {/* Verantwortlich */}
        <Section title="Verantwortlich f&uuml;r den Inhalt nach &sect; 55 Abs. 2 RSt&shy;V">
          <p>Massaro Calogero</p>
          <p>Br&uuml;sseler Stra&szlig;e 39</p>
          <p>51149 K&ouml;ln</p>
          <p>Deutschland</p>
        </Section>

        {/* CHECK24 Partnerprogramm */}
        <Section title="CHECK24.net Partnerprogramm">
          <p>
            Wir nehmen am CHECK24.net Partnerprogramm teil. Auf unseren Seiten
            werden iFrame-Buchungsmasken und andere Werbemittel eingebunden, an
            denen wir &uuml;ber Transaktionen, zum Beispiel durch Leads und
            Sales, eine Werbekostenerstattung erhalten k&ouml;nnen.
          </p>
          <p className="mt-3">
            Weitere Informationen zur Datennutzung durch CHECK24.net erhalten
            Sie in der Datenschutzerkl&auml;rung von{' '}
            <a
              href="https://www.check24.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2e75fa] hover:underline"
            >
              CHECK24.net
            </a>
            .
          </p>
        </Section>

        {/* EU-Streitschlichtung */}
        <Section title="EU-Streitschlichtung">
          <p>
            Die Europ&auml;ische Kommission stellt eine Plattform zur
            Online-Streitbeilegung (OS) bereit:{' '}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2e75fa] hover:underline break-all"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
          </p>
          <p className="mt-3">
            Unsere E-Mail-Adresse finden Sie oben im Impressum.
          </p>
        </Section>

        {/* Verbraucherstreitbeilegung */}
        <Section title="Verbraucherstreitbeilegung / Universalschlichtungsstelle">
          <p>
            Wir sind nicht bereit oder verpflichtet, an
            Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
            teilzunehmen.
          </p>
        </Section>

        {/* Haftung fuer Inhalte */}
        <Section title="Haftung f&uuml;r Inhalte">
          <p>
            Als Diensteanbieter sind wir gem&auml;&szlig; &sect; 7 Abs. 1 TMG
            f&uuml;r eigene Inhalte auf diesen Seiten nach den allgemeinen
            Gesetzen verantwortlich. Nach &sect;&sect; 8 bis 10 TMG sind wir als
            Diensteanbieter jedoch nicht verpflichtet, &uuml;bermittelte oder
            gespeicherte fremde Informationen zu &uuml;berwachen oder nach
            Umst&auml;nden zu forschen, die auf eine rechtswidrige
            T&auml;tigkeit hinweisen.
          </p>
          <p className="mt-3">
            Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
            Informationen nach den allgemeinen Gesetzen bleiben hiervon
            unber&uuml;hrt. Eine diesbez&uuml;gliche Haftung ist jedoch erst ab
            dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung
            m&ouml;glich. Bei Bekanntwerden von entsprechenden
            Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
          </p>
        </Section>

        {/* Haftung fuer Links */}
        <Section title="Haftung f&uuml;r Links">
          <p>
            Unser Angebot enth&auml;lt Links zu externen Websites Dritter, auf
            deren Inhalte wir keinen Einfluss haben. Deshalb k&ouml;nnen wir
            f&uuml;r diese fremden Inhalte auch keine Gew&auml;hr
            &uuml;bernehmen. F&uuml;r die Inhalte der verlinkten Seiten ist
            stets der jeweilige Anbieter oder Betreiber der Seiten
            verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der
            Verlinkung auf m&ouml;gliche Rechtsverst&ouml;&szlig;e
            &uuml;berpr&uuml;ft. Rechtswidrige Inhalte waren zum Zeitpunkt der
            Verlinkung nicht erkennbar.
          </p>
          <p className="mt-3">
            Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist
            jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht
            zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir
            derartige Links umgehend entfernen.
          </p>
        </Section>

        {/* Urheberrecht */}
        <Section title="Urheberrecht">
          <p>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
            diesen Seiten unterliegen dem deutschen Urheberrecht. Die
            Vervielf&auml;ltigung, Bearbeitung, Verbreitung und jede Art der
            Verwertung au&szlig;erhalb der Grenzen des Urheberrechtes
            bed&uuml;rfen der schriftlichen Zustimmung des jeweiligen Autors
            bzw. Erstellers. Downloads und Kopien dieser Seite sind nur f&uuml;r
            den privaten, nicht kommerziellen Gebrauch gestattet.
          </p>
          <p className="mt-3">
            Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt
            wurden, werden die Urheberrechte Dritter beachtet. Insbesondere
            werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie
            trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten
            wir um einen entsprechenden Hinweis. Bei Bekanntwerden von
            Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
          </p>
        </Section>

        {/* Footer nav + last update */}
        <div className="mt-16 pt-8 border-t border-[#0a1a3a]/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link
              href="/datenschutz"
              className="text-sm text-[#2e75fa] hover:underline"
            >
              Zur Datenschutzerkl&auml;rung
            </Link>
            <p className="text-xs text-[#0a1a3a]/50">
              Letzte Aktualisierung: M&auml;rz 2026
            </p>
          </div>
        </div>
      </article>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Reusable sub-components (kept local to this file)                 */
/* ------------------------------------------------------------------ */

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-10">
      <h2
        className="text-lg sm:text-xl font-bold text-[#0a1a3a] mb-3"
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <div className="text-[#0a1a3a]/80 text-sm sm:text-base leading-relaxed space-y-1">
        {children}
      </div>
    </section>
  )
}

function Spacer() {
  return <div className="h-3" />
}
