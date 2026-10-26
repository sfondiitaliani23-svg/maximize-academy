import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import SidebarDrawer from './components/SidebarDrawer';
import HeroSection from './components/HeroSection';
import PartnerStrip from './components/PartnerStrip';
import FounderStory from './components/FounderStory';
import HomeAreas from './components/HomeAreas';
import ManifestoSection from './components/ManifestoSection';
import ContactCta from './components/ContactCta';
import EcosystemGrid from './components/EcosystemGrid';
import InternationalTraining from './components/InternationalTraining';
import BarberResetSection from './components/BarberResetSection';
import SabeySection from './components/SabeySection';
import AnaqaSection from './components/AnaqaSection';
import TreatwellSection from './components/TreatwellSection';
import BarberMatchSection from './components/BarberMatchSection';
import MensEventsSection from './components/MensEventsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import WhatsAppConcierge from './components/WhatsAppConcierge';
import CourseModal from './components/CourseModal';
import CookieBanner from './components/CookieBanner';
import AdminStorie from './components/AdminStorie';
import { SITE, home, findPage, legacyHash, normalize } from './routes';

function setMeta(page) {
  const p = page || home;
  document.title = p.title;
  const set = (sel, attr, val) => { const el = document.querySelector(sel); if (el) el.setAttribute(attr, val); };
  set('meta[name="description"]', 'content', p.description);
  set('link[rel="canonical"]', 'href', SITE + (p.path === '/' ? '/' : p.path));
  set('meta[property="og:url"]', 'content', SITE + (p.path === '/' ? '/' : p.path));
  set('meta[property="og:title"]', 'content', p.title);
  set('meta[property="og:description"]', 'content', p.description);
}

function scrollToTarget(hash) {
  if (hash) {
    const el = document.getElementById(hash.slice(1));
    if (el) { el.scrollIntoView(); return; }
  }
  window.scrollTo(0, 0);
}

export default function App() {
  const [path, setPath] = useState(() => normalize(window.location.pathname));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  // Navigazione tra le pagine senza ricaricare il sito
  useEffect(() => {
    // Vecchi link con #sezione (es. condivisi prima): portano alla pagina giusta
    const legacy = window.location.pathname === '/' && legacyHash[window.location.hash];
    if (legacy) {
      window.history.replaceState(null, '', legacy);
      setPath(normalize(legacy.split('#')[0]));
    }

    // Indirizzo aperto direttamente con #sezione (es. /sabey#trova-forbice)
    if (window.location.hash && !legacy) setTimeout(() => scrollToTarget(window.location.hash), 50);

    const go = (url, push = true) => {
      const u = new URL(url, window.location.origin);
      if (push) window.history.pushState(null, '', u.pathname + u.hash);
      setPath(normalize(u.pathname));
      setMobileMenuOpen(false);
      requestAnimationFrame(() => scrollToTarget(u.hash));
    };

    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest('a[href]');
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      const u = new URL(a.getAttribute('href'), window.location.href);
      if (u.origin !== window.location.origin) return;
      const p = normalize(u.pathname);
      if (p !== '/' && !findPage(p)) return; // privacy e altri file: caricamento normale
      if (p === normalize(window.location.pathname) && u.hash) return; // ancora nella stessa pagina
      e.preventDefault();
      go(u.href);
    };
    const onPop = () => go(window.location.href, false);

    document.addEventListener('click', onClick);
    window.addEventListener('popstate', onPop);
    return () => { document.removeEventListener('click', onClick); window.removeEventListener('popstate', onPop); };
  }, []);

  const page = findPage(path);
  useEffect(() => { if (path !== '/gestione') setMeta(page); }, [path]);

  const openCourse = (id) => setSelectedCourseId(id);

  let content;
  switch (page?.path) {
    case '/ecosistema': content = <EcosystemGrid />; break;
    case '/formazione': content = <InternationalTraining onSelectCourse={openCourse} />; break;
    case '/barber-reset': content = <BarberResetSection />; break;
    case '/sabey': content = <SabeySection />; break;
    case '/anaqa': content = <AnaqaSection />; break;
    case '/treatwell': content = <TreatwellSection />; break;
    case '/eventi': content = (<><BarberMatchSection onSelectCourse={openCourse} /><MensEventsSection /></>); break;
    case '/contatti': content = <ContactSection />; break;
    default:
      content = (
        <>
          <HeroSection />
          <PartnerStrip />
          <FounderStory />
          <HomeAreas />
          <ManifestoSection />
          <ContactCta />
        </>
      );
  }

  // Gestione delle storie: pagina a parte, fuori dal menu (solo per chi ha l'accesso).
  if (path === '/gestione') return <AdminStorie />;

  return (
    <div className="relative min-h-screen bg-[#111111] text-gray-200 selection:bg-amber-500/30 selection:text-amber-200">
      <Navbar currentPath={page?.path || '/'} onOpenMobileMenu={() => setMobileMenuOpen(true)} />
      <SidebarDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <main id="main">{content}</main>

      <Footer />
      <WhatsAppConcierge />

      {selectedCourseId && (
        <CourseModal courseId={selectedCourseId} onClose={() => setSelectedCourseId(null)} />
      )}

      <CookieBanner />
    </div>
  );
}
