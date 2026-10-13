import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, User } from "lucide-react";
import type { CrochetPattern } from "@/data/patterns";

interface PatternCardProps {
  pattern: CrochetPattern;
}

const FALLBACK_IMG = "/placeholder-400x300.svg";

export function PatternCard({ pattern }: PatternCardProps) {
  const [imgSrc, setImgSrc] = useState<string>(pattern.mainImg);

  return (
    <Link
      to={`/patterns/${pattern.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <img
          src={imgSrc}
          alt={pattern.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImgSrc(FALLBACK_IMG)}
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-zinc-700 shadow-sm dark:bg-zinc-900/90 dark:text-zinc-300">
          {pattern.category}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
          <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 dark:bg-zinc-800">
            {pattern.difficulty}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors group-hover:decoration-zinc-900 dark:text-zinc-100 dark:group-hover:decoration-zinc-100">
          {pattern.title}
        </h3>

        <p className="text-sm leading-relaxed text-zinc-600 line-clamp-2 dark:text-zinc-400">
          {pattern.description}
        </p>

        <div className="mt-auto flex items-center gap-4 pt-3 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            {pattern.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {pattern.date}
          </span>
        </div>
      </div>
    </Link>
  );
}