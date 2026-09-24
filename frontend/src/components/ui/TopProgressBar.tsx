'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Complete progress on route change
  useEffect(() => {
    setProgress(100);
    const timeout = setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 250);
    return () => clearTimeout(timeout);
  }, [pathname, searchParams]);

  // Listen to internal link clicks to trigger progress bar immediately
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      const targetAttr = target.getAttribute('target');

      // Only trigger for same-window internal navigation
      if (
        href &&
        href.startsWith('/') &&
        !href.startsWith('//') &&
        !targetAttr &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey &&
        !e.altKey
      ) {
        // If clicking current page with same hash/pathname, ignore
        const currentUrl = window.location.pathname + window.location.search;
        if (href === currentUrl) return;

        setLoading(true);
        setProgress(30);

        const timer1 = setTimeout(() => setProgress(65), 150);
        const timer2 = setTimeout(() => setProgress(85), 400);

        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
        };
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  if (!loading && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[9999] h-[2.5px] pointer-events-none bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-amber via-amber-light to-amber shadow-[0_0_12px_rgba(245,158,11,0.8)] transition-all ease-out duration-200"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
          transitionDuration: progress === 100 ? '200ms' : '300ms',
        }}
      />
    </div>
  );
}
