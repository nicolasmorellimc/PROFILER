/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Ticket, Globe, Zap, Database, MapPin, Menu, X, Users, Play, ChevronLeft, ChevronRight, Activity, Layers, Target, Phone, Mail, ClipboardList, Briefcase } from 'lucide-react';
import FluidBackground from './components/FluidBackground';
import GradientText from './components/GlitchText';
import CustomCursor from './components/CustomCursor';
import ArtistCard from './components/ArtistCard';
import { Artist } from './types';

// Profiler Data - Based on PDF Deck
const PERSONAS: Artist[] = [
  { 
    id: '1', 
    name: 'Scouts', 
    genre: 'Capture Talent', 
    day: 'ON THE FIELD', 
    // Image: Moody stadium view from the stands/sideline - Focused on observation
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0565c6a?q=80&w=1200&auto=format&fit=crop',
    description: `Your scouts didn't join the club to waste hours compiling reports after every match. They joined to capture talent while it's fresh.

Profiler delivers the match sheet at the final whistle - they write observations, rate players, tag skills, check data fingerprints, drop video clips, add audio notes, flag interesting players, build their best XI, and update their watchlist.

Everything in one place. They lock in their insights while emotions are raw, not hours later when details fade.`
  },
  { 
    id: '2', 
    name: 'Data Analysts', 
    genre: 'Find Edges', 
    day: 'INTELLIGENCE', 
    // Image: Dark abstract data/tech visualization
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    description: `Your analysts are hired to find competitive edges, not to spend days reconciling data sources.
    
But before they can analyze anything, they need to unify Wyscout, Opta, SkillCorner, Impect, StatsBomb, etc - manually checking duplicates, matching player IDs, and standardizing formats.

Profiler eliminates that entire process. All your sources are unified in one place, instantly available, with zero duplication. Your team stops fixing data and starts creating value.`
  },
  { 
    id: '3', 
    name: 'Chief Scout', 
    genre: 'Full Visibility', 
    day: 'COORDINATION', 
    // Image: Tactical board/Planning close-up - Focused on strategy
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d6db0?q=80&w=1200&auto=format&fit=crop',
    description: `Chief scouts need to see the full picture instantly: who's tracking which player, what's the status of each file, where are the gaps, who's going to Norway this weekend...

Instead, they chase updates through emails, WhatsApp and meetings, losing hours to coordination overhead.

Profiler gives them a single dashboard with complete visibility and smart alerts. No more asking "where are we on this?" or "who's covering that game?"—they already know.`
  },
  { 
    id: '4', 
    name: 'Decision Makers', 
    genre: 'Instant Clarity', 
    day: 'EXECUTION', 
    // Image: Modern, dark architectural/executive vibe - Focused on big picture
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
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
  
  // Handle keyboard navigation for modal
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
    <div className="relative min-h-screen text-white selection:bg-[#ff0033] selection:text-white cursor-auto md:cursor-none overflow-x-hidden">
      <CustomCursor />
      <FluidBackground />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-8 py-6 mix-blend-normal bg-gradient-to-b from-black/80 to-transparent">
        <div className="font-heading text-xl md:text-2xl font-bold tracking-tighter text-white cursor-default z-50 flex items-center gap-2">
           <span className="text-[#ff0033]">●</span> PROFILER
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-10 text-sm font-bold tracking-widest uppercase">
          {['Roles', 'Platform', 'Contact'].map((item) => (
            <button 
              key={item} 
              onClick={() => scrollToSection(item.toLowerCase())}
              className="hover:text-[#ff0033] transition-colors text-white cursor-pointer bg-transparent border-none"
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
                className="text-4xl font-heading font-bold text-white hover:text-[#ff0033] transition-colors uppercase bg-transparent border-none"
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
      <header className="relative h-[100svh] min-h-[600px] flex flex-col items-center justify-center overflow-hidden px-4">
        <motion.div 
          style={{ y, opacity }}
          className="z-10 text-center flex flex-col items-center w-full max-w-7xl pb-24 md:pb-20"
        >
           {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex items-center gap-3 md:gap-6 text-xs md:text-sm font-mono text-gray-300 tracking-[0.2em] md:tracking-[0.3em] uppercase mb-4 bg-black/40 px-6 py-2 rounded-full backdrop-blur-sm border border-white/10"
          >
            <span>Clubs</span>
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#ff0033] rounded-full animate-pulse"/>
            <span>Federations</span>
          </motion.div>

          {/* Main Title */}
          <div className="relative w-full flex justify-center items-center">
            <GradientText 
              text="PROFILER" 
              as="h1" 
              className="text-[15vw] md:text-[14vw] leading-[0.9] font-black tracking-tighter text-center text-white" 
            />
            {/* Optimized Orb */}
            <motion.div 
               className="absolute -z-20 w-[50vw] h-[50vw] bg-blue-900/10 blur-[60px] rounded-full pointer-events-none will-change-transform"
               animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.5, 0.3] }}
               transition={{ duration: 6, repeat: Infinity }}
               style={{ transform: 'translateZ(0)' }}
            />
          </div>
          
          <motion.div
             initial={{ scaleX: 0 }}
             animate={{ scaleX: 1 }}
             transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
             className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-[#ff0033]/50 to-transparent mt-4 md:mt-8 mb-6 md:mb-8"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-lg md:text-2xl font-light max-w-2xl mx-auto text-gray-200 leading-relaxed drop-shadow-lg px-4"
          >
            Every player. Every metric. <span className="text-white font-bold">One platform.</span>
            <br/>
            <span className="text-sm md:text-base text-gray-400 mt-2 block">Combine human expertise with data intelligence.</span>
          </motion.p>
        </motion.div>

        {/* MARQUEE */}
        <div className="absolute bottom-12 md:bottom-16 left-0 w-full py-4 md:py-6 bg-white text-black z-20 overflow-hidden border-y-4 border-[#ff0033] shadow-[0_0_40px_rgba(255,0,51,0.2)]">
          <motion.div 
            className="flex w-fit will-change-transform"
            animate={{ x: "-50%" }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            {[0, 1].map((key) => (
              <div key={key} className="flex whitespace-nowrap shrink-0">
                {[...Array(4)].map((_, i) => (
                  <span key={i} className="text-3xl md:text-7xl font-heading font-black px-8 flex items-center gap-4">
                    SCOUTING REVOLUTIONIZED <span className="text-[#ff0033] text-2xl md:text-4xl">●</span> 
                    DATA INTELLIGENCE <span className="text-[#ff0033] text-2xl md:text-4xl">●</span> 
                    ZERO FRICTION <span className="text-[#ff0033] text-2xl md:text-4xl">●</span> 
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </header>

      {/* PERSONAS SECTION (Formerly Lineup) */}
      <section id="roles" className="relative z-10 py-20 md:py-32">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 px-4">
             <h2 className="text-5xl md:text-7xl font-heading font-bold uppercase leading-[0.9] drop-shadow-lg break-words w-full md:w-auto">
              Every Role <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Empowered</span>
            </h2>
            <p className="text-gray-400 max-w-md text-right mt-4 md:mt-0 font-mono text-xs md:text-sm">
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

      {/* PLATFORM SECTION (Formerly Experience) */}
      <section id="platform" className="relative z-10 py-20 md:py-32 bg-black/20 backdrop-blur-sm border-t border-white/10 overflow-hidden">
        {/* Decorative blurred circle */}
        <div className="absolute top-1/2 right-[-20%] w-[50vw] h-[50vw] bg-[#1a237e]/20 rounded-full blur-[60px] pointer-events-none will-change-transform" style={{ transform: 'translateZ(0)' }} />

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
          <div className="flex flex-col items-center">
            <div className="max-w-4xl w-full text-center">
              <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6 md:mb-8 leading-tight">
                One <br/> <GradientText text="PLATFORM" className="text-5xl md:text-7xl" />
              </h2>
              <p className="text-lg md:text-xl text-gray-200 mb-12 md:mb-16 font-light leading-relaxed drop-shadow-md max-w-2xl mx-auto">
                Clubs drown in data but starve for insights. Profiler centralizes the entire workflow of your scouting team with all market data and turns it into a real competitive edge.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                {[
                  { icon: Database, title: 'Centralization', desc: 'Wyscout, Opta, SkillCorner, Statsbomb, Impect etc — all unified in one powerful platform.' },
                  { icon: Globe, title: 'Global Intelligence', desc: 'Track every eligible player worldwide.' },
                  { icon: ClipboardList, title: 'Workflow Management', desc: 'Centralize the entire workflow of your scouting team from observation to signing.' },
                  { icon: Layers, title: 'Custom Recruitment', desc: 'Tailor every tool to match your club\'s DNA and tactical requirements.' },
                ].map((feature, i) => (
                  <div
                    key={i} 
                    className="flex items-start gap-6 p-6 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="p-4 rounded-2xl bg-[#05051a] border border-white/10 shrink-0">
                      <feature.icon className="w-6 h-6 text-[#ff0033]" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2 font-heading">{feature.title}</h4>
                      <p className="text-sm text-gray-300 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION (Formerly Tickets) */}
      <section id="contact" className="relative z-10 py-20 md:py-32 px-4 md:px-6 bg-black/40 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12 md:mb-16">
             <h2 className="text-4xl md:text-7xl font-heading font-bold text-white mb-6">
               READY TO <span className="text-[#ff0033]">REVOLUTIONIZE</span>
             </h2>
             <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
               Profiler doesn't cost—it multiplies your team's impact. Stop adding complexity. Start creating value.
             </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <motion.div
              whileHover={{ y: -5 }}
              className="p-8 border border-white/10 bg-white/5 backdrop-blur-md rounded-lg flex flex-col items-center justify-center gap-4"
            >
              <Phone className="w-10 h-10 text-[#ff0033]" />
              <h3 className="text-xl font-bold uppercase">Call Us</h3>
              <p className="text-xl font-mono">+33 661 633 038</p>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5 }}
              className="p-8 border border-white/10 bg-white/5 backdrop-blur-md rounded-lg flex flex-col items-center justify-center gap-4"
            >
              <Mail className="w-10 h-10 text-[#ff0033]" />
              <h3 className="text-xl font-bold uppercase">Email Us</h3>
              <a href="mailto:nicolas@profilerfootball.com" className="text-xl font-mono hover:text-[#ff0033] transition-colors">
                nicolas@profilerfootball.com
              </a>
            </motion.div>
          </div>

          <motion.a 
            href="mailto:nicolas@profilerfootball.com"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block mt-16 px-12 py-5 bg-[#ff0033] text-white font-bold text-lg tracking-widest uppercase rounded hover:bg-[#d50000] transition-colors shadow-[0_0_20px_rgba(255,0,51,0.4)]"
          >
            Schedule Demo
          </motion.a>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 py-12 md:py-16 bg-[#020210]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
             <div className="font-heading text-3xl md:text-4xl font-bold tracking-tighter mb-4 text-white flex items-center gap-2">
              <span className="text-[#ff0033]">●</span> PROFILER
             </div>
             <div className="flex gap-2 text-xs font-mono text-gray-500">
               <span>© 2025 Profiler Football. All rights reserved.</span>
             </div>
          </div>
          
          <div className="flex gap-6 md:gap-8 flex-wrap">
            <a href="#" className="text-gray-400 hover:text-white font-bold uppercase text-xs tracking-widest transition-colors">Twitter</a>
            <a href="#" className="text-gray-400 hover:text-white font-bold uppercase text-xs tracking-widest transition-colors">LinkedIn</a>
            <a href="#" className="text-gray-400 hover:text-white font-bold uppercase text-xs tracking-widest transition-colors">Instagram</a>
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
              className="relative w-full max-w-6xl bg-[#0a0a2a] border border-white/10 overflow-hidden flex flex-col md:flex-row shadow-2xl shadow-[#ff0033]/10 group/modal max-h-[90vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPersona(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors"
                data-hover="true"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Navigation Buttons */}
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

              {/* Image Side */}
              <div className="w-full md:w-5/12 h-64 md:h-auto relative overflow-hidden bg-black">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={selectedPersona.id}
                    // Direct src usage without fallback logic
                    src={selectedPersona.image} 
                    alt={selectedPersona.name} 
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 w-full h-full object-cover object-top opacity-80"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a2a] via-transparent to-transparent md:bg-gradient-to-r" />
              </div>

              {/* Content Side */}
              <div className="w-full md:w-7/12 p-8 pb-24 md:p-16 flex flex-col justify-center relative overflow-y-auto">
                <motion.div
                  key={selectedPersona.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <div className="flex items-center gap-3 text-[#ff0033] mb-6">
                     <Target className="w-5 h-5" />
                     <span className="font-mono text-sm tracking-widest uppercase">{selectedPersona.day}</span>
                  </div>
                  
                  <h3 className="text-4xl md:text-5xl font-heading font-bold uppercase leading-none mb-4 text-white">
                    {selectedPersona.name}
                  </h3>
                  
                  <p className="text-xl text-gray-400 font-medium tracking-wider uppercase mb-8 flex items-center gap-2">
                    <Activity className="w-5 h-5" /> {selectedPersona.genre}
                  </p>
                  
                  <div className="h-px w-20 bg-[#ff0033] mb-8" />
                  
                  <div className="text-gray-300 leading-relaxed text-lg font-light space-y-4 whitespace-pre-wrap">
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