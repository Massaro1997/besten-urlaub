# Bester Urlaub — Brand Sheet

Versione 2.0 · 05/09/2026 · palette allineata al logo 2026 · fonte unica per sito, social e stampa.
Chi tocca grafica o testi di Bester Urlaub parte da qui.

---

## 1. Chi siamo

**Bester Urlaub** è un consulente di viaggio tedesco che lavora al telefono e su TikTok:
niente motore di ricerca anonimo, una persona che confronta i pacchetti dei grandi
tour operator e prenota quello giusto per te.

**Promessa in una riga (DE):**
> Wir suchen deinen Urlaub raus — du musst nur noch anrufen.

**Cosa non siamo:** un comparatore automatico, un aggregatore di coupon, un canale di
"offerte lampo" urlate.

---

## 2. Carattere del brand

Quattro tratti. Ogni scelta di design o di copy deve poterne rivendicare almeno due.

| Tratto | Significa | Si vede in |
|---|---|---|
| **Klar** | Una informazione per volta, prezzi leggibili, niente asterischi | Layout arioso, gerarchia forte, numeri grandi |
| **Nah** | Si dà del "du", risponde una persona vera | Foto reali, numero di telefono in chiaro, orari dichiarati |
| **Geprüft** | Solo numeri e claim verificabili | Badge di verifica, fonti, nessuna cifra stimata |
| **Sonnig** | Leggerezza mediterranea, mai infantile | Blu oceano + arancio sole, onde, palma, luce alta |

**Archetipo:** la guida esperta in spiaggia. Rilassata nei modi, precisa nei fatti.

**Tono di voce (DE)**

- Frasi corte. Verbo presto. Massimo un'idea per frase.
- "du", mai "Sie". Mai plurale maiestatis pomposo.
- Numeri solo se veri e citabili. Mai "über 1000 zufriedene Kunden" se non contati.

| ✅ Si scrive | ❌ Non si scrive |
|---|---|
| Lieber beraten lassen? | MEGA-SCHNÄPPCHEN!!! Nur heute!!! |
| Wir prüfen Verfügbarkeit und Flugzeiten für dich. | Die besten Deals im ganzen Internet |
| Erreichbar Mo–Fr 9:00 – 19:00 Uhr | Jederzeit für dich da (non è vero) |
| 7 Nächte, All Inclusive, ab Düsseldorf | Traumurlaub zum Wahnsinnspreis |

**Lista nera:** "Piraten", "Schnäppchenjäger", punti esclamativi multipli, emoji nei
titoli (ammesse solo nelle didascalie social), MAIUSCOLO urlato, prezzi barrati non
documentati, countdown finti.

---

## 3. Logo

Il marchio è **isola + palma + onde** dentro un cerchio implicito, con lettering
geometrico monolinea in due righe.

**File ufficiali** — `/brand/logo/`

| File | Uso |
|---|---|
| `noBgColor.png` | Standard su fondo chiaro |
| `noBgWhite.png` | Su navy, su foto, su blu |
| `noBgBlack.png` | Stampa a un colore, fax, timbri |
| `whiteBgColor.png` | Quando serve un fondo bianco chiuso (marketplace, PDF) |
| `symbol.svg` | Simbolo monocromatico blu: pattern, timbri, stampa a un colore |
| `symbol-2026.svg` | **Simbolo a colori 2026** (palma, sole, onde): favicon, avatar social, app |

**Regole**

- Area di rispetto: almeno l'altezza della "B" su ogni lato.
- Dimensione minima: 120 px di larghezza a schermo, 25 mm in stampa. Sotto, solo simbolo.
- Su foto: sempre versione bianca, e sotto ci vuole un velo scuro (navy 40–70%) o una zona calma dell'immagine.

**Vietato:** ruotare, stirare, cambiare colore fuori palette, aggiungere ombre o
contorni, ricomporre simbolo e testo, mettere il logo a colori su fondo blu.

---

## 4. Colori

### Core

| Nome | HEX | Ruolo |
|---|---|---|
| **Ozean Blau** | `#006AF9` | Colore del marchio, preso dall'onda del logo. Link, icone, grafici |
| **Blau Tief** | `#004DE9` | Hover e stati premuti, blu profondo dell'onda |
| **Blau Nebel** | `#E6F0FF` | Fondi tenui, chip, evidenze leggere |
| **Tiefsee Navy** | `#0a1a3a` | Inchiostro dei testi e fondo delle sezioni emotive |
| **Sonnenorange** | `#F2660A` | **Solo azione**: CTA, prezzo, accenti. Sole del logo, scurito quanto basta per restare leggibile su bianco |
| **Sonnenrot** | `#FE561B` | Fine del gradiente CTA, tramonto del logo |

### Supporto

| Nome | HEX | Ruolo |
|---|---|---|
| **Himmel Cyan** | `#2DCBFC` | Onda chiara del logo: secondo colore di grafici e pattern |
| **Aqua** | `#5FD8FA` | Riflessi, fondi leggeri, illustrazioni |
| **Lagune** | `#D8F4FE` | Fondo hero, aree luce |
| **Palmgrün hell** | `#69C734` | Palma del logo: accenti vivi, illustrazioni, adesivi |
| **Palmgrün** | `#2A9733` | Disponibile, confermato, incluso (testo e icone) |
| **Sonnengelb** | `#FFD424` | Sole del logo: stelle, evidenze, badge |
| **Sand** | `#f7efe3` | Fondo editoriale (Ratgeber, testi lunghi) |
| **Koralle** | `#e5343f` | Solo errori e ultimi posti. Mai decorativo |

### Neutri

`#ffffff` · `#f5f7fa` · `#e6eaf0` · `#8a94a6` · `#0a1a3a`

