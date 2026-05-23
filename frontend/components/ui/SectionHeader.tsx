import React from "react";

interface Props {
  title: string;
  actionText?: string;
  actionHref?: string;
}

export function SectionHeader({ title, actionText, actionHref = "#" }: Props) {
  return (
    <div className="mb-7 relative pb-4">
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-primary-border/20 rounded-full" />
      <div 
        className="absolute bottom-0 left-0 h-[3px] bg-brand-primary rounded-full transition-all duration-500 group-hover:w-32" 
        style={{
          width: "80px",
          borderRadius: "50% 20% 20% 50% / 50%",
        }}
      />
      
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-bold text-charcoal-ink tracking-tight flex items-center gap-2">
          {title}
          <svg 
            className="h-5 w-5 text-brand-primary/50 shrink-0 transform -rotate-12 animate-pulse" 
            fill="currentColor" 
            viewBox="0 0 24 24"
            style={{ animationDuration: "3s" }}
          >
            <path d="M17,8C8,8,4,16,4,16s8-1,11-5s2-7,2-7S17,6,17,8z" />
          </svg>
        </h2>
        
        {actionText && (
          <a
            href={actionHref}
            className="flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-widest text-brand-primary transition-all duration-300 hover:opacity-80 hover:translate-x-0.5"
          >
            {actionText}
            <svg className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
