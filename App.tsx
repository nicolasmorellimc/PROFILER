/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Ticket, Globe, Zap, Database, MapPin, Menu, X, Users, Play, ChevronLeft, ChevronRight, Activity, Layers, Target, Phone, Mail, ClipboardList, Briefcase, ScanEye, Network } from 'lucide-react';
import FluidBackground from './components/FluidBackground';
import GradientText from './components/GlitchText';
import CustomCursor from './components/CustomCursor';
import ArtistCard from './components/ArtistCard';
import { Artist } from './types';

// Updated Logo Component with Magenta Hexagon
const ProfilerLogo = ({ className = "w-10 h-10", color = "#ff007b" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Outer boundary */}
    <path d="M50 5 L90 27.5 V72.5 L50 95 L10 72.5 V27.5 L50 5Z" stroke="white" strokeWidth="4" strokeLinejoin="round"/>
    {/* Horizontal lines */}
    <line x1="10" y1="50" x2="38" y2="50" stroke="white" strokeWidth="4"/>
    <line x1="62" y1="50" x2="90" y2="50" stroke="white" strokeWidth="4"/>
    {/* Central Hexagon replaces the circle */}
    <path d="M50 38 L60.4 44 L60.4 56 L50 62 L39.6 56 L39.6 44 Z" fill={color} />
  </svg>
);

