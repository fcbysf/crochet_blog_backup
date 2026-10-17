import { PatternGallery } from "@/components/PatternGallery";

export default function Home() {
  return (
    <main className="pb-12">
      <div className="max-w-7xl mx-auto px-6">

        {/* Hero Section */}
        <section id="patterns" className="mb-12">
          <div className="flex flex-row gap-4 lg:gap-12 items-center">
            {/* Left column: title, subtitle, subscribe form */}
            <div className="flex-1 w-1/2 text-left ms-0 lg:ms-12">
              <h1 className="text-2xl md:text-6xl font-bold tracking-tight text-zinc-900 mb-4">
                Your Next Favorite Crochet Project Starts Here
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 text-[14px] md:text-xl leading-relaxed mb-6">
                Discover easy and adorable crochet patterns for every style. From cute animals to charming accessories, find step-by-step patterns that make crocheting fun, simple, and enjoyable for everyone.
              </p>
            </div>

            {/* Right column: hero image */}
            <div className="flex-1">
              <img
                src="/hero.jpg"
                alt="Finished crochet project"
                width={380}
                height={350}
                loading="eager"
                fetchPriority="high"
                className="m-auto rounded-lg object-cover"
              />
            </div>
          </div>
        </section>

        {/* Rectangle 300x250 (Adsterra unit 4) */}
        <div data-unit-id="rect-300x250" className="mb-6"></div>

        {/* About Us Section */}
        <section id="about" className="md:mt-32 mb-24 md:mb-52">
          <div className="flex flex-row gap-4 lg:gap-12 items-center">
            {/* Left column: about image */}
            <div className="flex-1">
              <img
                src="/about-us.png"
                alt="Crochet project"
                width={1536}
                height={1024}
                loading="lazy"
                className="w-full h-auto rounded-lg object-cover"
              />
            </div>

            {/* Right column: about text */}
            <div className="flex-1 text-left">
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-zinc-900 mb-4">
                About Our Crochet Blog
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-[14px] md:text-lg leading-relaxed">
                Welcome to our little crochet corner! Here, you'll find easy and adorable crochet patterns for all skill levels, from cute handmade animals to beautiful accessories and more. Our goal is to make crocheting fun, simple, and inspiring, one stitch at a time. Whether you're a beginner or an experienced crocheter, there's always something lovely to create!
              </p>
            </div>
          </div>
        </section>

        {/* Banner 320x50 (Adsterra unit 3 – mobile banner) */}
        <div data-unit-id="banner-320x50" className="block mb-4 w-full"></div>

        {/* Pattern Sections - rendered from the PatternsContext */}
        <section id="latest-patterns" className="mb-16">
          <PatternGallery title="Latest Patterns" />
        </section>

        <PatternGallery
          title="Easy Patterns for Beginners"
          difficulty="Beginner"
        />
        <PatternGallery title="Popular Patterns" limit={3} />

        {/* Container Banner (Adsterra unit 2) */}
        <div data-unit-id="container-banner" className="mb-8"></div>

        {/* Contact Section */}
        <section id="contact" className="mt-24 py-12 bg-zinc-50">
          <div className="max-w-2xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 dark:text-zinc-100">
              Contact Us
            </h2>
            <div data-unit-id="leader-728x90" className="hidden lg:block mb-8"></div>
            <p className="text-zinc-600 dark:text-zinc-600 mb-6">
              Got questions or feedback? Drop us a line at info@crochetblog.com
            </p>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 px-3 text-sm text-zinc-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 px-3 text-sm text-zinc-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                  Message
                </label>
                <textarea
                  placeholder="Write your message here..."
                  rows={3}
                  className="w-full rounded-lg border border-zinc-300 bg-white py-3 px-3 text-sm text-zinc-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
              >
                Send Message
              </button>
            </form>
            <div data-unit-id="skyscraper-160x300" className="flex justify-center m-8"></div>
          </div>
        </section>

        <div data-unit-id="leader-468x60" className=" mb-8"></div>
      </div>
    </main>
  );
};