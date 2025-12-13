/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion } from 'framer-motion';

const TacticalBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none w-full h-full">
      
      {/* 1. Global Tactical Grid - Subtle */}
      <div 
        className="absolute inset-0 opacity-[0.05]" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)',
          backgroundSize: '100px 100px'
        }} 
      />

      {/* 2. Top Right - Half Pitch / Heatmap Zone */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vh] opacity-20">
        <svg width="100%" height="100%" viewBox="0 0 400 300">
           {/* Corner Arc */}
           <path d="M 400 0 L 400 300 L 0 0 Z" fill="none" /> 
           <motion.path 
             d="M 400 100 Q 300 100 300 0" 
             stroke="white" strokeWidth="1" fill="none" strokeDasharray="5 5"
             initial={{ pathLength: 0 }}
             animate={{ pathLength: 1 }}
             transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
           />
           {/* Tactical Crosses */}
           <g stroke="white" strokeWidth="1" opacity="0.6">
             <line x1="350" y1="50" x2="360" y2="50" />
             <line x1="355" y1="45" x2="355" y2="55" />
             
             <line x1="300" y1="80" x2="310" y2="80" />
             <line x1="305" y1="75" x2="305" y2="85" />
           </g>
           {/* Abstract Data Lines */}
           <motion.line 
             x1="0" y1="0" x2="400" y2="200" 
             stroke="white" 
             strokeWidth="1"
             initial={{ opacity: 0 }}
             animate={{ opacity: [0, 0.3, 0] }}
             transition={{ duration: 5, repeat: Infinity }}
           />
        </svg>
      </div>

      {/* 3. Bottom Left - Radar Chart / Stats */}
      <div className="absolute bottom-10 left-0 md:left-10 w-[300px] h-[300px] opacity-20">
        <svg width="100%" height="100%" viewBox="0 0 200 200">
          {/* Static Hexagon Grid */}
          <path d="M100 20 L170 60 L170 140 L100 180 L30 140 L30 60 Z" fill="none" stroke="white" strokeWidth="1" />
          <path d="M100 40 L152 70 L152 130 L100 160 L48 130 L48 70 Z" fill="none" stroke="white" strokeWidth="0.5" opacity="0.6" />
          
          <line x1="100" y1="100" x2="100" y2="20" stroke="white" strokeWidth="0.5" opacity="0.4" />
          <line x1="100" y1="100" x2="170" y2="60" stroke="white" strokeWidth="0.5" opacity="0.4" />
          <line x1="100" y1="100" x2="170" y2="140" stroke="white" strokeWidth="0.5" opacity="0.4" />
          <line x1="100" y1="100" x2="100" y2="180" stroke="white" strokeWidth="0.5" opacity="0.4" />
          <line x1="100" y1="100" x2="30" y2="140" stroke="white" strokeWidth="0.5" opacity="0.4" />
          <line x1="100" y1="100" x2="30" y2="60" stroke="white" strokeWidth="0.5" opacity="0.4" />

          {/* Dynamic Data Shape */}
          <motion.path
            d="M100 30 L160 65 L140 130 L100 150 L50 120 L40 70 Z"
            fill="rgba(255, 0, 51, 0.1)"
            stroke="#ff0033"
            strokeWidth="1"
            initial={{ d: "M100 100 L100 100 L100 100 L100 100 L100 100 L100 100 Z" }}
            animate={{ 
              d: [
                "M100 30 L160 65 L140 130 L100 150 L50 120 L40 70 Z",
                "M100 45 L150 75 L160 120 L100 170 L40 130 L45 60 Z",
                "M100 30 L160 65 L140 130 L100 150 L50 120 L40 70 Z"
              ] 
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* 4. Center Right - Vertical Metric Bars */}
      <div className="absolute top-1/3 right-[5%] w-[20px] h-[200px] flex flex-col justify-between opacity-30">
         {[...Array(10)].map((_, i) => (
           <motion.div 
             key={i}
             className="w-full bg-white h-[2px]"
             initial={{ width: "20%", opacity: 0.4 }}
             animate={{ width: ["20%", "100%", "20%"], opacity: [0.4, 0.9, 0.4] }}
             transition={{ duration: 2 + i, repeat: Infinity, ease: "easeInOut" }}
           />
         ))}
      </div>

      {/* 5. Center Circle - Spinning Slowly */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vh] h-[60vh] opacity-[0.1] pointer-events-none">
         <svg width="100%" height="100%" viewBox="0 0 500 500">
           <circle cx="250" cy="250" r="200" fill="none" stroke="white" strokeWidth="1" strokeDasharray="10 20" />
           <circle cx="250" cy="250" r="150" fill="none" stroke="white" strokeWidth="0.5" />
           <motion.line 
             x1="250" y1="250" x2="250" y2="50" 
             stroke="white" strokeWidth="1"
             animate={{ rotate: 360 }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             style={{ originX: "250px", originY: "250px" }}
           />
         </svg>
      </div>
    </div>
  );
};

export default TacticalBackground;