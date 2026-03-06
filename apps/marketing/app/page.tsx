export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-50 to-white px-6 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
            HIPAA Compliant · Built for Medical Aesthetics
          </span>
          <h1 className="mt-6 text-5xl font-extrabold leading-tight text-gray-900">
            Run Your Aesthetics Practice{" "}
            <span className="text-indigo-600">End-to-End</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600">
            MedAesthetics is the all-in-one platform for Nurse Practitioners, PAs, and
            Physicians — from scheduling and charting to billing and before/after photos.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <a
              href="/sign-up"
              className="rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-indigo-700"
            >
              Start Free Trial
            </a>
            <a
              href="#features"
              className="rounded-xl border border-gray-300 px-6 py-3 text-base font-semibold text-gray-700 hover:bg-gray-50"
            >
              See Features
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Everything Your Practice Needs
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-6"
              >
                <div className="text-3xl">{f.icon}</div>
                <h3 className="mt-3 text-base font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900">Simple, Transparent Pricing</h2>
          <p className="mt-3 text-gray-600">One platform. No hidden fees. Cancel anytime.</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl border p-6 ${
                  tier.featured
                    ? "border-indigo-600 bg-indigo-600 text-white"
                    : "border-gray-200 bg-white"
                }`}
              >
                <p className="text-sm font-semibold uppercase tracking-wide opacity-75">
                  {tier.name}
                </p>
                <p className="mt-3 text-4xl font-bold">{tier.price}</p>
                <p className="opacity-70">/month</p>
                <ul className="mt-6 space-y-2 text-sm text-left">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="/sign-up"
                  className={`mt-6 block rounded-xl py-2 text-center text-sm font-semibold ${
                    tier.featured
                      ? "bg-white text-indigo-700 hover:bg-gray-100"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
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
      <section className="bg-indigo-700 px-6 py-12 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold">Built HIPAA-Compliant from Day One</h2>
          <p className="mt-3 text-indigo-200">
            Encrypted at rest and in transit. Audit logs on all PHI access. Role-based access
            controls. Business Associate Agreements available with all vendors.
          </p>
        </div>
      </section>

      <footer className="border-t border-gray-200 bg-white px-6 py-8 text-center text-sm text-gray-500">
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
