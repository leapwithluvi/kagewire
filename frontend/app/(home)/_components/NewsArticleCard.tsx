import { ArtworkFrame } from "@/components/ui/ArtworkFrame";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { NewsArticle } from "@/types/news";

interface Props {
  article: NewsArticle;
  variant?: "default" | "large" | "horizontal";
}

function Byline({ author, date, readingTime }: { author?: string; date: string; readingTime?: number }) {
  return (
    <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-gray">
      {author && (
        <>
          <span className="font-bold text-muted-text">{author}</span>
          <span>·</span>
        </>
      )}
      <span>{date}</span>
      {readingTime && (
        <>
          <span>·</span>
          <span>{readingTime} min read</span>
        </>
      )}
    </div>
  );
}

export function NewsArticleCard({ article, variant = "default" }: Props) {

    if (variant === "horizontal") {
    return (
      <article className="group flex cursor-pointer gap-3.5">
        <div className="shrink-0">
          <ArtworkFrame icon={article.icon} image={article.image} size="sm" />
        </div>
        <div className="flex min-w-0 flex-col justify-between py-0.5">
          <div className="flex flex-col gap-1">
            <CategoryBadge category={article.category} size="xs" />
            <h3 className="font-serif text-sm font-bold leading-snug text-charcoal-ink transition-colors group-hover:text-brand-primary">
              {article.title}
            </h3>
          </div>
          <Byline author={article.author} date={article.date} readingTime={article.readingTime} />
        </div>
      </article>
    );
  }

    if (variant === "large") {
    return (
      <article className="group flex cursor-pointer flex-col gap-3">
        <div className="relative">
          <ArtworkFrame icon={article.icon} image={article.image} size="lg" />
          <div className="absolute bottom-3 left-3 z-20">
            <CategoryBadge category={article.category} />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <h3 className="font-serif text-xl font-bold leading-tight text-charcoal-ink transition-colors group-hover:text-brand-primary">
            {article.title}
          </h3>
          <Byline author={article.author} date={article.date} readingTime={article.readingTime} />
          {article.excerpt && (
            <p className="mt-1 text-sm leading-relaxed text-muted-gray">
              {article.excerpt}
            </p>
          )}
        </div>
      </article>
    );
  }

  return (
    <article className="group flex cursor-pointer flex-col gap-3">
      <ArtworkFrame icon={article.icon} image={article.image} size="md" />
      <div className="flex flex-1 flex-col gap-1.5">
        <CategoryBadge category={article.category} />
        <h3 className="font-serif text-lg font-bold leading-tight text-charcoal-ink transition-colors group-hover:text-brand-primary">
          {article.title}
        </h3>
        <Byline author={article.author} date={article.date} readingTime={article.readingTime} />
        {article.excerpt && (
          <p className="mt-1 text-sm text-muted-gray">{article.excerpt}</p>
        )}
      </div>
    </article>
  );
}
