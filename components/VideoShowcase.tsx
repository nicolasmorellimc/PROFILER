/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useState, ChangeEvent, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, Upload, RotateCcw, MonitorPlay, Sparkles, RefreshCw } from 'lucide-react';

const DB_NAME = 'ProfilerVideoDB';
const STORE_NAME = 'videos';
const VIDEO_KEY = 'customVideo';

// URL de secours robuste (CDN haute disponibilité)
const FALLBACK_VIDEO_URL = "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-futuristic-blue-grid-background-9020-large.mp4";

const VideoShowcase: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Utilisation d'un chemin absolu pour forcer la recherche à la racine du serveur
  const DEFAULT_VIDEO = "/videochef.mp4"; 
  
  const [videoSrc, setVideoSrc] = useState<string>(DEFAULT_VIDEO);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isCustom, setIsCustom] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Charger la vidéo sauvegardée ou le défaut au démarrage
  useEffect(() => {
    const loadStoredVideo = () => {
      const request = indexedDB.open(DB_NAME, 1);
      
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = (event: any) => {
        const db = event.target.result;
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const getRequest = store.get(VIDEO_KEY);

        getRequest.onsuccess = () => {
          if (getRequest.result && (getRequest.result instanceof Blob || getRequest.result instanceof File)) {
            const url = URL.createObjectURL(getRequest.result);
            setVideoSrc(url);
            setIsCustom(true);
            setUseFallback(false);
          } else {
            setVideoSrc(DEFAULT_VIDEO);
            setIsCustom(false);
          }
          setIsLoading(false);
        };

        getRequest.onerror = () => {
          setVideoSrc(DEFAULT_VIDEO);
          setIsLoading(false);
        };
      };

      request.onerror = () => {
        setVideoSrc(DEFAULT_VIDEO);
        setIsLoading(false);
      };
    };

    loadStoredVideo();
  }, []);

  // Forcer le rechargement du moteur vidéo quand la source change
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      if (isPlaying) {
        videoRef.current.play().catch(e => console.log("Autoplay blocked or load failed", e));
      }
    }
  }, [videoSrc]);

  const saveVideoToDB = (file: File) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onsuccess = (event: any) => {
      const db = event.target.result;
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.put(file, VIDEO_KEY);
    };
  };

  const removeVideoFromDB = () => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onsuccess = (event: any) => {
      const db = event.target.result;
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.delete(VIDEO_KEY);
    };
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (isCustom && videoSrc.startsWith('blob:')) {
        URL.revokeObjectURL(videoSrc);
      }
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setIsCustom(true);
      setIsPlaying(true);
      setUseFallback(false);
      saveVideoToDB(file);
    }
  };

  const resetVideo = () => {
    if (isCustom && videoSrc.startsWith('blob:')) {
      URL.revokeObjectURL(videoSrc);
    }
    setVideoSrc(DEFAULT_VIDEO);
    setIsCustom(false);
    setUseFallback(false);
    removeVideoFromDB();
  };

  const handleVideoError = () => {
    // Si la vidéo par défaut échoue, on bascule discrètement sur le fallback
    if (!isCustom && !useFallback) {
      console.warn(`Tentative de chargement de secours car ${DEFAULT_VIDEO} est illisible.`);
      setVideoSrc(FALLBACK_VIDEO_URL);
      setUseFallback(true);
    }
  };

  return (
    <section className="relative pt-8 pb-20 px-6 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <Sparkles className="text-[#ff007b] w-5 h-5" />
            <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-white/60">System Monitor</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-black uppercase tracking-tighter-custom mb-4"
          >
            COMMAND <span className="text-[#ff007b]">CENTER</span>
          </motion.h2>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative group rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(255,0,123,0.15)] bg-[#05051a]"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="video/*" 
            className="hidden" 
          />

          <div className="aspect-video relative bg-black flex items-center justify-center">
            {isLoading ? (
              <RefreshCw className="w-10 h-10 text-[#ff007b] animate-spin" />
            ) : (
              <video
                ref={videoRef}
                src={videoSrc}
                autoPlay
                muted={isMuted}
                loop
                playsInline
                onError={handleVideoError}
                className="w-full h-full object-cover z-0"
              />
            )}

            {/* Overlay Glitch/Tactical */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] z-10" />

            {/* Dynamic Labels */}
            <div className="absolute top-6 left-6 z-20 flex flex-col gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-black/70 backdrop-blur-xl border border-white/10 rounded-full">
                <div className={`w-2 h-2 rounded-full ${isCustom ? 'bg-blue-400' : 'bg-[#ff007b]'} animate-pulse`} />
                <span className="text-[10px] font-bold tracking-widest uppercase text-white">
                  {isCustom ? 'LOCAL OVERRIDE' : (useFallback ? 'CDN BACKUP' : 'SYSTEM ROOT FEED')}
                </span>
              </div>
            </div>

            {/* Interface Controls */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-8 z-30">
              <div className="flex flex-col md:flex-row items-center justify-between w-full gap-6">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={togglePlay} 
                    className="w-16 h-16 rounded-full bg-[#ff007b] flex items-center justify-center text-white hover:bg-[#ff007b]/80 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#ff007b]/30"
                  >
                    {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
                  </button>
                  <button 
                    onClick={() => setIsMuted(!isMuted)} 
                    className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <div className="w-px h-8 bg-white/10 mx-2" />
                  <button 
                    onClick={() => fileInputRef.current?.click()} 
                    className="flex items-center gap-2 px-6 h-12 rounded-full bg-white text-black font-black text-xs uppercase tracking-[0.1em] hover:bg-gray-200 transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Personal Video</span>
                  </button>
                  {isCustom && (
                    <button 
                      onClick={resetVideo} 
                      className="w-12 h-12 rounded-full bg-[#ff007b]/20 border border-[#ff007b]/50 flex items-center justify-center text-[#ff007b] hover:bg-[#ff007b] hover:text-white transition-all"
                      title="Restore Root Video"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                  )}
                </div>
                
                <div className="text-right hidden md:block">
                   <div className="flex items-center justify-end gap-2 mb-1">
                      <div className="w-2 h-2 bg-[#ff007b] rounded-full animate-ping" />
                      <p className="text-white font-black text-lg tracking-tighter uppercase leading-none">STREAMING ROOT_ASSET</p>
                   </div>
                   <p className="text-white/30 text-[9px] font-mono tracking-widest uppercase">MIME: VIDEO/MP4 | SRC: {isCustom ? 'INDEXED_DB' : (useFallback ? 'EXTERNAL_CDN' : 'LOCAL_ROOT')}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-8 flex flex-col items-center gap-2"
        >
          <p className="text-white/20 text-[9px] font-mono uppercase tracking-[0.3em] text-center max-w-lg">
            Profiler uses persistent browser storage to keep your custom videos active across sessions. 
            Root video detection: <span className={useFallback ? "text-orange-500/50" : "text-green-500/50"}>
              {useFallback ? "FAILED (Using backup)" : "VERIFIED"}
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoShowcase;