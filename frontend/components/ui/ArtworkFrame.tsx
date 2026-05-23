
interface Props {
  icon: string;
  image?: string;
  size?: "sm" | "md" | "lg";
}

export function ArtworkFrame({ icon, image, size = "md" }: Props) {
  const sizeMap = {
    sm: {
      container: "h-[72px] w-24 rounded-2xl",
      emoji: "text-3xl",
      decorSize: "h-6 w-6",
    },
    md: {
      container: "h-44 w-full rounded-[28px]",
      emoji: "text-6xl",
      decorSize: "h-10 w-10",
    },
    lg: {
      container: "h-52 w-full rounded-[32px]",
      emoji: "text-7xl",
      decorSize: "h-14 w-14",
    },
  }[size];

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden border border-brand-primary-border/40 bg-surface-slate shadow-inner transition-all duration-500 group-hover:scale-[1.01] ${sizeMap.container}`}
      style={{
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(74, 156, 104, 0.06) 0%, transparent 45%),
          radial-gradient(circle at 80% 70%, rgba(63, 169, 229, 0.06) 0%, transparent 45%)
        `,
      }}
    >
      <div className="absolute inset-0 opacity-[0.07] dark:opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--brand-primary-border) 1px, transparent 1px),
            linear-gradient(to bottom, var(--brand-primary-border) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      <div className="absolute inset-2 border border-dashed border-brand-primary-border/25 rounded-[inherit] pointer-events-none" />

        <div className="absolute flex items-center justify-center rounded-full border border-brand-primary-border/20 bg-white/40 dark:bg-black/20 backdrop-blur-xs transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6"
        style={{
          width: size === "sm" ? "42px" : size === "md" ? "96px" : "112px",
          height: size === "sm" ? "42px" : size === "md" ? "96px" : "112px",
          borderRadius: "45% 55% 50% 50% / 50% 45% 55% 50%",
          boxShadow: "inset 0 4px 10px rgba(0,0,0,0.02)",
        }}
      >
        <div className="absolute inset-1 rounded-full bg-brand-primary/5 filter blur-xs animate-pulse" />
        {image ? (
          size === "sm" ? (
            <img
              src={image}
              alt="artwork"
              className="relative z-10 object-cover select-none transition-transform duration-500 group-hover:scale-105 h-10 w-10"
              loading="lazy"
            />
          ) : (
            <>
              <img
                src={image}
                alt="artwork"
                className="absolute inset-0 z-0 w-full h-full object-cover"
                loading="lazy"
              />
              <span className={`relative z-10 select-none filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)] transition-transform duration-500 group-hover:scale-105 ${sizeMap.emoji}`}>
                {icon}
              </span>
            </>
          )
        ) : (
          <span className={`relative z-10 select-none filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)] transition-transform duration-500 group-hover:scale-105 ${sizeMap.emoji}`}>
            {icon}
          </span>
        )}
      </div>

      <div className="absolute bottom-2.5 right-2.5 opacity-30 group-hover:opacity-50 transition-opacity duration-300">
        <svg className={`${size === "sm" ? "h-3 w-3" : "h-5 w-5"} text-brand-primary`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M17,8C8,8,4,16,4,16s8-1,11-5s2-7,2-7S17,6,17,8z" />
        </svg>
      </div>
      <div className="absolute top-2.5 left-2.5 opacity-20 group-hover:opacity-40 transition-opacity duration-300 rotate-180">
        <svg className={`${size === "sm" ? "h-3 w-3" : "h-5 w-5"} text-brand-primary`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M17,8C8,8,4,16,4,16s8-1,11-5s2-7,2-7S17,6,17,8z" />
        </svg>
      </div>
    </div>
  );
}
