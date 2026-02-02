/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  videoUrl: string;
  description: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    title: "SCALE YOUR DNA",
    subtitle: "Immersive Intelligence",
    videoUrl: "input_file_0.mp4",
    description: "Visualize every metric in real-time. Transform raw data into actionable tactical advantages with our holographic interface."
  },
  {
    id: 2,
    title: "DATA UNIFICATION",
    subtitle: "The Single Source of Truth",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-high-tech-digital-abstract-animation-9022-large.mp4",
    description: "Connect Wyscout, Opta and StatsBomb in one place. No more ID reconciliation or data fragmentation."
  },
  {
    id: 3,
    title: "MOBILE COMMAND",
    subtitle: "Decide Anywhere",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-smartphone-with-a-blue-screen-34444-large.mp4",
    description: "Access full player profiles and video clips directly from your pocket during the game."
  }
];

const MediaCarousel: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 10000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    })
  };

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative aspect-video md:aspect-[21/9] w-full bg-black rounded-[2rem] overflow-hidden border border-white/10 group shadow-2xl shadow-black">
          
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.4 },
                scale: { duration: 0.4 }
              }}
              className="absolute inset-0"
            >
              {/* Video Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
              <div className="absolute inset-0 bg-black/40 z-10" />

              <video
                key={SLIDES[current].videoUrl}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              >
                <source src={SLIDES[current].videoUrl} type="video/mp4" />
              </video>

              {/* Content Box */}
              <div className="absolute bottom-0 left-0 p-8 md:p-16 z-20 w-full md:max-w-2xl">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-[#ff007b] font-mono text-xs tracking-[0.3em] uppercase mb-2 block font-bold">
                    {SLIDES[current].subtitle}
                  </span>
                  <h3 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter uppercase">
                    {SLIDES[current].title}
                  </h3>
                  <p className="text-gray-300 text-lg font-medium leading-relaxed max-w-lg">
                    {SLIDES[current].description}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="absolute top-1/2 -translate-y-1/2 left-6 right-6 flex justify-between z-30 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={prevSlide}
              className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-[#ff007b] transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={nextSlide}
              className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-[#ff007b] transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Indicators & Progress */}
          <div className="absolute bottom-6 right-12 flex gap-3 z-30">
            {SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => {
                  setDirection(idx > current ? 1 : -1);
                  setCurrent(idx);
                }}
                className={`h-1.5 transition-all duration-500 rounded-full ${
                  idx === current ? 'w-12 bg-[#ff007b]' : 'w-3 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MediaCarousel;
