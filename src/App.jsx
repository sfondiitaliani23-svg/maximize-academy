import React, { useState } from 'react';
import Navbar from './components/Navbar';
import SidebarDrawer from './components/SidebarDrawer';
import HeroSection from './components/HeroSection';
import FounderStory from './components/FounderStory';
import EcosystemGrid from './components/EcosystemGrid';
import InternationalTraining from './components/InternationalTraining';
import BarberResetSection from './components/BarberResetSection';
import SabeySection from './components/SabeySection';
import AnaqaSection from './components/AnaqaSection';
import TreatwellSection from './components/TreatwellSection';
import BarberMatchSection from './components/BarberMatchSection';
import MensEventsSection from './components/MensEventsSection';
import ManifestoSection from './components/ManifestoSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import WhatsAppConcierge from './components/WhatsAppConcierge';
import CourseModal from './components/CourseModal';
import CookieBanner from './components/CookieBanner';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  return (
    <div className="relative min-h-screen bg-[#070709] text-gray-200 selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Glass Top Navbar */}
      <Navbar 
        onOpenMobileMenu={() => setMobileMenuOpen(true)} 
      />

      {/* Offcanvas Glass Mobile Menu */}
      <SidebarDrawer 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />

      {/* Main Sections */}
      <main>
        {/* 1. Hero Luxury Presentation */}
        <HeroSection />

        {/* 2. Dalla Barberia alla Formazione (Storytelling Maurizio) */}
        <FounderStory />

        {/* 3. L'Ecosistema Maximize (I 6 Passi Ottimizzati) */}
        <EcosystemGrid />

        {/* 4. Formazione Internazionale (Cardinale, Yass, Men's Events, Sabey) */}
        <InternationalTraining 
          onSelectCourse={(id) => setSelectedCourseId(id)} 
        />

        {/* 5. Barber Reset (Intervento Strategico & Audit Calculator) */}
        <BarberResetSection />

        {/* 6. Sabey Scissors (Brand Ambassador Strategist Badge & Selector) */}
        <SabeySection />

        {/* 7. ANAQA Men Creation (Prodotti Professionali) */}
        <AnaqaSection />

        {/* 8. Treatwell (Digitalizzazione Agenda Barberia) */}
        <TreatwellSection />

        {/* 9. Manifesto Maximize Academy */}
        <ManifestoSection />

        {/* 10. Barber Match Paestum 2026 */}
        <BarberMatchSection 
          onSelectCourse={(id) => setSelectedCourseId(id)} 
        />

        {/* 11. Men's Events Education (Network) */}
        <MensEventsSection />

        {/* 12. Canali Contatto Differenziati & Form */}
        <ContactSection />
      </main>

      {/* Footer Societario */}
      <Footer />

      {/* Floating Luxury WhatsApp Concierge */}
      <WhatsAppConcierge />

      {/* Interactive Course Details Modal */}
      {selectedCourseId && (
        <CourseModal 
          courseId={selectedCourseId} 
          onClose={() => setSelectedCourseId(null)} 
        />
      )}

      {/* GDPR Privacy & Cookie Banner */}
      <CookieBanner />

    </div>
  );
}
