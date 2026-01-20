/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 400, mass: 0.1 }; 
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      const target = e.target as HTMLElement;
      const clickable = target.closest('button') || target.closest('a') || target.closest('[data-hover="true"]');
      setIsHovering(!!clickable);
    };
    window.addEventListener('mousemove', updateMousePosition, { passive: true });
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none flex items-center justify-center hidden md:flex will-change-transform"
      style={{ x, y, translateX: '-50%', translateY: '-50%' }}
    >
      <motion.div
        className="relative bg-[#ff007b] shadow-[0_0_20px_rgba(255,0,123,0.5)] flex items-center justify-center"
        style={{ 
          width: 80, 
          height: 80,
          /* Vertical pointy-top hexagon matching the logo shape */
          clipPath: 'polygon(50% 0%, 90% 25%, 90% 75%, 50% 100%, 10% 75%, 10% 25%)'
        }}
        animate={{ scale: isHovering ? 1.4 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <motion.span className="z-10 text-white font-black uppercase tracking-widest text-[10px]" initial={{ opacity: 0 }} animate={{ opacity: isHovering ? 1 : 0 }} transition={{ duration: 0.2 }}>
          VIEW
        </motion.span>
      </motion.div>
    </motion.div>
  );
};

export default CustomCursor;