// Copia Eliseo da Maurizio Barber Shop (stessi account, stesso database) dentro l'area privata di Maximize.
// Uso: node scripts/sync-strumenti.mjs ../maurizio-barber-shop
// Adatta solo i punti che in Maximize sono diversi: sessione (lib/account.js), notifiche, dati del sito importati da src/strumenti/dati.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const mbs = process.argv[2] || '../maurizio-barber-shop';
const out = new URL('../src/strumenti/', import.meta.url).pathname;
const read = (f) => readFileSync(join(mbs, 'js', f), 'utf8');
const must = (s, from, to, name) => { if (!s.includes(from)) throw new Error(`Non trovo il punto da adattare in ${name}: ${from.slice(0, 60)}`); return s.replace(from, to); };

let eliseo = read('portal-eliseo.js');
eliseo = must(eliseo, "import { client } from './auth.js';", "import { client } from './auth-session.js';", 'portal-eliseo.js');
eliseo = must(eliseo, "import { api as pushApi } from './push.js';", "import { api as pushApi } from './push-api.js';", 'portal-eliseo.js');
writeFileSync(join(out, 'portal-eliseo.js'), eliseo);

let ai = read('portal-eliseo-ai.js');
ai = must(ai, "import { promptsCard, sheetsCard } from './portal-eliseo-settings.js';",
  "import { promptsCard, sheetsCard } from './portal-eliseo-settings.js';\nimport assistantData from './dati/assistant.json';\nimport knowledgeData from './dati/knowledge.json';\nimport offersData from './dati/offers.json';\nimport hoursData from './dati/hours.json';\nimport sitemapXml from './dati/sitemap.xml?raw';", 'portal-eliseo-ai.js');
ai = ai.replace(/  function siteView\(\) \{\n    return siteScreen\(async \(\) => \{[\s\S]*?\n    \}\);\n  \}/, "  function siteView() {\n    return siteScreen(async () => ({ map: sitemapXml, when: 'a ogni pubblicazione' }));\n  }");
if (!ai.includes('map: sitemapXml')) throw new Error('siteView non adattata');
ai = must(ai, "const [assistant, knowledge, offers] = await Promise.all([fetch('/data/assistant.json').then((r) => r.json()), fetch('/data/knowledge.json').then((r) => r.json()), fetch('/data/offers.json').then((r) => r.json()).catch(() => ({ items: [] }))]);",
  'const assistant = assistantData;\n    const knowledge = knowledgeData;\n    const offers = offersData;', 'portal-eliseo-ai.js');
ai = must(ai, "let hd = {}; try { hd = JSON.parse(document.getElementById('hours-data')?.textContent || '{}'); } catch { hd = {}; }", 'const hd = hoursData;', 'portal-eliseo-ai.js');
writeFileSync(join(out, 'portal-eliseo-ai.js'), ai);

writeFileSync(join(out, 'portal-eliseo-settings.js'), read('portal-eliseo-settings.js'));
writeFileSync(join(out, 'eliseo-rules.js'), read('eliseo-rules.js'));
console.log('Eliseo copiato da', mbs);
