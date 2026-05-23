"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passcodes do not match!");
      return;
    }
    console.log("Creating KageWire account for:", { username, email, agreeTerms });
  };

  const handleGoogleLogin = () => {
    console.log("Initiating Google sign-up flow for Ghibli chronicles...");
  };

  return (
    <div className="min-h-screen w-full bg-canvas-background text-charcoal-ink font-serif flex items-stretch select-none overflow-x-hidden relative">
      
      {/* Back Button to Hero Page */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 lg:top-10 lg:left-10 z-50 flex items-center justify-center sm:justify-start gap-2 h-10 px-3.5 sm:px-4 sm:py-2 rounded-full border border-brand-primary-border bg-surface-slate hover:bg-brand-primary hover:text-white transition-all duration-200 shadow-sm text-charcoal-ink font-mono text-[10px] lg:text-xs uppercase tracking-wider"
        title="Back to home"
      >
        <svg className="h-4.5 w-4.5 stroke-[2.5px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="hidden sm:inline">Back to home</span>
      </Link>

      <div className="hidden lg:flex lg:w-[60%] bg-surface-slate border-r border-image-frame flex-col justify-between p-16 relative overflow-hidden">
        
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand-primary/10 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-100 h-100 rounded-full bg-brand-primary/5 blur-3xl pointer-events-none"></div>

        <div className="z-10 my-auto flex flex-col items-start gap-6 select-none max-w-xl">
          <span className="font-mono text-sm uppercase tracking-[2px] font-semibold text-brand-primary">
            COZY ANIME NEWS & EXPLORATION
          </span>
          <h1 className="font-serif italic font-bold tracking-wide text-5xl md:text-7xl leading-tight text-charcoal-ink">
            KageWire<span className="text-brand-primary font-normal">.</span>
            <br />
            <span className="text-brand-primary">Chronicles</span>
          </h1>
          <p className="text-base leading-relaxed text-muted-text font-serif italic mt-2">
            &quot;Your warmest gateway to hand-painted anime reviews, breaking announcements, and seasonal catalog updates. Explore the stories that shape our worlds.&quot;
          </p>

          <div className="w-full mt-12 border-t border-dashed border-image-frame pt-8">
            <span className="font-mono text-xs uppercase tracking-[1.8px] text-brand-primary block mb-6 font-semibold">
              LATEST CHRONICLES & PRESS
            </span>
            
            <ul className="relative pl-6 border-l border-dashed border-timeline-rule space-y-8">
              
              <li className="relative">
                <span className="absolute -left-1.75 top-1.5 h-3.5 w-3.5 rounded-full bg-brand-primary border-2 border-[#fcf9f2] shadow-sm animate-pulse"></span>
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
                <span className="absolute -left-1.75 top-1.5 h-3.5 w-3.5 rounded-full bg-brand-primary border-2 border-[#fcf9f2] shadow-sm"></span>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[1.1px] text-muted-gray">Morning Breeze</span>
                    <span className="px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary font-mono text-[9px] font-bold uppercase tracking-[0.72px]">JOURNAL</span>
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

      <div className="w-full lg:w-[40%] flex flex-col justify-between p-6 md:p-8 lg:p-10 bg-canvas-background lg:h-screen lg:overflow-y-auto">
        
        <div className="lg:hidden flex items-center justify-between mb-8 pl-12">
          <h2 className="font-serif font-bold italic tracking-wide text-xl text-charcoal-ink">
            KageWire<span className="text-brand-primary">.</span>
          </h2>
          <span className="font-mono text-[9px] uppercase tracking-[1.5px] text-muted-gray">
            DIARY REGISTRATION
          </span>
        </div>

        <div className="hidden lg:block"></div>

        <div className="my-auto w-full max-w-md mx-auto pt-10 pb-6">
          
          <div className="bg-surface-slate p-6 md:p-8 rounded-4xl border border-brand-primary-border shadow-md shadow-amber-900/2 relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 z-20">
              <div className="absolute inset-0 bg-amber-500/5 rounded-full blur-md animate-pulse max-w-20 mx-auto"></div>
              <Image 
                src="/kage-chan.svg" 
                alt="Kage-chan Mascot" 
                width={80}
                height={80}
                className="w-20 h-20 drop-shadow-md select-none pointer-events-none" 
              />
            </div>

            <div className="flex flex-col gap-1.5 mb-5 mt-2">
              <span className="font-mono text-xs uppercase tracking-[1.9px] text-brand-primary font-bold">
                JOIN THE CHRONICLES
              </span>
              <h2 className="font-serif text-3xl font-bold tracking-wide text-charcoal-ink leading-none">
                Create Account
              </h2>
              <p className="text-xs text-muted-text font-serif italic mt-1">
                Register a new reader profile to start tracking seasonal news.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[11px] uppercase tracking-[1.5px] text-charcoal-ink font-semibold">
                  WANDERER DISPLAY NAME
                </label>
                <input
                  type="text"
                  required
                  pattern="^[a-zA-Z0-9_ ]{3,20}$"
                  title="Display name must be 3-20 characters, containing only letters, numbers, spaces or underscores."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Totoro"
                  className="w-full bg-canvas-background border border-brand-primary-border rounded-2xl px-4 py-2.5 text-sm font-sans text-charcoal-ink placeholder-[#b1a998] focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:shadow-md focus:shadow-amber-900/3 transition-all duration-200"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[11px] uppercase tracking-[1.5px] text-charcoal-ink font-semibold">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="wanderer@forest.com"
                  className="w-full bg-canvas-background border border-brand-primary-border rounded-2xl px-4 py-2.5 text-sm font-sans text-charcoal-ink placeholder-[#b1a998] focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:shadow-md focus:shadow-amber-900/3 transition-all duration-200"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[11px] uppercase tracking-[1.5px] text-charcoal-ink font-semibold">
                  CREATE PASSCODE
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-canvas-background border border-brand-primary-border rounded-2xl px-4 py-2.5 text-sm font-sans text-charcoal-ink placeholder-[#b1a998] focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:shadow-md focus:shadow-amber-900/3 transition-all duration-200"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[11px] uppercase tracking-[1.5px] text-charcoal-ink font-semibold">
                  CONFIRM PASSCODE
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-canvas-background border border-brand-primary-border rounded-2xl px-4 py-2.5 text-sm font-sans text-charcoal-ink placeholder-[#b1a998] focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:shadow-md focus:shadow-amber-900/3 transition-all duration-200"
                />
              </div>

              <div className="flex items-center justify-between mt-0.5">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    required
                    className="sr-only"
                  />
                  <span className={`h-4.5 w-4.5 rounded-lg border transition-all duration-150 flex items-center justify-center ${agreeTerms ? "border-brand-primary bg-brand-primary" : "border-brand-primary-border bg-canvas-background group-hover:border-brand-primary"}`}>
                    {agreeTerms && (
                      <svg className="h-3 w-3 text-white stroke-[3.5px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[1px] text-muted-gray group-hover:text-charcoal-ink transition-colors duration-150 font-semibold">
                    I AGREE TO CHRONICLE MY ANIME PATH HONESTLY
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-brand-primary text-white font-mono text-xs font-bold uppercase tracking-[1.5px] py-3.5 px-6 rounded-full hover:bg-brand-primary/95 hover:scale-[1.02] active:scale-[0.98] border border-transparent transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-brand-primary/20"
              >
                CREATE ACCOUNT
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div className="relative flex py-1 items-center">
                <div className="grow border-t border-dashed border-brand-primary-border/30"></div>
                <span className="shrink mx-4 font-serif text-[10px] text-muted-gray italic">or wander with</span>
                <div className="grow border-t border-dashed border-brand-primary-border/30"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-canvas-background hover:bg-[#faf4e5] border border-brand-primary-border text-charcoal-ink font-mono text-[11px] font-bold uppercase tracking-[1.5px] py-3 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer hover:scale-[1.02] active:scale-[0.98] shadow-sm shadow-amber-900/2"
              >
                <svg className="h-4.5 w-4.5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M5.266 9.765A7.077 7.077 0 0112 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.33 0 3.266 2.682 1.173 6.627l4.093 3.138z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M1.173 6.627L5.266 9.765a7.077 7.077 0 010 4.47l-4.093 3.138A11.968 11.968 0 010 12c0-1.927.427-3.755 1.173-5.373z"
                  />
                  <path
                    fill="#4285F4"
                    d="M12 24c3.245 0 5.973-1.082 7.964-2.945l-3.909-3.027c-1.118.755-2.545 1.209-4.055 1.209-3.118 0-5.755-2.109-6.7-4.945L1.209 17.427A11.972 11.972 0 0012 24z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 12c0-.855-.082-1.682-.227-2.482H12v4.709h6.736A5.768 5.768 0 0116.2 18.027l3.909 3.027C22.4 19.145 24 15.827 24 12z"
                  />
                </svg>
                CONTINUE WITH GOOGLE
              </button>
            </form>
          </div>

          <div className="mt-6 text-center pt-2 flex flex-col gap-2">
            <span className="font-serif text-xs text-muted-text italic">
              Already have a KageWire account?
            </span>
            <Link
              href="/auth/login"
              className="w-full bg-surface-slate text-charcoal-ink border border-brand-primary-border font-mono text-xs uppercase tracking-[1.2px] py-3 px-6 rounded-full hover:bg-brand-primary hover:text-white hover:border-transparent transition-all duration-180 flex items-center justify-center cursor-pointer"
            >
              SIGN IN TO PORTAL
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center lg:text-left text-muted-gray font-mono text-[9px] uppercase tracking-[1.1px]">
          KageWire Chronicles is a premium anime news, discovery, and watchlist platform. Restored with nostalgia.
        </div>
      </div>

    </div>
  );
}
