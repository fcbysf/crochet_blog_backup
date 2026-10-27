import { Suspense, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Download, Heart, X } from "lucide-react";
import { usePatterns } from "@/context/PatternsContext";
import { PatternCard } from "@/components/PatternCard";

const FALLBACK_IMG = "/placeholder-400x300.svg";

function DetailSkeleton() {
  return (
    <main className="pt-20 pb-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="animate-pulse space-y-6">
          <div className="h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="aspect-[4/3] rounded-xl bg-zinc-200 dark:bg-zinc-800" />
            <div className="space-y-3">
              <div className="h-8 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function PatternDetailPage() {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <PatternDetailContent />
    </Suspense>
  );
}

function PatternDetailContent() {
  const { id = "" } = useParams();
  const { getPatternById, patterns } = usePatterns();
  const pattern = getPatternById(id);

  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  if (!pattern) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-24">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Pattern not found
          </h1>
          <p className="mt-3 text-zinc-500 dark:text-zinc-400">
            Sorry, we couldn&apos;t find the pattern you&apos;re looking for.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all patterns
          </Link>
        </div>
      </main>
    );
  }

  const similar = patterns
    .filter((p) => p.id !== pattern.id && p.category === pattern.category)
    .slice(0, 3);

  const openLightbox = (src: string) => {
    setSelectedImg(src);
  };

  return (
    <main className=" pb-12 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div data-unit-id="leader-728x90" className="mb-5"></div>


        {/* Back link */}
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors my-2 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <ArrowLeft className="h-4 w-4" />
          All patterns
        </Link>

        {/* Social Bar (Adsterra unit 1) – sticky, page-level ad */}
        <div data-unit-id="social-bar" className="sticky top-0 z-40"></div>

        {/* Hero: main image left, details + related images right */}
        <section className="mb-14 grid w-full min-w-0 gap-8 lg:grid-cols-2 lg:items-stretch">
          <button
            type="button"
            onClick={() => openLightbox(pattern.mainImg)}
            className="relative aspect-[4/3] w-full min-w-0 cursor-zoom-in overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 lg:aspect-auto lg:h-full lg:min-h-[480px]"
            aria-label="Enlarge main image"
          >
            <img
              src={pattern.mainImg}
              alt={pattern.title}
              loading="eager"
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = FALLBACK_IMG;
              }}
            />
          </button>


          <div className="flex min-w-0 flex-col gap-6">
            <div className="flex flex-col gap-4">
              <span className="inline-flex w-fit items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
                {pattern.category}
              </span>

              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-100">
                {pattern.title}
              </h1>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  {pattern.difficulty}
                </span>
                <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  {pattern.author}
                </span>
                <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  {pattern.date}
                </span>
              </div>

              <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
                {pattern.description}
              </p>
              <div data-unit-id="banner-320x50" className="block "></div>
              <div data-unit-id="leader-468x60" className="mobile-leaderboard mobile-leaderboard-568 block " />




            </div>

            {/* Gallery: small thumbnails in a row */}
            {pattern.otherImgs.length > 0 && (
              <div>
                <h2 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  More from this pattern
                </h2>
                <div className="flex flex-wrap gap-2">
                  {pattern.otherImgs.map((img, index) => (
                    <div
                      key={index}
                      className="relative h-30 w-30 sm:h-40 sm:w-40 cursor-default overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800"
                    >
                      <img
                        src={img}
                        alt={`${pattern.title} view ${index + 1}`}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = FALLBACK_IMG;
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3">

            </div>
          </div>
        </section>

        {/* Container Banner (Adsterra unit 2) – injected by AdInjector */}
        <div data-unit-id="container-banner" className="mb-[1050px] xsm:mb-[270px] md:mb-[100px] lg:mb-25"></div>
        <div className="flex justify-between items-center">
          <h1 className="w-3/4  mb-6 text-lg sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Pattern Instructions
          </h1>
          <a
            href={"https://araplhn.org/4/befbdc95165d5a692c8b634602efa265"}

            className="inline-flex items-center gap-2 rounded-lg bg-green-200 hover:bg-green-300 px-2 py-1.5 mb-2.5 text-[10px] sm:text-lg sm:me-100 text-shadow-gray-300 font-bold transition-colors dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <Download className="h-4 w-4" />
            FREE PDF pattern
          </a>

        </div>
        <section dangerouslySetInnerHTML={{
          __html: pattern.patternText || "<p>No pattern text available.</p>"
        }} className=" m-auto " >
        </section>


        {/* Support me */}
        <div className="flex justify-center" >

          <div data-unit-id="rect-300x250" className="mb-6"></div>
        </div>
        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center">

          {pattern.buyUrl && (
            <a
              href={pattern.buyUrl}

              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <Download className="h-4 w-4" />
               Download PDF pattern
            </a>
          )}


          <a
            href={"https://crochetmakerr.gumroad.com/"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
          >
            <Heart className="h-4 w-4" />
            Discover more
          </a>

        </div>
        <div className="flex justify-center">

          <div data-unit-id="skyscraper-160x300" className=" sm:block  my-3"></div>
        </div>


        {/* Rectangle 300x250 (Adsterra unit 4) */}

        {/* Similar patterns */}
        {similar.length > 0 && (
          <section>
            <h2 className="mb-6 text-xl font-bold text-zinc-900 dark:text-zinc-100">
              More in {pattern.category}
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((p) => (
                <PatternCard key={p.id} pattern={p} />
              ))}
            </div>
          </section>
        )}

        {/* Skyscraper 160x300 (Adsterra unit 5) */}

      </div>

      {/* Lightbox */}
      {
        selectedImg && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
            onClick={() => setSelectedImg(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
          >
            <button
              type="button"
              onClick={() => setSelectedImg(null)}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              aria-label="Close image viewer"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="relative h-[90vh] w-[90vw]">
              <img
                src={selectedImg}
                alt={pattern.title}
                loading="eager"
                className="absolute inset-0 h-full w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_IMG;
                }}
              />
            </div>
          </div>
        )
      }

    </main >
  );
}