import React from 'react';
import Link from 'next/link';

interface AlphabetFilterProps {
  currentLetter?: string;
  baseUrl: string;
  searchParams?: Record<string, string | number | undefined>;
  className?: string;
}

const ALPHABET = ['Semua', '#', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

export function AlphabetFilter({
  currentLetter = 'Semua',
  baseUrl,
  searchParams = {},
  className = '',
}: AlphabetFilterProps) {
  const createLetterUrl = (letter: string) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v !== undefined && v !== '' && k !== 'letter' && k !== 'page') {
        params.set(k, String(v));
      }
    });
    if (letter !== 'Semua') {
      params.set('letter', letter);
    }
    const q = params.toString();
    return q ? `${baseUrl}?${q}` : baseUrl;
  };

  return (
    <div className={`flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none ${className}`}>
      <span className="text-[11px] font-mono font-bold uppercase text-content-muted mr-1 flex-shrink-0">
        Indeks A–Z:
      </span>
      {ALPHABET.map((char) => {
        const isActive =
          (currentLetter === 'Semua' && char === 'Semua') ||
          currentLetter?.toUpperCase() === char.toUpperCase();

        return (
          <Link
            key={char}
            href={createLetterUrl(char)}
            className={`min-w-[28px] h-7 px-2 rounded-md flex items-center justify-center text-xs font-mono transition-all flex-shrink-0 ${
              isActive
                ? 'bg-amber text-black font-bold shadow-sm shadow-amber/20'
                : 'bg-surface-card border border-border-subtle text-content-secondary hover:text-amber hover:border-amber/40 hover:bg-surface-secondary'
            }`}
          >
            {char}
          </Link>
        );
      })}
    </div>
  );
}
