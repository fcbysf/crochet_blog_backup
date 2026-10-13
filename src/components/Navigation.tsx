import { Link } from "react-router-dom";

export const Navigation = () => {
  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-zinc-200/50">
      <div className="max-w-7xl mx-auto h-20 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <img
            src="/text logo-Picsart-BackgroundRemover copy.jpg"
            alt="Crochet Blog Logo"
            className="h-24 w-44 ms-0 sm:h-10 md:w-45 md:h-24"
          />
        </div>

        <nav className="hidden md:flex items-center gap-8">
<Link to="#latest-patterns" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 font-medium text-sm">
            Patterns
          </Link>

          <Link to="#about" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 font-medium text-sm">
            About Us
          </Link>

          <Link to="#contact" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 font-medium text-sm">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3">
        



          <a
            href="https://crochetmakerr.gumroad.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="sm:inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
          >
            Support me
          </a>
        </div>
      </div>
    </header>
  );
};