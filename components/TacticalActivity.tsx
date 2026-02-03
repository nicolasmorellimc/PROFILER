/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Zap, Radio } from 'lucide-react';

const TacticalActivity: React.FC = () => {
  return (
    <section className="relative py-12 px-6 bg-black border-y border-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-8">
          
          {/* Main Visual Activity */}
          <div className="relative w-full max-w-2xl aspect-[21/9] bg-[#05051a] rounded-3xl border border-[#ff007b]/20 flex items-center justify-center overflow-hidden group shadow-[0_0_50px_rgba(255,0,123,0.05)]">
            
            {/* Background Grid Layer */}
            <div 
              className="absolute inset-0 opacity-[0.03]" 
              style={{ 
                backgroundImage: 'linear-gradient(#ff007b 1px, transparent 1px), linear-gradient(90deg, #ff007b 1px, transparent 1px)',
                backgroundSize: '30px 30px'
              }} 
            />

            {/* Scanning Line */}
            <motion.div 
              className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#ff007b] to-transparent z-10 opacity-30"
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />

            <div className="relative z-20 flex flex-col items-center gap-6">
              {/* Central Pulse Sensor */}
              <div className="relative">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-[#ff007b] blur-xl rounded-full opacity-20"
                />
                <div className="relative bg-black/50 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <Activity className="w-12 h-12 text-[#ff007b]" />
                </div>
              </div>

              {/* Activity Bars (The pink sensor) */}
              <div className="flex gap-1.5 h-8 items-end">
                {[...Array(12)].map((_, i) => (
                  <motion.div 
                    key={i} 
                    animate={{ 
                      height: [
                        Math.random() * 10 + 10, 
                        Math.random() * 25 + 5, 
                        Math.random() * 10 + 10
                      ] 
                    }}
                    transition={{ 
                      duration: 0.5 + Math.random() * 0.5, 
                      repeat: Infinity, 
                      delay: i * 0.05 
                    }}
                    className="w-1.5 bg-[#ff007b] rounded-full shadow-[0_0_10px_rgba(255,0,123,0.5)]" 
                  />
                ))}
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-mono font-black text-white/40 tracking-[0.5em] uppercase">Tactical Feed</span>
                <motion.span 
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 3 }}
                  className="text-[#ff007b] font-mono text-xs font-bold uppercase tracking-widest"
                >
                  LIVE DATA UNIFICATION IN PROGRESS
                </motion.span>
              </div>
            </div>

            {/* Corner Details */}
            <div className="absolute top-4 left-6 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[8px] font-mono text-white/30 uppercase tracking-tighter">System: Stable</span>
            </div>
            <div className="absolute bottom-4 right-6 flex items-center gap-2">
              <span className="text-[8px] font-mono text-white/30 uppercase tracking-tighter">Frequency: 2.4 GHz</span>
              <Radio className="w-3 h-3 text-white/20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TacticalActivity;