import { practice, concerns, testimonials, whyChoose, providers } from "../content";

const provider = providers[0];

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative flex min-h-[92vh] items-center justify-center bg-black">
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <p style={{ color: "rgba(255,255,255,0.5)" }} className="mb-6 text-[11px] tracking-[0.35em] uppercase">
            Austin, Texas · Physician-Led Aesthetics
          </p>
          <h1 style={{ color: "#ffffff" }} className="font-serif text-6xl font-light leading-tight md:text-7xl">
            {practice.heroHeadline.split("\n").map((line, i) => (
              <span key={i}>{line}{i === 0 && <br />}</span>
            ))}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)" }} className="mt-6 font-serif text-xl font-light italic">
            {practice.tagline}
          </p>
          <a
            href={practice.bookingUrl}
            style={{ color: "#ffffff", borderColor: "#ffffff" }}
            className="mt-10 inline-block border px-10 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors hover:bg-white hover:text-black"
          >
            Schedule a Consult
          </a>
        </div>
      </section>

      {/* Philosophy strip */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] tracking-[0.25em] uppercase text-gray-400">Our Philosophy</p>
          <h2 className="mt-4 font-serif text-4xl font-light leading-snug text-gray-900">
            {practice.heroSubtitle}
          </h2>
          <div className="mx-auto mt-8 h-px w-12 bg-gray-200" />
          <p className="mt-8 text-sm leading-relaxed text-gray-500">{practice.philosophyBody}</p>
        </div>
      </section>

      {/* Services concerns grid */}
      <section className="bg-stone-50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-[11px] tracking-[0.25em] uppercase text-gray-400">What We Treat</p>
            <h2 className="mt-4 font-serif text-4xl font-light text-gray-900">Areas of Focus</h2>
          </div>
          <div className="grid gap-px bg-gray-200 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {concerns.map((c) => (
              <a
                key={c}
                href="/services"
                className="group bg-white px-8 py-10 transition-colors hover:bg-black"
              >
                <p className="font-serif text-xl font-light text-gray-900 transition-colors group-hover:text-white">
                  {c}
                </p>
              </a>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a
              href="/services"
              className="inline-block border border-gray-900 px-10 py-3.5 text-[11px] tracking-[0.2em] uppercase text-gray-900 transition-colors hover:bg-black hover:text-white"
              style={{ color: "inherit" }}
            >
              View Services + Pricing
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-[11px] tracking-[0.25em] uppercase text-gray-400">Client Stories</p>
            <h2 className="mt-4 font-serif text-4xl font-light text-gray-900">What Our Clients Say</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="border border-gray-100 bg-stone-50 px-8 py-10">
                <p className="font-serif text-lg font-light italic leading-relaxed text-gray-700">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="mt-6 text-[10px] tracking-[0.2em] uppercase text-gray-400">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About teaser */}
      <section className="bg-black px-6 py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div className="hidden h-80 md:block" style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex h-full items-center justify-center">
              <p style={{ color: "rgba(255,255,255,0.15)" }} className="font-serif text-sm tracking-[0.2em] uppercase">
                {provider.firstName} {provider.lastName}, {provider.title}
              </p>
            </div>
          </div>
          <div>
            <p style={{ color: "rgba(255,255,255,0.4)" }} className="text-[11px] tracking-[0.25em] uppercase">
              Meet the Physician
            </p>
            <h2 style={{ color: "#ffffff" }} className="mt-4 font-serif text-4xl font-light leading-snug">
              {provider.firstName} {provider.lastName}, {provider.title}
            </h2>
            <p style={{ color: "rgba(255,255,255,0.6)" }} className="mt-6 text-sm leading-relaxed">
              {provider.bio[0]}
            </p>
            <a
              href="/about"
              style={{ color: "rgba(255,255,255,0.7)", borderColor: "rgba(255,255,255,0.3)" }}
              className="mt-8 inline-block border-b pb-px text-[11px] tracking-[0.2em] uppercase transition-colors hover:text-white"
            >
              Read Her Story
            </a>
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-[11px] tracking-[0.25em] uppercase text-gray-400">Why {practice.name}</p>
            <h2 className="mt-4 font-serif text-4xl font-light text-gray-900">The Difference</h2>
          </div>
          <div className="grid gap-px bg-gray-100 sm:grid-cols-2 lg:grid-cols-4">
            {whyChoose.map((item) => (
              <div key={item.title} className="bg-white px-8 py-10">
                <p className="font-serif text-xl font-light text-gray-900">{item.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-gray-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-stone-50 px-6 py-20 text-center">
        <p className="text-[11px] tracking-[0.25em] uppercase text-gray-400">Ready to Begin?</p>
        <h2 className="mt-4 font-serif text-5xl font-light text-gray-900">Your consultation awaits.</h2>
        <a
          href={practice.bookingUrl}
          className="mt-10 inline-block bg-black px-12 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors hover:bg-gray-800"
          style={{ color: "#ffffff" }}
        >
          Schedule a Consult
        </a>
      </section>
    </main>
  );
}
