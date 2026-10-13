import { usePatterns } from "@/context/PatternsContext";
import type { CrochetPattern, Difficulty } from "@/data/patterns";
import { PatternCard } from "@/components/PatternCard";

interface PatternGalleryProps {
  /** Filter patterns to a single category (case-insensitive). */
  category?: string;
  /** Filter patterns to a single difficulty level. */
  difficulty?: Difficulty;
  /** Sort order for the displayed patterns. */
  sortBy?: "newest" | "title" | "difficulty";
  /** Maximum number of patterns to render. */
  limit?: number;
  /** Optional section heading rendered above the grid. */
  title?: string;
  /** Extra classes for the section wrapper. */
  className?: string;
}

const DIFFICULTY_ORDER: Record<Difficulty, number> = {
  Beginner: 0,
  Intermediate: 1,
  Advanced: 2,
};

function sortPatterns(
  list: CrochetPattern[],
  sortBy: PatternGalleryProps["sortBy"]
): CrochetPattern[] {
  const sorted = [...list];
  switch (sortBy) {
    case "title":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "difficulty":
      return sorted.sort(
        (a, b) =>
          (DIFFICULTY_ORDER[a.difficulty] ?? 9) -
          (DIFFICULTY_ORDER[b.difficulty] ?? 9)
      );
    case "newest":
    default:
      return sorted;
  }
}

export function PatternGallery({
  category,
  difficulty,
  sortBy = "newest",
  limit,
  title,
  className = "",
}: PatternGalleryProps) {
  const { patterns, loading } = usePatterns();

  let visible = patterns;

  if (category) {
    visible = visible.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (difficulty) {
    visible = visible.filter((p) => p.difficulty === difficulty);
  }

  visible = sortPatterns(visible, sortBy);
  if (limit !== undefined) visible = visible.slice(0, limit);

  if (loading) {
    return (
      <section className={`py-12 ${className}`}>
        {title && (
          <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {title}
          </h2>
        )}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: limit ?? 3 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800"
            />
          ))}
        </div>
      </section>
    );
  }

  if (visible.length === 0) {
    return (
      <section className={`py-12 ${className}`}>
        {title && (
          <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {title}
          </h2>
        )}
        <p className="text-zinc-500 dark:text-zinc-400">
          No patterns found
          {category ? ` in "${category}"` : ""}
          {difficulty ? ` at "${difficulty}" level` : ""}.
        </p>
      </section>
    );
  }

  return (
    <section className={`py-12 ${className}`} id="patterns">
      {title && (
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {title}
          </h2>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {visible.length} {visible.length === 1 ? "pattern" : "patterns"}
          </span>
        </div>
      )}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((pattern) => (
          <PatternCard key={pattern.id} pattern={pattern} />
        ))}
      </div>
    </section>
  );
}