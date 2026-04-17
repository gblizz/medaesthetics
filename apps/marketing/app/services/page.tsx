import { practice, services, packages, peels, providers } from "../../content";

export default function ServicesPage() {
  const provider = providers[0];

  return (
    <main>
      <section className="bg-black px-6 py-28 text-center">
        <p style={{ color: "rgba(255,255,255,0.4)" }} className="text-[11px] tracking-[0.3em] uppercase">
          Treatments
        </p>
        <h1 style={{ color: "#ffffff" }} className="mt-4 font-serif text-6xl font-light">
          Services + Pricing
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)" }} className="mt-6 font-serif text-lg font-light italic">
          Personalized to you. Performed by a physician.
        </p>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <p className="mb-12 text-[11px] tracking-[0.25em] uppercase text-gray-400">Treatments</p>
          <div className="divide-y divide-gray-100">
            {services.map((s) => (
              <div key={s.name} className="py-10">
                <div className="flex items-baseline justify-between gap-8">
                  <h2 className="font-serif text-3xl font-light text-gray-900">{s.name}</h2>
                  <p className="shrink-0 text-sm text-gray-400">{s.price}</p>
                </div>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-500">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-stone-50 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12">
            <p className="text-[11px] tracking-[0.25em] uppercase text-gray-400">Bundles</p>
            <h2 className="mt-4 font-serif text-4xl font-light text-gray-900">Botox + Filler Packages</h2>
            <p className="mt-4 text-sm leading-relaxed text-gray-500">
              Combine treatments and save. All packages include the option to add up to 50 units of Botox at $10/unit.
            </p>
          </div>
          <div className="grid gap-px bg-gray-200 md:grid-cols-3">
            {packages.map((pkg) => (
              <div key={pkg.name} className="bg-white px-8 py-10">
                <p className="text-[10px] tracking-[0.25em] uppercase text-gray-400">{pkg.name}</p>
                <p className="mt-4 font-serif text-2xl font-light text-gray-900">{pkg.tagline}</p>
                <div className="my-6 h-px bg-gray-100" />
                <p className="text-sm leading-relaxed text-gray-500">{pkg.description}</p>
                <p className="mt-4 text-sm font-medium text-gray-900">{pkg.savings}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <p className="mb-12 text-[11px] tracking-[0.25em] uppercase text-gray-400">Skin Treatments</p>
          <div className="grid gap-px bg-gray-100 sm:grid-cols-3">
            {peels.map((p) => (
              <div key={p.name} className="bg-white px-8 py-10">
                <p className="font-serif text-xl font-light text-gray-900">{p.name}</p>
                <p className="mt-2 font-serif text-3xl font-light text-gray-900">{p.price}</p>
                <p className="mt-3 text-sm text-gray-500">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black px-6 py-20 text-center">
        <p style={{ color: "rgba(255,255,255,0.4)" }} className="text-[11px] tracking-[0.25em] uppercase">
          Not sure where to start?
        </p>
        <h2 style={{ color: "#ffffff" }} className="mt-4 font-serif text-4xl font-light">
          Every journey begins with a consultation.
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)" }} className="mx-auto mt-4 max-w-xl text-sm leading-relaxed">
          Dr. {provider.lastName} will assess your unique anatomy and goals before recommending any treatment.
        </p>
        <a
          href={practice.bookingUrl}
          style={{ color: "#ffffff", borderColor: "#ffffff" }}
          className="mt-10 inline-block border px-10 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors hover:bg-white hover:text-black"
        >
          Book a Consult
        </a>
      </section>
    </main>
  );
}
