/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, Upload, RefreshCw, ShieldCheck, Activity } from 'lucide-react';

const VideoShowcase: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const DEFAULT_VIDEO = "videochef.mp4"; 
  
  const [videoSrc, setVideoSrc] = useState<string>(DEFAULT_VIDEO);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [needsInteraction, setNeedsInteraction] = useState(false);

  // Configuration initiale de la vidéo
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Paramètres critiques pour l'autoplay et la boucle infinie
    video.muted = true;
    video.playsInline = true;
    video.loop = true; // La vidéo bouclera automatiquement
    video.load();
  }, [videoSrc]);

  // Tentative de lecture automatique quand le flux est prêt
  const handleCanPlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      await video.play();
      setIsPlaying(true);
      setNeedsInteraction(false);
    } catch (err) {
      // Safari/iOS bloque souvent l'autoplay sans clic, on affiche l'overlay d'activation
      setNeedsInteraction(true);
      setIsPlaying(false);
    }
  };

  const handleManualAction = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      video.muted = isMuted;
      await video.play();
      setIsPlaying(true);
      setNeedsInteraction(false);
    } catch (e) {
      // Fallback de sécurité : forcer le mute pour garantir la lecture
      video.muted = true;
      setIsMuted(true);
      await video.play().catch(() => {});
      setIsPlaying(true);
      setNeedsInteraction(false);
    }
  };

  const togglePlayback = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      handleManualAction();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Si on charge une nouvelle vidéo, on remplace l'ancienne proprement
      if (isCustom && videoSrc.startsWith('blob:')) URL.revokeObjectURL(videoSrc);
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setIsCustom(true);
      setNeedsInteraction(false);
    }
  };

  return (
    <section className="relative pt-8 pb-20 px-4 md:px-6 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            className="flex items-center justify-center gap-2 mb-4"
          >
            <ShieldCheck className="text-[#ff007b] w-4 h-4" />
            <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-white/50">Tactical Intelligence Interface</span>
          </motion.div>
          <motion.h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter-custom">
            COMMAND <span className="text-[#ff007b]">CENTER</span>
          </motion.h2>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#05051a] group"
        >
          {/* Input masqué pour l'upload si besoin */}
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="video/*" className="hidden" />

          <div className="aspect-video relative bg-black flex items-center justify-center overflow-hidden">
            <video
              ref={videoRef}
              src={videoSrc}
              playsInline
              muted={isMuted}
              loop
              onCanPlay={handleCanPlay}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full h-full object-cover"
            />

            {/* Overlay d'interaction pour mobile/Safari */}
            <AnimatePresence>
              {needsInteraction && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={handleManualAction}
                  className="absolute inset-0 z-40 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center cursor-pointer p-6 text-center"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    className="w-20 h-20 rounded-full bg-[#ff007b] flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(255,0,123,0.5)]"
                  >
                    <Play className="w-8 h-8 text-white fill-white ml-1" />
                  </motion.div>
                  <h3 className="text-white font-black text-xl uppercase tracking-tighter mb-2">ACTIVER LE FLUX</h3>
                  <p className="text-white/40 text-[10px] font-mono uppercase tracking-[0.3em]">Synchronisation tactique requise</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Status Labels - Professionnels et Unifiés */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-black/80 backdrop-blur-md border border-white/10 rounded-full">
                <Activity className="w-3 h-3 text-[#ff007b] animate-pulse" />
                <span className="text-[9px] font-bold tracking-widest uppercase text-white">
                  FLUX TACTIQUE EN DIRECT
                </span>
              </div>
            </div>

            {/* Contrôles tactiques */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex gap-2">
                <button onClick={togglePlayback} className="bg-black/70 backdrop-blur-md p-3 rounded-full border border-white/10 text-white hover:text-[#ff007b] transition-colors">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); if(videoRef.current) videoRef.current.muted = !isMuted; }} 
                  className="bg-black/70 backdrop-blur-md p-3 rounded-full border border-white/10 text-white"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
              
              <button 
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }} 
                className="bg-[#ff007b] px-5 py-2 rounded-full text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-[#ff007b]/30 active:scale-95 transition-all"
              >
                <Upload className="w-3 h-3" /> Importer
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Barre de statut système */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="flex gap-1.5">
             {[...Array(5)].map((_, i) => (
               <motion.div 
                 key={i} 
                 animate={{ scaleY: [1, 2, 1], opacity: [0.3, 1, 0.3] }}
                 transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                 className="w-1 h-3 bg-[#ff007b] rounded-full" 
               />
             ))}
          </div>
          <div className="flex items-center gap-4 text-white/20 text-[9px] font-mono uppercase tracking-[0.4em]">
            <span>SIGNAL : STABLE</span>
            <span className="text-white/5">|</span>
            <span className="text-white/40">BOUCLE : ACTIVE</span>
            <span className="text-white/5">|</span>
            <span>AUTO-SYNC : OK</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;