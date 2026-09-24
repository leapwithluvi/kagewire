import React from 'react';

export default function ReaderLoading() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center pb-24 animate-pulse">
      {/* Top Header skeleton */}
      <div className="w-full bg-surface-main/95 border-b border-border-subtle px-4 py-3 flex items-center justify-between">
        <div className="h-5 w-48 rounded bg-surface-secondary/80" />
        <div className="h-6 w-24 rounded bg-surface-secondary/60" />
      </div>

      {/* Pages placeholder */}
      <div className="w-full max-w-3xl flex flex-col items-center gap-4 mt-6 px-4">
        <div className="w-full aspect-[2/3] rounded bg-surface-secondary/70 border border-border-subtle flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-amber/40 border-t-amber animate-spin" />
        </div>
        <div className="w-full aspect-[2/3] rounded bg-surface-secondary/50 border border-border-subtle" />
      </div>
    </div>
  );
}
