import React from 'react';

export default function RootLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="h-64 sm:h-80 w-full rounded-md bg-surface-secondary/70 border border-border-subtle mb-10" />

      {/* Section Title Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-6 w-48 rounded bg-surface-secondary/80" />
        <div className="h-4 w-24 rounded bg-surface-secondary/50" />
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="aspect-[3/4] w-full rounded-md bg-surface-secondary/70 border border-border-subtle" />
            <div className="h-4 w-4/5 rounded bg-surface-secondary/80 mt-1" />
            <div className="h-3 w-1/2 rounded bg-surface-secondary/50" />
          </div>
        ))}
      </div>
    </div>
  );
}
