import { practice, providers } from "../../content";

const provider = providers[0];

export default function AboutPage() {
  return (
    <main>
      <section className="bg-black px-6 py-28 text-center">
        <p style={{ color: "rgba(255,255,255,0.4)" }} className="text-[11px] tracking-[0.3em] uppercase">
          The Physician
        </p>
        <h1 style={{ color: "#ffffff" }} className="mt-4 font-serif text-6xl font-light">
          About Me
        </h1>
      </section>

      <section className="bg-white px-6 py-24">
        <div className="mx-auto grid max-w-6xl items-start gap-16 md:grid-cols-2">
          {/* Photo */}
          <div
            className="aspect-[3/4] w-full"
            style={{ background: "linear-gradient(160deg, #f5f5f0 0%, #e8e8e0 100%)", border: "1px solid #e5e5e0" }}
          >
            <div className="flex h-full items-end p-8">
              <div>
                <p className="font-serif text-2xl font-light text-gray-600">
                  {provider.firstName} {provider.lastName}, {provider.title}
                </p>
                <p className="mt-1 text-[10px] tracking-[0.2em] uppercase text-gray-400">
                  {provider.credential}
                </p>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="pt-2">
            <p className="text-[11px] tracking-[0.25em] uppercase text-gray-400">My Story</p>
            <h2 className="mt-4 font-serif text-4xl font-light leading-snug text-gray-900">
              I&apos;m excited you&apos;re here.
            </h2>
            <div className="mt-8 space-y-5 text-sm leading-relaxed text-gray-500">
              {provider.bio.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <div className="mt-10 border-l-2 border-gray-900 pl-6">
              <p className="font-serif text-xl font-light italic leading-relaxed text-gray-700">
                &ldquo;{provider.heroQuote}&rdquo;
              </p>
            </div>
            <a
              href={practice.bookingUrl}
              className="mt-10 inline-block bg-black px-10 py-3.5 text-[11px] tracking-[0.2em] uppercase transition-colors hover:bg-gray-800"
              style={{ color: "#ffffff" }}
            >
              Schedule a Consult
            </a>
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="bg-stone-50 px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <p className="mb-10 text-center text-[11px] tracking-[0.25em] uppercase text-gray-400">Credentials</p>
          <div className="grid gap-px bg-gray-200 sm:grid-cols-3">
            <div className="bg-white px-8 py-8 text-center">
              <p className="font-serif text-lg font-light text-gray-900">{provider.credential}</p>
              <p className="mt-2 text-xs text-gray-400">{provider.specialty}</p>
            </div>
            <div className="bg-white px-8 py-8 text-center">
              <p className="font-serif text-lg font-light text-gray-900">{provider.yearsExperience} Years Experience</p>
              <p className="mt-2 text-xs text-gray-400">Clinical &amp; Aesthetic Medicine</p>
            </div>
            <div className="bg-white px-8 py-8 text-center">
              <p className="font-serif text-lg font-light text-gray-900">{provider.location}</p>
              <p className="mt-2 text-xs text-gray-400">{practice.name}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-black px-6 py-20 text-center">
        <p style={{ color: "rgba(255,255,255,0.4)" }} className="text-[11px] tracking-[0.3em] uppercase">
          Stay Connected
        </p>
        <h2 style={{ color: "#ffffff" }} className="mt-4 font-serif text-4xl font-light">
          Let&apos;s Connect!
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)" }} className="mx-auto mt-4 max-w-md text-sm leading-relaxed">
          Sign up for the latest beauty tips and exclusive specials from {practice.name}.
        </p>
        <form className="mx-auto mt-8 flex max-w-md gap-3">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-1 border-0 border-b bg-transparent px-0 py-3 text-sm focus:outline-none"
            style={{ color: "#ffffff", borderColor: "rgba(255,255,255,0.3)" }}
          />
          <button
            type="submit"
            style={{ color: "#ffffff", borderColor: "#ffffff" }}
            className="border px-6 py-3 text-[10px] tracking-[0.2em] uppercase transition-colors hover:bg-white hover:text-black"
          >
            Subscribe
          </button>
        </form>
      </section>
    </main>
  );
}
