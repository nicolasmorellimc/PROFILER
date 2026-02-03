/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useState, ChangeEvent, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, Upload, RotateCcw, Sparkles, RefreshCw, AlertCircle, ShieldCheck } from 'lucide-react';

const DB_NAME = 'ProfilerVideoDB';
const STORE_NAME = 'videos';
const VIDEO_KEY = 'customVideo';

/** 
 * Vidéo de secours "Tech" si videochef.mp4 est manquant. 
 * On utilise une boucle abstraite de haute qualité pour rester dans l'univers Profiler.
 */
const FALLBACK_VIDEO_URL = "https://assets.mixkit.co/videos/preview/mixkit-futuristic-technology-background-with-lines-and-dots-9104-large.mp4";

const VideoShowcase: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // On utilise le chemin relatif direct. 
  const DEFAULT_VIDEO = "videochef.mp4"; 
  
  const [videoSrc, setVideoSrc] = useState<string>(DEFAULT_VIDEO);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [autoplayFailed, setAutoplayFailed] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Initialisation et chargement depuis IndexedDB (Persistence de l'upload utilisateur)
  useEffect(() => {
    const initDB = () => {
      try {
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

  // Gestion de la lecture automatique
  useEffect(() => {
    const video = videoRef.current;
    if (!video || isLoading) return;

    const handlePlay = async () => {
      video.muted = true;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      
      try {
        await video.play();
        setIsPlaying(true);
        setAutoplayFailed(false);
        setLoadError(null);
      } catch (err: any) {
        if (err.name !== 'NotAllowedError') {
           console.warn("Playback hint:", err.message);
        }
        setAutoplayFailed(true);
        setIsPlaying(false);
      }
    };

    handlePlay();
  }, [videoSrc, isLoading]);

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      try {
        await video.play();
        setIsPlaying(true);
        setAutoplayFailed(false);
      } catch (e: any) {
        console.error("Manual play error:", e.message);
      }
    }
  };

  const handleVideoError = () => {
    // Si la vidéo locale (videochef.mp4) échoue, on bascule sur le fallback tech
    if (!isCustom && !useFallback) {
      console.warn("Local tactical feed not found. Routing to encrypted backup stream.");
      setUseFallback(true);
      setVideoSrc(FALLBACK_VIDEO_URL);
    } else if (isCustom) {
      setLoadError("Fichier utilisateur corrompu ou illisible.");
    }
  };

  const resetToDefault = () => {
    if (isCustom && videoSrc.startsWith('blob:')) {
      URL.revokeObjectURL(videoSrc);
    }
    setVideoSrc(DEFAULT_VIDEO);
    setIsCustom(false);
    setUseFallback(false);
    setLoadError(null);
    setAutoplayFailed(false);

    const request = indexedDB.open(DB_NAME, 1);
    request.onsuccess = (event: any) => {
      const db = event.target.result;
      db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).delete(VIDEO_KEY);
    };
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <section className="relative pt-8 pb-20 px-4 md:px-6 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="flex items-center justify-center gap-2 mb-4">
            <ShieldCheck className="text-[#ff007b] w-4 h-4" />
            <span className="text-[9px] font-mono tracking-[0.4em] uppercase text-white/50">Tactical Feed Processor</span>
          </motion.div>
          <motion.h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter-custom">
            COMMAND <span className="text-[#ff007b]">CENTER</span>
          </motion.h2>
        </div>

        <motion.div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#05051a]">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const url = URL.createObjectURL(file);
                setVideoSrc(url);
                setIsCustom(true);
                setUseFallback(false);
                setLoadError(null);
                const request = indexedDB.open(DB_NAME, 1);
                request.onsuccess = (event: any) => {
                  const db = event.target.result;
                  db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).put(file, VIDEO_KEY);
                };
              }
            }} 
            accept="video/*" 
            className="hidden" 
          />

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
                autoPlay
                loop
                preload="auto"
                className="w-full h-full object-cover"
                onPlay={() => { setIsPlaying(true); setAutoplayFailed(false); }}
                onError={handleVideoError}
              />
            )}

            {loadError && (
              <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-8 text-center">
                <AlertCircle className="w-12 h-12 text-[#ff007b] mb-4" />
                <h3 className="text-white font-black uppercase tracking-tighter mb-2">Feed Interrupted</h3>
                <p className="text-white/40 text-xs mb-6">{loadError}</p>
                <button onClick={resetToDefault} className="px-6 py-2 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-full">Restore System Root</button>
              </div>
            )}

            {autoplayFailed && !loadError && (
              <div onClick={togglePlay} className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center cursor-pointer">
                <div className="w-20 h-20 rounded-full bg-[#ff007b] flex items-center justify-center mb-4 shadow-2xl">
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </div>
                <p className="text-white font-black uppercase tracking-widest text-xs">Tap to sync feed</p>
              </div>
            )}

            {/* Labels de statut contextuels */}
            <div className="absolute top-4 left-4 z-20 flex gap-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-black/80 backdrop-blur-md border border-white/10 rounded-full">
                <div className={`w-1.5 h-1.5 rounded-full ${isCustom ? 'bg-blue-500' : 'bg-[#ff007b]'} animate-pulse`} />
                <span className="text-[8px] md:text-[10px] font-bold tracking-widest uppercase text-white">
                  {isCustom ? 'OVERRIDE_ACTIVE' : (useFallback ? 'BACKUP_STREAM' : 'SYSTEM_ROOT')}
                </span>
              </div>
            </div>

            {/* Command Overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-30 opacity-0 hover:opacity-100 transition-opacity duration-300">
              <div className="flex gap-2">
                <button onClick={togglePlay} className="bg-black/50 backdrop-blur-md p-2 rounded-full border border-white/10 text-white">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button onClick={() => { if(videoRef.current){ videoRef.current.muted = !isMuted; setIsMuted(!isMuted); } }} className="bg-black/50 backdrop-blur-md p-2 rounded-full border border-white/10 text-white">
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex gap-2">
                {isCustom && (
                  <button onClick={resetToDefault} className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                )}
                <button onClick={triggerUpload} className="bg-[#ff007b] px-4 py-2 rounded-full text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-[#ff007b]/20">
                  <Upload className="w-3 h-3" /> {isCustom ? 'Replace' : 'Upload Tactical Feed'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="mt-6 flex flex-col items-center gap-2">
          <p className="text-white/20 text-[8px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-center">
            Encryption Status: <span className="text-green-500/50">Active</span> | 
            Feed Protocol: <span className="text-white/40">{useFallback ? 'REMOTE_CDN' : 'LOCAL_STORAGE'}</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;