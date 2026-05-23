import { getCategoryStyle } from "@/lib/categoryStyles";

interface BadgeProps {
  category: string;
  size?: "xs" | "sm" | "md";
  glassy?: boolean;
}

export function CategoryBadge({ category, size = "sm", glassy = false }: BadgeProps) {
  const style = getCategoryStyle();

  if (glassy) {
    return (
      <span className="inline-flex w-fit items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[1.5px] text-white/90">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
        {category}
      </span>
    );
  }

  const textSize = {
    xs: "text-[9px]",
    sm: "text-[10px]",
    md: "text-xs",
  }[size];

  return (
    <span className={`inline-flex w-fit items-center gap-1.5 font-mono font-bold uppercase tracking-[1.5px] text-brand-primary ${textSize}`}>
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`} />
      {category}
    </span>
  );
}
