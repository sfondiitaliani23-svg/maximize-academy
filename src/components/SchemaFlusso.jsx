import { useEffect, useRef } from 'react';

// Stessa figura del metodo M×E. Le voci sono quelle già scritte nel manifesto di Maximize.
const SPECS = [
  { view: '0 0 1000 560', fs: '17px', wide: true, paths: [
    ['M140,83 L140,95 C140,169 444,169 444,243', '2.40s', '0s', 0],
    ['M320,83 L320,95 C320,169 472,169 472,243', '2.75s', '-0.47s', 0],
    ['M500,83 L500,95 C500,169 500,169 500,243', '3.10s', '-0.94s', 0],
    ['M680,83 L680,95 C680,169 528,169 528,243', '2.40s', '-1.41s', 0],
    ['M860,83 L860,95 C860,169 556,169 556,243', '2.75s', '-1.88s', 0],
    ['M461,317 C461,397 260,397 260,477', '2.60s', '-2.35s', 1],
    ['M500,317 C500,397 500,397 500,477', '3.00s', '-2.82s', 1],
    ['M539,317 C539,397 740,397 740,477', '2.60s', '-3.29s', 1],
  ], nodes: [
    ['73,37 215,37 215,75 207,83 65,83 65,45', 140, 60, 0],
    ['253,37 395,37 395,75 387,83 245,83 245,45', 320, 60, 0],
    ['433,37 575,37 575,75 567,83 425,83 425,45', 500, 60, 0],
    ['613,37 755,37 755,75 747,83 605,83 605,45', 680, 60, 0],
    ['793,37 935,37 935,75 927,83 785,83 785,45', 860, 60, 0],
    ['193,477 335,477 335,515 327,523 185,523 185,485', 260, 500, 1],
    ['433,477 575,477 575,515 567,523 425,523 425,485', 500, 500, 1],
    ['673,477 815,477 815,515 807,523 665,523 665,485', 740, 500, 1],
  ], hub: ['399,243 615,243 615,303 601,317 385,317 385,257', 500, 269, 295] },
  { view: '0 0 400 640', fs: '14px', wide: false, paths: [
    ['M66,72 L66,154 C66,234 156,234 156,314', '2.40s', '0s', 0],
    ['M200,72 L200,154 C200,234 178,234 178,314', '2.75s', '-0.47s', 0],
    ['M334,72 L334,154 C334,234 200,234 200,314', '3.10s', '-0.94s', 0],
    ['M137,142 L137,154 C137,234 222,234 222,314', '2.40s', '-1.41s', 0],
    ['M263,142 L263,154 C263,234 244,234 244,314', '2.75s', '-1.88s', 0],
    ['M169,386 C169,477 66,477 66,568', '2.60s', '-2.35s', 1],
    ['M200,386 C200,477 200,477 200,568', '3.00s', '-2.82s', 1],
    ['M231,386 C231,477 334,477 334,568', '2.60s', '-3.29s', 1],
  ], nodes: [
    ['15,28 125,28 125,64 117,72 7,72 7,36', 66, 50, 0],
    ['149,28 259,28 259,64 251,72 141,72 141,36', 200, 50, 0],
    ['283,28 393,28 393,64 385,72 275,72 275,36', 334, 50, 0],
    ['86,98 196,98 196,134 188,142 78,142 78,106', 137, 120, 0],
    ['212,98 322,98 322,134 314,142 204,142 204,106', 263, 120, 0],
    ['15,568 125,568 125,604 117,612 7,612 7,576', 66, 590, 1],
    ['149,568 259,568 259,604 251,612 141,612 141,576', 200, 590, 1],
    ['283,568 393,568 393,604 385,612 275,612 275,576', 334, 590, 1],
  ], hub: ['114,314 300,314 300,372 286,386 100,386 100,328', 200, 339, 365] },
];

const LABELS = {
  top: ['Formazione', 'Forbice', 'Prodotto', 'Gestionale', 'Evento'],
  bottom: ['Tecnica', 'Mentalità', 'Futuro'],
  hub: 'Maximize',
  sub: 'Una strategia',
};

function Disegno({ spec }) {
  const words = [...LABELS.top, ...LABELS.bottom];
  const [points, x, y1, y2] = spec.hub;
  return (
    <svg className={`flusso__svg flusso__svg--${spec.wide ? 'largo' : 'stretto'}`} viewBox={spec.view} style={{ '--fs': spec.fs }} aria-hidden="true" focusable="false">
      {spec.paths.map(([d, dur, delay, out]) => (
        <g key={d}>
          <path className="flusso__base" d={d} />
          <path className={out ? 'flusso__part flusso__part--esce' : 'flusso__part'} d={d} pathLength="1000" style={{ '--d': dur, '--r': delay }} />
        </g>
      ))}
      {spec.nodes.map(([poly, nx, ny, out], i) => (
        <g key={poly} className={out ? 'flusso__nodo flusso__nodo--esce' : 'flusso__nodo'}>
          <polygon points={poly} />
          <text x={nx} y={ny}>{words[i]}</text>
        </g>
      ))}
      <g className="flusso__hub">
        <polygon points={points} />
        <text x={x} y={y1} className="flusso__hub-sigla">{LABELS.hub}</text>
        <text x={x} y={y2}>{LABELS.sub}</text>
      </g>
    </svg>
  );
}

export default function SchemaFlusso() {
  const ref = useRef(null);
  useEffect(() => {
    const f = ref.current;
    if (!f) return undefined;
    if (!('IntersectionObserver' in window)) {
      f.classList.add('flusso--attivo');
      return undefined;
    }
    const io = new IntersectionObserver((voci) => {
      voci.forEach((v) => f.classList.toggle('flusso--attivo', v.isIntersecting));
    }, { rootMargin: '80px' });
    io.observe(f);
    return () => io.disconnect();
  }, []);
  return (
    <figure ref={ref} className="flusso" role="img" aria-label="Schema: formazione, forbice, prodotto, gestionale ed evento passano da Maximize e diventano tecnica, mentalità e futuro.">
      {SPECS.map((spec) => <Disegno key={spec.view} spec={spec} />)}
    </figure>
  );
}
