// Luce del cursore sulle schede di vetro delle aree riservate (15/11/2026, richiesta di Eliseo).
// La scheda sotto il mouse riceve data-luce e le coordinate --lx/--ly: il CSS accende un filo d'oro
// sul bordo, proprio dove sta il cursore. Solo con il mouse (sul telefono non serve). Solo grafica.
export function avviaLuce(area, selettore) {
  let accesa = null;
  let attesa = 0;
  let ex = 0;
  let ey = 0;
  let et = null;
  const aggiorna = () => {
    attesa = 0;
    const el = (et && et.closest && et.closest(selettore)) || null;
    if (el !== accesa) {
      if (accesa) accesa.removeAttribute('data-luce');
      accesa = el;
      if (el) el.setAttribute('data-luce', '');
    }
    if (el) {
      const b = el.getBoundingClientRect();
      el.style.setProperty('--lx', `${ex - b.left}px`);
      el.style.setProperty('--ly', `${ey - b.top}px`);
    }
  };
  const muovi = (e) => {
    if (e.pointerType !== 'mouse') return;
    ex = e.clientX; ey = e.clientY; et = e.target;
    if (!attesa) attesa = requestAnimationFrame(aggiorna);
  };
  const fuori = () => { if (accesa) accesa.removeAttribute('data-luce'); accesa = null; };
  area.addEventListener('pointermove', muovi, { passive: true });
  area.addEventListener('pointerleave', fuori);
  return () => {
    cancelAnimationFrame(attesa);
    area.removeEventListener('pointermove', muovi);
    area.removeEventListener('pointerleave', fuori);
    fuori();
  };
}
