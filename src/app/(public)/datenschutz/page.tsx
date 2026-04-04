import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Datenschutz | Besten Urlaub',
  description:
    'Datenschutzerklaerung von Besten Urlaub. Informationen zur Erhebung und Verarbeitung personenbezogener Daten.',
  robots: { index: true, follow: true },
}

export default function DatenschutzPage() {
  return (
    <div className="bg-[#f8f9fc] py-16 sm:py-24">
      <article className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Badge */}
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#2e75fa] bg-[#2e75fa]/10 px-3 py-1 rounded-full mb-6">
          Rechtliches
        </span>

        <h1 className="text-3xl sm:text-4xl font-bold text-[#0a1a3a] mb-12">
          Datenschutzerkl&auml;rung
        </h1>

        {/* ------------------------------------------------------------ */}
        {/* 1. Datenschutz auf einen Blick                                */}
        {/* ------------------------------------------------------------ */}
        <Section number="1" title="Datenschutz auf einen Blick">
          <h3 className="font-semibold text-[#0a1a3a] mt-4 mb-2">
            Allgemeine Hinweise
          </h3>
          <p>
            Die folgenden Hinweise geben einen einfachen &Uuml;berblick
            dar&uuml;ber, was mit Ihren personenbezogenen Daten passiert, wenn
            Sie diese Website besuchen. Personenbezogene Daten sind alle Daten,
            mit denen Sie pers&ouml;nlich identifiziert werden k&ouml;nnen.
            Ausf&uuml;hrliche Informationen zum Thema Datenschutz entnehmen Sie
            unserer nachfolgenden Datenschutzerkl&auml;rung.
          </p>

          <h3 className="font-semibold text-[#0a1a3a] mt-4 mb-2">
            Datenerfassung auf dieser Website
          </h3>
          <p>
            <strong>
              Wer ist verantwortlich f&uuml;r die Datenerfassung auf dieser
              Website?
            </strong>
          </p>
          <p>
            Die Datenverarbeitung auf dieser Website erfolgt durch den
            Websitebetreiber. Dessen Kontaktdaten k&ouml;nnen Sie dem Abschnitt
            &bdquo;Hinweis zur verantwortlichen Stelle&ldquo; in dieser
            Datenschutzerkl&auml;rung entnehmen.
          </p>

          <p className="mt-3">
            <strong>Wie erfassen wir Ihre Daten?</strong>
          </p>
          <p>
            Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese
            mitteilen. Hierbei kann es sich z.&thinsp;B. um Daten handeln, die
            Sie in ein Kontaktformular eingeben. Andere Daten werden automatisch
            oder nach Ihrer Einwilligung beim Besuch der Website durch unsere
            IT-Systeme erfasst. Das sind vor allem technische Daten (z.&thinsp;B.
            Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).
          </p>

          <p className="mt-3">
            <strong>Wof&uuml;r nutzen wir Ihre Daten?</strong>
          </p>
          <p>
            Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung
            der Website zu gew&auml;hrleisten. Andere Daten k&ouml;nnen zur
            Analyse Ihres Nutzerverhaltens verwendet werden.
          </p>

          <p className="mt-3">
            <strong>Welche Rechte haben Sie bez&uuml;glich Ihrer Daten?</strong>
          </p>
          <p>
            Sie haben jederzeit das Recht, unentgeltlich Auskunft &uuml;ber
            Herkunft, Empf&auml;nger und Zweck Ihrer gespeicherten
            personenbezogenen Daten zu erhalten. Sie haben au&szlig;erdem ein
            Recht, die Berichtigung oder L&ouml;schung dieser Daten zu
            verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt
            haben, k&ouml;nnen Sie diese Einwilligung jederzeit f&uuml;r die
            Zukunft widerrufen. Au&szlig;erdem haben Sie das Recht, unter
            bestimmten Umst&auml;nden die Einschr&auml;nkung der Verarbeitung
            Ihrer personenbezogenen Daten zu verlangen. Des Weiteren steht Ihnen
            ein Beschwerderecht bei der zust&auml;ndigen Aufsichtsbeh&ouml;rde
            zu.
          </p>
        </Section>

        {/* ------------------------------------------------------------ */}
        {/* 2. Hosting                                                    */}
        {/* ------------------------------------------------------------ */}
        <Section number="2" title="Hosting">
          <p>
            Wir hosten die Inhalte unserer Website bei{' '}
            <strong>Vercel Inc.</strong> (340 S Lemon Ave #4133, Walnut, CA
            91789, USA). Vercel ist ein Cloud-Hosting-Anbieter, der unsere
            Website auf Servern in der EU und den USA bereitstellt.
          </p>
          <p className="mt-3">
            Die Nutzung von Vercel erfolgt auf Grundlage von Art. 6 Abs. 1
            lit.&thinsp;f DSGVO. Wir haben ein berechtigtes Interesse an einer
            m&ouml;glichst zuverl&auml;ssigen und performanten Darstellung
            unserer Website. Sofern eine entsprechende Einwilligung abgefragt
            wurde, erfolgt die Verarbeitung ausschlie&szlig;lich auf Grundlage
            von Art. 6 Abs. 1 lit.&thinsp;a DSGVO. Die Einwilligung ist
            jederzeit widerrufbar.
          </p>
          <p className="mt-3">
            Die Daten&uuml;bertragung in die USA wird auf die
            Standardvertragsklauseln der EU-Kommission gest&uuml;tzt. Details
            finden Sie unter:{' '}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2e75fa] hover:underline break-all"
            >
              https://vercel.com/legal/privacy-policy
            </a>
          </p>
        </Section>

        {/* ------------------------------------------------------------ */}
        {/* 3. Allgemeine Hinweise und Pflichtinformationen               */}
        {/* ------------------------------------------------------------ */}
        <Section number="3" title="Allgemeine Hinweise und Pflichtinformationen">
          <h3 className="font-semibold text-[#0a1a3a] mt-4 mb-2">
            Datenschutz
          </h3>
          <p>
            Die Betreiber dieser Seiten nehmen den Schutz Ihrer
            pers&ouml;nlichen Daten sehr ernst. Wir behandeln Ihre
            personenbezogenen Daten vertraulich und entsprechend den
            gesetzlichen Datenschutzvorschriften sowie dieser
            Datenschutzerkl&auml;rung.
          </p>
          <p className="mt-3">
            Wir weisen darauf hin, dass die Daten&uuml;bertragung im Internet
            (z.&thinsp;B. bei der Kommunikation per E-Mail)
            Sicherheitsl&uuml;cken aufweisen kann. Ein l&uuml;ckenloser Schutz
            der Daten vor dem Zugriff durch Dritte ist nicht m&ouml;glich.
          </p>

          <h3 className="font-semibold text-[#0a1a3a] mt-6 mb-2">
            Hinweis zur verantwortlichen Stelle
          </h3>
          <p>
            Die verantwortliche Stelle f&uuml;r die Datenverarbeitung auf dieser
            Website ist:
          </p>
          <p className="mt-2">Massaro Calogero</p>
          <p>Br&uuml;sseler Stra&szlig;e 39</p>
          <p>51149 K&ouml;ln</p>
          <p>Deutschland</p>
          <p className="mt-2">
            Telefon:{' '}
            <a
              href="tel:+4917682405507"
              className="text-[#2e75fa] hover:underline"
            >
              +49 176 82405507
            </a>
          </p>
          <p>
            E-Mail:{' '}
            <a
              href="mailto:ufficio.massaro@gmail.com"
              className="text-[#2e75fa] hover:underline"
            >
              ufficio.massaro@gmail.com
            </a>
          </p>
          <p className="mt-3">
            Verantwortliche Stelle ist die nat&uuml;rliche oder juristische
            Person, die allein oder gemeinsam mit anderen &uuml;ber die Zwecke
            und Mittel der Verarbeitung von personenbezogenen Daten
            (z.&thinsp;B. Namen, E-Mail-Adressen o.&thinsp;&Auml;.) entscheidet.
          </p>

          <h3 className="font-semibold text-[#0a1a3a] mt-6 mb-2">
            Speicherdauer
          </h3>
          <p>
            Soweit innerhalb dieser Datenschutzerkl&auml;rung keine speziellere
            Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen Daten
            bei uns, bis der Zweck f&uuml;r die Datenverarbeitung
            entf&auml;llt. Wenn Sie ein berechtigtes L&ouml;schersuchen geltend
            machen oder eine Einwilligung zur Datenverarbeitung widerrufen,
            werden Ihre Daten gel&ouml;scht, sofern wir keine anderen rechtlich
            zul&auml;ssigen Gr&uuml;nde f&uuml;r die Speicherung Ihrer
            personenbezogenen Daten haben (z.&thinsp;B. steuer- oder
            handelsrechtliche Aufbewahrungsfristen); im letztgenannten Fall
            erfolgt die L&ouml;schung nach Fortfall dieser Gr&uuml;nde.
          </p>

          <h3 className="font-semibold text-[#0a1a3a] mt-6 mb-2">
            Widerruf Ihrer Einwilligung zur Datenverarbeitung
          </h3>
          <p>
            Viele Datenverarbeitungsvorg&auml;nge sind nur mit Ihrer
            ausdr&uuml;cklichen Einwilligung m&ouml;glich. Sie k&ouml;nnen eine
            bereits erteilte Einwilligung jederzeit widerrufen. Die
            Rechtm&auml;&szlig;igkeit der bis zum Widerruf erfolgten
            Datenverarbeitung bleibt vom Widerruf unber&uuml;hrt.
          </p>

          <h3 className="font-semibold text-[#0a1a3a] mt-6 mb-2">
            Recht auf Daten&uuml;bertragbarkeit
          </h3>
          <p>
            Sie haben das Recht, Daten, die wir auf Grundlage Ihrer
            Einwilligung oder in Erf&uuml;llung eines Vertrags automatisiert
            verarbeiten, an sich oder an einen Dritten in einem g&auml;ngigen,
            maschinenlesbaren Format aush&auml;ndigen zu lassen. Sofern Sie die
            direkte &Uuml;bertragung der Daten an einen anderen
            Verantwortlichen verlangen, erfolgt dies nur, soweit es technisch
            machbar ist.
          </p>

          <h3 className="font-semibold text-[#0a1a3a] mt-6 mb-2">
            Auskunft, L&ouml;schung und Berichtigung
          </h3>
          <p>
            Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen
            jederzeit das Recht auf unentgeltliche Auskunft &uuml;ber Ihre
            gespeicherten personenbezogenen Daten, deren Herkunft und
            Empf&auml;nger und den Zweck der Datenverarbeitung und ggf. ein
            Recht auf Berichtigung oder L&ouml;schung dieser Daten. Hierzu sowie
            zu weiteren Fragen zum Thema personenbezogene Daten k&ouml;nnen Sie
            sich jederzeit an uns wenden.
          </p>

          <h3 className="font-semibold text-[#0a1a3a] mt-6 mb-2">
            Recht auf Einschr&auml;nkung der Verarbeitung
          </h3>
          <p>
            Sie haben das Recht, die Einschr&auml;nkung der Verarbeitung Ihrer
            personenbezogenen Daten zu verlangen. Hierzu k&ouml;nnen Sie sich
            jederzeit an uns wenden. Das Recht auf Einschr&auml;nkung der
            Verarbeitung besteht in folgenden F&auml;llen:
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>
              Wenn Sie die Richtigkeit Ihrer bei uns gespeicherten
              personenbezogenen Daten bestreiten, ben&ouml;tigen wir in der
              Regel Zeit, um dies zu &uuml;berpr&uuml;fen. F&uuml;r die Dauer
              der Pr&uuml;fung haben Sie das Recht, die Einschr&auml;nkung der
              Verarbeitung Ihrer personenbezogenen Daten zu verlangen.
            </li>
            <li>
              Wenn die Verarbeitung Ihrer personenbezogenen Daten
              unrechtm&auml;&szlig;ig geschah/geschieht, k&ouml;nnen Sie statt
              der L&ouml;schung die Einschr&auml;nkung der Datenverarbeitung
              verlangen.
            </li>
            <li>
              Wenn wir Ihre personenbezogenen Daten nicht mehr ben&ouml;tigen,
              Sie sie jedoch zur Aus&uuml;bung, Verteidigung oder Geltendmachung
              von Rechtsanspr&uuml;chen ben&ouml;tigen, haben Sie das Recht,
              statt der L&ouml;schung die Einschr&auml;nkung der Verarbeitung
              Ihrer personenbezogenen Daten zu verlangen.
            </li>
            <li>
              Wenn Sie einen Widerspruch nach Art. 21 Abs. 1 DSGVO eingelegt
              haben, muss eine Abw&auml;gung zwischen Ihren und unseren
              Interessen vorgenommen werden. Solange noch nicht feststeht, wessen
              Interessen &uuml;berwiegen, haben Sie das Recht, die
              Einschr&auml;nkung der Verarbeitung Ihrer personenbezogenen Daten
              zu verlangen.
            </li>
          </ul>
        </Section>

        {/* ------------------------------------------------------------ */}
        {/* 4. Datenerfassung auf dieser Website                          */}
        {/* ------------------------------------------------------------ */}
        <Section number="4" title="Datenerfassung auf dieser Website">
          <h3 className="font-semibold text-[#0a1a3a] mt-4 mb-2">Cookies</h3>
          <p>
            Unsere Internetseiten verwenden so genannte &bdquo;Cookies&ldquo;.
            Cookies sind kleine Datenpakete und richten auf Ihrem
            Endger&auml;t keinen Schaden an. Sie werden entweder
            vor&uuml;bergehend f&uuml;r die Dauer einer Sitzung
            (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem
            Endger&auml;t gespeichert. Session-Cookies werden nach Ende Ihres
            Besuchs automatisch gel&ouml;scht. Permanente Cookies bleiben auf
            Ihrem Endger&auml;t gespeichert, bis Sie diese selbst l&ouml;schen
            oder eine automatische L&ouml;schung durch Ihren Webbrowser erfolgt.
          </p>
          <p className="mt-3">
            Cookies, die zur Durchf&uuml;hrung des elektronischen
            Kommunikationsvorgangs oder zur Bereitstellung bestimmter, von Ihnen
            erw&uuml;nschter Funktionen erforderlich sind, werden auf Grundlage
            von Art. 6 Abs. 1 lit.&thinsp;f DSGVO gespeichert. Der
            Websitebetreiber hat ein berechtigtes Interesse an der Speicherung
            von technisch notwendigen Cookies zur optimierten und fehlerfreien
            Bereitstellung seiner Dienste.
          </p>
          <p className="mt-3">
            Sie k&ouml;nnen Ihren Browser so einstellen, dass Sie &uuml;ber das
            Setzen von Cookies informiert werden und Cookies nur im Einzelfall
            erlauben, die Annahme von Cookies f&uuml;r bestimmte F&auml;lle oder
            generell ausschlie&szlig;en sowie das automatische L&ouml;schen der
            Cookies beim Schlie&szlig;en des Browsers aktivieren.
          </p>

          <h3 className="font-semibold text-[#0a1a3a] mt-6 mb-2">
            Server-Logfiles
          </h3>
          <p>
            Der Provider der Seiten erhebt und speichert automatisch
            Informationen in so genannten Server-Logfiles, die Ihr Browser
            automatisch an uns &uuml;bermittelt. Dies sind:
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Browsertyp und Browserversion</li>
            <li>verwendetes Betriebssystem</li>
            <li>Referrer URL</li>
            <li>Hostname des zugreifenden Rechners</li>
            <li>Uhrzeit der Serveranfrage</li>
            <li>IP-Adresse</li>
          </ul>
          <p className="mt-3">
            Eine Zusammenf&uuml;hrung dieser Daten mit anderen Datenquellen wird
            nicht vorgenommen. Die Erfassung dieser Daten erfolgt auf Grundlage
            von Art. 6 Abs. 1 lit.&thinsp;f DSGVO. Der Websitebetreiber hat ein
            berechtigtes Interesse an der technisch fehlerfreien Darstellung und
            der Optimierung seiner Website &ndash; hierzu m&uuml;ssen die
            Server-Logfiles erfasst werden.
          </p>
        </Section>

        {/* ------------------------------------------------------------ */}
        {/* 5. Affiliate-Links und CHECK24                                */}
        {/* ------------------------------------------------------------ */}
        <Section number="5" title="Affiliate-Links und CHECK24">
          <p>
            Unsere Website enth&auml;lt Affiliate-Links zu{' '}
            <a
              href="https://www.check24.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2e75fa] hover:underline"
            >
              CHECK24.net
            </a>
            . Wenn Sie &uuml;ber diese Links eine Buchung vornehmen, erhalten
            wir eine Provision. Die Buchung erfolgt direkt bei CHECK24, und es
            gelten deren Datenschutzbestimmungen. Wir haben keinen Zugriff auf
            Ihre Buchungsdaten bei CHECK24.
          </p>
          <p className="mt-3">
            Beim Klick auf einen Affiliate-Link werden Sie zu CHECK24
            weitergeleitet. CHECK24 kann dabei Cookies setzen und Daten erheben,
            um die Transaktion nachzuverfolgen. Die Rechtsgrundlage f&uuml;r die
            Einbindung der Affiliate-Links ist Art. 6 Abs. 1 lit.&thinsp;f DSGVO
            (berechtigtes Interesse an der wirtschaftlichen Verwertung unseres
            Angebots).
          </p>
          <p className="mt-3">
            Weitere Informationen zum Datenschutz bei CHECK24 finden Sie unter:{' '}
            <a
              href="https://www.check24.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2e75fa] hover:underline"
            >
              https://www.check24.net
            </a>
          </p>
        </Section>

        {/* ------------------------------------------------------------ */}
        {/* 6. TikTok Pixel                                               */}
        {/* ------------------------------------------------------------ */}
        <Section number="6" title="TikTok Pixel">
          <p>
            Wir verwenden auf dieser Website den TikTok Pixel (Pixel-ID:
            D74KVVJC77U2583OHT0G) zur Messung der Wirksamkeit unserer
            TikTok-Werbung. Der TikTok Pixel ist ein JavaScript-Code-Snippet,
            das auf unserer Website eingebunden ist und Informationen &uuml;ber
            Ihr Nutzungsverhalten an TikTok &uuml;bermittelt.
          </p>
          <p className="mt-3">
            Dabei k&ouml;nnen unter anderem folgende Daten erfasst werden:
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>aufgerufene Seiten</li>
            <li>get&auml;tigte Aktionen (z.&thinsp;B. Klicks auf Links)</li>
            <li>
              technische Informationen (Browser, Betriebssystem, Bildschirmaufl&ouml;sung)
            </li>
            <li>IP-Adresse (gek&uuml;rzt)</li>
          </ul>
          <p className="mt-3">
            Die Rechtsgrundlage f&uuml;r die Nutzung des TikTok Pixels ist Art.
            6 Abs. 1 lit.&thinsp;f DSGVO (berechtigtes Interesse an der Analyse
            der Wirksamkeit unserer Werbema&szlig;nahmen). Anbieter ist die
            TikTok Technology Limited, 10 Earlsfort Terrace, Dublin, D02 T380,
            Irland.
          </p>
          <p className="mt-3">
            Weitere Informationen zum Datenschutz bei TikTok finden Sie unter:{' '}
            <a
              href="https://www.tiktok.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2e75fa] hover:underline break-all"
            >
              https://www.tiktok.com/legal/privacy-policy
            </a>
          </p>
        </Section>

        {/* ------------------------------------------------------------ */}
        {/* 7. Eingebettete Inhalte                                       */}
        {/* ------------------------------------------------------------ */}
        <Section number="7" title="Eingebettete Inhalte (TikTok Videos)">
          <p>
            Wir betten TikTok-Videos auf unserer Website ein. Beim Laden dieser
            Videos wird eine Verbindung zu den Servern von TikTok hergestellt.
            Dabei wird TikTok mitgeteilt, welche unserer Seiten Sie besucht
            haben. Sind Sie in Ihrem TikTok-Konto eingeloggt, kann TikTok Ihr
            Surfverhalten Ihrem pers&ouml;nlichen Profil zuordnen.
          </p>
          <p className="mt-3">
            Die Nutzung erfolgt im Interesse einer ansprechenden Darstellung
            unserer Online-Angebote. Dies stellt ein berechtigtes Interesse im
            Sinne von Art. 6 Abs. 1 lit.&thinsp;f DSGVO dar.
          </p>
          <p className="mt-3">
            Weitere Informationen zum Umgang mit Nutzerdaten finden Sie in der
            Datenschutzerkl&auml;rung von TikTok:{' '}
            <a
              href="https://www.tiktok.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2e75fa] hover:underline break-all"
            >
              https://www.tiktok.com/legal/privacy-policy
            </a>
          </p>
        </Section>

        {/* ------------------------------------------------------------ */}
        {/* 8. Ihre Rechte                                                */}
        {/* ------------------------------------------------------------ */}
        <Section number="8" title="Ihre Rechte nach der DSGVO">
          <p>
            Nach der Datenschutz-Grundverordnung stehen Ihnen folgende Rechte
            zu:
          </p>
          <ul className="list-disc ml-6 mt-3 space-y-2">
            <li>
              <strong>Auskunftsrecht (Art. 15 DSGVO):</strong> Sie haben das
              Recht, eine Best&auml;tigung dar&uuml;ber zu verlangen, ob
              personenbezogene Daten verarbeitet werden, und auf Auskunft
              &uuml;ber diese Daten.
            </li>
            <li>
              <strong>Recht auf Berichtigung (Art. 16 DSGVO):</strong> Sie haben
              das Recht, die unverz&uuml;gliche Berichtigung unrichtiger
              personenbezogener Daten zu verlangen.
            </li>
            <li>
              <strong>Recht auf L&ouml;schung (Art. 17 DSGVO):</strong> Sie
              haben das Recht, die L&ouml;schung Ihrer personenbezogenen Daten
              zu verlangen, sofern die Voraussetzungen hierf&uuml;r vorliegen.
            </li>
            <li>
              <strong>
                Recht auf Einschr&auml;nkung der Verarbeitung (Art. 18 DSGVO):
              </strong>{' '}
              Sie haben das Recht, die Einschr&auml;nkung der Verarbeitung Ihrer
              personenbezogenen Daten zu verlangen.
            </li>
            <li>
              <strong>
                Recht auf Daten&uuml;bertragbarkeit (Art. 20 DSGVO):
              </strong>{' '}
              Sie haben das Recht, Ihre personenbezogenen Daten in einem
              strukturierten, g&auml;ngigen und maschinenlesbaren Format zu
              erhalten.
            </li>
            <li>
              <strong>Widerspruchsrecht (Art. 21 DSGVO):</strong> Sie haben das
              Recht, aus Gr&uuml;nden, die sich aus Ihrer besonderen Situation
              ergeben, jederzeit gegen die Verarbeitung Widerspruch einzulegen.
            </li>
            <li>
              <strong>
                Beschwerderecht bei einer Aufsichtsbeh&ouml;rde (Art. 77 DSGVO):
              </strong>{' '}
              Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbeh&ouml;rde
              &uuml;ber die Verarbeitung Ihrer personenbezogenen Daten zu
              beschweren.
            </li>
          </ul>
          <p className="mt-3">
            Zur Aus&uuml;bung Ihrer Rechte k&ouml;nnen Sie sich jederzeit an uns
            unter{' '}
            <a
              href="mailto:ufficio.massaro@gmail.com"
              className="text-[#2e75fa] hover:underline"
            >
              ufficio.massaro@gmail.com
            </a>{' '}
            wenden.
          </p>
        </Section>

        {/* ------------------------------------------------------------ */}
        {/* 9. Aenderungen                                                */}
        {/* ------------------------------------------------------------ */}
        <Section number="9" title="&Auml;nderungen dieser Datenschutzerkl&auml;rung">
          <p>
            Wir behalten uns vor, diese Datenschutzerkl&auml;rung anzupassen,
            damit sie stets den aktuellen rechtlichen Anforderungen entspricht
            oder um &Auml;nderungen unserer Leistungen in der
            Datenschutzerkl&auml;rung umzusetzen, z.&thinsp;B. bei der
            Einf&uuml;hrung neuer Services. F&uuml;r Ihren erneuten Besuch gilt
            dann die neue Datenschutzerkl&auml;rung.
          </p>
        </Section>

        {/* Footer nav + last update */}
        <div className="mt-16 pt-8 border-t border-[#0a1a3a]/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link
              href="/impressum"
              className="text-sm text-[#2e75fa] hover:underline"
            >
              Zum Impressum
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
  number,
  title,
  children,
}: {
  number: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-12">
      <h2
        className="text-lg sm:text-xl font-bold text-[#0a1a3a] mb-4"
        dangerouslySetInnerHTML={{ __html: `${number}. ${title}` }}
      />
      <div className="text-[#0a1a3a]/80 text-sm sm:text-base leading-relaxed">
        {children}
      </div>
    </section>
  )
}