const PERSONAS: Artist[] = [
  { 
    id: '1', 
    name: 'Scouts', 
    genre: 'Capture Talent', 
    day: 'ON THE FIELD', 
    icon: Target,
    description: `Your scouts didn't join the club to waste hours compiling reports after every match. They joined to capture talent while it's fresh.

Profiler delivers the match sheet at the final whistle - they write observations, rate players, tag skills, check data fingerprints, drop video clips, add audio notes, flag interesting players, build their best XI, and update their watchlist.

Everything in one place. They lock in their insights while emotions are raw, not hours later when details fade.`
  },
  { 
    id: '2', 
    name: 'Data Analysts', 
    genre: 'Find Edges', 
    day: 'INTELLIGENCE', 
    icon: Database,
    description: `Your analysts are hired to find competitive edges, not to spend days reconciling data sources.
    
But before they can analyze anything, they need to unify Wyscout, Opta, SkillCorner, Impect, StatsBomb, etc - manually checking duplicates, matching player IDs, and standardizing formats.

Profiler eliminates that entire process. All your sources are unified in one place, instantly available, with zero duplication. Your team stops fixing data and starts creating value.`
  },
  { 
    id: '3', 
    name: 'Chief Scout', 
    genre: 'Full Visibility', 
    day: 'COORDINATION', 
    icon: Globe,
    description: `Chief scouts need to see the full picture instantly: who's tracking which player, what's the status of each file, where are the gaps, who's going to Norway this weekend...

Instead, they chase updates through emails, WhatsApp and meetings, losing hours to coordination overhead.

Profiler gives them a single dashboard with complete visibility and smart alerts. No more asking "where are we on this?" or "who's covering that game?"—they already know.`
  },
  { 
    id: '4', 
    name: 'Decision Makers', 
    genre: 'Instant Clarity', 
    day: 'EXECUTION', 
    icon: Briefcase,
    description: `Sporting directors can't wait for a scouting report or a data point on a player in their shortlist when transfer windows move in days. Incomplete information means decisions get delayed or made on instinct.

Profiler delivers complete intelligence instantly: all sources unified, all context available, every metric at your fingertips.

You decide faster and with full confidence while competitors are still gathering information.`
  },
];

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<Artist | null>(null);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPersona) return;
      if (e.key === 'ArrowLeft') navigatePersona('prev');
      if (e.key === 'ArrowRight') navigatePersona('next');
      if (e.key === 'Escape') setSelectedPersona(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPersona]);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navigatePersona = (direction: 'next' | 'prev') => {
    if (!selectedPersona) return;
    const currentIndex = PERSONAS.findIndex(a => a.id === selectedPersona.id);
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % PERSONAS.length;
    } else {
      nextIndex = (currentIndex - 1 + PERSONAS.length) % PERSONAS.length;
    }
    setSelectedPersona(PERSONAS[nextIndex]);
  };
  
  return (
    <div className="relative min-h-screen text-white selection:bg-[#ff007b] selection:text-white cursor-auto md:cursor-none overflow-x-hidden font-sans">
      <CustomCursor />
      <FluidBackground />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-8 py-6 mix-blend-normal bg-gradient-to-b from-black/80 to-transparent">
        <div className="text-xl md:text-2xl font-black tracking-tighter text-white cursor-default z-50 flex items-center gap-3">
           <ProfilerLogo className="w-8 h-8 md:w-10 md:h-10" />
           <span className="mt-1">PROFILER</span>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-10 text-sm font-bold tracking-widest uppercase">
          {['Roles', 'Platform', 'Contact'].map((item) => (
            <button 
              key={item} 
              onClick={() => scrollToSection(item.toLowerCase())}
              className="hover:text-[#ff007b] transition-colors text-white cursor-pointer bg-transparent border-none font-bold"
              data-hover="true"
            >
              {item}
            </button>
          ))}
        </div>
        <button 
          onClick={() => scrollToSection('contact')}
          className="hidden md:inline-block border border-white px-8 py-3 text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-[#05051a] transition-all duration-300 text-white cursor-pointer bg-transparent"
          data-hover="true"
        >
          Book Demo
        </button>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white z-50 relative w-10 h-10 flex items-center justify-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
           {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-[#05051a]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {['Roles', 'Platform', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-4xl font-black text-white hover:text-[#ff007b] transition-colors uppercase bg-transparent border-none"
              >
                {item}
              </button>
            ))}
            <button 
              onClick={() => scrollToSection('contact')}
              className="mt-8 border border-white px-10 py-4 text-sm font-bold tracking-widest uppercase bg-white text-[#05051a]"
            >
              Book Demo
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <header className="relative h-[100svh] min-h-[700px] flex flex-col items-center justify-center overflow-hidden px-4">
        <motion.div 
          style={{ y, opacity }}
          className="z-10 text-center flex flex-col items-center w-full max-w-7xl pb-24 md:pb-20"
        >
          {/* Logo Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="mb-12"
          >
            <ProfilerLogo className="w-32 h-32 md:w-48 md:h-48 drop-shadow-[0_0_30px_rgba(255,0,123,0.3)]" />
          </motion.div>

          {/* Main Title - Deck Styling */}
          <div className="relative w-full flex flex-col justify-center items-center">
            <GradientText 
              text="PROFILER" 
              as="h1" 
              className="text-[16vw] md:text-[13vw] leading-[0.75] font-black tracking-tighter-custom text-center text-white uppercase" 
            />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-6 text-2xl md:text-4xl font-black tracking-tight-custom text-white uppercase"
            >
              From data to decision.
            </motion.p>
            
            <motion.div 
               className="absolute -z-20 w-[60vw] h-[60vw] bg-[#ff007b]/10 blur-[80px] rounded-full pointer-events-none will-change-transform"
               animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.5, 0.3] }}
               transition={{ duration: 8, repeat: Infinity }}
               style={{ transform: 'translateZ(0)' }}
            />
          </div>
          
          <motion.div
             initial={{ scaleX: 0 }}
             animate={{ scaleX: 1 }}
             transition={{ duration: 1.5, delay: 0.8, ease: "circOut" }}
             className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-[#ff007b]/50 to-transparent mt-8 mb-8"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="text-lg md:text-xl font-medium max-w-3xl mx-auto text-gray-300 leading-relaxed drop-shadow-lg px-4"
          >
            A decision-support platform for professional football organizations.
          </motion.p>
        </motion.div>

        {/* MARQUEE */}
        <div className="absolute bottom-12 md:bottom-16 left-0 w-full py-4 md:py-6 bg-white text-black z-20 overflow-hidden border-y-4 border-[#ff007b] shadow-[0_0_40px_rgba(255,0,123,0.2)]">
          <motion.div 
            className="flex w-fit will-change-transform"
            animate={{ x: "-50%" }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            {[0, 1].map((key) => (
              <div key={key} className="flex whitespace-nowrap shrink-0">
                {[...Array(6)].map((_, i) => (
                  <span key={i} className="text-3xl md:text-6xl font-black px-8 flex items-center gap-4 uppercase tracking-tight">
                    YOUR NEXT SIGNING STARTS HERE <span className="text-[#ff007b] text-2xl md:text-4xl">●</span> 
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </header>

      {/* PERSONAS SECTION */}
      <section id="roles" className="relative z-10 py-20 md:py-32">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 px-4">
             <h2 className="text-5xl md:text-7xl font-black uppercase leading-[0.9] tracking-tighter-custom drop-shadow-lg break-words w-full md:w-auto">
              Every Role <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Empowered</span>
            </h2>
            <p className="text-gray-400 max-w-md text-right mt-4 md:mt-0 font-mono text-xs md:text-sm uppercase tracking-tight">
              Click a role to see how Profiler transforms the workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-white/10 bg-black/40 backdrop-blur-sm">
            {PERSONAS.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} onClick={() => setSelectedPersona(artist)} />
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM SECTION */}
      <section id="platform" className="relative z-10 py-20 md:py-32 bg-black/20 backdrop-blur-sm border-t border-white/10 overflow-hidden">
        <div className="absolute top-1/2 right-[-20%] w-[50vw] h-[50vw] bg-[#ff007b]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
          <div className="flex flex-col items-center">
            <div className="max-w-4xl w-full text-center">
              <h2 className="text-4xl md:text-6xl font-black mb-6 md:mb-8 leading-tight uppercase tracking-tighter-custom">
                One <br/> <GradientText text="PLATFORM" className="text-5xl md:text-7xl uppercase" />
              </h2>
              <p className="text-lg md:text-xl text-gray-200 mb-12 md:mb-16 font-light leading-relaxed drop-shadow-md max-w-2xl mx-auto">
                Clubs drown in data but starve for insights. Profiler acts as the intelligence layer for the providers you already subscribe to. We unify your existing data sources into one seamless workflow.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                {[
                  { icon: Database, title: 'Centralization', desc: 'Connect your existing accounts—Wyscout, Opta, SkillCorner, Statsbomb—unified in one powerful platform.' },
                  { icon: Globe, title: 'Global Intelligence', desc: 'Track every eligible player worldwide.' },
                  { icon: ClipboardList, title: 'Workflow Management', desc: 'Centralize the entire workflow of your scouting team from observation to signing.' },
                  { icon: Layers, title: 'Custom Recruitment', desc: 'Tailor every tool to match your club\'s DNA and tactical requirements.' },
                ].map((feature, i) => (
                  <div
                    key={i} 
                    className="flex items-start gap-6 p-6 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#ff007b]/30 transition-colors"
                  >
                    <div className="p-4 rounded-2xl bg-[#05051a] border border-white/10 shrink-0">
                      <feature.icon className="w-6 h-6 text-[#ff007b]" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black mb-2 uppercase tracking-tight">{feature.title}</h4>
                      <p className="text-sm text-gray-300 leading-relaxed font-medium">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="relative z-10 py-20 md:py-32 px-4 md:px-6 bg-black/40 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12 md:mb-16">
             <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tighter-custom">
               Profiler doesn’t sell you another platform - we deliver <span className="text-[#ff007b]">real results</span>.
             </h2>
             <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto font-medium">
               Profiler doesn't cost—it multiplies your team's impact. Stop adding complexity. Start creating value.
             </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <motion.div
              whileHover={{ y: -5, borderColor: '#ff007b' }}
              className="p-8 border border-white/10 bg-white/5 backdrop-blur-md rounded-lg flex flex-col items-center justify-center gap-4 transition-colors"
            >
              <Phone className="w-10 h-10 text-[#ff007b]" />
              <h3 className="text-xl font-black uppercase tracking-tight">Call Us</h3>
              <p className="text-xl font-mono">+33 661 633 038</p>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5, borderColor: '#ff007b' }}
              className="p-8 border border-white/10 bg-white/5 backdrop-blur-md rounded-lg flex flex-col items-center justify-center gap-4 transition-colors"
            >
              <Mail className="w-10 h-10 text-[#ff007b]" />
              <h3 className="text-xl font-black uppercase tracking-tight">Email Us</h3>
              <a href="mailto:nicolas@profilerfootball.com" className="text-xl font-mono hover:text-[#ff007b] transition-colors">
                nicolas@profilerfootball.com
              </a>
            </motion.div>
          </div>

          <motion.a 
            href="mailto:nicolas@profilerfootball.com"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block mt-16 px-12 py-5 bg-[#ff007b] text-white font-black text-lg tracking-widest uppercase rounded hover:bg-[#d50066] transition-colors shadow-[0_0_20px_rgba(255,0,123,0.4)]"
          >
            Schedule Demo
          </motion.a>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 py-12 md:py-16 bg-[#020210]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
             <div className="text-3xl md:text-4xl font-black tracking-tighter mb-4 text-white flex items-center gap-3">
              <ProfilerLogo className="w-10 h-10" />
              <span className="mt-1">PROFILER</span>
             </div>
             <div className="flex gap-2 text-xs font-mono text-gray-500">
               <span>© 2025 Profiler Football. All rights reserved.</span>
             </div>
          </div>
          
          <div className="flex gap-6 md:gap-8 flex-wrap">
            <a href="https://www.linkedin.com/company/profilerfootball/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white font-black uppercase text-xs tracking-[0.2em] transition-colors">LinkedIn</a>
            <a href="https://www.instagram.com/profilerfootball" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white font-black uppercase text-xs tracking-[0.2em] transition-colors">Instagram</a>
          </div>
        </div>
      </footer>

      {/* Persona Detail Modal */}
      <AnimatePresence>
        {selectedPersona && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPersona(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-6xl bg-[#0a0a2a] border border-white/10 overflow-hidden flex flex-col md:flex-row shadow-2xl shadow-[#ff007b]/10 group/modal max-h-[90vh]"
            >
              <button
                onClick={() => setSelectedPersona(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors"
                data-hover="true"
              >
                <X className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); navigatePersona('prev'); }}
                className="absolute left-4 bottom-4 translate-y-0 md:top-1/2 md:bottom-auto md:-translate-y-1/2 z-20 p-3 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors border border-white/10 backdrop-blur-sm"
                data-hover="true"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); navigatePersona('next'); }}
                className="absolute right-4 bottom-4 translate-y-0 md:top-1/2 md:bottom-auto md:-translate-y-1/2 z-20 p-3 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors border border-white/10 backdrop-blur-sm md:right-8"
                data-hover="true"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div className="w-full md:w-5/12 h-64 md:h-auto relative overflow-hidden bg-[#05051a] flex items-center justify-center">
                <div className="absolute inset-0 opacity-20" 
                    style={{ 
                      backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                      backgroundSize: '40px 40px'
                    }} 
                />
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedPersona.id}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                    className="relative z-10"
                  >
                     <div className="absolute inset-0 bg-[#ff007b] blur-[80px] opacity-20 rounded-full" />
                     {(() => {
                        const IconComponent = selectedPersona.icon;
                        return <IconComponent className="w-32 h-32 md:w-48 md:h-48 text-white relative z-10" strokeWidth={1} />;
                     })()}
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a2a] via-transparent to-transparent md:bg-gradient-to-r" />
              </div>

              <div className="w-full md:w-7/12 p-8 pb-24 md:p-16 flex flex-col justify-center relative overflow-y-auto">
                <motion.div
                  key={selectedPersona.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <div className="flex items-center gap-3 text-[#ff007b] mb-6">
                     <Target className="w-5 h-5" />
                     <span className="font-mono text-sm tracking-widest uppercase font-bold">{selectedPersona.day}</span>
                  </div>
                  
                  <h3 className="text-4xl md:text-5xl font-black uppercase leading-none mb-4 text-white tracking-tighter-custom">
                    {selectedPersona.name}
                  </h3>
                  
                  <p className="text-xl text-gray-400 font-black tracking-wider uppercase mb-8 flex items-center gap-2">
                    <Activity className="w-5 h-5" /> {selectedPersona.genre}
                  </p>
                  
                  <div className="h-px w-20 bg-[#ff007b] mb-8" />
                  
                  <div className="text-gray-300 leading-relaxed text-lg font-medium space-y-4 whitespace-pre-wrap">
                    {selectedPersona.description}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;