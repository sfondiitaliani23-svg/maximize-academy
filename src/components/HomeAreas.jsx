import React from 'react';
import { pages } from '../routes';

// Home: le macroaree come schede che portano alla loro pagina (come «Tutto quello che ti serve» su Maurizio Barber Shop).
export default function HomeAreas() {
  const areas = pages;
  return (
    <section className="bg-[#111111] px-[clamp(1.25rem,6vw,4.5rem)] py-[clamp(4rem,3rem+4vw,7rem)]" aria-labelledby="aree-title">
      <div className="max-w-[1240px] mx-auto">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-amber-400">Le aree di Maximize</p>
        <h2 id="aree-title" className="mt-3 text-[clamp(2.1rem,1.4rem+3vw,3.6rem)] leading-[1.1] font-bold text-[#f4f4f4]">
          Tutto quello che serve <em className="not-italic font-normal text-amber-400">per crescere.</em>
        </h2>
        <ul className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#3d3d3d] border border-[#3d3d3d] list-none p-0 m-0">
          {areas.map((a, i) => (
            <li key={a.path} className="bg-[#111111]">
              <a href={a.path} className="group flex flex-col h-full p-6 sm:p-8 hover:bg-[#181818] transition-colors">
                <span className="text-xs font-bold tracking-[0.16em] text-amber-400">{String(i + 1).padStart(2, '0')}</span>
                <span className="mt-4 text-2xl font-bold text-[#f4f4f4] group-hover:text-amber-400 transition-colors">{a.label}</span>
                <span className="mt-2 text-[#bdbdbd] leading-relaxed">{a.intro}</span>
                <span className="mt-auto pt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-amber-400">
                  Apri
                  <svg className="transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" /></svg>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
