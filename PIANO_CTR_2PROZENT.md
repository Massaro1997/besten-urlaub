# PIANO CTR 2% — besterurlaub.com

> Creato 2026-07-07 da audit GSC reale. Baseline 28gg: **41 click / 26.252 impr = CTR 0,16%**, pos media 23,4. Target: **CTR 2%** (~525 click/28gg a parità di impression).
> Esecutore: sessione Claude. Aggiornare REGISTRO in fondo dopo ogni sessione.

---

## GOTCHA OBBLIGATORI

1. **Path:** `Progetti in Corso/Bester Urlaub/tiktok-check24-travel/`. Next 16 breaking changes: leggere `node_modules/next/dist/docs/` prima di toccare API framework.
2. **Deploy:** git push = solo Preview. Prod SOLO `npx vercel deploy --prod`.
3. **Build:** `SKIP_ENV_VALIDATION=1 npx next build` (~1050 pagine SSG).
4. **Copy:** MAI trattini em/en. Voce umana (regole in memoria bestenurlaub_copy_rules).
5. **Contenuto programmatico:** ogni modifica ai builder (`src/lib/reisemonat.ts`, `src/lib/fragen.ts`) tocca centinaia di pagine con 1 edit. Validare con forge se si cambia il BODY (i title/meta non passano da forge).
6. Credenziali GSC: riuso OAuth Massaro (`.env.local` di insurance-leads), property `sc-domain:besterurlaub.com`. Script check: `Massaro Versicherungen/insurance-leads/.seo-work/bester-check.mjs`.

---

## FOTOGRAFIA (07/07/2026, 28gg)

| Asse | Pagine con impr | Click | Impr | CTR | Pos |
|---|---|---|---|---|---|
| /fragen | 109 | 18 | 13.637 | 0,13% | 25,4 |
| /reise | 208 | 20 | 9.783 | 0,20% | 13,4 |
| /ratgeber | 11 | 3 | 1.365 | 0,22% | 23,7 |
| /reiseziel | 30 | 0 | 883 | 0,00% | 67,6 |
| / (home) | 1 | 0 | 702 | 0,00% | 79,0 |

Impression in forte crescita (1k→2,2k/g in 2 settimane), pos media 57→23 in un mese: il motore programmatico sta maturando. Il problema è SOLO il click.

**Diagnosi (non era il copy):** title/meta già decenti, schema già ricco (Article+FAQPage+Breadcrumb). Cause reali:
1. **Intent zero-click:** query dominanti = meteo ("wetter bodrum oktober", "klimatabelle x", "flugzeit x") → SERP con widget meteo Google + wetter.com/klimatabelle.info. A pos 8-12 (sotto fold) CTR ~0% è quasi fisiologico. Esempio estremo: "flugzeit hamburg kreta" pos 2,9 / 40 impr / 0 click = risposta diretta in SERP.
2. **Posizione:** pos media /fragen 25. CTR 2% richiede top 3-5, non solo title migliori.
3. **Query mix:** quasi zero query commerciali ("pauschalreise x", "x urlaub all inclusive") = quelle che cliccano davvero.

**Realismo target:** 2% sitewide su query meteo = non raggiungibile a breve. Percorso: 0,16% → 0,5-0,8% con title v2 (fase 1), → 1-1,5% con posizioni top 5 (fase 2-3), → 2%+ spostando il mix su query commerciali (fase 4).

---

## FASE 1 — TITLE/META v2 (FATTO 07/07, da deployare→deployato, vedi registro)

Formula: keyword davanti + NUMERI concreti + anno + hook domanda. 1 edit nei builder = 850+ pagine.

- `/reise/[ziel]/[monat]`: `Bodrum im Oktober 2026: 26°C, Meer 23°C. Lohnt es sich?` (anno = prossima occorrenza del mese, calcolato a build time; fallback Sonnenstunden per mete inland wasser=0). Meta con Regentage + "Ehrliche Einschätzung + Pauschalreisen ab X €".
- `/fragen/*`: nuovo campo `seoTitle` (H1 resta la domanda):
  - klimatabelle → `Klimatabelle Bodrum: 15°C bis 34°C, Meer bis 26°C (alle Monate)` — exact match "klimatabelle x" che è la query reale
  - anreise → `Flugzeit nach Kreta: ca. 3,2 Stunden ab Deutschland`
  - beste-reisezeit → `Beste Reisezeit Kreta: Mai, Juni, September (bis 25°C Wasser)`
  - guenstigste-reisezeit → `Kreta günstig buchen: im November ab 389 € (Preistabelle)`
  - mit-kindern → `Kreta mit Kindern: beste Reisezeit Mai, Juni, September`
