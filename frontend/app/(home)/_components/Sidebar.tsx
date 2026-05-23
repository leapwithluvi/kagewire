import { CategoryBadge } from "@/components/ui/CategoryBadge";

const TRENDING_NEWS = [
  "Jujutsu Kaisen Season 3 Finale Breaks Streaming Records",
  "Why Delicious in Dungeon is a Culinary Masterpiece",
  "Top 10 Anime of Spring 2026 — Community Rankings",
  "Oshi no Ko Season 2 Confirmed for Summer Release",
];

const CATEGORIES = ["News", "Reviews", "Features", "Interviews", "Manga", "Gaming", "Events"];

const LATEST_UPDATES = [
  { time: "1 HOUR AGO",   category: "Anime", title: "Demon Slayer Hashira Training Arc Episode 4 Synopsis Revealed" },
  { time: "3 HOURS AGO",  category: "Event", title: "Voice Actor Natsuki Hanae to Attend Anime Expo 2026" },
  { time: "5 HOURS AGO",  category: "Manga", title: "One Piece Chapter 1120 Raw Scans Leaked Online" },
];

export function Sidebar() {
  return (
    <aside className="w-full shrink-0 lg:sticky lg:top-24 lg:self-start lg:w-80 flex flex-col gap-8">

      <div>
        <div className="mb-5 flex items-center justify-between border-b border-[#cfa375]/30 pb-4">
          <h2 className="font-serif text-2xl font-bold text-charcoal-ink">Trending Now</h2>
          <a href="#" className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand-primary hover:opacity-70 transition-opacity">
            See All
          </a>
        </div>
        <div className="flex flex-col gap-5">
          {TRENDING_NEWS.map((title, i) => (
            <div key={i} className="group flex cursor-pointer items-start gap-4">
              <span className="font-serif text-4xl font-bold leading-none text-charcoal-ink opacity-35 dark:text-white dark:opacity-30 transition-colors group-hover:text-brand-primary group-hover:opacity-100 select-none">
                0{i + 1}
              </span>
              <p className="text-sm font-bold leading-snug text-charcoal-ink transition-colors group-hover:text-brand-primary">
                {title}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[32px] border border-[#cfa375]/30 bg-surface-slate shadow-sm"
        style={{
          backgroundImage: `
            radial-gradient(circle at top right, rgba(74, 156, 104, 0.08) 0%, transparent 60%),
            radial-gradient(circle at bottom left, rgba(74, 156, 104, 0.04) 0%, transparent 60%)
          `,
        }}
      >
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, #cfa375 1px, transparent 1px),
              linear-gradient(to bottom, #cfa375 1px, transparent 1px)
            `,
            backgroundSize: "16px 16px",
          }}
        />

        <div className="absolute inset-2 border border-dashed border-[#cfa375]/20 rounded-[inherit] pointer-events-none" />

        <span className="absolute left-4 top-3 font-mono text-[8px] uppercase tracking-[2px] text-muted-gray/60 select-none">
          Cozy Circle
        </span>

        <div className="flex flex-col items-center gap-3 px-6 pb-6 pt-9 text-center relative z-10">
          
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-[#cfa375]/30 bg-white dark:bg-black/30 shadow-sm transition-transform duration-500 hover:scale-105"
            style={{
              borderRadius: "45% 55% 48% 52% / 52% 48% 52% 48%",
            }}
          >
            <div className="absolute inset-1 rounded-full bg-brand-primary/5 filter blur-xs" />
            
            <svg className="h-8 w-8 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
          </div>

          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[1.5px] text-brand-primary">
              KageWire Community
            </p>
            <h4 className="mt-1 font-serif text-base font-bold text-charcoal-ink leading-tight">
              Gabung komunitas anime paling hangat & santai
            </h4>
            <p className="mt-1.5 text-xs text-muted-gray leading-relaxed">
              Diskusikan anime favoritmu, bagikan review buatanmu, dan mengobrol seru secara gratis.
            </p>
          </div>
          
          <a
            href="https://discord.gg"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 w-full rounded-full bg-brand-primary py-2.5 text-center font-mono text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-brand-primary/95 hover:scale-[1.02]"
          >
            Gabung Discord
          </a>
        </div>
      </div>

      <div>
        <h3 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-muted-gray">Browse by Category</h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className="rounded-full border border-[#cfa375]/30 bg-surface-slate px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-text transition-all hover:border-brand-primary hover:bg-brand-primary hover:text-white"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[32px] border border-brand-primary-border bg-surface-slate p-6 shadow-sm relative overflow-hidden"
        style={{
          backgroundImage: `radial-gradient(circle at bottom right, rgba(74, 156, 104, 0.04) 0%, transparent 50%)`,
        }}
      >
        <h3 className="mb-5 font-mono text-xs font-bold uppercase tracking-widest text-brand-primary">
          Latest Updates
        </h3>
        <div className="flex flex-col divide-y divide-[#cfa375]/20">
          {LATEST_UPDATES.map((update, i) => (
            <div key={i} className={`${i > 0 ? "pt-4" : ""} ${i < LATEST_UPDATES.length - 1 ? "pb-4" : ""}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[9px] font-bold tracking-wider text-muted-gray">{update.time}</span>
                <CategoryBadge category={update.category} size="xs" />
              </div>
              <p className="cursor-pointer text-sm font-bold leading-snug text-charcoal-ink transition-colors hover:text-brand-primary">
                {update.title}
              </p>
            </div>
          ))}
        </div>
      </div>

    </aside>
  );
}
