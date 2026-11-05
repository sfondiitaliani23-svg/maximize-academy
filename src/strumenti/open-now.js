// Badge "Aperto ora" (B7). Funzione pura: serve sia al build sia al browser.
// Orari da data/hours.json, chiusure da data/holidays.json (solo voci con confermato: true). Fuso Europe/Rome.
const DAYS = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'];
const DAY_NAMES = { dom: 'domenica', lun: 'lunedì', mar: 'martedì', mer: 'mercoledì', gio: 'giovedì', ven: 'venerdì', sab: 'sabato' };
const DAY_NAMES_EN = { dom: 'Sunday', lun: 'Monday', mar: 'Tuesday', mer: 'Wednesday', gio: 'Thursday', ven: 'Friday', sab: 'Saturday' };
const toMin = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };

export function partsInZone(date, timeZone = 'Europe/Rome') {
  const f = new Intl.DateTimeFormat('en-GB', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', weekday: 'short', hourCycle: 'h23' });
  const p = Object.fromEntries(f.formatToParts(date).map((x) => [x.type, x.value]));
  const dayKey = { Sun: 'dom', Mon: 'lun', Tue: 'mar', Wed: 'mer', Thu: 'gio', Fri: 'ven', Sat: 'sab' }[p.weekday];
  return { iso: `${p.year}-${p.month}-${p.day}`, day: dayKey, minutes: Number(p.hour) * 60 + Number(p.minute) };
}

const addDays = (iso, n) => {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

const closedDates = (holidays = []) => new Set(holidays.filter((h) => h.confermato === true && h.chiuso).map((h) => h.data));
const slotsFor = (week, day, iso, closed) => (closed.has(iso) ? [] : week[day] || []);

// Restituisce { open, text, closesAt?, next? }
export function computeOpenStatus(now, hours, holidays = [], lang = 'it') {
  const en = lang === 'en';
  const closed = closedDates(holidays);
  const t = partsInZone(now, hours.timezone);
  const today = slotsFor(hours.week, t.day, t.iso, closed);
  const current = today.find(([a, b]) => t.minutes >= toMin(a) && t.minutes < toMin(b));
  if (current) return { open: true, closesAt: current[1], text: en ? `Open now · closes at ${current[1]}` : `Aperto ora · chiude alle ${current[1]}` };
  const later = today.find(([a]) => t.minutes < toMin(a));
  if (later) return { open: false, next: { day: 'oggi', at: later[0] }, text: en ? `Closed · reopening today at ${later[0]}` : `Chiuso · riapriamo oggi alle ${later[0]}` };
  for (let i = 1; i <= 14; i += 1) {
    const iso = addDays(t.iso, i);
    const day = DAYS[new Date(`${iso}T12:00:00Z`).getUTCDay()];
    const slots = slotsFor(hours.week, day, iso, closed);
    if (slots.length) {
      const label = en ? (i === 1 ? 'tomorrow' : DAY_NAMES_EN[day]) : (i === 1 ? 'domani' : DAY_NAMES[day]);
      return { open: false, next: { day: label, at: slots[0][0] }, text: en ? `Closed · reopening ${label} at ${slots[0][0]}` : `Chiuso · riapriamo ${label} alle ${slots[0][0]}` };
    }
  }
  return { open: false, text: en ? 'Closed' : 'Chiuso' };
}

// Nel browser: legge i dati incorporati e aggiorna ogni elemento con data-open-now.
if (typeof document !== 'undefined') {
  const node = document.getElementById('hours-data');
  const targets = [...document.querySelectorAll('[data-open-now]')];
  if (node && targets.length) {
    const { hours, holidays } = JSON.parse(node.textContent);
    const update = () => {
      const s = computeOpenStatus(new Date(), hours, holidays, document.documentElement.lang === 'en' ? 'en' : 'it');
      targets.forEach((el) => {
        if (el.classList.contains('open-badge')) {
          const [a, ...b] = s.text.split(' · ');
          el.replaceChildren(...[a, b.join(' · ')].filter(Boolean).map((x) => Object.assign(document.createElement('span'), { textContent: x })));
        } else el.textContent = s.text;
        el.dataset.state = s.open ? 'open' : 'closed';
      });
    };
    update();
    setInterval(update, 60000);
  }
}
