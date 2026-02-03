/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useState, ChangeEvent, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, Upload, RotateCcw, Sparkles, RefreshCw } from 'lucide-react';

const DB_NAME = 'ProfilerVideoDB';
const STORE_NAME = 'videos';
const VIDEO_KEY = 'customVideo';

// Utilisation d'un CDN extrêmement stable pour le fallback mobile
const FALLBACK_VIDEO_URL = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

const VideoShowcase: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Chemin absolu pour garantir la résolution sur tous les navigateurs
  const DEFAULT_VIDEO = "/videochef.mp4"; 
  
  const [videoSrc, setVideoSrc] = useState<string>(DEFAULT_VIDEO);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [autoplayFailed, setAutoplayFailed] = useState(false);

  useEffect(() => {
    const loadStoredVideo = () => {
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
      } catch (e) {
        setVideoSrc(DEFAULT_VIDEO);
        setIsLoading(false);
      }
    };

    loadStoredVideo();
  }, []);

  // Gestion de la lecture automatique renforcée
  useEffect(() => {
    const video = videoRef.current;
    if (!video || isLoading) return;

    const playVideo = async () => {
      // Configuration vitale pour Mobile
      video.muted = true;
      video.defaultMuted = true;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      
      try {
        video.load();
        await video.play();
        setIsPlaying(true);
        setAutoplayFailed(false);
      } catch (err: any) {
        console.warn("Autoplay interaction requirement:", err?.message);
        setAutoplayFailed(true);
        setIsPlaying(false);
      }
    };

    playVideo();
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
        console.error("Manual play error:", e?.message);
      }
    }
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (isCustom && videoSrc.startsWith('blob:')) URL.revokeObjectURL(videoSrc);
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setIsCustom(true);
      saveVideoToDB(file);
    }
  };

  const saveVideoToDB = (file: File) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onsuccess = (event: any) => {
      const db = event.target.result;
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      transaction.objectStore(STORE_NAME).put(file, VIDEO_KEY);
    };
  };

  const resetVideo = () => {
    if (isCustom && videoSrc.startsWith('blob:')) URL.revokeObjectURL(videoSrc);
    setVideoSrc(DEFAULT_VIDEO);
    setIsCustom(false);
    setUseFallback(false);
    const request = indexedDB.open(DB_NAME, 1);
    request.onsuccess = (event: any) => {
      const db = event.target.result;
      db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).delete(VIDEO_KEY);
    };
  };

  const handleVideoError = () => {
    // Si la vidéo par défaut échoue, on tente le fallback CDN
    if (!isCustom && !useFallback) {
      console.error("Default video failed. Switching to secure fallback.");
      setUseFallback(true);
      setVideoSrc(FALLBACK_VIDEO_URL);
    } else if (useFallback) {
      console.error("Fallback video also failed. Please check network.");
    }
  };

  return (
    <section className="relative pt-8 pb-20 px-4 md:px-6 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="text-[#ff007b] w-4 h-4" />
            <span className="text-[9px] font-mono tracking-[0.4em] uppercase text-white/50">Cross-Platform Feed</span>
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
                playsInline
                muted
                autoPlay
                loop
                preload="auto"
                className="w-full h-full object-cover"
                onPlay={() => { setIsPlaying(true); setAutoplayFailed(false); }}
                onError={handleVideoError}
              >
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}

            {autoplayFailed && (
              <div 
                onClick={togglePlay}
                className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center cursor-pointer p-6 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-[#ff007b] flex items-center justify-center mb-6 shadow-2xl">
                  <Play className="w-10 h-10 text-white ml-1" />
                </div>
                <h4 className="text-white font-black text-xl uppercase tracking-tighter mb-2">TAP TO INITIALIZE</h4>
                <p className="text-white/60 text-[10px] font-mono uppercase tracking-widest">Secure mobile stream detected</p>
              </div>
            )}

            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)] z-10" />

            <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20">
              <div className="flex items-center gap-2 px-3 py-1 bg-black/90 backdrop-blur-xl border border-white/10 rounded-full">
                <div className={`w-1.5 h-1.5 rounded-full ${isCustom ? 'bg-blue-400' : 'bg-[#ff007b]'} ${isPlaying ? 'animate-pulse' : ''}`} />
                <span className="text-[8px] md:text-[10px] font-bold tracking-widest uppercase text-white">
                  {isCustom ? 'USER_OVERRIDE' : (useFallback ? 'CDN_BACKUP' : 'SYSTEM_ROOT')}
                </span>
              </div>
            </div>

            <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-8 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 z-30">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button onClick={togglePlay} className="w-12 h-12 rounded-full bg-[#ff007b] flex items-center justify-center text-white hover:scale-110 transition-transform">
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                  </button>
                  <button onClick={() => {
                    if (videoRef.current) {
                      const newMute = !isMuted;
                      videoRef.current.muted = newMute;
                      setIsMuted(newMute);
                    }
                  }} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <button onClick={() => fileInputRef.current?.click()} className="px-5 h-10 rounded-full bg-white text-black font-black text-[10px] uppercase tracking-wider">
                    Upload
                  </button>
                  {isCustom && (
                    <button onClick={resetVideo} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white transition-colors">
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="hidden sm:block text-right">
                   <p className="text-white font-black text-xs tracking-widest uppercase">STABLE_FEED_V5</p>
                   <p className="text-white/30 text-[8px] font-mono uppercase tracking-[0.2em]">PROTOCOL: HTTPS | ENCRYPTION: SECURE</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="mt-6 flex flex-col items-center gap-2">
          <p className="text-white/20 text-[8px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-center">
            Mobile Compatibility: <span className="text-white/40">Optimized</span> | 
            CORS Bridge: <span className="text-white/40">Verified</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;