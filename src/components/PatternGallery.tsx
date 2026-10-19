import { usePatterns } from "@/context/PatternsContext";
import type { CrochetPattern, Difficulty } from "@/data/patterns";
import { PatternCard } from "@/components/PatternCard";
import { Search } from "lucide-react";

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
  /** Filter patterns by text in their title, description, category, difficulty, or author. */
  searchQuery?: string;
  /** Called when the search field changes. */
  onSearchQueryChange?: (query: string) => void;
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

function PatternGalleryHeader({
  title,
  count,
  searchQuery,
  onSearchQueryChange,
}: {
  title: string;
  count: number;
  searchQuery: string;
  onSearchQueryChange?: (query: string) => void;
}) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        {title}
      </h2>
      <div className="flex shrink-0 items-center gap-3">
        {onSearchQueryChange && (
          <label className="relative">
            <span className="sr-only">Search patterns</span>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchQueryChange(event.target.value)}
              placeholder="Search patterns"
              className="w-36 rounded-lg border border-zinc-300 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 sm:w-68 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </label>
        )}
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          {count} {count === 1 ? "pattern" : "patterns"}
        </span>
      </div>
    </div>
  );
}

export function PatternGallery({
  category,
  difficulty,
  sortBy = "newest",
  limit,
  title,
  searchQuery = "",
  onSearchQueryChange,
  className = "",
}: PatternGalleryProps) {
  const { patterns, loading } = usePatterns();

  let visible = patterns;
  const normalizedQuery = searchQuery.trim().toLowerCase();

  if (normalizedQuery) {
    visible = visible.filter((pattern) =>
      [
        pattern.title,
        pattern.description,
        pattern.category,
        pattern.difficulty,
        pattern.author,
      ].some((value) => value.toLowerCase().includes(normalizedQuery))
    );
  }

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
          <PatternGalleryHeader
            title={title}
            count={visible.length}
            searchQuery={searchQuery}
            onSearchQueryChange={onSearchQueryChange}
          />
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
          <PatternGalleryHeader
            title={title}
            count={0}
            searchQuery={searchQuery}
            onSearchQueryChange={onSearchQueryChange}
          />
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
      <PatternGalleryHeader
        title={title}
        count={visible.length}
        searchQuery={searchQuery}
        onSearchQueryChange={onSearchQueryChange}
      />
    )}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((pattern) => (
          <PatternCard key={pattern.id} pattern={pattern} />
        ))}
      </div>
    </section>
  );
}