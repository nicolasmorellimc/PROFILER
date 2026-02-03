/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, Upload, RotateCcw, RefreshCw, ShieldCheck } from 'lucide-react';

const DB_NAME = 'ProfilerVideoDB';
const STORE_NAME = 'videos';
const VIDEO_KEY = 'customVideo';

const VideoShowcase: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const DEFAULT_VIDEO = "videochef.mp4"; 
  
  const [videoSrc, setVideoSrc] = useState<string>(DEFAULT_VIDEO);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [needsInteraction, setNeedsInteraction] = useState(false);

  // Initialisation et récupération de la vidéo (IndexedDB)
  useEffect(() => {
    const initDB = () => {
      try {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = (e: any) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
        };
        request.onsuccess = (e: any) => {
          const db = e.target.result;
          const transaction = db.transaction(STORE_NAME, 'readonly');
          const store = transaction.objectStore(STORE_NAME);
          const getRequest = store.get(VIDEO_KEY);
          getRequest.onsuccess = () => {
            if (getRequest.result && (getRequest.result instanceof Blob || getRequest.result instanceof File)) {
              setVideoSrc(URL.createObjectURL(getRequest.result));
              setIsCustom(true);
            } else {
              setVideoSrc(DEFAULT_VIDEO);
              setIsCustom(false);
            }
            setIsLoading(false);
          };
          getRequest.onerror = () => { setVideoSrc(DEFAULT_VIDEO); setIsLoading(false); };
        };
        request.onerror = () => { setVideoSrc(DEFAULT_VIDEO); setIsLoading(false); };
      } catch (err) {
        setVideoSrc(DEFAULT_VIDEO);
        setIsLoading(false);
      }
    };
    initDB();
  }, []);

  // Gestion du chargement de la source
  useEffect(() => {
    const video = videoRef.current;
    if (!video || isLoading) return;

    // On configure les propriétés AVANT de charger la source
    video.muted = true;
    video.playsInline = true;
    video.loop = true;
    
    // On met à jour la source et on force le chargement
    // L'erreur "Not Supported" arrive souvent si on play() avant que load() soit fini sur Safari
    video.load();
  }, [videoSrc, isLoading]);

  // Déclenchement de la lecture quand le navigateur est prêt
  const handleCanPlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        await playPromise;
        setIsPlaying(true);
        setNeedsInteraction(false);
      }
    } catch (err) {
      // Safari bloque l'autoplay sans geste utilisateur, c'est normal
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
      // Fallback ultime : forcer le mode muet pour débloquer Safari
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
      if (isCustom && videoSrc.startsWith('blob:')) URL.revokeObjectURL(videoSrc);
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setIsCustom(true);
      setNeedsInteraction(false);
      
      const request = indexedDB.open(DB_NAME, 1);
      request.onsuccess = (event: any) => event.target.result.transaction(STORE_NAME, 'readwrite').put(file, VIDEO_KEY);
    }
  };

  const resetToDefault = () => {
    if (isCustom && videoSrc.startsWith('blob:')) URL.revokeObjectURL(videoSrc);
    setVideoSrc(DEFAULT_VIDEO);
    setIsCustom(false);
    setNeedsInteraction(false);
    const request = indexedDB.open(DB_NAME, 1);
    request.onsuccess = (e: any) => e.target.result.transaction(STORE_NAME, 'readwrite').delete(VIDEO_KEY);
  };

  return (
    <section className="relative pt-8 pb-20 px-4 md:px-6 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="flex items-center justify-center gap-2 mb-4">
            <ShieldCheck className="text-[#ff007b] w-4 h-4" />
            <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-white/50">Unified Visual Feed</span>
          </motion.div>
          <motion.h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter-custom">
            COMMAND <span className="text-[#ff007b]">CENTER</span>
          </motion.h2>
        </div>

        <motion.div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#05051a] group">
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="video/*" className="hidden" />

          <div className="aspect-video relative bg-black flex items-center justify-center overflow-hidden">
            {isLoading ? (
              <RefreshCw className="w-10 h-10 text-[#ff007b] animate-spin" />
            ) : (
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
            )}

            {/* Bouton d'activation Safari/Mobile */}
            <AnimatePresence>
              {needsInteraction && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={handleManualAction}
                  className="absolute inset-0 z-40 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center cursor-pointer p-6 text-center"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    className="w-24 h-24 rounded-full bg-[#ff007b] flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(255,0,123,0.5)]"
                  >
                    <Play className="w-10 h-10 text-white fill-white ml-1" />
                  </motion.div>
                  <h3 className="text-white font-black text-2xl uppercase tracking-tighter mb-2">INITIALISER LE FLUX</h3>
                  <p className="text-white/40 text-[10px] font-mono uppercase tracking-[0.3em]">Synchronisation requise par le décodeur</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Status Indicator */}
            <div className="absolute top-4 left-4 z-20">
              <div className="flex items-center gap-2 px-3 py-1 bg-black/80 backdrop-blur-md border border-white/10 rounded-full">
                <div className={`w-2 h-2 rounded-full ${isCustom ? 'bg-blue-500' : 'bg-[#ff007b]'} animate-pulse`} />
                <span className="text-[9px] font-bold tracking-widest uppercase text-white">
                  {isCustom ? 'SIGNAL PERSONNALISÉ' : 'FLUX TACTIQUE'}
                </span>
              </div>
            </div>

            {/* Barre de contrôles */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex gap-2">
                <button onClick={togglePlayback} className="bg-black/70 backdrop-blur-md p-3 rounded-full border border-white/10 text-white hover:text-[#ff007b]">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); if(videoRef.current) videoRef.current.muted = !isMuted; }} 
                  className="bg-black/70 backdrop-blur-md p-3 rounded-full border border-white/10 text-white"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex gap-2">
                {isCustom && (
                  <button onClick={(e) => { e.stopPropagation(); resetToDefault(); }} className="bg-black/70 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-white/10">
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                )}
                <button onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }} className="bg-[#ff007b] px-5 py-2 rounded-full text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-[#ff007b]/30 active:scale-95 transition-all">
                  <Upload className="w-3 h-3" /> Charger ma vidéo
                </button>
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="flex gap-1.5">
             {[...Array(5)].map((_, i) => (
               <motion.div 
                 key={i} 
                 animate={{ scaleY: [1, 1.8, 1], opacity: [0.5, 1, 0.5] }}
                 transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                 className="w-1 h-3 bg-[#ff007b] rounded-full" 
               />
             ))}
          </div>
          <p className="text-white/20 text-[9px] font-mono uppercase tracking-[0.4em] text-center">
            Signal : <span className="text-green-500/60 font-bold">OPTIMAL</span> | 
            Loop : <span className="text-white/40 font-bold">AUTOMATIQUE</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;