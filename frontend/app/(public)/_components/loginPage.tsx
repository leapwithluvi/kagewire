"use client";

import React, { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Secure access requested for Ghibli timeline:", { email, password, rememberMe });
  };

  return (
    <div className="min-h-screen w-full bg-canvas-background text-charcoal-ink font-serif flex items-stretch select-none overflow-x-hidden">
      
      <div className="hidden lg:flex lg:w-[60%] bg-[#fcf9f2] border-r border-image-frame flex-col justify-between p-16 relative overflow-hidden">
        
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand-primary/10 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-100 h-100 rounded-full bg-brand-secondary/5 blur-3xl pointer-events-none"></div>

        <div className="z-10 my-auto flex flex-col items-start gap-6 select-none max-w-xl">
          <span className="font-mono text-sm uppercase tracking-[2px] font-semibold text-brand-secondary">
            COZY ANIME NEWS & EXPLORATION
          </span>
          <h1 className="font-serif italic font-bold tracking-wide text-5xl md:text-7xl leading-tight text-charcoal-ink">
            KageWire<span className="text-brand-primary font-normal">.</span>
            <br />
            <span className="text-brand-secondary">Chronicles</span>
          </h1>
          <p className="text-base leading-relaxed text-muted-text font-serif italic mt-2">
            "Your warmest gateway to hand-painted anime reviews, breaking announcements, and seasonal catalog updates. Explore the stories that shape our worlds."
          </p>

          <div className="w-full mt-12 border-t border-dashed border-image-frame pt-8">
            <span className="font-mono text-xs uppercase tracking-[1.8px] text-brand-secondary block mb-6 font-semibold">
              LATEST CHRONICLES & PRESS
            </span>
            
            <ul className="relative pl-6 border-l border-dashed border-timeline-rule space-y-8">
              
              <li className="relative">
                <span className="absolute -left-7.5 top-1.5 h-3.5 w-3.5 rounded-full bg-brand-secondary border-2 border-[#fcf9f2]"></span>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[1.1px] text-muted-gray">Summer Afternoon</span>
                    <span className="px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary font-mono text-[9px] font-bold uppercase tracking-[0.72px]">ANNOUNCEMENT</span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-charcoal-ink hover:text-brand-primary transition-colors duration-150 cursor-pointer">
                    A Cozy Studio Ghibli Tribute Event Confirmed for Autumn
                  </h4>
                </div>
              </li>

              <li className="relative">
                <span className="absolute -left-7.5 top-1.5 h-3.5 w-3.5 rounded-full bg-brand-primary border-2 border-[#fcf9f2]"></span>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[1.1px] text-muted-gray">Morning Breeze</span>
                    <span className="px-2 py-0.5 rounded-full bg-brand-secondary/10 text-brand-secondary font-mono text-[9px] font-bold uppercase tracking-[0.72px]">JOURNAL</span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-charcoal-ink hover:text-brand-primary transition-colors duration-150 cursor-pointer">
                    Tracking the Most Scenic Hand-Painted Backgrounds in Seasonal Anime
                  </h4>
                </div>
              </li>

            </ul>
          </div>
        </div>

        <div className="z-10 flex items-center justify-between text-muted-gray font-mono text-[10px] uppercase tracking-[1.5px]">
          <span>© 2026 KAGEWIRE</span>
          <a href="https://github.com/leapwithluvi/kagewire" target="_blank" rel="noreferrer" className="hover:text-brand-primary transition-colors duration-150">
            GITHUB SOURCE
          </a>
        </div>
      </div>

      <div className="w-full lg:w-[40%] flex flex-col justify-between p-8 md:p-16 bg-canvas-background">
        
        <div className="lg:hidden flex items-center justify-between mb-12">
          <h2 className="font-serif font-bold italic tracking-wide text-2xl text-charcoal-ink">
            KageWire<span className="text-brand-primary">.</span>
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-[1.8px] text-muted-gray">
            DIARY ACCESS
          </span>
        </div>

        <div className="hidden lg:block"></div>

        <div className="my-auto w-full max-w-md mx-auto pt-10">
          
          <div className="bg-surface-slate p-8 md:p-10 rounded-4xl border border-brand-primary-border shadow-md shadow-amber-900/2 relative">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 z-20">
              <div className="absolute inset-0 bg-amber-500/5 rounded-full blur-lg animate-pulse max-w-24 mx-auto"></div>
              <img 
                src="/kage-chan.svg" 
                alt="Kage-chan Mascot" 
                className="w-24 h-24 drop-shadow-md select-none pointer-events-none" 
              />
            </div>

            <div className="flex flex-col gap-2 mb-8 mt-2">
              <span className="font-mono text-xs uppercase tracking-[1.9px] text-brand-secondary font-bold">
                WANDERER PORTAL
              </span>
              <h2 className="font-serif text-3xl font-bold tracking-wide text-charcoal-ink leading-none">
                Enter KageWire
              </h2>
              <p className="text-xs text-muted-text font-serif italic mt-1">
                Sign in to customize your watchlist, read reviews, and track news.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[11px] uppercase tracking-[1.5px] text-charcoal-ink font-semibold">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="wanderer@forest.com"
                  className="w-full bg-canvas-background border border-brand-primary-border rounded-2xl px-4 py-3 text-sm font-serif text-charcoal-ink placeholder-[#b1a998] focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all duration-150"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="font-mono text-[11px] uppercase tracking-[1.5px] text-charcoal-ink font-semibold">
                    YOUR PASSCODE
                  </label>
                  <a
                    href="#forgot"
                    className="font-mono text-[10px] uppercase tracking-[1.1px] text-muted-gray hover:text-brand-primary transition-colors duration-150"
                  >
                    FORGOT PASSCODE?
                  </a>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-canvas-background border border-brand-primary-border rounded-2xl px-4 py-3 text-sm font-serif text-charcoal-ink placeholder-[#b1a998] focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all duration-150"
                />
              </div>

              <div className="flex items-center justify-between mt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <span className={`h-4.5 w-4.5 rounded-lg border transition-all duration-150 flex items-center justify-center ${rememberMe ? "border-brand-secondary bg-brand-secondary" : "border-brand-primary-border bg-canvas-background group-hover:border-brand-secondary"}`}>
                    {rememberMe && (
                      <svg className="h-3 w-3 text-white stroke-[3.5px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[1.2px] text-muted-gray group-hover:text-charcoal-ink transition-colors duration-150 font-semibold">
                    KEEP SECURED SESSION
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-brand-primary text-white font-mono text-xs font-bold uppercase tracking-[1.5px] py-4 px-6 rounded-full hover:bg-brand-secondary border border-transparent transition-all duration-180 flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-brand-primary/20"
              >
                ENTER PORTAL
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </form>
          </div>

          <div className="mt-8 text-center pt-2 flex flex-col gap-3">
            <span className="font-serif text-xs text-muted-text italic">
              New to KageWire Chronicles?
            </span>
            <a
              href="/auth/register"
              className="w-full bg-surface-slate text-charcoal-ink border border-brand-primary-border font-mono text-xs uppercase tracking-[1.2px] py-3.5 px-6 rounded-full hover:bg-brand-primary hover:text-white hover:border-transparent transition-all duration-180 flex items-center justify-center cursor-pointer"
            >
              CREATE AN ACCOUNT
            </a>
          </div>
        </div>

        <div className="mt-12 text-center lg:text-left text-muted-gray font-mono text-[9px] uppercase tracking-[1.1px]">
          KageWire Chronicles is a premium anime news, discovery, and watchlist platform. Restored with nostalgia.
        </div>
      </div>

    </div>
  );
}