- **Verifica:** curl title live post-deploy + GSC CTR a +14gg sulle 10 pagine top (target: ≥3x baseline, cioè ≥0,6%).

## FASE 2 — POSIZIONE: da 8-12 a top 5 sulle pagine che hanno già impression

Le 10 pagine con l'80% delle impression sono tutte pos 7-17. Salire = moltiplicare CTR naturale (pos 3 ≈ 8-10% vs pos 9 ≈ 1%).

- [ ] **Arricchire le top 10** (bodrum/oktober, alanya/oktober, antalya/oktober, anreise-kreta, anreise-sardinien, klimatabelle-korfu/apulien/samos, guenstigste-kreta, ratgeber/bodrum): +300-500 parole UNICHE per pagina (non template): eventi del mese reali, quartieri/spiagge specifiche, tabella prezzi per settimana. Contenuto manuale sulle 10, non nel builder.
- [ ] **Internal linking verso le top 10**: da home e da hub /reise e /fragen, link diretti alle 10 (ora sono pari alle altre 1000).
- [ ] **Featured snippet:** box risposta 40-50 parole in cima alle anreise ("Der Flug nach Kreta dauert 3 Stunden 15 Minuten...") formato snippet-ready.

## FASE 3 — MESE CORRENTE DINAMICO (stagionalità)

Ottobre domina ora perché la gente cerca l'autunno. Ogni mese la domanda si sposta.

- [ ] Hub `/reise`: sezione "Wohin im [mese+1]?" in cima, rigenerata a ogni build/deploy → link freschi al mese che la gente sta cercando ORA.
- [ ] Cron/reminder: 1 deploy al mese minimo (SSG = contenuto congelato al build).

## FASE 4 — QUERY COMMERCIALI (il vero sblocco verso 2%)

Query meteo informano, query commerciali cliccano. Il sito HA le offerte Check24 ma le pagine offerta non rankano (/angebot 1 impr).

- [ ] Asse nuovo `/pauschalreise/[ziel]` (58 pagine, NON migliaia): target "pauschalreise bodrum", "bodrum urlaub all inclusive", "bodrum urlaub günstig". Contenuto: offerte reali UP/Check24 + prezzi per mese + hotel. Product/Offer schema. Validare con forge (page-forge).
- [ ] Link da ogni /reise/[ziel]/[monat] → /pauschalreise/[ziel] ("Angebote ansehen").
- [ ] /reiseziel (pos 67, 0 click): o si arricchisce o si fonde con /pauschalreise. Decidere coi dati a +30gg.

## FASE 5 — MONITORING (ogni sessione)

- [ ] `node .seo-work/bester-check.mjs` (da cartella insurance-leads Massaro).
- [ ] KPI: CTR sitewide, CTR delle 10 pagine top, quota impression di query commerciali.
- [ ] Aggiornare REGISTRO.

---

## PROIEZIONE

| Leva | CTR atteso |
|---|---|
| Baseline | 0,16% |
| Fase 1 (title v2) a +14gg | 0,4-0,8% |
| Fase 2 (top 5 sulle top 10) a +30-45gg | 0,8-1,5% |
| Fase 4 (mix commerciale) a +60-90gg | 1,5-2,5% |

---

## REGISTRO ESECUZIONE

| Data | Sessione | Fatto | CTR 28gg |
|---|---|---|---|
| 2026-07-07 | Audit+Fase 1 (Fable) | Audit GSC (41c/26.252i = 0,16%). Title/meta v2: reise-monat (anno dinamico + °C + hook, fallback inland), seoTitle 5 tipi fragen (keyword davanti + numeri). Creati bester-check.mjs + questo piano. | 0,16% |
