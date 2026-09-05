# Bester Urlaub — Brand Kit

Cartella unica del marchio. Sta in `public/`, quindi è **navigabile dal browser**:
apri `http://localhost:3001/brand/brandbook.html` (o `/brand/brandbook.html` in produzione).

```
public/brand/
├── BRANDSHEET.md              ← il documento: identità, voce, colori, regole
├── brandbook.html             ← la versione visiva, da aprire nel browser
├── logo/                      ← i 5 file ufficiali del logo, nessun altro
├── tokens/
│   ├── brand-tokens.css       ← variabili + classi .bu-* (importate da globals.css)
│   └── tokens.json            ← stessi valori, leggibili da tool e script
├── patterns/                  ← 3 tile ripetibili (wellen, insel, sonne)
└── elements/                  ← icone, badge, timbri, ticket, divisore d'onda
```

## Come si usa nel sito

`src/app/globals.css` importa `tokens/brand-tokens.css`. Da qualsiasi componente:

```tsx
<p className="bu-eyebrow">Persönliche Beratung</p>
<a className="bu-btn bu-btn--primary">Jetzt anrufen</a>
<section className="bu-surface-navy bu-pattern-wellen">…</section>
<hr className="bu-wave-divider" />
```

I colori restano disponibili anche come variabili CSS: `var(--bu-blue)`,
`var(--bu-navy)`, `var(--bu-orange)`, `var(--bu-sand)`, `var(--bu-lagune)`.

## Come si usa fuori dal sito

- **Elementi (`elements/*.png`):** generati con Nano Banana Pro su fondo bianco. Lo sfondo si toglie a mano prima dell'uso.
- **Social:** `elements/ticket.png` come modulo offerta, `patterns/pattern-sonne.svg` come fondo storie.
- **Email:** `patterns/pattern-insel.svg` come fondo intestazione, `elements/badge-set.png` per le garanzie.

## Regole da non rompere

1. L'arancio è il colore dell'azione, non della decorazione: massimo ~10% della superficie.
2. I bottoni sono sempre pill.
3. Il logo a colori non va mai su fondo blu o navy: lì si usa `logo/noBgWhite.png`.
4. Il pattern resta sotto l'8% di opacità dietro un testo lungo.
5. Nessun numero pubblicato senza fonte: niente cifre stimate.

Dettagli e motivazioni: [BRANDSHEET.md](./BRANDSHEET.md).