Il marrone del tronco (`#8D471A`) vive solo dentro il logo: non è un colore di interfaccia.

### Regole d'uso

1. **Il blu è il brand, l'arancio è l'azione.** Arancio massimo ~10% della superficie di una pagina: se tutto è arancio, niente è un bottone.
2. Su navy si usa bianco a opacità scalare (100 / 75 / 50%), non grigi.
3. Il rosso Koralle non decora mai un prezzo: quello è compito dell'arancio.
4. Contrasto minimo AA: navy su bianco 15.8:1 ✅ · blu su bianco 3.9:1 → solo da 18px/600 in su o per icone e bordi · bianco su arancio 3.1:1 → solo testo ≥18px bold.
5. Gradiente CTA ufficiale: `linear-gradient(135deg, #FF8A0F, #FE561B)` — è il tramonto del logo con ombra `0 12px 40px -8px rgba(255,107,53,.6)`.

---

## 5. Tipografia

Un carattere solo: **Poppins** (Google Fonts, già caricato dal sito). Geometrico come
il lettering del logo, disponibile ovunque, zero costi di licenza.

| Stile | Peso / Corpo | Tracking |
|---|---|---|
| Display | 700 · 40–56 px | −0.03em |
| H2 | 700 · 30–42 px | −0.02em |
| H3 | 600 · 22–26 px | −0.02em |
| Body L | 400 · 18 px / 1.6 | 0 |
| Body | 400 · 16 px / 1.6 | 0 |
| Small | 400 · 14 px / 1.5 | 0 |
| **Occhiello** | 700 · 11–12 px MAIUSC. | **0.25em** |
| Prezzo | 800 · 28–42 px, cifre tabellari | −0.02em |

Regole: massimo due pesi per schermata; l'occhiello è sempre arancio; i numeri di
prezzo e telefono usano `font-variant-numeric: tabular-nums`; misura di riga 60–75
caratteri nei testi lunghi.

---

## 6. Forme, superfici, movimento

- **Raggi:** 8 (chip) · 12 (input) · 16 (card) · 24 (blocchi grandi) · pill (bottoni). I bottoni sono sempre pill: è la firma del brand.
- **Ombre:** `0 1px 2px rgba(10,26,58,.06)` · `0 8px 24px -8px rgba(10,26,58,.18)` · CTA arancio come sopra. Mai ombre nere piatte.
- **Bordi:** 1px `rgba(10,26,58,.08)` su chiaro, `rgba(255,255,255,.15)` su navy.
- **Onda:** il divisore tra una sezione e l'altra è l'onda del logo (`/brand/elements/wave-divider.svg`), non una linea retta.
- **Griglia:** contenitore 1280 px, gutter 16/24/32, spaziatura su base 4, ritmo tra sezioni 64 → 80 → 96 px.
- **Movimento:** 200 ms micro-interazioni, 300 ms sezioni, curva `cubic-bezier(.22,1,.36,1)`. Hover `scale(1.02)`, active `scale(.98)`. Niente rimbalzi, niente parallasse pesante.

---

## 7. Fotografia

**Sì:** luce del mattino o dorata, orizzonte alto, acqua turchese, spazio vuoto a
sinistra per il testo, gente vera in scena media.
**No:** HDR saturo, tramonti viola finti, stock con sorrisi da catalogo, filtri caldi
sopra le righe, collage.

Trattamento standard su foto con testo sopra: velo `linear-gradient(90deg, #0a1a3a
95%, transparent)` su desktop, dal basso su mobile.

---

## 8. Pattern e elementi

Tutto in `/brand/patterns/` e `/brand/elements/`, ripetibili all'infinito.

| Asset | Dove si usa |
|---|---|
| `pattern-wellen.png` / `.svg` | Fondo di sezioni navy, retro delle card, packaging |
| `pattern-insel.png` / `.svg` | Carta da regalo, tote, fondo email, retro biglietti |
| `pattern-sonne.png` / `.svg` | Blocchi promo, storie social, copertine Ratgeber |
| `icon-set.png` | Icone monolinea: palma, sole, aereo, valigia, ombrellone, onda, bussola, biglietto |
| `badge-set.png` | Quattro garanzie: Bestpreis geprüft, Persönlich beraten, Sicher gebucht, Handverlesen |
| `stamp-set.png` | Timbri circolari per stampa, adesivi, packaging |
| `ticket.png` | Modulo offerta / boarding pass per social e stampa |
| `wave-divider.png` | Passaggio tra due sezioni |
| `wave-divider.svg` | Versione vettoriale usata dal CSS (`.bu-wave-divider`) |

Elementi e pattern in versione `.png` sono generati con **Nano Banana Pro su fondo
bianco**: lo sfondo va scontornato a mano prima dell'uso. Dei pattern resta anche la
versione `.svg`, l'unica che il CSS può ripetere come tile combaciando sui bordi.

Il pattern non va mai sotto un testo lungo: massimo 8% di opacità dietro il corpo del
testo, fino al 100% nelle aree decorative.

---

## 9. Applicazione al sito

I token vivono in `/brand/tokens/brand-tokens.css`, importati da `src/app/globals.css`.
Classi utili già pronte: `.bu-eyebrow`, `.bu-btn`, `.bu-btn--primary`,
`.bu-btn--ghost`, `.bu-card`, `.bu-badge`, `.bu-pattern-wellen`, `.bu-pattern-insel`,
`.bu-surface-navy`, `.bu-surface-sand`.

Alternanza dei fondi delle sezioni: bianco → sabbia → bianco → navy (una sola sezione
navy per pagina, quella emotiva o la CTA finale).
