export default function AboutPage() {
  return (
    <main className="pt-20 pb-12">
      <div className="mx-auto max-w-7xl px-6">
        <section className="mb-12">
          <div className="flex flex-row gap-4 lg:gap-12 items-center">
            <div className="flex-1 w-1/2 text-left ms-0 lg:ms-12">
              <h1 className="text-2xl md:text-6xl font-bold tracking-tight text-zinc-900 mb-4">
                About Our Crochet Blog
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 text-[14px] md:text-xl leading-relaxed mb-6">
                Welcome to our little crochet corner! Here, you'll find easy and adorable crochet patterns for all skill levels, from cute handmade animals to beautiful accessories and more. Our goal is to make crocheting fun, simple, and inspiring, one stitch at a time. Whether you're a beginner or an experienced crocheter, there's always something lovely to create!
              </p>
            </div>

            <div className="flex-1">
              <img
                src="/about-us.png"
                alt="Crochet project"
                width={500}
                height={400}
                className="m-auto rounded-lg object-cover"
              />
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-zinc-900 mb-4 dark:text-zinc-100">
            Our Mission
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            We believe crochet is more than just a hobby—it's a form of creative expression that brings people together. Our mission is to provide clear, well-photographed patterns that help crocheters of all levels succeed and enjoy the process. We're passionate about sharing the joy of handmade crafts with the world.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-zinc-900 mb-4 dark:text-zinc-100">
            Meet the Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Sarah Mackenzie</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                Pattern designer and writer
              </p>
            </div>
            <div className="p-4 rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Lisa Chen</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                Photography and tutorials
              </p>
            </div>
            <div className="p-4 rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Emma Watson</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                Community manager
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}