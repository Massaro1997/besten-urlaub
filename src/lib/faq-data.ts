/**
 * Homepage FAQ items.
 * Single source of truth used by:
 *   - <FaqSection /> (client component, accordion UI)
 *   - FAQPage JSON-LD on the homepage (server-rendered)
 *
 * Keep questions tightly worded to maximise the chance of being lifted
 * verbatim into Google's FAQ rich result and AI Overview citations.
 */

export interface FaqItem {
  q: string
  a: string
}

export const HOMEPAGE_FAQ: FaqItem[] = [
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
