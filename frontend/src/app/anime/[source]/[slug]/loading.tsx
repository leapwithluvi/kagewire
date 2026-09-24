import React from 'react';

export default function AnimeDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="h-4 w-32 rounded bg-surface-secondary/70 mb-6" />

      {/* Hero header skeleton */}
      <div className="flex flex-col md:flex-row gap-6 mb-10">
        <div className="w-48 sm:w-60 aspect-[3/4] rounded-md bg-surface-secondary/80 flex-shrink-0" />
        <div className="flex-1 flex flex-col gap-3">
          <div className="h-4 w-28 rounded bg-surface-secondary/60" />
          <div className="h-8 w-3/4 rounded bg-surface-secondary/80" />
          <div className="flex gap-2 my-2">
            <div className="h-6 w-16 rounded bg-surface-secondary/50" />
            <div className="h-6 w-16 rounded bg-surface-secondary/50" />
            <div className="h-6 w-16 rounded bg-surface-secondary/50" />
          </div>
          <div className="h-20 w-full rounded bg-surface-secondary/40 mt-2" />
        </div>
      </div>

      {/* Episode list skeleton */}
      <div className="h-6 w-40 rounded bg-surface-secondary/70 mb-4" />
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-10 rounded bg-surface-secondary/60 border border-border-subtle" />
        ))}
      </div>
    </div>
  );
}
