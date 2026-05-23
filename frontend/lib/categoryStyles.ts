export interface CategoryStyle {
  bg: string;
  text: string;
  dot: string;
  border: string;
}

const BRAND_GREEN_STYLE: CategoryStyle = {
  bg: "bg-brand-primary/10",
  text: "text-brand-primary",
  dot: "bg-brand-primary",
  border: "border-brand-primary/25",
};

export function getCategoryStyle(): CategoryStyle {
  return BRAND_GREEN_STYLE;
}
