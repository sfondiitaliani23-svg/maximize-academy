# DESIGN.md — Maximize Academy

Stile del sito Maximize Academy (formazione e consulenza per barber di Maurizio Pizzuto), scritto per chi crea pagine, grafiche o demo (persone o IA).
Fonte di verità: `src/index.css` e `tailwind.config.js`. È la stessa linea visiva di Maurizio Barber Shop.
Ultima modifica: 2026-11-02.

## In una riga
Accademia premium per barber: nero, oro antico, Oswald in maiuscolo, pulsanti a parallelogramma con doppio filo. «Non solo Barber. Molto di più.»

## Colori
| Ruolo | Variabile | Valore |
|---|---|---|
| Fondo base | `--ink` | `#111` |
| Sezioni scure | `--ink-2` | `#181818` |
| Card | `--ink-3` | `#222` |
| Oro | `--gold` | `#bfa16a` |
| Oro al passaggio | `--gold-hover` | `#d2b67f` |
| Oro scuro (su chiaro) | `gold.dark` (Tailwind) | `#80632f` |
| Testo | `--text` | `#f4f4f4` |
| Testo secondario | `--text-soft` | `#bdbdbd` |
| Bordi | `--line` | `#3d3d3d` |

Niente tema chiaro, niente pastelli. Oro per titoli brevi, numeri grandi, icone attive e pulsanti.

## Caratteri
- **Oswald** (OFL), ospitato sul sito, per tutto (`serif`, `display` e `sans` in Tailwind puntano a Oswald).
- Testo del corpo con spaziatura `.03em`; titoli maiuscoli.

## Forme
- Angoli piccoli: `rounded-xl` = 6 px, `rounded-2xl`/`3xl` = 8 px. I cerchi (`rounded-full`) restano cerchi.
- **Pulsanti** `.btn-gold` (oro) e `.btn-glass` (filo grigio): parallelogramma con `--sk: .9rem`, doppio filo, nessun raggio, al passaggio fondo `color-mix(oro, nero 82%)`.
- Menu laterale da destra (`SidebarDrawer`): fondo `#111`, bordo oro tenue, icone in riquadri, voce «Installa l'app / Aggiorna l'app» in fondo.

## Movimento
- Solo `transform`, `opacity`, `filter`. Movimento ridotto rispettato. `:hover` solo dove c'è il mouse (`hoverOnlyWhenSupported`).
- Campi di testo a 16 px sul telefono (niente zoom automatico su iPhone).

## Contenuti
- Partner solo con permesso: Sabey Scissors (logo bianco su nero), Men's Events, ANAQA, Treatwell.
- Testi tecnici sui prodotti solo da Maurizio. Numeri e risultati solo veri.

## Da evitare
- Colori fuori dalla tavolozza, gradienti viola o blu.
- Stock foto di persone e foto senza liberatoria.
- Mescolare con lo stile di Barberia Garofalo (Rye, pulsanti tondi).
