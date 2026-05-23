"use client";

import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-canvas-background text-charcoal-ink font-serif flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      <div className="z-10 bg-surface-slate border border-brand-primary-border rounded-4xl p-8 md:p-12 max-w-lg w-full text-center shadow-lg shadow-amber-900/2 relative flex flex-col items-center gap-6">
        
        <div className="relative h-44 w-44 flex items-center justify-center">
          <div className="absolute inset-0 bg-amber-500/5 rounded-full blur-xl animate-pulse"></div>
          
          <img 
            src="/kage-chan.svg" 
            alt="Kage-chan Mascot" 
            className="w-36 h-36 drop-shadow-md z-10 select-none pointer-events-none" 
          />

          <div className="absolute top-2 left-6 animate-[bounce_3s_infinite_ease-in-out_delay-200]">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M12 2 L14 8 L20 6 L17 12 L22 15 L15 16 L16 22 L12 18 L8 22 L9 16 L2 15 L7 12 L4 6 L10 8 Z" fill="#ffb3ba" />
            </svg>
          </div>
          <div className="absolute top-6 right-6 animate-[bounce_4.5s_infinite_ease-in-out_delay-800]">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M12 2 L14 8 L20 6 L17 12 L22 15 L15 16 L16 22 L12 18 L8 22 L9 16 L2 15 L7 12 L4 6 L10 8 Z" fill="#bcf4d4" />
            </svg>
          </div>
          <div className="absolute bottom-6 left-4 animate-[bounce_3.8s_infinite_ease-in-out_delay-500]">
            <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
              <path d="M12 2 L14 8 L20 6 L17 12 L22 15 L15 16 L16 22 L12 18 L8 22 L9 16 L2 15 L7 12 L4 6 L10 8 Z" fill="#ffffba" />
            </svg>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs uppercase tracking-[2.5px] text-brand-primary font-bold">
            CHRONICLE OFFSET 404
          </span>
          <h2 className="font-serif italic font-bold text-4xl text-charcoal-ink tracking-wide leading-none mt-1">
            Lost in the Forest
          </h2>
          <p className="text-sm leading-relaxed text-muted-text font-serif italic max-w-sm mt-3 mx-auto">
            "Like a tiny soot sprite wandering off the cozy woodland lane, the chronicle path you seek has hidden itself among the summer branches."
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full mt-4 justify-center">
          
          <Link
            href="/"
            className="bg-brand-primary text-white font-mono text-xs font-bold uppercase tracking-[1.5px] py-4 px-8 rounded-full hover:bg-brand-primary/95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-brand-primary/20 hover:shadow-brand-primary/30"
          >
            <svg className="h-4 w-4 stroke-[2.5px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Follow Forest Path
          </Link>

          <Link
            href="/auth/login"
            className="bg-surface-slate text-charcoal-ink border border-brand-primary-border font-mono text-xs font-semibold uppercase tracking-[1.2px] py-4 px-8 rounded-full hover:bg-brand-primary hover:text-white hover:border-transparent transition-all duration-200 flex items-center justify-center cursor-pointer"
          >
            Enter Portal
          </Link>
        </div>

      </div>

      <div className="mt-8 text-center text-muted-gray font-mono text-[9px] uppercase tracking-[1.5px] z-10">
        KageWire Chronicles • Hand-painted with Cozy Nostalgia
      </div>


    </div>
  );
}
