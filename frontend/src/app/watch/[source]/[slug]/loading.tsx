import React from 'react';

export default function WatchLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-pulse">
      {/* Back button skeleton */}
      <div className="h-4 w-36 rounded bg-surface-secondary/70 mb-4" />

      {/* Header skeleton */}
      <div className="mb-6 border-b border-border-subtle pb-4">
        <div className="h-3 w-44 rounded bg-surface-secondary/50 mb-2" />
        <div className="h-8 w-2/3 sm:w-1/2 rounded bg-surface-secondary/80" />
      </div>

      {/* Video Player Skeleton */}
      <div className="w-full max-w-5xl mx-auto">
        <div className="aspect-video w-full rounded-md bg-surface-secondary/80 border border-border-subtle flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-amber/40 border-t-amber animate-spin" />
        </div>
        <div className="mt-4 h-12 w-full rounded-md bg-surface-secondary/60 border border-border-subtle" />
      </div>

      {/* Download section skeleton */}
      <div className="max-w-5xl mx-auto mt-8">
        <div className="h-28 w-full rounded-md bg-surface-secondary/40 border border-border-subtle" />
      </div>
    </div>
  );
}
