/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useState, ChangeEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, Upload, RotateCcw, RefreshCw, AlertCircle, Zap } from 'lucide-react';

const DB_NAME = 'ProfilerVideoDB';
const STORE_NAME = 'videos';
const VIDEO_KEY = 'customVideo';

/** 
 * Flux de secours professionnel (Plexus/Data loop).
 * Garanti sans aspect "dessin animé".
 */
const FALLBACK_VIDEO_URL = "https://assets.mixkit.co/videos/preview/mixkit-futuristic-technology-background-with-lines-and-dots-9104-large.mp4";

const VideoShowcase: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const DEFAULT_VIDEO = "videochef.mp4"; 
  
  const [videoSrc, setVideoSrc] = useState<string>(DEFAULT_VIDEO);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [needsInteraction, setNeedsInteraction] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  // Initialisation et récupération de la vidéo utilisateur (IndexedDB)
  useEffect(() => {
    const initDB = async () => {
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

  // Gestion robuste de la lecture pour Safari/iOS
  useEffect(() => {
    const video = videoRef.current;
    if (!video || isLoading) return;

    const attemptPlayback = async () => {
      // Configuration obligatoire pour l'autoplay mobile
      video.muted = true;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      
      try {
        // L'erreur "Operation not supported" survient souvent si play() est appelé trop tôt
        // ou si le codec n'est pas prêt. load() réinitialise l'état correctement.
        video.load(); 
        
        // On attend un court instant que Safari initialise le décodeur
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPlaying(true);
            setNeedsInteraction(false);
          }).catch((err) => {
            if (err.name === 'NotAllowedError' || err.name === 'NotSupportedError') {
              setNeedsInteraction(true);
            } else {
              handleVideoError();
            }
            setIsPlaying(false);
          });
        }
      } catch (err) {
        console.warn("Playback init failed, user interaction likely required.");
        setNeedsInteraction(true);
      }
    };

    attemptPlayback();
  }, [videoSrc, isLoading]);

  const handleVideoError = () => {
    // Si la vidéo principale échoue, on bascule sur le cloud
    if (!isCustom && !useFallback) {
      setUseFallback(true);
      setVideoSrc(FALLBACK_VIDEO_URL);
    } else if (isCustom) {
      setErrorStatus("FICHIER_CORROMPU");
    }
  };

  const togglePlay = async () => {
    if (!videoRef.current) return;
    try {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        await videoRef.current.play();
        setIsPlaying(true);
        setNeedsInteraction(false);
      }
    } catch (e) {
      // Si même le clic échoue (rare), on affiche l'erreur
      setErrorStatus("ERREUR_LECTURE_SYSTEME");
    }
  };

  const resetFeed = () => {
    if (isCustom && videoSrc.startsWith('blob:')) URL.revokeObjectURL(videoSrc);
    setVideoSrc(DEFAULT_VIDEO);
    setIsCustom(false);
    setUseFallback(false);
    setErrorStatus(null);
    setNeedsInteraction(false);
    const request = indexedDB.open(DB_NAME, 1);
    request.onsuccess = (e: any) => e.target.result.transaction(STORE_NAME, 'readwrite').delete(VIDEO_KEY);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (isCustom && videoSrc.startsWith('blob:')) URL.revokeObjectURL(videoSrc);
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setIsCustom(true);
      setUseFallback(false);
      setErrorStatus(null);
      const request = indexedDB.open(DB_NAME, 1);
      request.onsuccess = (event: any) => event.target.result.transaction(STORE_NAME, 'readwrite').put(file, VIDEO_KEY);
    }
  };

  return (
    <section className="relative pt-8 pb-20 px-4 md:px-6 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="flex items-center justify-center gap-2 mb-4">
            <Zap className="text-[#ff007b] w-4 h-4 fill-[#ff007b]" />
            <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-white/50">Centre de Commande Tactique</span>
          </motion.div>
          <motion.h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter-custom">
            COMMAND <span className="text-[#ff007b]">CENTER</span>
          </motion.h2>
        </div>

        <motion.div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#05051a]">
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="video/*" className="hidden" />

          <div className="aspect-video relative bg-black flex items-center justify-center overflow-hidden">
            {isLoading ? (
              <RefreshCw className="w-10 h-10 text-[#ff007b] animate-spin" />
            ) : (
              <video
                ref={videoRef}
                key={videoSrc}
                src={videoSrc}
                playsInline
                muted
                loop
                preload="auto"
                className="w-full h-full object-cover"
                onError={handleVideoError}
              />
            )}

            {/* Interface de synchronisation pour Safari/Mobile */}
            <AnimatePresence>
              {needsInteraction && !errorStatus && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={togglePlay}
                  className="absolute inset-0 z-40 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center cursor-pointer p-6 text-center"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-24 h-24 rounded-full bg-[#ff007b] flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(255,0,123,0.4)]"
                  >
                    <Play className="w-10 h-10 text-white fill-white ml-1" />
                  </motion.div>
                  <h3 className="text-white font-black text-2xl uppercase tracking-tighter mb-4">ACTIVER LE FLUX</h3>
                  <p className="text-white/40 text-xs font-mono uppercase tracking-widest max-w-xs mx-auto">
                    Le navigateur nécessite une action manuelle pour synchroniser l'intelligence visuelle.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Labels de Statut Épurés */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-black/80 backdrop-blur-md border border-white/10 rounded-full">
                <div className={`w-2 h-2 rounded-full ${isCustom ? 'bg-blue-500' : (useFallback ? 'bg-yellow-500' : 'bg-[#ff007b]')} animate-pulse`} />
                <span className="text-[9px] font-bold tracking-widest uppercase text-white">
                  {isCustom ? 'PROJET_PERSONNALISÉ' : (useFallback ? 'FLUX_DE_SECOURS' : 'FLUX_ACTIF')}
                </span>
              </div>
            </div>

            {/* Contrôles tactiques */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-30 opacity-0 md:group-hover:opacity-100 md:opacity-0 transition-opacity duration-300">
              {/* Sur mobile, on peut laisser les contrôles visibles ou les révéler au toucher */}
              <div className="flex gap-2">
                <button onClick={togglePlay} className="bg-black/70 backdrop-blur-md p-3 rounded-full border border-white/10 text-white">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <button onClick={() => { if(videoRef.current) { videoRef.current.muted = !isMuted; setIsMuted(!isMuted); } }} className="bg-black/70 backdrop-blur-md p-3 rounded-full border border-white/10 text-white">
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex gap-2">
                {isCustom && (
                  <button onClick={resetFeed} className="bg-black/70 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                )}
                <button onClick={() => fileInputRef.current?.click()} className="bg-[#ff007b] px-5 py-2 rounded-full text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-[#ff007b]/30 active:scale-95 transition-transform">
                  <Upload className="w-3 h-3" /> Remplacer
                </button>
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="flex gap-1">
             {[...Array(5)].map((_, i) => (
               <div key={i} className={`w-1 h-3 rounded-full ${i < 4 ? 'bg-[#ff007b]' : 'bg-white/10'}`} />
             ))}
          </div>
          <p className="text-white/20 text-[9px] font-mono uppercase tracking-[0.3em] text-center">
            Synchronisation des données : <span className="text-green-500/60 font-bold">TERMINÉE</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;