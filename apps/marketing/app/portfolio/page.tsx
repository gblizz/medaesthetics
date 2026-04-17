export default function PortfolioPage() {
  return (
    <main>
      {/* Page header */}
      <section className="bg-black px-6 py-28 text-center">
        <p style={{ color: "rgba(255,255,255,0.4)" }} className="text-[11px] tracking-[0.3em] uppercase">
          Results
        </p>
        <h1 style={{ color: "#ffffff" }} className="mt-4 font-serif text-6xl font-light">
          Portfolio
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)" }} className="mt-6 font-serif text-lg font-light italic">
          Natural enhancements. Real results.
        </p>
      </section>

      {/* Disclaimer */}
      <section className="border-b border-gray-100 bg-stone-50 px-6 py-6 text-center">
        <p className="text-xs leading-relaxed text-gray-400">
          All photographs are of actual patients and are displayed with consent. Individual results may vary.
        </p>
      </section>

      {/* Category filters */}
      <section className="bg-white px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                className="border border-gray-200 px-5 py-2 text-[10px] tracking-[0.2em] uppercase text-gray-500 transition-colors hover:border-gray-900 hover:text-gray-900"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid placeholder */}
      <section className="bg-white px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-px bg-gray-100 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-stone-50 flex items-center justify-center"
                style={{ background: i % 3 === 0 ? "#f5f5f0" : i % 3 === 1 ? "#f0f0eb" : "#ebebе5" }}
              >
                <div className="text-center">
                  <p className="font-serif text-lg font-light text-gray-300">Before / After</p>
                  <p className="mt-1 text-[10px] tracking-[0.2em] uppercase text-gray-300">
                    {portfolioLabels[i % portfolioLabels.length]}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Coming soon note */}
          <div className="mt-16 border border-stone-100 bg-stone-50 px-10 py-14 text-center">
            <p className="font-serif text-3xl font-light text-gray-500">More photos coming soon.</p>
            <p className="mt-3 text-sm text-gray-400">
              Follow{" "}
              <a
                href="https://instagram.com/refinedaestheticmd"
                className="border-b border-gray-400 pb-px text-gray-600 transition-colors hover:border-gray-900 hover:text-gray-900"
              >
                @refinedaestheticmd
              </a>{" "}
              on Instagram for the latest work.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black px-6 py-20 text-center">
        <p style={{ color: "rgba(255,255,255,0.4)" }} className="text-[11px] tracking-[0.25em] uppercase">
          Ready for your transformation?
        </p>
        <h2 style={{ color: "#ffffff" }} className="mt-4 font-serif text-4xl font-light">
          Let&apos;s create your best result.
        </h2>
        <a
          href="/contact"
          style={{ color: "#ffffff", borderColor: "#ffffff" }}
          className="mt-10 inline-block border px-10 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors hover:bg-white hover:text-black"
        >
          Schedule a Consult
        </a>
      </section>
    </main>
  );
}

const categories = [
  "All",
  "Botox",
  "Lip Filler",
  "Cheeks",
  "Undereyes",
  "Jawline",
  "Full Face",
  "Chemical Peel",
];

const portfolioLabels = [
  "Lip Enhancement",
  "Full Face Rejuvenation",
  "Cheek Filler",
  "Undereyes",
  "Jawline",
  "Botox",
  "Facial Balancing",
  "Chemical Peel",
  "Facial Contouring",
];
