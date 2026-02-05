/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import TacticalBackground from './TacticalBackground';
import DataParticles from './DataParticles';

const StarField = () => {
  const stars = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      size: Math.random() * 1.5 + 0.5,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 3 + 4,
      delay: Math.random() * 2,
      opacity: Math.random() * 0.5 + 0.1
    }));
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white/40 will-change-[opacity,transform]"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            transform: 'translateZ(0)'
          }}
          initial={{ opacity: star.opacity, scale: 1 }}
          animate={{
            opacity: [star.opacity, star.opacity * 1.5, star.opacity],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.duration * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: star.delay,
          }}
        />
      ))}
    </div>
  );
};

const FluidBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#02020a]">
      
      {/* Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020210] via-[#010108] to-black opacity-90" />
      
      <StarField />
      
      {/* Interactive Data Particles */}
      <DataParticles />

      {/* Blob 1: Profiler Vibrant Magenta */}
      <motion.div
        className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] bg-[#ff007b] rounded-full mix-blend-overlay filter blur-[120px] opacity-[0.08] will-change-transform"
        animate={{
          x: [0, 50, -25, 0],
          y: [0, -25, 25, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ transform: 'translateZ(0)' }}
      />

      {/* Blob 2: Deep Blue */}
      <motion.div
        className="absolute top-[20%] right-[-20%] w-[90vw] h-[90vw] bg-[#0015ff] rounded-full mix-blend-screen filter blur-[100px] opacity-[0.05] will-change-transform"
        animate={{
          x: [0, -50, 25, 0],
          y: [0, 50, -25, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ transform: 'translateZ(0)' }}
      />

      <TacticalBackground />

      {/* Static Grain Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.12] mix-blend-overlay pointer-events-none"></div>
      
      {/* Heavy Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#02020a]/40 to-[#000000]/90 pointer-events-none" />
    </div>
  );
};

export default FluidBackground;