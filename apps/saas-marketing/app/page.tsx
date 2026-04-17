export default function Home() {
  return (
    <main className="bg-cream">
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="text-xl font-bold tracking-tight text-gold-700">
          MedAesthetics
        </span>
        <a
          href="/sign-up"
          className="rounded-full bg-gold-500 px-5 py-2 text-sm font-semibold text-cream shadow-sm hover:bg-gold-600 transition-colors"
        >
          Start Free Trial
        </a>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-gold-100 to-cream px-6 pb-24 pt-16 text-center">
        <div className="mx-auto max-w-3xl">
          <span className="inline-block rounded-full bg-gold-200 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-gold-700">
            HIPAA Compliant · Built for Medical Aesthetics
          </span>
          <h1 className="mt-7 text-5xl font-extrabold leading-tight text-gold-900">
            Run Your Aesthetics Practice{" "}
            <span className="text-gold-500">End-to-End</span>
          </h1>
          <p className="mt-6 text-xl leading-relaxed text-gold-800/70">
            MedAesthetics is the all-in-one platform for Nurse Practitioners, PAs, and
            Physicians — from scheduling and charting to billing and before/after photos.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <a
              href="/sign-up"
              className="rounded-full bg-gold-500 px-8 py-3.5 text-base font-semibold text-cream shadow-md hover:bg-gold-600 transition-colors"
            >
              Start Free Trial
            </a>
            <a
              href="#features"
              className="rounded-full border border-gold-300 px-8 py-3.5 text-base font-semibold text-gold-700 hover:bg-gold-50 transition-colors"
            >
              See Features
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-cream px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold text-gold-900">
            Everything Your Practice Needs
          </h2>
          <p className="mt-3 text-center text-gold-700/70">
            One elegant platform — from first booking to final invoice.
          </p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-gold-100 bg-gold-50 p-6 transition-shadow hover:shadow-md"
              >
                <div className="text-3xl">{f.icon}</div>
                <h3 className="mt-3 text-base font-semibold text-gold-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gold-700/70">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gold-50 px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gold-900">Simple, Transparent Pricing</h2>
          <p className="mt-3 text-gold-700/70">One platform. No hidden fees. Cancel anytime.</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl border p-6 ${
                  tier.featured
                    ? "border-gold-400 bg-gradient-to-b from-gold-400 to-gold-500 text-cream shadow-lg"
                    : "border-gold-200 bg-cream"
                }`}
              >
                <p className={`text-sm font-semibold uppercase tracking-widest ${tier.featured ? "text-cream/80" : "text-gold-500"}`}>
                  {tier.name}
                </p>
                <p className={`mt-3 text-4xl font-bold ${tier.featured ? "text-cream" : "text-gold-900"}`}>
                  {tier.price}
                </p>
                <p className={`text-sm ${tier.featured ? "text-cream/70" : "text-gold-700/60"}`}>/month</p>
                <ul className={`mt-6 space-y-2 text-sm text-left ${tier.featured ? "text-cream/90" : "text-gold-800"}`}>
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className={tier.featured ? "text-cream" : "text-gold-500"}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="/sign-up"
                  className={`mt-6 block rounded-full py-2.5 text-center text-sm font-semibold transition-colors ${
                    tier.featured
                      ? "bg-cream text-gold-700 hover:bg-gold-50"
                      : "bg-gold-500 text-cream hover:bg-gold-600"
                  }`}
                >
                  Get Started
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HIPAA callout */}
      <section className="bg-gold-700 px-6 py-14">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-cream">Built HIPAA-Compliant from Day One</h2>
          <p className="mt-3 text-gold-200">
            Encrypted at rest and in transit. Audit logs on all PHI access. Role-based access
            controls. Business Associate Agreements available with all vendors.
          </p>
        </div>
      </section>

      <footer className="border-t border-gold-100 bg-cream px-6 py-8 text-center text-sm text-gold-600">
        © {new Date().getFullYear()} MedAesthetics. All rights reserved.
      </footer>
    </main>
  );
}

const features = [
  {
    icon: "📅",
    title: "Smart Scheduling",
    description:
      "Client self-booking, multi-provider calendars, automated SMS and email reminders.",
  },
  {
    icon: "📋",
    title: "Clinical Charting",
    description: "SOAP notes, injection mapping with body diagrams, provider e-signatures.",
  },
  {
    icon: "📸",
    title: "Before & After Photos",
    description:
      "Encrypted photo storage with side-by-side comparison — private by default.",
  },
  {
    icon: "💳",
    title: "Billing & Invoicing",
    description:
      "Stripe-powered payments, packages, memberships, and automated invoices.",
  },
  {
    icon: "📝",
    title: "Digital Forms",
    description:
      "Custom intake and consent forms with digital signatures, timestamps, and PDF export.",
  },
  {
    icon: "📦",
    title: "Inventory",
    description:
      "Track injectables by unit, get low-stock alerts, and monitor expiry dates.",
  },
  {
    icon: "⭐",
    title: "Loyalty & Marketing",
    description:
      "Loyalty points, discount codes, and targeted SMS/email campaigns.",
  },
  {
    icon: "🎥",
    title: "Telehealth",
    description:
      "HIPAA-compliant video consultations via Daily.co with session notes.",
  },
  {
    icon: "🔒",
    title: "HIPAA Compliance",
    description:
      "Full audit logs, role-based access, encryption at rest and in transit.",
  },
];

const pricingTiers = [
  {
    name: "Starter",
    price: "$99",
    featured: false,
    features: ["1 provider", "Unlimited clients", "Scheduling & charting", "5 GB storage"],
  },
  {
    name: "Growth",
    price: "$249",
    featured: true,
    features: [
      "Up to 3 providers",
      "Everything in Starter",
      "Inventory & loyalty",
      "25 GB storage",
    ],
  },
  {
    name: "Pro",
    price: "$499",
    featured: false,
    features: [
      "Up to 10 providers",
      "Everything in Growth",
      "Telehealth + campaigns",
      "100 GB storage",
    ],
  },
];
