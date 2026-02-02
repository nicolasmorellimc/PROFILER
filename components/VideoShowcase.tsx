/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useState, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, Upload, RotateCcw } from 'lucide-react';

const VideoShowcase: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const DEFAULT_VIDEO = "grok-video-6633a3be-4d2e-4460-aa1c-df334ab9d010.mp4";
  
  const [videoSrc, setVideoSrc] = useState(DEFAULT_VIDEO);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isCustom, setIsCustom] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setIsCustom(true);
      setIsPlaying(true);
      // Reset video state
      if (videoRef.current) {
        videoRef.current.load();
        videoRef.current.play();
      }
    }
  };

  const resetVideo = () => {
    setVideoSrc(DEFAULT_VIDEO);
    setIsCustom(false);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <section className="relative pt-12 pb-20 px-6 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-black uppercase tracking-tighter-custom mb-4"
          >
            YOUR <span className="text-[#ff007b]">COMMAND CENTER</span>
          </motion.h2>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative group rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(255,0,123,0.15)] bg-[#05051a]"
        >
          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="video/*" 
            className="hidden" 
          />

          {/* Video Player */}
          <div className="aspect-video relative">
            <video
              ref={videoRef}
              key={videoSrc}
              autoPlay
              muted={isMuted}
              loop
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={videoSrc} type="video/mp4" />
            </video>

            {/* Overlay Tag */}
            <div className="absolute top-6 left-6 z-20 flex gap-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-black/50 backdrop-blur-md border border-white/20 rounded-full">
                <div className={`w-2 h-2 rounded-full ${isCustom ? 'bg-blue-400' : 'bg-[#ff007b]'} animate-pulse`} />
                <span className="text-[10px] font-bold tracking-widest uppercase text-white">
                  {isCustom ? 'Fichier Client' : 'Live UI Feed'}
                </span>
              </div>
            </div>

            {/* Custom Controls */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 md:p-10">
              <div className="flex flex-col md:flex-row items-center justify-between w-full gap-6">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={togglePlay}
                    title={isPlaying ? "Pause" : "Lecture"}
                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-[#ff007b] transition-all hover:scale-110"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                  </button>
                  <button 
                    onClick={() => setIsMuted(!isMuted)}
                    title={isMuted ? "Activer le son" : "Couper le son"}
                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-[#ff007b] transition-all hover:scale-110"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <div className="w-px h-8 bg-white/10 mx-2" />
                  <button 
                    onClick={triggerFileInput}
                    title="Importer votre vidéo"
                    className="flex items-center gap-2 px-5 h-12 rounded-full bg-[#ff007b] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#d50066] transition-all hover:scale-105 shadow-lg shadow-[#ff007b]/20"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Importer</span>
                  </button>
                  {isCustom && (
                    <button 
                      onClick={resetVideo}
                      title="Revenir à la vidéo par défaut"
                      className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                  )}
                </div>
                
                <div className="text-right">
                   <p className="text-white/60 text-[10px] font-mono tracking-widest uppercase mb-1">Profiler Engine v2.5</p>
                   <p className="text-[#ff007b] text-[9px] font-bold tracking-[0.2em] uppercase">Secure Local Preview Mode</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoShowcase;