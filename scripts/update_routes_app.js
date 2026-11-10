import fs from 'node:fs';

// 1. Update src/routes.js
let routes = fs.readFileSync('src/routes.js', 'utf8').replace(/\r\n/g, '\n');
const targetRoute = `  {
    path: '/contatti',
    label: 'Contatti',
    title: 'Contatti | Maximize Academy',
    description: 'Consulenza e corsi con Maurizio Pizzuto. Forbici Sabey, prodotti ANAQA e Treatwell con Keplero.',
    intro: 'Maurizio per formazione e consulenza. Keplero per Sabey, ANAQA e Treatwell.',
  },`;

const newRoute = `  {
    path: '/contatti',
    label: 'Contatti',
    title: 'Contatti | Maximize Academy',
    description: 'Consulenza e corsi con Maurizio Pizzuto. Forbici Sabey, prodotti ANAQA e Treatwell con Keplero.',
    intro: 'Maurizio per formazione e consulenza. Keplero per Sabey, ANAQA e Treatwell.',
  },
  {
    path: '/pro',
    label: 'Professionisti',
    menu: false,
    title: 'Maurizio Pizzuto | Formazione, Prodotti & Business B2B · Maximize Academy',
    description: 'La piattaforma B2B di Maurizio Pizzuto per barbieri e titolari: percorsi formativi, Barber Reset, Sabey Scissors, rituale ANAQA e assistenza commerciale Keplero.',
    intro: 'Dedicato ai professionisti del settore barber.',
  },`;

if (routes.includes(targetRoute)) {
  routes = routes.replace(targetRoute, newRoute);
  fs.writeFileSync('src/routes.js', routes, 'utf8');
  console.log('src/routes.js updated!');
} else {
  console.log('targetRoute not found in src/routes.js');
}

// 2. Update src/App.jsx
let app = fs.readFileSync('src/App.jsx', 'utf8').replace(/\r\n/g, '\n');
const importTarget = `import ContactSection from './components/ContactSection';`;
const newImport = `import ContactSection from './components/ContactSection';
import ProB2BSection from './components/ProB2BSection';`;

const switchTarget = `    case '/contatti': content = <ContactSection />; break;`;
const newSwitch = `    case '/contatti': content = <ContactSection />; break;
    case '/pro': content = <ProB2BSection />; break;`;

if (app.includes(importTarget)) {
  app = app.replace(importTarget, newImport);
}
if (app.includes(switchTarget)) {
  app = app.replace(switchTarget, newSwitch);
  fs.writeFileSync('src/App.jsx', app, 'utf8');
  console.log('src/App.jsx updated!');
} else {
  console.log('switchTarget not found in src/App.jsx');
}
