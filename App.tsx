/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Target, Database, Globe, Briefcase, Menu, X, Phone, Mail, ClipboardList, Layers } from 'lucide-react';
import FluidBackground from './components/FluidBackground';
import GradientText from './components/GlitchText';
import CustomCursor from './components/CustomCursor';
import ArtistCard from './components/ArtistCard';
import AIChat from './components/AIChat';
import TacticalActivity from './components/TacticalActivity';
import { Artist } from './types';

const ProfilerLogo = ({ className = "w-10 h-10", color = "#ff007b" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M50 5 L90 27.5 V72.5 L50 95 L10 72.5 V27.5 L50 5Z" stroke="white" strokeWidth="4" strokeLinejoin="round"/>
    <line x1="10" y1="50" x2="36" y2="50" stroke="white" strokeWidth="4"/>
    <line x1="64" y1="50" x2="90" y2="50" stroke="white" strokeWidth="4"/>
    <path d="M50 35 L63 42.5 L63 57.5 L50 65 L37 57.5 L37 42.5 Z" fill={color} />
  </svg>
);

const PERSONAS: Artist[] = [
  { 
    id: '1', 
    name: 'SCOUTS', 
    genre: 'ON THE FIELD', 
    day: 'CAPTURE TALENT', 
    icon: Target,
    description: `Your scouts didn't join the club to waste hours compiling reports after every match. They joined to capture talent while it's fresh.\n\nProfiler delivers the match sheet at the final whistle - they write observations, rate players, tag skills, check data fingerprints, drop video clips, add audio notes, flag interesting players, build their best XI, and update their watchlist.\n\nEverything in one place. They lock in their insights while emotions are raw, not hours later when details fade.`
  },
  { 
    id: '2', 
    name: 'DATA ANALYSTS', 
    genre: 'INTELLIGENCE', 
    day: 'FIND EDGES', 
    icon: Database,
    description: `Your analysts are hired to find competitive edges, not to spend days reconciling data sources.\n\nBut before they can analyze anything, they need to unify Wyscout, Opta, SkillCorner, Impect, StatsBomb, etc - manually checking duplicates, matching player IDs, and standardizing formats.\n\nProfiler eliminates that entire process. All your sources are unified in one place, instantly available, with zero duplication. Your team stops fixing data and starts creating value.`
  },
  { 
    id: '3', 
    name: 'CHIEF SCOUT', 
    genre: 'COORDINATION', 
    day: 'FULL VISIBILITY', 
    icon: Globe,
    description: `Chief scouts need to see the full picture instantly: who's tracking which player, what's the status of each file, where are the gaps, who's going to Norway this weekend...\n\nInstead, they chase updates through emails, WhatsApp and meetings, losing hours to coordination overhead.\n\nProfiler gives them a single dashboard with complete visibility and smart alerts. No more asking "where are we on this?" or "who's covering that game?"—they already know.`
  },
  { 
    id: '4', 
    name: 'DECISION MAKERS', 
    genre: 'EXECUTION', 
    day: 'INSTANT CLARITY', 
    icon: Briefcase,
    description: `Sporting directors can't wait for a scouting report or a data point on a player in their shortlist when transfer windows move in days. Incomplete information means decisions get delayed or made on instinct.\n\nProfiler delivers complete intelligence instantly: all sources unified, all context available, every metric at your fingertips.\n\nYou decide faster and with full confidence while competitors are still gathering information.`
  },
];

const PLATFORM_FEATURES = [
  {
    title: "CENTRALIZATION",
    description: "Connect all your data providers with your scouts' live reports. A unified ecosystem that bridges data and field intelligence seamlessly.",
    icon: Database
  },
  {
    title: "GLOBAL INTELLIGENCE",
    description: "Real-time monitoring of every player across 100+ leagues. Identify elite targets and market opportunities before the competition reacts.",
    icon: Globe
  },
  {
    title: "WORKFLOW MANAGEMENT",
    description: "From match sheet to signature, end the chaos of WhatsApp and PDFs. A single source of truth for your entire recruitment team.",
    icon: ClipboardList
  },
  {
    title: "CUSTOM RECRUITMENT",
    description: "A private command center built around your tactical DNA. Scale your recruitment with custom metrics and proprietary scouting logic.",
    icon: Layers
  }
];

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<Artist | null>(null);

  useEffect(() => {
    document.body.style.overflow = selectedPersona ? 'hidden' : 'unset';
  }, [selectedPersona]);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen text-white selection:bg-[#ff007b] selection:text-white cursor-auto md:cursor-none overflow-x-hidden">
      <CustomCursor />
      <FluidBackground />
      
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-8 py-6 bg-gradient-to-b from-black/80 to-transparent">
        <div className="text-xl md:text-2xl font-black tracking-tighter text-white cursor-default z-50 flex items-center gap-3">
           <ProfilerLogo className="w-8 h-8 md:w-10 md:h-10" />
           <span className="mt-1">PROFILER</span>
        </div>
        <div className="hidden md:flex gap-10 text-sm font-bold tracking-widest uppercase">
          {['Roles', 'Platform', 'Contact'].map((item) => (
            <button key={item} onClick={() => scrollToSection(item.toLowerCase())} className="hover:text-[#ff007b] transition-colors text-white font-bold">{item}</button>
          ))}
        </div>
        <button onClick={() => scrollToSection('contact')} className="hidden md:inline-block border border-white px-8 py-3 text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-[#05051a] transition-all duration-300">Book Demo</button>
        <button className="md:hidden text-white z-50 relative" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
           {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      <header className="relative h-[85vh] min-h-[600px] flex flex-col items-center justify-center overflow-hidden px-4 pt-16">
        <motion.div style={{ y, opacity }} className="z-10 text-center flex flex-col items-center w-full max-w-7xl pb-0">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2 }} className="mb-4">
            <ProfilerLogo className="w-24 h-24 md:w-40 md:h-40 drop-shadow-[0_0_30px_rgba(255,0,123,0.3)]" />
          </motion.div>
          <div className="relative w-full text-center">
            <h1 className="text-[15vw] md:text-[11vw] leading-[0.8] font-black tracking-tighter-custom uppercase mb-4">
              <GradientText text="PROFILER" />
            </h1>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-lg md:text-2xl font-black tracking-tight text-white/80 uppercase">
              The Command Center for <span className="text-[#ff007b]">Modern Recruitment.</span>
            </motion.p>
          </div>
        </motion.div>

        <div className="absolute bottom-0 left-0 w-full py-4 bg-white text-black z-20 overflow-hidden border-y-4 border-[#ff007b]">
          <motion.div className="flex w-fit" animate={{ x: "-50%" }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}>
            {[0, 1].map((key) => (
              <div key={key} className="flex whitespace-nowrap shrink-0">
                {[...Array(6)].map((_, i) => (
                  <span key={i} className="text-2xl md:text-5xl font-black px-8 flex items-center gap-4 uppercase tracking-tight">
                    YOUR NEXT SIGNING STARTS HERE <span className="text-[#ff007b] text-xl md:text-3xl">●</span> 
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </header>

      {/* Activité tactique centrale */}
      <TacticalActivity />

      {/* ONE PLATFORM SECTION */}
      <section id="platform" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start gap-6 mb-16">
            <div className="mt-2">
              <ProfilerLogo className="w-12 h-12" />
            </div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">
              ONE <br />
              <span className="text-white/40">PLAT</span><span className="text-white">FORM</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PLATFORM_FEATURES.map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#05051a]/60 border border-white/10 rounded-3xl p-8 md:p-12 hover:border-[#ff007b]/50 transition-colors group"
              >
                <div className="w-16 h-16 bg-black/40 border border-[#ff007b]/30 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#ff007b]/10 transition-colors">
                  <feature.icon className="w-8 h-8 text-[#ff007b]" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black uppercase mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-gray-400 text-lg leading-relaxed max-w-md">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="roles" className="relative z-10 py-20 md:py-32 border-t border-white/5">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6">
          <div className="mb-16">
            <h2 className="text-5xl md:text-7xl font-black uppercase leading-[0.9] tracking-tighter-custom mb-6">
              One system.<br/>Every role <span className="text-[#ff007b]">empowered.</span>
            </h2>
            <p className="text-gray-400 font-mono text-sm uppercase italic">Zero friction. Total clarity. Competitive edge.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-white/10 bg-black/40">
            {PERSONAS.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} onClick={() => setSelectedPersona(artist)} />
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="relative z-10 py-32 px-6 bg-[#020210]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter-custom uppercase">
            Ready to <span className="text-[#ff007b]">optimize?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-16 max-w-2xl mx-auto">
            Join the elite clubs and federations using Profiler to centralize their recruitment intelligence.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 border border-white/10 bg-white/5 rounded-lg flex flex-col items-center gap-4">
              <Phone className="w-10 h-10 text-[#ff007b]" />
              <p className="text-xl font-mono">+33 661 633 038</p>
            </div>
            <div className="p-8 border border-white/10 bg-white/5 rounded-lg flex flex-col items-center gap-4">
              <Mail className="w-10 h-10 text-[#ff007b]" />
              <a href="mailto:nicolas@profilerfootball.com" className="text-xl font-mono hover:text-[#ff007b] transition-colors">nicolas@profilerfootball.com</a>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 py-16 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
             <div className="text-3xl font-black tracking-tighter mb-4 text-white flex items-center gap-3">
              <ProfilerLogo className="w-10 h-10" />
              <span>PROFILER</span>
             </div>
             <p className="text-xs font-mono text-gray-500 uppercase">© 2025 PROFILER FOOTBALL. UNIFIED SCOUTING INTELLIGENCE.</p>
          </div>
          <div className="flex gap-8">
            <a href="https://www.linkedin.com/company/profilerfootball/" target="_blank" className="text-gray-400 hover:text-white font-black uppercase text-xs tracking-[0.2em]">LinkedIn</a>
            <a href="https://www.instagram.com/profiler_football/?hl=fr" target="_blank" className="text-gray-400 hover:text-white font-black uppercase text-xs tracking-[0.2em]">Instagram</a>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {selectedPersona && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setSelectedPersona(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-5xl bg-[#0a0a2a] border border-white/10 flex flex-col md:flex-row shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
              <button onClick={() => setSelectedPersona(null)} className="absolute top-4 right-4 z-30 text-white hover:text-[#ff007b]"><X className="w-8 h-8" /></button>
              <div className="w-full md:w-5/12 h-48 md:h-auto bg-[#05051a] flex items-center justify-center p-12">
                {React.createElement(selectedPersona.icon, { className: "w-32 h-32 text-white stroke-1" })}
              </div>
              <div className="w-full md:w-7/12 p-10 md:p-16">
                <div className="text-[#ff007b] font-mono text-xs tracking-widest uppercase font-bold mb-4">{selectedPersona.day}</div>
                <h3 className="text-4xl md:text-5xl font-black uppercase mb-6 tracking-tighter-custom">{selectedPersona.name}</h3>
                <div className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">{selectedPersona.description}</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AIChat />
    </div>
  );
};

export default App;