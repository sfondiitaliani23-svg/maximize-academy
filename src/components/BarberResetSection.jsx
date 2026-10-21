import React, { useState } from 'react';
import { Sparkles, Calculator, ArrowRight, ShieldCheck, CheckCircle2, TrendingUp, DollarSign } from 'lucide-react';

export default function BarberResetSection() {
  const [chairs, setChairs] = useState(2);
  const [weeklyClients, setWeeklyClients] = useState(120);
  const [avgTicket, setAvgTicket] = useState(22);
  const [monthlyProducts, setMonthlyProducts] = useState(15);
  const [calculating, setCalculating] = useState(false);
  const [auditResult, setAuditResult] = useState(null);

  const handleCalculateAudit = async (e) => {
    e.preventDefault();
    setCalculating(true);

    try {
      const response = await fetch('/api/barber-reset/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chairs: parseInt(chairs),
          weeklyClients: parseInt(weeklyClients),
          avgTicket: parseFloat(avgTicket),
          monthlyProductsSold: parseInt(monthlyProducts)
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAuditResult(data);
      } else {
        throw new Error('API offline');
      }
    } catch (err) {
      // Calcolo locale immediato se il server è in fase di avvio
      const curMonth = (weeklyClients * 4.33 * avgTicket) + (monthlyProducts * 25);
      const projTicket = avgTicket * 1.28;
      const projProducts = weeklyClients * 4.33 * 0.18;
      const projMonth = (weeklyClients * 4.33 * projTicket) + (projProducts * 26);
      const diff = projMonth - curMonth;
      setAuditResult({
        currentMonthlyRevenue: curMonth,
        projectedMonthlyRevenue: projMonth,
        monthlyUplift: diff,
        annualUplift: diff * 12,
        resetNeedScore: 80,
        summary: `Con l'intervento strategico Barber Reset, la tua barberia ha un margine di incremento stimato in circa € ${(diff * 12).toLocaleString('it-IT', { maximumFractionDigits: 0 })} all'anno.`
      });
    } finally {
      setCalculating(false);
    }
  };

  return (
    <section id="barber-reset" className="py-24 relative overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute inset-0 bg-[#08080b]">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-red-950/10 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Brand Bar */}
        <div className="flex flex-col items-center justify-center text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel-gold border border-amber-500/40">
            <span className="font-display font-extrabold text-xs text-amber-300 tracking-[0.25em]">
              02 / IL PERCORSO DI MAURIZIO PIZZUTO
            </span>
          </div>

          <div className="text-xs uppercase tracking-[0.3em] text-gray-400 font-semibold">
            PROPOSTA DI IDENTITÀ · VERSIONE 2 · BY MAXIMIZE ACADEMY
          </div>

          <h2 className="text-4xl sm:text-6xl font-display font-black text-white tracking-tight">
            BARBER <span className="text-red-500">RESET</span>
          </h2>
          <div className="text-sm uppercase tracking-[0.25em] text-amber-400 font-bold">
            INTERVENTO STRATEGICO IN BARBERIA
          </div>
        </div>

        {/* Presentation Grid: Artwork + Philosophy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          {/* Official Artwork 3D */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden glass-panel-gold border border-amber-500/30 p-2 shadow-2xl group">
              <div className="w-full h-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                <img 
                  src="/assets/img/barber_reset.jpg" 
                  alt="Barber Reset - Intervento Strategico in Barberia" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>

          {/* Manifesto & Concepts */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-2xl sm:text-4xl font-display font-bold text-white leading-tight">
              La tua barberia{' '}
              <span className="font-serif italic font-normal gold-text-gradient">
                può fare di più.
              </span>
            </h3>

            <p className="text-base text-gray-300 leading-relaxed">
              Barber Reset è il percorso intensivo che ho creato per trasformare la barberia da semplice bottega a impresa solida e profittevole: dalla relazione con il cliente alla gestione manageriale delle poltrone.
            </p>

            {/* Impact Quote Box */}
            <div className="p-6 rounded-2xl glass-panel border-l-4 border-l-amber-500 border-white/10 space-y-2">
              <p className="text-sm sm:text-base font-serif italic text-gray-200">
                “Puoi cambiare forbici. Puoi cambiare prodotti. Puoi cambiare arredamento.
                La vera crescita comincia quando cambi il modo in cui gestisci la tua barberia.”
              </p>
              <div className="text-xs uppercase font-bold tracking-wider text-amber-400 text-right">
                — Maurizio Pizzuto
              </div>
            </div>

            {/* Pillar Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Scontrino Medio & Cross-Selling</h4>
                  <p className="text-xs text-gray-400">Protocolli di consulenza per aumentare il valore di ogni cliente servito.</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Fidelizzazione & Team</h4>
                  <p className="text-xs text-gray-400">Organizzazione del personale e creazione di una clientela alto-spendante e costante.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/393917163833?text=Salve%20Maurizio,%20vorrei%20candidarmi%20per%20il%20percorso%20Barber%20Reset"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full btn-gold text-xs uppercase font-bold tracking-wider shadow-gold-glow"
              >
                <span>Parlami di Barber Reset</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>

        </div>

        {/* AUDIT & BUSINESS SIMULATOR (Connesso al Backend Java / Node) */}
        <div className="glass-panel-gold rounded-3xl p-8 sm:p-12 border border-amber-500/40 relative shadow-2xl">
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-400 mb-2">
              <Calculator className="w-4 h-4" />
              <span>SIMULATORE DIAGNOSTICO BUSINESS BARBERIA</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
              Calcola il Potenziale Inespresso della Tua Barberia
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 mt-2">
              Inserisci i parametri della tua attività: il nostro algoritmo calcolerà la dispersione attuale di fatturato e l'incremento generabile con l'adozione del metodo Barber Reset.
            </p>
          </div>

          <form onSubmit={handleCalculateAudit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Input 1 */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Numero Poltrone Attive
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  min="1" 
                  max="20"
                  value={chairs}
                  onChange={(e) => setChairs(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white font-semibold focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Input 2 */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Clienti Totali / Settimana
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  min="10" 
                  max="1000"
                  value={weeklyClients}
                  onChange={(e) => setWeeklyClients(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white font-semibold focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Input 3 */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Scontrino Medio Attuale (€)
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  min="5" 
                  max="200"
                  value={avgTicket}
                  onChange={(e) => setAvgTicket(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white font-semibold focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Input 4 */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Prodotti Venduti / Mese
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  min="0" 
                  max="500"
                  value={monthlyProducts}
                  onChange={(e) => setMonthlyProducts(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white font-semibold focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="sm:col-span-2 lg:col-span-4 pt-2">
              <button
                type="submit"
                disabled={calculating}
                className="w-full py-4 rounded-xl btn-gold text-xs uppercase font-extrabold tracking-widest flex items-center justify-center gap-2 shadow-gold-glow"
              >
                <Sparkles className="w-4 h-4" />
                <span>{calculating ? 'Elaborazione Algoritmo...' : 'Esegui Audit Strategico Immediato'}</span>
              </button>
            </div>

          </form>

          {/* Audit Results Glass Container */}
          {auditResult && (
            <div className="mt-8 pt-8 border-t border-amber-500/30 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
              
              <div className="p-5 rounded-2xl bg-black/60 border border-white/10">
                <div className="text-xs uppercase text-gray-400 font-semibold mb-1">Fatturato Attuale Stimato</div>
                <div className="text-2xl font-display font-bold text-white">
                  € {auditResult.currentMonthlyRevenue?.toLocaleString('it-IT', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  <span className="text-xs font-normal text-gray-400"> /mese</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-black/60 border border-amber-500/30">
                <div className="text-xs uppercase text-amber-400 font-semibold mb-1">Potenziale con Barber Reset</div>
                <div className="text-2xl font-display font-bold gold-text-gradient">
                  € {auditResult.projectedMonthlyRevenue?.toLocaleString('it-IT', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  <span className="text-xs font-normal text-amber-300"> /mese</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/20 to-black border border-amber-400 shadow-gold-glow">
                <div className="text-xs uppercase text-amber-300 font-bold mb-1">Incremento Annuo Stimato</div>
                <div className="text-2xl font-display font-extrabold text-white">
                  + € {auditResult.annualUplift?.toLocaleString('it-IT', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </div>
                <div className="text-[11px] text-amber-200 mt-1">Margine aggiuntivo lordo</div>
              </div>

              <div className="md:col-span-3 p-4 rounded-xl glass-panel border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs sm:text-sm text-gray-300 text-center sm:text-left">
                  {auditResult.summary}
                </p>
                <a
                  href={`https://wa.me/393917163833?text=${encodeURIComponent(`Salve Maurizio, ho eseguito l'Audit Barber Reset sul sito per la mia barberia (${chairs} poltrone, ${weeklyClients} clienti a settimana). Vorrei fissare una consulenza per valutare l'intervento.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 rounded-full btn-gold text-xs uppercase font-bold tracking-wider whitespace-nowrap"
                >
                  Blocca Audit con Maurizio
                </a>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
}
