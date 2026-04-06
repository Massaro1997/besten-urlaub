'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const FAQ_ITEMS = [
  {
    q: 'Was ist ein Pauschalurlaub?',
    a: 'Ein Pauschalurlaub ist ein Reiseangebot, das mehrere Leistungen in einer Buchung vereint. In der Regel sind Flug und Unterkunft enthalten, oft auch Verpflegung, Transfers und Aktivitäten. Das Ziel ist es, dir das Leben einfacher zu machen und beim Reisen zu sparen. Du kannst zwischen All-Inclusive-Angeboten, die fast alles abdecken, oder einfacheren Paketen mit nur Flug und Hotel wählen.',
  },
  {
    q: 'Wie funktioniert der Reisevergleich bei Bester Urlaub?',
    a: 'Wir vergleichen Angebote der führenden Reiseveranstalter und zeigen dir sowohl All-Inclusive-Pakete als auch einfache Flug-Hotel-Kombinationen. Sobald du ein Angebot auswählst, wirst du direkt zum Anbieter weitergeleitet, um dort zu buchen. Jeder Anbieter bietet verschiedene Extras wie Mahlzeiten, Getränke, Flughafentransfers oder Aktivitäten.',
  },
  {
    q: 'Sind Pauschalreisen in der Regel günstiger?',
    a: 'Die Preise variieren je nach Buchungszeitpunkt, Reiseziel und Reisezeitraum. In der Regel ist es jedoch günstiger, eine Pauschalreise zu buchen, als jeden einzelnen Service separat zu kaufen.',
  },
  {
    q: 'Kann ich mein Reisepaket individuell anpassen?',
    a: 'Auf der Ergebnisseite kannst du verschiedene Filter auswählen, um die Ergebnisse nach deinen Wünschen anzupassen. Für spezielle Anfragen wende dich bitte direkt an den von dir gewählten Reiseanbieter.',
  },
  {
    q: 'Tipps für günstige Urlaubsbuchungen?',
    a: 'Nutze unseren Vergleich, um die besten Angebote aller Top-Reiseveranstalter zu finden. Wenn du flexibel mit deinen Reisedaten bist, reise in der Nebensaison oder unter der Woche, um noch mehr zu sparen. Ziehe auch alternative oder weniger beliebte Reiseziele in Betracht und buche frühzeitig, um von niedrigeren Preisen zu profitieren.',
  },
  {
    q: 'Welche sind die besten Reiseziele für Pauschalurlaub?',
    a: 'Ob Mallorca, Antalya, Kreta oder Hurghada — bei uns findest du hunderte Pauschalreisen zur Auswahl. Schau dir unsere Top-Reiseziele an, um Inspiration zu finden.',
  },
  {
    q: 'Kann ich meine Buchung ändern oder stornieren?',
    a: 'Die Stornierungs- und Änderungsrichtlinien variieren je nach Reiseanbieter. Prüfe daher die jeweiligen Bedingungen sorgfältig. In der Regel findest du flexible oder nicht erstattungsfähige Optionen. Für sorgenfreies Reisen empfehlen wir den Abschluss einer Reiseversicherung.',
  },
  {
    q: 'Wie viel Gepäck darf ich mitnehmen?',
    a: 'Die Freigepäckmenge kann je nach Fluggesellschaft und Ticketart variieren. Weitere Details findest du in den Gepäckrichtlinien der jeweiligen Fluggesellschaft, mit der du reist.',
  },
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a1a3a] tracking-tight mb-2">
        G&uuml;nstige Pauschalreisen: H&auml;ufig gestellte Fragen
      </h2>
      <p className="text-sm text-[#0a1a3a]/50 mb-8">
        Plane deine Reise &mdash; alles, was du wissen musst.
      </p>

      <div className="space-y-0 border-t border-[#0a1a3a]/10">
        {FAQ_ITEMS.map((item, i) => (
          <div key={i} className="border-b border-[#0a1a3a]/10">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between py-5 text-left gap-4"
            >
              <span className="text-[15px] font-semibold text-[#0a1a3a]">{item.q}</span>
              <ChevronDown
                className={`w-5 h-5 text-[#0a1a3a]/40 shrink-0 transition-transform duration-200 ${
                  openIndex === i ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openIndex === i && (
              <div className="pb-5 pr-10">
                <p className="text-sm text-[#0a1a3a]/65 leading-relaxed">{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
