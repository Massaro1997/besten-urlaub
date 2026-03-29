export interface RatgeberSection {
  title: string
  content: string
}

export interface RatgeberArticle {
  slug: string
  title: string
  destination: string
  country: string
  heroImage: string
  metaDescription: string
  intro: string
  sections: RatgeberSection[]
  tips: string[]
  offerTitle: string
  offerPrice: string
  offerLink: string
}

export const ratgeberArticles: RatgeberArticle[] = [
  {
    slug: 'mallorca',
    title: 'Mallorca: Mehr als Ballermann',
    destination: 'Mallorca',
    country: 'Spanien',
    heroImage: '/destinations/mallorca.png',
    metaDescription:
      'Mallorca Urlaub 2026: Die besten Strände, Geheimtipps & günstige Angebote. Entdecke die Baleareninsel jenseits vom Ballermann.',
    intro:
      'Vergiss alles, was du über Mallorca zu wissen glaubst. Die Insel ist mehr als Sangria-Eimer und Schinkenstraße. Traumhafte Buchten, Serra de Tramuntana, erstklassige Küche. Mallorca ist der Allrounder unter den Inseln. Und ja, die Preise sind besser als du denkst.',
    sections: [
      {
        title: 'Warum Mallorca?',
        content:
          'Mallorca liefert. Punkt. Nur zwei Flugstunden von Deutschland, 300 Sonnentage im Jahr, über 200 Strände. von der einsamen Cala bis zum goldenen Sandstrand. Die Serra de Tramuntana im Norden ist UNESCO-Welterbe und bietet Wanderwege, die dich sprachlos machen. Dazu kommen Dörfer wie Valldemossa, Deià und Sóller, die aussehen wie aus einem Bildband. Ob Familienurlaub, Pärchen-Trip oder Solo-Abenteuer: Mallorca hat für jeden das Richtige. Und das Beste? Du findest hier Deals, die kaum jemand auf dem Schirm hat. Pauschalreisen ab 399 Euro inklusive Flug und Hotel. das ist kein Traum, das ist Mallorca.',
      },
      {
        title: 'Die besten Aktivitäten',
        content:
          'Morgens mit dem Rad durch Mandelhaine, mittags frischen Fisch im Hafen von Port de Sóller, nachmittags baden in der Cala Mondragó. So geht ein perfekter Tag auf Mallorca. Für Aktive: Die Tramuntana-Durchquerung ist ein Bucket-List-Highlight. Wassersportler finden in Alcúdia perfekte Bedingungen für SUP, Kajak und Schnorcheln. Die Altstadt von Palma? Absolut sehenswert. mit der Kathedrale La Seu, hippen Cafés und Galerien. Abends dann Tapas in Santa Catalina. Familien lieben den Marineland-Wasserpark und die Drachenhöhlen in Porto Cristo. Langweilig wird es auf Mallorca garantiert nicht.',
      },
      {
        title: 'Reisetipps',
        content:
          'Beste Reisezeit: Mai bis Juni und September bis Oktober. weniger Touristen, perfekte Temperaturen um die 25 Grad. Hochsaison ist Juli und August, dann wird es heiß und voll. Ein Mietwagen lohnt sich fast immer: Die Insel ist kompakt genug für Tagesausflüge. Vom Flughafen Palma erreichst du jeden Punkt der Insel in maximal einer Stunde. Budget-Tipp: Fincas im Landesinneren sind oft günstiger als Strandhotels und bieten mehr Charme. Mallorca hat ein exzellentes Busnetz, aber die schönsten Buchten erreichst du nur mit dem Auto. Leitungswasser ist trinkbar, aber die meisten Locals kaufen Wasser in Flaschen.',
      },
      {
        title: 'Unser Fazit',
        content:
          'Mallorca ist nicht ohne Grund die beliebteste Insel der Deutschen. Aber die meisten kratzen nur an der Oberfläche. Wer sich abseits der Touristen-Hotspots bewegt, entdeckt eine Insel, die sich hinter der Karibik nicht verstecken muss. Kristallklares Wasser, atemberaubende Berglandschaften, Weltklasse-Gastronomie. alles innerhalb von zwei Flugstunden. Und bei den Preisen, die wir für dich finden, gibt es eigentlich keinen Grund, nicht zu buchen. Dein Mallorca-Urlaub wartet. schnapp dir den Deal, bevor es andere tun.',
      },
    ],
    tips: [
      'Mietwagen früh buchen. in der Hochsaison werden die Preise schnell teuer.',
      'Cala Varques ist eine der schönsten Buchten, aber nur zu Fuß erreichbar. Früh da sein!',
      'Tagesausflug nach Sóller mit dem historischen Zug „Roter Blitz". ein Erlebnis.',
      'In Palma sonntags auf den Rastro-Flohmarkt gehen. Vintage-Schätze und Streetfood.',
    ],
    offerTitle: 'Mallorca All Inclusive ab',
    offerPrice: '399 €',
    offerLink: '/reiseziel/mallorca',
  },
  {
    slug: 'santorini',
    title: 'Santorini: Die Insel, die nie enttäuscht',
    destination: 'Santorini',
    country: 'Griechenland',
    heroImage: '/destinations/santorini.png',
    metaDescription:
      'Santorini Reiseführer 2026: Sonnenuntergänge in Oia, schwarze Strände & die besten Deals für deinen Griechenland-Urlaub.',
    intro:
      'Weiße Häuser, blaue Kuppeln, Sonnenuntergänge, die man nicht vergisst. Santorini ist die Insel, die auf jedem Vision Board steht. und die in echt noch besser ist. Hier findest du alles, was du für deinen Traumurlaub brauchst.',
    sections: [
      {
        title: 'Warum Santorini?',
        content:
          'Santorini ist pure Magie. Die Insel liegt auf dem Rand eines versunkenen Vulkans, und das merkt man überall. dramatische Klippen, schwarze und rote Strände, ein Licht, das alles in Gold taucht. Oia und Fira thronen hoch über der Caldera und bieten Ausblicke, für die andere Inseln töten würden. Die Architektur ist ikonisch: weiß getünchte Häuser mit blauen Kuppeln, verwinkelte Gassen, Bougainvillea überall. Dazu erstklassiger Wein aus vulkanischem Boden und frischer Fisch direkt vom Boot. Santorini ist romantisch, ja. aber auch für Freunde, Familien und Solo-Reisende ein absolutes Highlight. Die Insel liefert Emotionen, die kein Instagram-Filter nachahmen kann.',
      },
      {
        title: 'Was dich erwartet',
        content:
          'Der Sonnenuntergang in Oia ist legendär. aber Santorini hat so viel mehr. Wandere den Caldera-Weg von Fira nach Oia, eine dreistündige Route mit Panoramen, die dich anhalten lassen. Besuche das rote Strand bei Akrotiri, eine archäologische Sensation aus der Bronzezeit. Mach eine Bootstour zum Vulkankrater und spring in die heißen Quellen. Die Weinroute mit Verkostungen auf Weingütern wie Santo Wines oder Venetsanos ist ein Must-Do. Abends dann frische Meeresfrüchte in Ammoudi Bay, dem kleinen Hafen unterhalb von Oia. Und wer es ruhiger mag: Perissa und Kamari bieten entspannte Strandtage mit schwarzem Vulkansand.',
      },
      {
        title: 'Reisetipps',
        content:
          'Beste Reisezeit: Mai bis Mitte Juni und September bis Oktober. Im Juli und August ist die Insel extrem voll und heiß. Anreise per Flug nach Thira oder per Fähre von Athen (ca. 5 Stunden mit der Schnellfähre). Ein Quad oder ATV ist das ideale Fortbewegungsmittel. günstiger als Mietwagen und perfekt für die engen Straßen. Hotels mit Caldera-Blick sind teuer, aber es gibt günstige Alternativen in Perissa oder Kamari. Budget-Hack: Sonnenuntergang in einer der Bars in Fira statt Oia genießen. gleich schön, halb so voll. Das Essen in den Touristen-Hotspots ist überteuert; die besten Tavernen findest du in den Dörfern.',
      },
      {
        title: 'Unser Fazit',
        content:
          'Santorini gehört zu den Orten, die man einmal im Leben gesehen haben muss. Die Kombination aus vulkanischer Landschaft, ikonischer Architektur und griechischer Lebensfreude ist einzigartig auf der Welt. Ja, die Insel ist touristisch. aber wer weiß, wo er hinmuss, findet auch hier stille Ecken und authentische Momente. Mit unseren Deals bekommst du Santorini, ohne dein Konto zu sprengen. Schnapp dir das Angebot und mach den Traum wahr. Santorini wartet nicht.',
      },
    ],
    tips: [
      'Den Sonnenuntergang in Oia mindestens 1 Stunde vorher sichern. die Plätze sind begehrt.',
      'Die Wanderung Fira-Oia dauert ca. 3 Stunden. genug Wasser mitnehmen.',
      'Lokalen Assyrtiko-Wein probieren. wächst nur hier auf vulkanischem Boden.',
      'Frühfähre ab Athen nehmen, dann hast du den ganzen Tag auf der Insel.',
      'Red Beach am besten morgens besuchen, bevor die Touristenbusse kommen.',
    ],
    offerTitle: 'Santorini Pauschalreise ab',
    offerPrice: '549 €',
    offerLink: '/reiseziel/santorini',
  },
  {
    slug: 'bad-griesbach',
    title: 'Bayern Wellness: Entspannung pur',
    destination: 'Bad Griesbach',
    country: 'Deutschland',
    heroImage: '/destinations/bad-griesbach.png',
    metaDescription:
      'Bad Griesbach Wellness-Urlaub: Thermalquellen, Spa-Hotels & Erholung in Bayerns Bäderdreieck. Die besten Angebote.',
    intro:
      'Kein Flug nötig. Kein Jetlag. Einfach einsteigen, ankommen, entspannen. Bad Griesbach im niederbayerischen Bäderdreieck ist Deutschlands Wellness-Geheimtipp. mit Thermalquellen, die alles heilen, was der Alltag kaputt macht.',
    sections: [
      {
        title: 'Warum Bad Griesbach?',
        content:
          'Bad Griesbach liegt im Herzen des niederbayerischen Bäderdreiecks und ist einer der renommiertesten Kurorte Europas. Drei Thermen mit natürlichem Thermalwasser bis 60 Grad, umgeben von sanften Hügeln und bayerischer Bilderbuchlandschaft. Hier geht es nicht um Action und Adrenalin, sondern um eines: Erholung. Die Thermalquellen sind reich an Mineralien und wirken nachweislich bei Rücken-, Gelenk- und Hautproblemen. Die Wellness-Hotels der Region gehören zu den besten Deutschlands. mit Spa-Bereichen, die man sonst nur in Fünf-Sterne-Resorts in Thailand findet. Und das Beste: Die Anreise aus ganz Deutschland ist unkompliziert, und die Preise sind überraschend fair.',
      },
      {
        title: 'Was dich erwartet',
        content:
          'Morgens im Thermalwasser treiben, nachmittags eine Hot-Stone-Massage, abends bayerische Küche mit Blick auf die Hügellandschaft. Bad Griesbach ist perfekt für alle, die ihren Akku aufladen wollen. Die Wohlfühl-Therme, Rottal Terme und das Thermalbad der Hotels bieten verschiedene Saunalandschaften, Solebecken und Ruhebereiche. Wer doch etwas Bewegung braucht: Die Region hat über 25 Golfplätze und ist Europas größtes zusammenhängendes Golfareal. Radfahren entlang des Rottals, Wandern durch den Bayerischen Wald oder ein Tagesausflug nach Passau. die Drei-Flüsse-Stadt ist nur 30 Minuten entfernt. Kulinarisch erwartet dich deftige bayerische Kost, Biergärten und überraschend gute Weinbars.',
      },
      {
        title: 'Reisetipps',
        content:
          'Beste Reisezeit: Ganzjährig. im Winter ist die Therme besonders reizvoll, im Sommer locken die Biergärten. Anreise mit dem Auto über die A3 oder per Bahn bis Passau, dann Shuttlebus. Viele Hotels bieten All-Inclusive-Wellness-Pakete mit Halbpension, Spa-Zugang und Anwendungen. das lohnt sich fast immer. Tipp: Unter der Woche sind die Thermen deutlich leerer als am Wochenende. Für Paare gibt es spezielle Romantik-Arrangements mit Candle-Light-Dinner und Paarmassage. Wer länger als drei Tage bleibt, bekommt oft Rabatte. Die Kurkarte ist im Hotelpreis enthalten und bietet kostenlosen Nahverkehr und ermäßigten Thermeintritt.',
      },
      {
        title: 'Unser Fazit',
        content:
          'Nicht jeder Traumurlaub muss mit einem Flug beginnen. Bad Griesbach beweist, dass Weltklasse-Wellness auch vor der Haustür möglich ist. Thermalwasser, das wirklich wirkt, Hotels mit Spa-Standards, die international mithalten, und eine Ruhe, die man in der Karibik so nicht findet. Perfekt für ein langes Wochenende oder eine ganze Woche Digital Detox. Die Deals, die wir für dich haben, machen den Wellness-Urlaub zum Schnäppchen. Pack die Badesachen ein. Bad Griesbach erwartet dich.',
      },
    ],
    tips: [
      'Unter der Woche buchen. deutlich günstiger und ruhiger als am Wochenende.',
      'Die Kurkarte vom Hotel mitnehmen. sie gilt als Fahrschein für den Nahverkehr.',
      'Tagesausflug nach Passau einplanen. die Altstadt am Dreiflüsseeck ist wunderschön.',
      'Bademantel-Gänge zwischen Hotel und Therme sind üblich. kein Umziehen nötig.',
    ],
    offerTitle: 'Wellness Bad Griesbach ab',
    offerPrice: '199 €',
    offerLink: '/reiseziel/bad-griesbach',
  },
  {
    slug: 'nordkroatien',
    title: 'Kroatien Rundreise: Geheimtipps',
    destination: 'Nordkroatien',
    country: 'Kroatien',
    heroImage: '/destinations/nordkroatien.png',
    metaDescription:
      'Nordkroatien Geheimtipps 2026: Istrien, Kvarner Bucht & Plitvicer Seen. Günstige Rundreise-Angebote für Kroatien.',
    intro:
      'Vergiss Dubrovnik. die wahren Schätze Kroatiens liegen im Norden. Istrien mit seinen Trüffelwäldern, die Kvarner Bucht mit türkisem Wasser, Plitvicer Seen wie aus einem Märchen. Das ist Kroatien, wie es die wenigsten kennen.',
    sections: [
      {
        title: 'Warum Nordkroatien?',
        content:
          'Nordkroatien ist das bestgehütete Geheimnis an der Adria. Während sich Touristen in Dubrovnik und Split drängen, bietet der Norden alles, was Kroatien ausmacht. nur ohne die Massen. Istrien ist die Trüffelhochburg Europas und wird oft als „neues Toskana" bezeichnet. Mittelalterliche Hügeldörfer wie Motovun und Grožnjan, Olivenhaine und Weinberge soweit das Auge reicht. Die Kvarner Bucht um Opatija war schon im 19. Jahrhundert Rückzugsort der österreichischen Aristokratie. und hat sich diesen eleganten Charme bewahrt. Dazu die Plitvicer Seen, Kroatiens Nationalpark Nummer eins mit 16 kaskadenartigen Seen. Das Preis-Leistungs-Verhältnis? Unschlagbar.',
      },
      {
        title: 'Die besten Aktivitäten',
        content:
          'Eine Trüffelsuche in den Wäldern von Motovun mit einem lokalen Guide und seinem Hund. ein unvergessliches Erlebnis. Danach frische Trüffelpasta im Dorf. Die Küstenstadt Rovinj ist fotogener als Venedig und nur halb so überlaufen. Baden in der Bucht von Lim, Kajak fahren entlang der Klippen, abends frischen Fisch in einer Konoba. Die Plitvicer Seen erwandert man auf Holzstegen durch türkisfarbene Wasserfälle. surreal schön. Wer Inseln liebt: Cres und Lošinj in der Kvarner Bucht sind Naturparadiese mit Delfinen, Wanderwegen und einsamen Buchten. Zagreb, die unterschätzte Hauptstadt, lohnt einen Zwischenstopp für Street Food und Nightlife.',
      },
      {
        title: 'Reisetipps',
        content:
          'Beste Reisezeit: Mai bis Juni und September. angenehm warm, wenig los. Anreise per Auto aus Süddeutschland in 5-6 Stunden oder per Flug nach Pula oder Zagreb. Ein Mietwagen ist Pflicht für Rundreisen. das Straßennetz ist hervorragend. Die Autobahnmaut in Kroatien ist günstig und die Autobahnen leer. Essen gehen ist deutlich günstiger als in Westeuropa: ein komplettes Dinner mit Wein für 25-30 Euro pro Person. In Istrien lohnen sich Agriturismi. Bauernhöfe mit Übernachtung und hausgemachtem Essen. Die Kuna wurde durch den Euro ersetzt, kein Geldwechsel nötig. Trinkgeld: 10 Prozent sind üblich, aber nicht erwartet.',
      },
      {
        title: 'Unser Fazit',
        content:
          'Nordkroatien ist der perfekte Urlaub für alle, die mehr wollen als Standard-Strandurlaub. Die Kombination aus Kultur, Natur, Kulinarik und kristallklarem Meer ist in Europa kaum zu schlagen. und das zu Preisen, die noch bezahlbar sind. Ob Roadtrip durch Istrien, Wellness in Opatija oder Naturerlebnis an den Plitvicer Seen: Nordkroatien überrascht auf jeder Etappe. Schnapp dir jetzt den Deal und entdecke Kroatien, bevor alle anderen es tun.',
      },
    ],
    tips: [
      'Plitvicer Seen: Tickets online vorab kaufen. Kontingent ist begrenzt.',
      'In Istrien die lokalen Konobas (Tavernen) besuchen. authentischer als Restaurants an der Promenade.',
      'Mautgebühren in Kroatien werden per Karte bezahlt, kein Bargeld nötig.',
      'Rovinj früh morgens oder abends besuchen. tagsüber kommen Kreuzfahrt-Touristen.',
      'Lokalen Malvazija-Wein und Istrischen Trüffel unbedingt probieren.',
    ],
    offerTitle: 'Kroatien Rundreise ab',
    offerPrice: '449 €',
    offerLink: '/reiseziel/nordkroatien',
  },
  {
    slug: 'chalkidiki',
    title: 'Chalkidiki: Griechenlands bestgehütetes Geheimnis',
    destination: 'Chalkidiki',
    country: 'Griechenland',
    heroImage: '/destinations/chalkidiki.png',
    metaDescription:
      'Chalkidiki Urlaub 2026: Türkisblaue Buchten, Pinienwälder & griechische Gastfreundschaft. Günstige Pauschalreisen entdecken.',
    intro:
      'Drei Finger ragen ins Ägäische Meer. und jeder einzelne ist ein Paradies. Chalkidiki hat die schönsten Strände Griechenlands, und die meisten Deutschen haben noch nie davon gehört. Dein Vorteil.',
    sections: [
      {
        title: 'Warum Chalkidiki?',
        content:
          'Chalkidiki liegt südlich von Thessaloniki und ist die Halbinsel mit den drei „Fingern": Kassandra, Sithonia und Athos. Kassandra ist lebhaft mit Beach Bars und Nightlife. Sithonia ist ruhiger, wilder, naturbelassener. Pinienwälder, die bis ans türkisblaue Wasser reichen. Athos ist die geheimnisvolle Mönchsrepublik, die man nur vom Boot aus sehen kann. Die Strände gehören zu den saubersten Europas: feiner Sand, kristallklares Wasser, oft menschenleer. Dazu griechische Gastfreundschaft, Tavernen mit Meerblick und Preise, die deutlich unter denen der Inseln liegen. Chalkidiki ist der perfekte Griechenland-Urlaub für alle, die Santorini zu touristisch finden.',
      },
      {
        title: 'Die besten Aktivitäten',
        content:
          'Strand, Strand, Strand. aber auch viel mehr. Die Orange Beach Bar in Sarti ist legendär. Kavourotrypes (Portokali Beach) auf Sithonia gehört zu den schönsten Stränden der Welt. kein Witz. Schnorcheln im kristallklaren Wasser, SUP-Boarding, Bootstouren zur Athos-Küste. Für Naturfreunde: Wandern auf dem Sithonia Küstenpfad oder durch die antike Stätte Olynth. Thessaloniki ist nur eine Stunde entfernt. perfekt für einen Tagesausflug in die zweitgrößte Stadt Griechenlands mit Streetfood-Märkten, Byzantinischen Kirchen und pulsierendem Nachtleben. Abends dann zurück ans Meer, gegrillten Oktopus in einer Taverne und dazu ein Glas Tsipouro.',
      },
      {
        title: 'Reisetipps',
        content:
          'Beste Reisezeit: Juni bis September. Anreise per Flug nach Thessaloniki, dann ca. 1-1,5 Stunden mit dem Mietwagen. Mietwagen ist empfehlenswert, um die schönsten Buchten zu erreichen. Die Halbinsel ist sicher und familienfreundlich. Unterkünfte auf Sithonia sind günstiger als auf Kassandra. Viele Familien-Hotels bieten All-Inclusive-Pakete zu erstaunlich niedrigen Preisen. Campingplätze direkt am Strand sind eine beliebte Budget-Option. Griechisch zu können ist nicht nötig. die meisten Einheimischen sprechen Englisch oder sogar Deutsch. Die Supermärkte haben alles, was man braucht, und frisches Obst gibt es an Straßenständen für fast nichts.',
      },
      {
        title: 'Unser Fazit',
        content:
          'Chalkidiki ist das Griechenland, das du dir immer gewünscht hast. ohne die Preise und Massen der bekannten Inseln. Türkisblaues Wasser, Pinienwälder bis zum Strand, griechische Küche vom Feinsten. Perfekt für Familien, Paare und alle, die einfach mal abschalten wollen. Die Deals, die wir für dich haben, machen diesen Traumurlaub erschwinglich. Zögere nicht zu lange. die besten Unterkünfte sind schnell weg.',
      },
    ],
    tips: [
      'Sithonia statt Kassandra wählen. ruhiger, schöner, authentischer.',
      'Kavourotrypes Beach: früh kommen, keine Infrastruktur. Wasser und Snacks mitnehmen.',
      'Tagesausflug nach Thessaloniki für die Streetfood-Szene rund um den Modiano-Markt.',
      'Sonnenuntergang am Porto Koufo Hafen. der tiefste Naturhafen Griechenlands.',
    ],
    offerTitle: 'Chalkidiki Pauschalreise ab',
    offerPrice: '479 €',
    offerLink: '/reiseziel/chalkidiki',
  },
  {
    slug: 'lago-di-garda',
    title: 'Gardasee: Dolce Vita am Wasser',
    destination: 'Gardasee',
    country: 'Italien',
    heroImage: '/destinations/lago-di-garda.png',
    metaDescription:
      'Gardasee Urlaub 2026: Limone, Sirmione, Riva. die besten Orte, Aktivitäten & günstige Angebote am größten See Italiens.',
    intro:
      'Zitronen, Berge, türkisblaues Wasser. der Gardasee ist Italien im Zeitraffer. An einem Tag Mittelmeer-Feeling, am nächsten Alpen-Panorama. Und alles in Reichweite eines Roadtrips von Deutschland aus.',
    sections: [
      {
        title: 'Warum Gardasee?',
        content:
          'Der Gardasee ist Italiens größter See. und vermutlich der vielseitigste Urlaubsort Europas. Im Norden dramatische Berge mit Klettersteigen und Mountainbike-Trails, im Süden sanfte Hügel, Weinberge und das dolce Vita pur. Sirmione ragt auf einer schmalen Landzunge ins Wasser und besticht mit einer mittelalterlichen Burg, römischen Ruinen und Thermalquellen. Limone sul Garda verzaubert mit seinen Zitronenhainen und pastellfarbenen Häusern. Riva del Garda ist das Mekka für Windsurfer und Segler. Und Lazise, Bardolino, Desenzano. jeder Ort hat seinen eigenen Charme. Die Anreise aus Süddeutschland dauert nur 4-5 Stunden. Perfekt für einen spontanen Kurztrip oder einen ausgedehnten Sommerurlaub.',
      },
      {
        title: 'Die besten Aktivitäten',
        content:
          'Die Gardesana Occidentale entlangfahren. eine der schönsten Küstenstraßen Europas mit Tunneln, Aussichtspunkten und Fotostops. Das Gardaland, Italiens größter Freizeitpark, ist ein Muss für Familien. Mountainbiking am Monte Baldo mit Seilbahn-Auffahrt und Panoramablick über den gesamten See. Windsurfen in Torbole, wo der Ora-Wind nachmittags perfekte Bedingungen schafft. Sirmiones Thermalquellen besuchen. heißes Wasser direkt am See. Abends Aperol Spritz mit Seeblick in Lazise, dazu frische Pasta und Bardolino-Wein. Wer es aktiv mag: der Ponale-Wanderweg von Riva aus ist spektakulär. Und für Feinschmecker: Trüffel, Olivenöl und Gelato. die Küche am Gardasee ist erstklassig.',
      },
      {
        title: 'Reisetipps',
        content:
          'Beste Reisezeit: Mai bis Oktober, Hochsaison Juli-August. Anreise mit dem Auto über den Brenner oder per Flug nach Verona (30 Min. zum See). Die Ostseite ist ruhiger und günstiger als die beliebte Westseite. Fähren verbinden alle Orte am See. ein Tagesticket lohnt sich für Ort-Hopping. Parken kann in der Hochsaison stressig sein. lieber am Ortsrand parken und laufen. Unterkunft: Ferienwohnungen sind oft günstiger als Hotels und bieten mehr Platz. Der Gardasee ist ideal für Tagesausflüge nach Verona (Romeo und Julia!) und Venedig (1,5 Stunden). Trinkgeld ist in Italien nicht üblich, Coperto (Gedeck) ist aber auf der Rechnung.',
      },
      {
        title: 'Unser Fazit',
        content:
          'Der Gardasee ist der Klassiker, der nie alt wird. Italien-Feeling ab der ersten Sekunde, Vielseitigkeit, die kaum ein anderer Urlaubsort bieten kann, und Preise, die für jeden Geldbeutel passen. Ob Adrenalin-Junkie, Romantiker oder Familie. am Gardasee findet jeder seinen perfekten Urlaub. Mit unseren Deals sparst du bares Geld. Buche jetzt und starte dein Italien-Abenteuer.',
      },
    ],
    tips: [
      'Die Fähre Limone-Malcesine nutzen. schneller als die Straße und viel schöner.',
      'Monte Baldo Seilbahn bei klarem Wetter fahren. Blick bis in die Dolomiten.',
      'Olivenöl direkt beim Erzeuger kaufen. in Bardolino gibt es ein Olivenöl-Museum.',
      'Gardaland-Tickets online vorab kaufen. spart Wartezeit und Geld.',
    ],
    offerTitle: 'Gardasee Urlaub ab',
    offerPrice: '349 €',
    offerLink: '/reiseziel/lago-di-garda',
  },
  {
    slug: 'sardegna',
    title: 'Sardinien: Die Karibik Europas',
    destination: 'Sardinien',
    country: 'Italien',
    heroImage: '/destinations/sardegna.png',
    metaDescription:
      'Sardinien Reiseführer 2026: Costa Smeralda, einsame Buchten & glasklares Meer. Die besten Tipps und günstigen Angebote.',
    intro:
      'Weißer Sand, Wasser so klar, dass du den Grund in fünf Metern Tiefe siehst. Sardinien ist die Karibik, nur zwei Flugstunden entfernt. und ohne Zeitverschiebung. Diese Insel spielt in einer eigenen Liga.',
    sections: [
      {
        title: 'Warum Sardinien?',
        content:
          'Sardinien ist die zweitgrößte Mittelmeerinsel und hat mehr Küstenlinie als ganz Italien zusammen. Die Costa Smeralda im Nordosten glänzt mit smaragdgrünem Wasser und Luxus-Resorts. Aber die wahre Magie liegt abseits: einsame Buchten wie Cala Goloritzé, die nur per Boot oder Wanderung erreichbar sind. Die Grotta di Nettuno, eine Tropfsteinhöhle direkt am Meer. Das Inselarchipel La Maddalena, ein Nationalpark mit Stränden, die aussehen wie Photoshop. Dazu eine eigene Kultur mit sardischer Küche, Cannonau-Wein und einer Geschichte, die bis in die Nuraghenzeit zurückreicht. Sardinien ist wild, unberührt und atemberaubend schön. Und die Flugverbindungen ab Deutschland werden immer besser.',
      },
      {
        title: 'Die besten Aktivitäten',
        content:
          'Bootstour durch den La Maddalena Archipel. das Highlight jeder Sardinien-Reise. Die Strände Spiaggia del Principe und Cala Brandinchi konkurrieren mit jedem Karibik-Strand. Schnorcheln und Tauchen in kristallklarem Wasser mit Unterwasserhöhlen und Korallen. Wandern im Gennargentu-Gebirge oder durch die Gorropu-Schlucht, eine der tiefsten Europas. Die Stadt Alghero im Westen hat katalanischen Charme, Festungsmauern am Meer und hervorragende Meeresfrüchte. Kulinarisch: Porceddu (Spanferkel), Culurgiones (sardische Ravioli) und Seadas (frittierte Teigtaschen mit Honig). Abends Aperitivo an der Piazza mit Blick aufs Meer. das ist das Leben.',
      },
      {
        title: 'Reisetipps',
        content:
          'Beste Reisezeit: Mai bis Oktober, ideal Juni und September. Anreise per Flug nach Olbia, Cagliari oder Alghero. Mietwagen ist absolut notwendig. ohne Auto erreichst du die besten Strände nicht. Die Straßen im Inselinneren sind kurvig aber gut ausgebaut. Unterkünfte: Agriturismi im Landesinneren sind günstiger und bieten authentisches Sardinien. Die Costa Smeralda ist teuer, aber südlich von Olbia gibt es bezahlbare Alternativen. Tanke immer rechtzeitig. Tankstellen im Inselinneren sind selten. Wasser an den wilden Stränden selbst mitbringen. Sardinien ist sehr sicher. Kriminalität ist praktisch nicht existent.',
      },
      {
        title: 'Unser Fazit',
        content:
          'Wer einmal auf Sardinien war, kommt immer wieder. Die Insel hat alles: Weltklasse-Strände, wilde Natur, einzigartige Kultur und eine Küche, die süchtig macht. Und das Beste: Sardinien ist noch nicht so überlaufen wie andere Mittelmeer-Destinationen. Nutze das aus, solange es noch geht. Unsere Deals machen den Sardinien-Traumurlaub bezahlbar. Jetzt buchen, später danken.',
      },
    ],
    tips: [
      'La Maddalena Bootstour im Voraus buchen. die besten Touren sind schnell ausverkauft.',
      'Cala Goloritzé erfordert eine 1-stündige Wanderung. festes Schuhwerk und Wasser mitnehmen.',
      'Sardischen Cannonau-Wein probieren. einer der ältesten Rebsorten der Welt.',
      'In Alghero abends die Stadtmauer entlanglaufen. bester Sonnenuntergang der Insel.',
    ],
    offerTitle: 'Sardinien Pauschalreise ab',
    offerPrice: '499 €',
    offerLink: '/reiseziel/sardegna',
  },
  {
    slug: 'fuessen',
    title: 'Füssen & Neuschwanstein: Märchenhaft',
    destination: 'Füssen',
    country: 'Deutschland',
    heroImage: '/destinations/fuessen.png',
    metaDescription:
      'Füssen & Schloss Neuschwanstein 2026: Märchenschlösser, Alpenseen & Wanderwege. Tipps und günstige Hotel-Angebote.',
    intro:
      'Schloss Neuschwanstein kennt jeder. Aber die Region drumherum? Ein Traum aus Alpenseen, Wanderwegen und bayerischer Gemütlichkeit. Füssen ist mehr als nur eine Schloss-Kulisse. es ist Urlaub für die Seele.',
    sections: [
      {
        title: 'Warum Füssen?',
        content:
          'Füssen liegt am Ende der Romantischen Straße und am Fuß der Allgäuer Alpen. dramatischer kann eine Kulisse kaum sein. Schloss Neuschwanstein ist das meistfotografierte Gebäude Deutschlands und zieht Besucher aus aller Welt an. Aber Füssen bietet so viel mehr: die Altstadt mit ihren mittelalterlichen Gassen, das Hohe Schloss mit der größten Illusionsmalerei-Fassade Bayerns, und die umliegenden Seen. Forggensee, Alpsee, Weißensee. alle mit kristallklarem Bergwasser. Im Sommer perfekt zum Baden, Wandern und Radfahren, im Winter ein verschneites Wunderland. Die Region ist ideal für Kurzurlaube: kompakt, gut erreichbar und voller Überraschungen. Von München aus bist du in unter zwei Stunden da.',
      },
      {
        title: 'Was dich erwartet',
        content:
          'Natürlich: Schloss Neuschwanstein besichtigen. am besten mit Führung frühmorgens, bevor die Busse kommen. Direkt daneben liegt Schloss Hohenschwangau, das Kindheitsschloss von Ludwig II. Die Marienbrücke über der Pöllatschlucht bietet DEN Instagram-Shot. Wanderung um den Alpsee. flach, familienfreundlich und wunderschön. Ambitioniertere Wanderer steigen auf den Tegelberg mit Panoramablick bis zum Zugspitzmassiv. Im Sommer Bootfahren auf dem Forggensee, im Winter Langlauf und Schlittenfahren. Die Füssener Altstadt lädt zum Bummeln ein mit Cafés, Kunsthandwerk und dem berühmten Geigenbaumuseum. Abends dann Allgäuer Kässpatzen in einem urigen Gasthof.',
      },
      {
        title: 'Reisetipps',
        content:
          'Beste Reisezeit: Mai bis Oktober für Outdoor, Dezember bis Februar für Winter-Romantik. Neuschwanstein-Tickets unbedingt online vorab buchen. vor Ort oft ausverkauft. Anreise per Auto oder Bahn ab München (2 Stunden). Die König-Ludwig-Card bietet Ermäßigungen für viele Attraktionen. Unterkünfte in Schwangau sind touristisch und teurer. in Füssen selbst gibt es günstigere Pensionen mit mehr Charme. Für Wanderer: Die Tegelbergbahn spart den anstrengenden Aufstieg. Regenjacke einpacken. in den Alpen kann das Wetter schnell umschlagen. Parkplätze an den Schlössern kosten 8-10 Euro pro Tag.',
      },
      {
        title: 'Unser Fazit',
        content:
          'Füssen und Neuschwanstein sind wie ein lebendiges Märchen. Die Kombination aus königlicher Geschichte, alpiner Natur und bayerischer Gastfreundschaft ist einzigartig. Perfekt für ein verlängertes Wochenende oder als Station auf einer Bayern-Rundreise. Und mit unseren Hotel-Deals wird der Märchenurlaub zum Schnäppchen. Buche jetzt und lass dich verzaubern. König Ludwig hätte es so gewollt.',
      },
    ],
    tips: [
      'Neuschwanstein-Tickets nur online erhältlich. mindestens 2 Wochen vorher buchen.',
      'Marienbrücke früh morgens besuchen. ab 10 Uhr wird es sehr voll.',
      'Den Lechfall in Füssen besuchen. ein beeindruckendes Naturschauspiel, kostenlos.',
      'Allgäuer Kässpatzen in der Altstadt probieren. am besten im „Zum Schwanen".',
    ],
    offerTitle: 'Füssen Kurzurlaub ab',
    offerPrice: '149 €',
    offerLink: '/reiseziel/fuessen',
  },
  {
    slug: 'playa-del-carmen',
    title: 'Mexiko: Karibik-Feeling pur',
    destination: 'Playa del Carmen',
    country: 'Mexiko',
    heroImage: '/destinations/playa-del-carmen.png',
    metaDescription:
      'Playa del Carmen Urlaub 2026: Karibikstrände, Maya-Ruinen & Cenoten. Mexiko günstig erleben mit den besten Deals.',
    intro:
      'Türkisblaues Karibik-Meer, Maya-Tempel im Dschungel, Cenoten wie natürliche Pools. Playa del Carmen ist der Ort, an dem Abenteuer und Strand aufeinandertreffen. Und die Preise? Überraschend fair für so viel Paradies.',
    sections: [
      {
        title: 'Warum Playa del Carmen?',
        content:
          'Playa del Carmen liegt an der Riviera Maya auf der Yucatán-Halbinsel und ist der perfekte Mix aus Karibik-Strand und Kultur. Anders als das benachbarte Cancún ist Playa noch authentischer, lebendiger und weniger Resort-lastig. Die berühmte Quinta Avenida (5th Avenue) ist eine kilometerlange Fußgängerzone mit Boutiquen, Restaurants und Straßenkünstlern. Der Strand ist breit, weiß und mit Palmen gesäumt. In der Umgebung warten die Maya-Ruinen von Tulum auf einer Klippe über dem Meer, die geheimnisvolle Unterwasserwelt der Cenoten und das zweitgrößte Korallenriff der Welt. Die mexikanische Küche. Tacos, Ceviche, Mole. ist ein Fest für jeden Feinschmecker.',
      },
      {
        title: 'Die besten Aktivitäten',
        content:
          'Cenoten-Hopping ist ein absolutes Muss: Cenote Dos Ojos, Cenote Azul und Gran Cenote sind natürliche Kalksteinhöhlen mit kristallklarem Süßwasser. perfekt zum Schwimmen und Schnorcheln. Die Maya-Stätte Tulum besuchen, direkt an der Karibikküste gelegen. Schnorcheln am Mesoamerikanischen Riff, dem zweitgrößten der Welt. Eine Bootsfahrt nach Cozumel zum Tauchen. Abends entlang der Quinta Avenida flanieren, Street Tacos für 2 Euro essen und in einer Rooftop-Bar den Sonnenuntergang genießen. Wer es abenteuerlich mag: Zip-Lining über den Dschungel im Xcaret Eco-Park. Und für totale Entspannung: Temazcal, eine traditionelle Maya-Schwitzhütte.',
      },
      {
        title: 'Reisetipps',
        content:
          'Beste Reisezeit: November bis April (Trockenzeit). Hurrikan-Saison ist Juni bis November. Anreise per Flug nach Cancún, dann 45 Minuten mit dem Shuttle. Colectivos (Sammeltaxis) sind die günstigste Art, sich entlang der Küste zu bewegen. Mexikanische Pesos sind günstiger als Dollar-Zahlung. am Automaten abheben. Trinkwasser nicht aus der Leitung trinken. Die Sicherheitslage in der Touristenzone ist gut. wie überall auf Reisen gilt: gesunder Menschenverstand. All-Inclusive-Resorts bieten oft erstaunlichen Wert, aber die besten Tacos findest du auf der Straße. Sonnenschutz ist Pflicht. der UV-Index ist extrem.',
      },
      {
        title: 'Unser Fazit',
        content:
          'Playa del Carmen ist der Beweis, dass Karibik-Urlaub nicht teuer sein muss. Weißer Sand, türkises Meer, Maya-Kultur und mexikanische Lebensfreude. alles in einem Paket. Die Cenoten allein sind die Reise wert. Und mit unseren Deals nach Mexiko sparst du richtig Geld. Wann, wenn nicht jetzt? Buche deinen Traumurlaub in der Karibik.',
      },
    ],
    tips: [
      'Cenoten am Vormittag besuchen. nachmittags kommen die Tour-Busse.',
      'Tulum-Ruinen gleich bei Öffnung um 8 Uhr besuchen. danach wird es extrem voll.',
      'Street Tacos auf der Quinta Avenida sind sicher und lecker. mindestens einmal täglich essen.',
      'Reef-safe Sonnencreme verwenden. in vielen Cenoten ist normale Creme verboten.',
      'Colectivo statt Taxi nehmen. von Playa nach Tulum für unter 3 Euro.',
    ],
    offerTitle: 'Mexiko Pauschalreise ab',
    offerPrice: '899 €',
    offerLink: '/reiseziel/playa-del-carmen',
  },
  {
    slug: 'rodi',
    title: 'Rhodos: Sonneninsel im Mittelmeer',
    destination: 'Rhodos',
    country: 'Griechenland',
    heroImage: '/destinations/rodi.png',
    metaDescription:
      'Rhodos Urlaub 2026: Mittelalterliche Altstadt, Traumstrände & günstige All-Inclusive-Angebote für die griechische Sonneninsel.',
    intro:
      'Rhodos hat 3.000 Sonnenstunden im Jahr. Das ist kein Marketing-Spruch, das ist Fakt. Dazu eine UNESCO-Altstadt, endlose Strände und griechisches Essen, das süchtig macht. Willkommen auf der Sonneninsel.',
    sections: [
      {
        title: 'Warum Rhodos?',
        content:
          'Rhodos ist die viertgrößte griechische Insel und eine der sonnigsten Inseln im gesamten Mittelmeer. Die mittelalterliche Altstadt von Rhodos-Stadt ist UNESCO-Welterbe. eine der besterhaltenen mittelalterlichen Städte Europas mit Stadtmauern, Ritterstraße und dem Großmeisterpalast. Auf der Ostseite der Insel reihen sich Sandstrände wie Tsambika, Faliraki und Lindos aneinander. Lindos mit seiner Akropolis auf einem Felsen über einer türkisblauen Bucht ist der fotogenste Ort der Insel. Die Westseite ist wilder, windiger und perfekt für Surfer. Rhodos bietet exzellentes Preis-Leistungs-Verhältnis: All-Inclusive-Hotels mit Strandlage zu Preisen, die du auf Santorin nie findest.',
      },
      {
        title: 'Die besten Aktivitäten',
        content:
          'Durch die Altstadt von Rhodos flanieren. verlauf dich in den Gassen, das ist Teil des Erlebnisses. Die Akropolis von Lindos besteigen und den Blick über die St. Pauls Bay genießen. Am Tsambika Beach den perfekten Strandtag verbringen. Schmetterlingstal (Petaloudes) besuchen, wo im Sommer Tausende Schmetterlinge in einem schattigen Tal flattern. Prasonisi ganz im Süden ist der Spot für Windsurfer und Kitesurfer. hier treffen Ägäis und Mittelmeer aufeinander. Bootstour nach Symi, die bunte Nachbarinsel mit neoklassizistischen Häusern am Hafen. Abends Souvlaki und Ouzo in einer Taverne in der Altstadt. authentischer geht es nicht.',
      },
      {
        title: 'Reisetipps',
        content:
          'Beste Reisezeit: Mai bis Oktober, Hochsaison Juli-August. Direktflüge aus ganz Deutschland nach Rhodos. Die Ostseite ist ruhiger, die Westseite windiger und bei Surfern beliebt. Mietwagen lohnt sich für Tagesausflüge, ist aber nicht zwingend. viele Strände sind per Bus erreichbar. Lindos wird tagsüber von Kreuzfahrt-Touristen überflutet. früh morgens oder abends hin. Die Altstadt von Rhodos-Stadt hat nachts eine ganz besondere Atmosphäre. unbedingt abends besuchen. Wasser aus der Leitung ist trinkbar. Griechisches Trinkgeld: 5-10 Prozent, auf dem Tisch liegen lassen.',
      },
      {
        title: 'Unser Fazit',
        content:
          'Rhodos ist der solide Allrounder unter den griechischen Inseln: Kultur, Strand, Nachtleben und griechische Gastfreundschaft in Perfektion. Die Preise sind fair, die Sonne scheint fast immer, und langweilig wird es nie. Ob All-Inclusive-Familienurlaub oder aktiver Inseltrip. Rhodos liefert. Schnapp dir unseren Deal und buche die Sonneninsel, bevor die Plätze weg sind.',
      },
    ],
    tips: [
      'Lindos: früh morgens oder nach 16 Uhr besuchen. tagsüber ist es überlaufen und heiß.',
      'Die Altstadt von Rhodos nachts erkunden. magische Atmosphäre ohne Massen.',
      'Fährticket nach Symi am Vortag kaufen. die Tagestour lohnt sich absolut.',
      'Prasonisi ganz im Süden besuchen. wo zwei Meere aufeinandertreffen.',
    ],
    offerTitle: 'Rhodos All Inclusive ab',
    offerPrice: '459 €',
    offerLink: '/reiseziel/rodi',
  },
  {
    slug: 'mont-saint-michel',
    title: 'Mont-Saint-Michel: Magisch',
    destination: 'Mont-Saint-Michel',
    country: 'Frankreich',
    heroImage: '/destinations/mont-saint-michel.png',
    metaDescription:
      'Mont-Saint-Michel Reiseführer 2026: Die magische Klosterinsel in der Normandie. Tipps, Gezeiten-Wanderung & günstige Angebote.',
    intro:
      'Eine Insel, die bei Flut im Meer verschwindet und bei Ebbe aus dem Nebel auftaucht. Mont-Saint-Michel ist kein normales Reiseziel. es ist ein Ort, der dich sprachlos macht. Einmal im Leben Pflicht.',
    sections: [
      {
        title: 'Warum Mont-Saint-Michel?',
        content:
          'Mont-Saint-Michel ist einer der ikonischsten Orte Frankreichs. und der Welt. Die mittelalterliche Abtei thront auf einem Granitfelsen in der Bucht zwischen Normandie und Bretagne, umgeben von den stärksten Gezeiten Europas. Bei Flut wird die Insel vom Meer umschlossen, bei Ebbe erstreckt sich endloser Sand bis zum Horizont. UNESCO-Welterbe seit 1979, besucht von über 3 Millionen Menschen jährlich. und trotzdem verliert dieser Ort nie seine Magie. Die engen Gassen, die Treppenstufen zur Abtei, der Blick vom Kreuzgang über die Bucht. all das fühlt sich an wie eine Zeitreise ins Mittelalter. Frankreichs meistbesuchtes Monument nach dem Eiffelturm, und das aus gutem Grund.',
      },
      {
        title: 'Was dich erwartet',
        content:
          'Die Abtei besichtigen. das Herzstück von Mont-Saint-Michel. Die Architektur ist ein Meisterwerk romanischer und gotischer Baukunst, direkt auf die Felsspitze gebaut. Die Gezeiten-Wanderung mit einem zertifizierten Guide durch die Bucht ist ein Abenteuer: barfuß durch Treibsand, Priele und Schlick, während das Meer mit Rennpferd-Geschwindigkeit zurückkehrt. Durch die mittelalterlichen Gassen schlendern, Crêpes in einer der ältesten Herbergen Europas essen (La Mère Poulard serviert seit 1888 Omeletts). Saint-Malo, die Piratenstadt an der bretonischen Küste, ist nur eine Stunde entfernt und perfekt für einen Tagesausflug. Und der Sonnenuntergang über der Bucht? Unvergesslich.',
      },
      {
        title: 'Reisetipps',
        content:
          'Beste Reisezeit: Mai bis September, aber auch im Winter magisch (weniger Touristen, dramatische Stimmung). Anreise per Auto oder TGV nach Rennes, dann Bus oder Mietwagen (1 Stunde). Parken auf dem Festland-Parkplatz, dann Shuttle-Bus oder 2,5 km Fußweg über den Damm. Gezeiten-Kalender checken: Bei Springflut ist das Schauspiel am beeindruckendsten. Übernachtung auf der Insel selbst ist teuer aber magisch. nach 18 Uhr sind die Tagestouristen weg. Budget-Option: Hotels in Pontorson (10 Min. entfernt). Gezeiten-Wanderung nur mit Guide. die Bucht ist gefährlich. Reservierung im Voraus nötig.',
      },
      {
        title: 'Unser Fazit',
        content:
          'Mont-Saint-Michel ist einer dieser Orte, die man mit eigenen Augen gesehen haben muss. Fotos werden dem Ort nicht gerecht. Die Kombination aus mittelalterlicher Architektur, den dramatischen Gezeiten und der mystischen Atmosphäre ist weltweit einzigartig. Perfekt als Wochenend-Trip oder als Teil einer Normandie-Rundreise. Unsere Deals machen es möglich. buche jetzt und erlebe Magie.',
      },
    ],
    tips: [
      'Gezeiten-Kalender vorab checken. bei Springflut ist das Erlebnis am intensivsten.',
      'Übernachtung auf der Insel buchen, um die Abtei nach Touristen-Abzug zu erleben.',
      'Gezeiten-Wanderung mit Guide ist Pflicht. die Bucht hat tödlichen Treibsand.',
      'La Mère Poulard Omeletts probieren. ein Klassiker seit 1888.',
      'Saint-Malo als Tagesausflug einplanen. die Piratenstadt ist nur 1 Stunde entfernt.',
    ],
    offerTitle: 'Normandie Kurzreise ab',
    offerPrice: '299 €',
    offerLink: '/reiseziel/mont-saint-michel',
  },
  {
    slug: 'antalya',
    title: 'Belek: Luxus an der Türkischen Riviera',
    destination: 'Antalya / Belek',
    country: 'Türkei',
    heroImage: '/destinations/antalya.png',
    metaDescription:
      'Belek & Antalya Urlaub 2026: 5-Sterne All Inclusive, Traumstrände & günstige Deals an der Türkischen Riviera.',
    intro:
      'Fünf Sterne zum Preis von drei. Belek an der Türkischen Riviera ist der Ort, wo Luxus erschwinglich wird. Endlose Sandstrände, All-Inclusive-Resorts der Extraklasse und Sonne satt. Das ist kein Kompromiss. das ist clever reisen.',
    sections: [
      {
        title: 'Warum Belek?',
        content:
          'Belek liegt östlich von Antalya an der Türkischen Riviera und ist bekannt für seine erstklassigen All-Inclusive-Resorts, kilometerlange Sandstrände und über 15 Championship-Golfplätze. Die Region bietet ein Preis-Leistungs-Verhältnis, das in Europa seinesgleichen sucht: Fünf-Sterne-Hotels mit mehreren Pools, Wasserparks, Spa-Bereichen und Gourmet-Buffets. zu Preisen, für die du anderswo ein Drei-Sterne-Hotel bekommst. Die Strände sind breit, sauber und mit Liegen ausgestattet. Das Wetter liefert von April bis November zuverlässig Sonne. Und die türkische Gastfreundschaft ist legendär. du wirst dich ab der ersten Minute willkommen fühlen.',
      },
      {
        title: 'Die besten Aktivitäten',
        content:
          'Die meisten Belek-Urlauber genießen ihre Resort-Anlage. verständlich, bei dem, was sie bieten. Aber es lohnt sich, rauszukommen: Die antike Stadt Aspendos mit dem besterhaltenen römischen Theater der Welt ist nur 20 Minuten entfernt. Der Düden-Wasserfall stürzt direkt ins Meer. spektakulär. Die Altstadt von Antalya (Kaleiçi) ist ein Labyrinth aus osmanischen Holzhäusern, Boutiquen und Rooftop-Restaurants. Eine Bootstour entlang der Küste zeigt versteckte Buchten und Grotten. Für Golfer: Belek ist die Golf-Hauptstadt der Türkei mit Plätzen wie dem Carya Golf Club. Land of Legends ist ein riesiger Themenpark mit Wasserrutschen und Shows. perfekt für Familien.',
      },
      {
        title: 'Reisetipps',
        content:
          'Beste Reisezeit: Mai bis Oktober, Badewetter ab April. Direktflüge nach Antalya ab fast jedem deutschen Flughafen, Flugzeit ca. 3,5 Stunden. Transfer nach Belek dauert 30-40 Minuten. All-Inclusive ist hier fast immer die beste Wahl. die Resorts bieten so viel, dass du kaum Geld außerhalb ausgibst. Türkische Lira am Automaten abheben, besserer Kurs als Wechselstuben. Alkohol in den Hotels ist inklusive, außerhalb deutlich teurer. Trinkgeld: 1-2 Euro für Zimmermädchen und Restaurant-Personal wird geschätzt. Ausflüge über lokale Anbieter buchen, nicht übers Hotel. oft 50 Prozent günstiger.',
      },
      {
        title: 'Unser Fazit',
        content:
          'Belek ist die Antwort auf die Frage: Wo bekomme ich Luxus-Urlaub zum besten Preis? All-Inclusive mit Fünf-Sterne-Standard, Sonne, Strand und Service. das gibt es so nur an der Türkischen Riviera. Ob Familien, Golfer oder Paare: Belek liefert. Und mit unseren Deals wird der Luxus-Urlaub zum echten Schnäppchen. Buche jetzt, bevor die Preise steigen.',
      },
    ],
    tips: [
      'All-Inclusive buchen. lohnt sich in Belek fast immer.',
      'Aspendos bei Sonnenuntergang besuchen. das antike Theater in goldenem Licht.',
      'Ausflüge über lokale Anbieter statt übers Hotel buchen. spart bis zu 50%.',
      'Türkischen Hamam mindestens einmal ausprobieren. ein einzigartiges Erlebnis.',
    ],
    offerTitle: 'Belek All Inclusive ab',
    offerPrice: '499 €',
    offerLink: '/reiseziel/antalya',
  },
  {
    slug: 'holland',
    title: 'Holland: Tiny House am Meer',
    destination: 'Holland',
    country: 'Niederlande',
    heroImage: '/destinations/holland.png',
    metaDescription:
      'Holland Urlaub 2026: Tiny Houses an der Nordsee, Tulpenfelder & Amsterdam. Günstige Kurztrips in die Niederlande.',
    intro:
      'Ein Tiny House direkt am Strand, Meeresrauschen zum Einschlafen, morgens Radfahren durch Dünenlandschaft. Holland ist der Kurzurlaub, der sich anfühlt wie eine andere Welt. und ist nur ein paar Autostunden entfernt.',
    sections: [
      {
        title: 'Warum Holland?',
        content:
          'Die Niederlande sind das perfekte Ziel für Kurztrips: kurze Anreise, keine Sprachbarriere, und eine Küste, die überrascht. Die Nordseestrände von Zeeland bis Texel sind breit, sauber und weniger überlaufen als man denkt. Der Trend Tiny Houses am Strand boomt. kleine, designte Häuschen direkt in den Dünen mit Meerblick und Fußbodenheizung. Dazu kommen die Tulpenfelder im Frühling, die Grachten von Amsterdam, die Käsemärkte in Gouda und Alkmaar. Holland ist flach, fahrradfreundlich und unglaublich gemütlich. Die niederländische Küche mit ihren Frikandeln, Stroopwafels und frischem Fisch aus der Nordsee ist das ultimative Comfort Food.',
      },
      {
        title: 'Was dich erwartet',
        content:
          'Mit dem Fahrrad durch die Dünenlandschaft radeln, Wind im Gesicht, Meer im Blick. das ist Holland-Feeling pur. Die Strände von Domburg, Katwijk oder Zandvoort sind perfekt für lange Spaziergänge. Im Frühling den Keukenhof besuchen, den weltweit größten Blumenpark mit Millionen Tulpen. Amsterdam bietet Weltklasse-Museen (Van Gogh, Rijksmuseum), das Jordaan-Viertel und die Grachten-Bootsfahrten. Rotterdam überrascht mit moderner Architektur und der coolsten Markthalle Europas. Den Haag hat Vermeer und die schönste Stadtbrandung der Niederlande in Scheveningen. Und abends dann Bitterballen und ein lokales Craft Beer in einer braunen Kneipe.',
      },
      {
        title: 'Reisetipps',
        content:
          'Beste Reisezeit: Mai bis September für Strand, April für Tulpenblüte. Anreise per Auto (ab NRW ca. 2 Stunden), Bahn oder Flug nach Amsterdam Schiphol. In Holland brauchst du kein Auto. das Fahrrad reicht. OV-Chipkaart kaufen für den öffentlichen Nahverkehr. Tiny Houses mindestens 2-3 Monate im Voraus buchen. die beliebten Standorte sind schnell weg. In Amsterdam das Zentrum meiden und lieber in Amsterdam-Noord oder De Pijp übernachten. günstiger und authentischer. Regenjacke immer dabei. das Wetter in Holland kann sich jederzeit ändern. Die Niederländer sprechen fast alle Deutsch oder Englisch.',
      },
      {
        title: 'Unser Fazit',
        content:
          'Holland ist der unterschätzte Urlaub. Nah, günstig, überraschend schön. Wer einen Kurztrip mit Strand, Kultur und gutem Essen sucht, ist hier richtig. Die Tiny Houses am Meer sind das Highlight. minimalistisch wohnen mit maximalem Meerblick. Und mit unseren Deals wird der Holland-Urlaub noch günstiger. Schnapp dir dein Tiny House, bevor sie weg sind.',
      },
    ],
    tips: [
      'Tiny Houses 2-3 Monate im Voraus buchen. die besten Plätze sind schnell weg.',
      'Fahrrad mitnehmen oder vor Ort leihen. Holland ist das Fahrradland schlechthin.',
      'Keukenhof nur im Frühling (März-Mai) geöffnet. Tickets online vorab kaufen.',
      'Stroopwafel frisch vom Markt probieren. der Unterschied zum Supermarkt ist enorm.',
    ],
    offerTitle: 'Holland Tiny House ab',
    offerPrice: '199 €',
    offerLink: '/reiseziel/holland',
  },
  {
    slug: 'sicilia',
    title: 'Sizilien: Vulkane, Meer & Pasta',
    destination: 'Sizilien',
    country: 'Italien',
    heroImage: '/destinations/sicilia.png',
    metaDescription:
      'Sizilien Urlaub 2026: Ätna, Taormina, Strände & die beste Küche Italiens. Günstige Pauschalreisen nach Sizilien.',
    intro:
      'Am Fuß des Ätna Granita löffeln, nachmittags in türkisem Wasser schwimmen, abends Arancini auf einer Piazza. Sizilien ist Italien, nur intensiver. Mehr Geschmack, mehr Drama, mehr Leben.',
    sections: [
      {
        title: 'Warum Sizilien?',
        content:
          'Sizilien ist die größte Mittelmeerinsel und ein Kontinent für sich. Hier trifft griechische Antike auf arabische Architektur, barocke Kirchenpracht auf brodelnde Vulkane. Der Ätna, Europas aktivster Vulkan, dominiert die Ostküste und bietet Wanderungen bis zum Kraterrand. Taormina, das Juwel der Insel, liegt auf einer Klippe mit Blick auf den Ätna und das Meer. das antike Theater hier ist der spektakulärste Veranstaltungsort der Welt. Palermo ist rau, laut und voller Energie. mit Straßenmärkten wie Ballarò, die an nordafrikanische Souks erinnern. Die Strände reichen von Sandstränden in Cefalù bis zu vulkanischen Buchten bei Taormina. Und die Küche? Die beste Italiens, sagen viele Italiener selbst.',
      },
      {
        title: 'Die besten Aktivitäten',
        content:
          'Den Ätna besteigen. mit Guide bis zum Krater, ein unvergessliches Erlebnis. Das griechische Theater von Taormina besuchen, mit Ätna und Meer als Kulisse. Palermo und seine Straßenmärkte erkunden: Sfincione (sizilianische Pizza), Pani ca Meusa (Milzsandwich), Arancini. Streetfood-Paradies. Die Scala dei Turchi besuchen, eine weiße Kalksteinklippe, die wie eine Treppe ins Meer führt. Das Tal der Tempel in Agrigent. griechische Tempelruinen, besser erhalten als in Griechenland selbst. Syrakus mit der Insel Ortigia, dem Archimedes-Museum und barocken Piazzas. Cefalù für Strandtage mit normannischer Kathedrale als Kulisse. Abends: Granita mit Brioche. das sizilianische Frühstück der Götter.',
      },
      {
        title: 'Reisetipps',
        content:
          'Beste Reisezeit: Mai bis Oktober, ideal Mai-Juni und September. Anreise per Flug nach Catania oder Palermo. Mietwagen ist unbedingt empfehlenswert. die öffentlichen Verkehrsmittel sind auf Sizilien unzuverlässig. Fahrstil der Sizilianer ist „kreativ". defensiv fahren und ein Navi verwenden. Die Ostküste (Taormina, Catania, Syrakus) ist touristischer, der Westen (Trapani, Marsala) authentischer. Unterkünfte in der Nebensaison oft 50 Prozent günstiger. Sizilien ist sicher für Touristen. die Mafia-Klischees sind überholt. Trinken: lokalen Nero d\'Avola Wein und Limoncello probieren.',
      },
      {
        title: 'Unser Fazit',
        content:
          'Sizilien ist Italien im Überfluss. mehr Geschmack, mehr Geschichte, mehr Leidenschaft. Die Insel packt dich ab dem ersten Moment und lässt nicht los. Ob Vulkan-Abenteuer, Strandurlaub oder kulinarische Rundreise. Sizilien liefert auf ganzer Linie. Die Preise sind noch moderat, und unsere Deals machen den Sizilien-Urlaub zum Schnäppchen. Buche jetzt und lass dich von der Insel verzaubern.',
      },
    ],
    tips: [
      'Ätna-Tour mit Guide buchen. der Vulkan ist aktiv, Sicherheit geht vor.',
      'In Palermo den Markt Ballarò besuchen. authentisches Streetfood-Erlebnis.',
      'Granita mit Brioche zum Frühstück probieren. das sizilianische Ritual.',
      'Scala dei Turchi bei Sonnenuntergang besuchen. unbeschreiblich schön.',
      'Mietwagen mit Vollkasko buchen. die sizilianischen Straßen sind abenteuerlich.',
    ],
    offerTitle: 'Sizilien Pauschalreise ab',
    offerPrice: '449 €',
    offerLink: '/reiseziel/sicilia',
  },
  {
    slug: 'punta-cana',
    title: 'Dominikanische Republik: Karibik-Traum',
    destination: 'Punta Cana',
    country: 'Dominikanische Republik',
    heroImage: '/destinations/punta-cana.png',
    metaDescription:
      'Punta Cana Urlaub 2026: All-Inclusive Karibik mit Traumstränden, Palmen & besten Preisen. Jetzt günstig buchen.',
    intro:
      'Palmen, die sich über weißen Sand beugen. Warmes, türkises Wasser, so weit du schauen kannst. Punta Cana ist die Postkarten-Karibik. und mit dem richtigen Deal erschwinglicher als du denkst.',
    sections: [
      {
        title: 'Warum Punta Cana?',
        content:
          'Punta Cana liegt an der Ostspitze der Dominikanischen Republik und ist das Karibik-Ziel Nummer eins für europäische Urlauber. Der Grund ist einfach: endlose Palmenstrände mit puderzuckerweißem Sand, durchgehend warmes Wasser und All-Inclusive-Resorts, die keine Wünsche offen lassen. Bavaro Beach wurde mehrfach als einer der schönsten Strände der Welt ausgezeichnet. Die Resorts liegen direkt am Strand und bieten alles von Infinity-Pools bis zu Unterwasser-Restaurants. Das Wetter ist ganzjährig warm mit Temperaturen um die 28-30 Grad. Die Dominikaner sind unglaublich freundlich und die Insel versprüht eine Lebensfreude, die ansteckend ist. Merengue-Rhythmen, Rum-Cocktails und Sonnenuntergänge. das ist Punta Cana.',
      },
      {
        title: 'Die besten Aktivitäten',
        content:
          'Am Strand liegen und nichts tun ist in Punta Cana eine vollkommen akzeptable Aktivität. Aber wer mehr will: Schnorcheln am Korallenriff, Schwimmen mit Delfinen, Zip-Lining über den Regenwald. Die Insel Saona erreicht man per Katamaran. ein Tagesausflug mit natürlichen Pools und einsamen Stränden, der sich wie ein Traum anfühlt. Die Hoyo Azul ist eine versteckte Cenote im Dschungel mit leuchtend blauem Wasser. Buggy-Safari durch Zuckerrohr-Plantagen und dominikanische Dörfer gibt echte Einblicke in die Kultur. Abends: Merengue-Tanzen, karibische Cocktails und Live-Musik in den Resorts. Für Golfer: Punta Cana hat einige der besten Golfplätze der Karibik.',
      },
      {
        title: 'Reisetipps',
        content:
          'Beste Reisezeit: November bis April (Trockenzeit). Hurrikan-Saison Juni bis November, aber Punta Cana wird selten getroffen. Direktflüge ab Deutschland dauern ca. 9-10 Stunden. All-Inclusive ist hier Standard und die beste Wahl. außerhalb der Resorts gibt es wenig Infrastruktur. Dominikanische Pesos am Automaten abheben, aber in den Resorts wird oft in USD abgerechnet. Sonnenschutz ist Pflicht. die Karibik-Sonne ist intensiv. Ausflüge über lokale Anbieter buchen, nicht über das Hotel. deutlich günstiger. Trinkwasser nur aus Flaschen. Die Zeitverschiebung beträgt minus 5 Stunden (Winterzeit) bzw. minus 6 Stunden (Sommerzeit).',
      },
      {
        title: 'Unser Fazit',
        content:
          'Punta Cana ist der Karibik-Traum, der Wirklichkeit wird. Weißer Sand, Palmen, All-Inclusive-Luxus. alles inklusive. Die Dominikanische Republik liefert Postkarten-Momente am laufenden Band. Und mit unseren Deals bekommst du die Karibik, ohne dein Konto zu sprengen. Traumurlaub muss nicht teuer sein. Buche jetzt und wach morgen am Strand auf.',
      },
    ],
    tips: [
      'All-Inclusive buchen. außerhalb der Resorts gibt es wenig Restaurants.',
      'Saona-Insel-Ausflug machen. der Highlight-Tagesausflug schlechthin.',
      'Lokale Anbieter für Ausflüge nutzen. spart bis zu 40% gegenüber Hotel-Buchung.',
      'Reef-safe Sonnencreme verwenden. das Korallenriff schützen.',
      'Dominikanischen Rum (Brugal, Barceló) probieren. am besten als Mamajuana.',
    ],
    offerTitle: 'Punta Cana All Inclusive ab',
    offerPrice: '999 €',
    offerLink: '/reiseziel/punta-cana',
  },
  {
    slug: 'marbella',
    title: 'Marbella: Glamour an der Costa del Sol',
    destination: 'Marbella',
    country: 'Spanien',
    heroImage: '/destinations/marbella.png',
    metaDescription:
      'Marbella Urlaub 2026: Puerto Banús, Beach Clubs & die besten Deals an der Costa del Sol. Luxus muss nicht teuer sein.',
    intro:
      'Superyachten in Puerto Banús, Beach Clubs mit DJ, und trotzdem eine bezaubernde Altstadt mit Orangenbäumen. Marbella ist Glamour und Authentizität in einem. Und günstiger als sein Ruf.',
    sections: [
      {
        title: 'Warum Marbella?',
        content:
          'Marbella liegt an der spanischen Costa del Sol und ist seit Jahrzehnten das Lieblingsziel der europäischen High Society. Aber Marbella ist mehr als Bling-Bling: Die Altstadt (Casco Antiguo) ist ein Juwel aus weißen Gassen, Orangenbäumen und gemütlichen Plazas. Puerto Banús glänzt mit Luxusboutiquen und Superyachten. hier kann man stundenlang Menschen-Watching betreiben, ohne einen Cent auszugeben. Die Strände sind gepflegt, die Beach Clubs bieten Daybed-Service mit Champagner, und das Nachtleben ist legendär. Dazu kommen über 300 Sonnentage, milde Winter und eine kulinarische Szene, die von Tapas-Bars bis zu Michelin-Restaurants reicht. Marbella liefert Lifestyle.',
      },
      {
        title: 'Die besten Aktivitäten',
        content:
          'Puerto Banús besuchen und den Luxus bestaunen. kostenlos und unterhaltsam. Am Nikki Beach Club einen Nachmittag im Daybed verbringen. Die Altstadt erkunden mit ihren versteckten Plazas, Tapas-Bars und Boutiquen. Tagesausflug nach Ronda, eine der dramatischsten Städte Spaniens mit ihrer berühmten Brücke über die Schlucht. Die Sierra Blanca bietet Wanderwege mit Ausblick auf Afrika bei klarer Sicht. Golfen auf einem der 40 Golfplätze der Region. Für Foodies: die Markthalle Mercado de San Pedro für frischen Fisch, Oliven und lokale Weine. Abends dann Tapas-Hopping in der Altstadt und danach ins Nachtleben. Marbella feiert bis in die Morgenstunden.',
      },
      {
        title: 'Reisetipps',
        content:
          'Beste Reisezeit: April bis Juni und September bis Oktober. perfekte Temperaturen, weniger Touristen. Anreise per Flug nach Málaga, dann 45 Minuten mit dem Auto. Die Altstadt ist günstiger als die „Golden Mile" und hat mehr Charme. Beach Clubs verlangen oft Mindestkonsum. Budget einplanen. Tapas in der Altstadt sind deutlich günstiger als in Puerto Banús. Mietwagen empfehlenswert für Ausflüge in die Umgebung. Nachtleben startet spät. vor Mitternacht passiert wenig. Spanisches Abendessen ab 21 Uhr, vorher sind die Restaurants leer. Gibraltar ist nur 45 Minuten entfernt. ein kurioser Tagesausflug mit britischem Flair und wilden Affen.',
      },
      {
        title: 'Unser Fazit',
        content:
          'Marbella ist Lifestyle-Urlaub vom Feinsten. Ob du am Beach Club chillen, durch die Altstadt schlendern oder das Nachtleben rocken willst. Marbella hat für jeden etwas. Und das Beste: Mit unseren Deals erlebst du den Glamour der Costa del Sol, ohne wie ein Millionär zahlen zu müssen. Schnapp dir das Angebot und gönn dir Marbella.',
      },
    ],
    tips: [
      'In der Altstadt übernachten. günstiger und charmanter als an der Golden Mile.',
      'Tagesausflug nach Ronda einplanen. eine der schönsten Städte Andalusiens.',
      'Tapas-Hopping: Calle del Peral in der Altstadt hat die besten Bars.',
      'Puerto Banús abends besuchen. die Yachten und die Atmosphäre sind spektakulär.',
    ],
    offerTitle: 'Marbella Strandurlaub ab',
    offerPrice: '399 €',
    offerLink: '/reiseziel/marbella',
  },
  {
    slug: 'corf',
    title: 'Korfu: Grüne Insel im Ionischen Meer',
    destination: 'Korfu',
    country: 'Griechenland',
    heroImage: '/destinations/corf.png',
    metaDescription:
      'Korfu Urlaub 2026: Die grünste Insel Griechenlands mit venezianischer Altstadt, Traumstränden & günstigen Angeboten.',
    intro:
      'Korfu ist anders als andere griechische Inseln. Grüner. Üppiger. Venezianischer. Zypressen, Olivenhaine und türkisblaue Buchten. hier fühlst du dich wie in einem Gerald Durrell Roman. Nur mit besserem Essen.',
    sections: [
      {
        title: 'Warum Korfu?',
        content:
          'Korfu ist die grünste der griechischen Inseln. und die kosmopolitischste. Jahrhundertelange venezianische, französische und britische Herrschaft haben eine einzigartige Kultur geschaffen, die sich von allem unterscheidet, was du aus der Ägäis kennst. Die Altstadt von Korfu ist UNESCO-Welterbe mit venezianischen Festungen, französischen Arkaden und der berühmten Esplanade, dem größten Platz Griechenlands. Die Landschaft ist üppig: Olivenhaine mit über 4 Millionen Bäumen, Zypressenwälder und dramatische Klippen. Die Strände reichen von organisierten Sandstränden im Süden bis zu wilden Buchten im Nordwesten. Paleokastritsa mit seinen Grotten und türkisem Wasser ist vielleicht der schönste Küstenabschnitt ganz Griechenlands.',
      },
      {
        title: 'Die besten Aktivitäten',
        content:
          'Die Altstadt von Korfu-Stadt erkunden. durch enge Gassen schlendern, Espresso auf dem Liston trinken und die Alte und Neue Festung besichtigen. Paleokastritsa besuchen: Bootstour zu den Grotten, Schnorcheln in kristallklarem Wasser, Kloster auf dem Hügel. Canal d\'Amour bei Sidari. eine natürliche Felsformation, durch die man angeblich die große Liebe findet. Den Mount Pantokrator besteigen (906 m). höchster Punkt der Insel mit 360-Grad-Panorama. Bootsausflug nach Paxos und Antipaxos. kleine Nachbarinseln mit dem türkisesten Wasser, das du je gesehen hast. Abends Sofrito (geschmortes Kalbfleisch) und Kumquat-Likör probieren. beides gibt es nur auf Korfu.',
      },
      {
        title: 'Reisetipps',
        content:
          'Beste Reisezeit: Mai bis Oktober, ideal Juni und September. Direktflüge aus Deutschland nach Korfu in ca. 2,5 Stunden. Mietwagen empfehlenswert. die Westküste mit ihren Buchten ist sonst schwer erreichbar. Die Straßen im Norden sind eng und kurvig, aber das gehört zum Abenteuer. Der Süden ist flacher und hat die längsten Sandstrände. Die Westküste hat die dramatischsten Sonnenuntergänge. Unterkunft in der Altstadt von Korfu-Stadt lohnt sich für mindestens eine Nacht. Preise sind günstiger als auf den Kykladen-Inseln. Kumquat-Produkte gibt es nur auf Korfu. der perfekte Mitbring.',
      },
      {
        title: 'Unser Fazit',
        content:
          'Korfu ist das Griechenland für Genießer und Entdecker. Die Mischung aus venezianischer Eleganz, üppiger Natur und griechischer Lebensfreude ist einzigartig. Perfekt für alle, die mehr wollen als nur Strand. Und mit unseren Deals wird der Korfu-Urlaub zum Schnäppchen. Grün, schön, günstig. was willst du mehr?',
      },
    ],
    tips: [
      'Paleokastritsa frühmorgens besuchen. nachmittags kommen die Ausflugsboote.',
      'Kumquat-Likör als Mitbringsel kaufen. gibt es nur auf Korfu.',
      'Bootstour nach Paxos/Antipaxos buchen. das türkiseste Wasser Griechenlands.',
      'In der Altstadt den Liston besuchen. Espresso unter französischen Arkaden.',
      'Westküste zum Sonnenuntergang ansteuern. Loggas Beach ist der beste Spot.',
    ],
    offerTitle: 'Korfu Pauschalreise ab',
    offerPrice: '429 €',
    offerLink: '/reiseziel/corf',
  },
  {
    slug: 'zypern',
    title: 'Zypern: Aphrodites Insel',
    destination: 'Zypern',
    country: 'Zypern',
    heroImage: '/destinations/zypern.png',
    metaDescription:
      'Zypern Urlaub 2026: Aphrodites Geburtsort, antike Ruinen & Traumstrände. Günstige Pauschalreisen nach Zypern entdecken.',
    intro:
      'Die Göttin der Liebe wurde hier geboren. kein Wunder, bei diesen Stränden. Zypern verbindet griechische Kultur, orientalischen Charme und 340 Sonnentage. Eine Insel, die mehr kann, als du erwartest.',
    sections: [
      {
        title: 'Warum Zypern?',
        content:
          'Zypern liegt am östlichsten Rand des Mittelmeers und ist eine Insel der Kontraste: griechische Tempel, byzantinische Kirchen, venezianische Festungen und osmanische Moscheen. alles auf engstem Raum. Der Aphrodite-Felsen (Petra tou Romiou) ist der mythische Geburtsort der Liebesgöttin und einer der fotogensten Orte im Mittelmeer. Paphos ist UNESCO-Welterbe mit sensationellen Bodenmosaiken aus der Römerzeit. Ayia Napa und Protaras bieten Partyleben und die schönsten Sandstrände der Insel. Das Troodos-Gebirge im Landesinneren überrascht mit Pinienwäldern, bemalten Kirchen und Weindörfern. Zypern hat 340 Sonnentage. die meisten in Europa. Und die Preise sind fair.',
      },
      {
        title: 'Die besten Aktivitäten',
        content:
          'Den Aphrodite-Felsen besuchen und die Mythologie spüren. Die Königsgräber von Paphos erkunden. monumentale unterirdische Grabkammern aus dem 3. Jahrhundert v. Chr. Am Nissi Beach in Ayia Napa den perfekten Strandtag verbringen. kristallklares, flaches Wasser. Wanderung auf dem Aphrodite-Trail im Akamas-Nationalpark mit der Blauen Lagune als Highlight. Weinprobe in den Troodos-Dörfern: Commandaria, der älteste benannte Wein der Welt, stammt von hier. Die geteilte Hauptstadt Nikosia besuchen. die letzte geteilte Hauptstadt Europas. Meze essen: die zypriotische Version von Tapas, mit 20-30 kleinen Gerichten. Abends Zivania trinken, den lokalen Grappa.',
      },
      {
        title: 'Reisetipps',
        content:
          'Beste Reisezeit: April bis November, Badewetter ab Mai. Anreise per Flug nach Larnaca oder Paphos, ca. 3,5 Stunden. Mietwagen ist empfehlenswert. Achtung: Linksverkehr (britisches Erbe). Die Ostküste (Ayia Napa) ist lebhafter, die Westküste (Paphos) ruhiger und kultureller. Im Troodos-Gebirge kann es auch im Sommer angenehm kühl sein. Jacke einpacken. Nordteil der Insel ist türkisch besetzt. Grenzübergang möglich, aber Mietwagen-Versicherung prüfen. Essen gehen ist günstiger als in Griechenland. Zypriotisches Halloumi direkt vom Erzeuger kaufen. schmeckt komplett anders als im Supermarkt.',
      },
      {
        title: 'Unser Fazit',
        content:
          'Zypern ist die Insel, die alles hat: Geschichte, Strände, Berge und eine Küche, die süchtig macht. Weniger überlaufen als die griechischen Inseln, sonniger als fast überall in Europa, und mit einem kulturellen Reichtum, der seinesgleichen sucht. Unsere Deals machen den Zypern-Urlaub zum Schnäppchen. Aphrodite hätte gebucht. und du?',
      },
    ],
    tips: [
      'Linksverkehr beachten. Zypern fährt auf der linken Seite (britisches Erbe).',
      'Commandaria-Wein probieren. der älteste benannte Wein der Welt.',
      'Halloumi direkt bei einem Dorfhersteller kaufen. ein Geschmackserlebnis.',
      'Nissi Beach unter der Woche besuchen. am Wochenende wird es zur Party-Zone.',
      'Die Blaue Lagune bei Akamas per Boot erreichen. vom Hafen Latchi aus.',
    ],
    offerTitle: 'Zypern Pauschalreise ab',
    offerPrice: '449 €',
    offerLink: '/reiseziel/zypern',
  },
  {
    slug: 'belek',
    title: 'Belek All Inclusive: 5 Sterne zum Sparpreis',
    destination: 'Belek',
    country: 'Türkei',
    heroImage: '/destinations/antalya.png',
    metaDescription:
      'Belek All Inclusive 2026: 5-Sterne Hotels zum Sparpreis. Aquaparks, Gourmet-Buffets & Traumstrände an der Türkischen Riviera.',
    intro:
      'Fünf Sterne, All Inclusive, direkt am Strand. und das zu einem Preis, der anderswo für drei Sterne reichen würde. Belek ist der König des All-Inclusive-Urlaubs. Hier stimmt einfach alles.',
    sections: [
      {
        title: 'Warum Belek All Inclusive?',
        content:
          'Belek hat sich zur All-Inclusive-Hauptstadt Europas entwickelt. und das aus gutem Grund. Die Fünf-Sterne-Resorts hier bieten ein Gesamtpaket, das seinesgleichen sucht: mehrere Pools inklusive Aquapark, private Strandabschnitte, Spa mit Hamam, Fitnessstudios, Kinderclubs, abendliche Shows und gastronomische Vielfalt mit mehreren Restaurants. Das alles zu Preisen, die in Griechenland oder Spanien für eine viel einfachere Unterkunft fällig wären. Die Strände von Belek sind breit, sandig und sauber. das Wasser ist warm und flach, perfekt für Familien. Über 300 Sonnentage garantieren traumhaftes Wetter von April bis November. Kein Wunder, dass Belek bei deutschen Urlaubern Platz eins der All-Inclusive-Ziele belegt.',
      },
      {
        title: 'Was die Resorts bieten',
        content:
          'Die Resorts in Belek sind kleine Städte für sich. Typisch: ein Hauptrestaurant mit Buffet-Vielfalt, dazu 3-5 A-la-carte-Restaurants (italienisch, asiatisch, türkisch, Seafood). Pool-Bars, Strandbar, Lobbybar. Getränke den ganzen Tag. Wasserparks mit Rutschen für Kinder und Erwachsene. Spa-Bereiche mit türkischem Hamam, Sauna, Jacuzzi und Massagen (teils inklusive). Kinderclubs mit Animation von morgens bis abends. Sportangebote: Tennis, Volleyball, Bogenschießen, Fitness. Abends Unterhaltungsprogramm mit Live-Musik, Tanz-Shows und Feuerwerk. Viele Resorts bieten sogar eigene Golfplätze oder Shuttle zum nächsten Course. Man kann zwei Wochen bleiben und muss das Resort kein einziges Mal verlassen.',
      },
      {
        title: 'Reisetipps',
        content:
          'Beste Reisezeit: Mai bis Oktober. Direktflüge nach Antalya ab fast jedem deutschen Flughafen, Flugzeit 3-3,5 Stunden. Transfer nach Belek dauert nur 30 Minuten. Bei der Hotelwahl auf Bewertungen achten. die Qualitätsunterschiede zwischen den Resorts sind groß. Ultra-All-Inclusive lohnt sich, wenn du Premium-Getränke und mehr A-la-carte-Restaurants willst. Zimmer mit Meerblick sind oft nur 20-30 Euro mehr pro Nacht. lohnt sich. Early Booking spart bis zu 30 Prozent. am besten im Winter für den Sommer buchen. Sonnenschutz und Kopfbedeckung nicht vergessen. die Sonne am Pool ist intensiv.',
      },
      {
        title: 'Unser Fazit',
        content:
          'Belek All Inclusive ist die Definition von „mehr für weniger". Fünf-Sterne-Luxus, endlose Buffets, Pool und Strand. und das zu Preisen, die günstiger sind als Camping am Gardasee. Perfekt für Familien, Paare und alle, die sich verwöhnen lassen wollen, ohne draufzuzahlen. Unsere Deals sind die besten am Markt. Schnapp dir deinen All-Inclusive-Traumurlaub, bevor die Preise steigen.',
      },
    ],
    tips: [
      'Early Booking nutzen. bis zu 30% Rabatt bei Buchung mehrere Monate im Voraus.',
      'Ultra-All-Inclusive wählen für Premium-Getränke und mehr Restaurant-Auswahl.',
      'Zimmer mit Meerblick upgraden. oft nur 20-30 Euro Aufpreis pro Nacht.',
      'Einen Tag für einen Ausflug einplanen. Antalya Altstadt oder Aspendos.',
      'Resort-Bewertungen genau lesen. bei Belek gibt es große Qualitätsunterschiede.',
    ],
    offerTitle: 'Belek 5* All Inclusive ab',
    offerPrice: '549 €',
    offerLink: '/reiseziel/antalya',
  },
]
