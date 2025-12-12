/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React from 'react';
import { motion } from 'framer-motion';
import { Artist } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface ArtistCardProps {
  artist: Artist;
  onClick: () => void;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist, onClick }) => {
  const Icon = artist.icon;

  return (
    <motion.div
      className="group relative h-[400px] md:h-[500px] w-full overflow-hidden border-b md:border-r border-white/10 bg-[#05051a] cursor-pointer"
      initial="rest"
      whileHover="hover"
      whileTap="hover"
      animate="rest"
      data-hover="true"
      onClick={onClick}
    >
      {/* Abstract Tech Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-20" 
             style={{ 
               backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
               backgroundSize: '40px 40px',
               maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
             }} 
        />
        
        {/* Centered Large Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            variants={{
              rest: { scale: 1, opacity: 0.1, rotate: 0 },
              hover: { scale: 1.2, opacity: 0.2, rotate: -10 }
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Icon className="w-64 h-64 text-white stroke-1" />
          </motion.div>
        </div>

        {/* Active State Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#ff0033]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Overlay Info */}
      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between pointer-events-none">
        <div className="flex justify-between items-start">
           <span className="text-xs font-mono border border-white/30 px-2 py-1 rounded-full backdrop-blur-md bg-black/50 text-gray-300 group-hover:border-[#ff0033]/50 group-hover:text-white transition-colors">
             {artist.day}
           </span>
           <motion.div
             variants={{
               rest: { opacity: 0, x: 20, y: -20 },
               hover: { opacity: 1, x: 0, y: 0 }
             }}
             className="bg-[#ff0033] text-white rounded-full p-2"
           >
             <ArrowUpRight className="w-6 h-6" />
           </motion.div>
        </div>

        <div>
          {/* Main Icon (Small visible version) */}
          <motion.div
            className="mb-4 text-[#ff0033]"
            variants={{
              rest: { y: 20, opacity: 0 },
              hover: { y: 0, opacity: 1 }
            }}
          >
            <Icon className="w-10 h-10" />
          </motion.div>

          <div className="overflow-hidden">
            <motion.h3 
              className="font-heading text-2xl md:text-3xl font-bold uppercase text-white"
              variants={{
                rest: { y: 0 },
                hover: { y: -5 }
              }}
              transition={{ duration: 0.4 }}
            >
              {artist.name}
            </motion.h3>
          </div>
          <motion.p 
            className="text-sm font-medium uppercase tracking-widest text-gray-400 mt-2"
            variants={{
              rest: { opacity: 0.6, y: 0 },
              hover: { opacity: 1, y: 0, color: "#fff" }
            }}
            transition={{ duration: 0.4 }}
          >
            {artist.genre}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default ArtistCard;