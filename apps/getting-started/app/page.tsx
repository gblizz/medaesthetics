import { Cormorant_Garamond } from "next/font/google";
import Link from "next/link";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const INCLUDED_FEATURES = [
  "Scheduling & Calendar",
  "Clinical Charting & SOAP Notes",
  "Patient Portal",
  "Billing & Invoicing",
  "Before & After Photos",
  "Digital Forms & Consent",
  "Inventory Management",
  "Loyalty & Marketing",
  "HIPAA Compliance",
];

export default function WelcomePage() {
  return (
    <div className="flex min-h-screen">
      {/* Left panel — dark */}
      <div
        className="flex flex-col justify-between px-12 py-16 w-1/2"
        style={{ backgroundColor: "#0a0a0a" }}
      >
        <div>
          {/* Logo / wordmark */}
          <p
            className={`${cormorant.className} text-sm tracking-[0.3em] uppercase mb-1`}
            style={{ color: "#c9a96e" }}
          >
            MedAesthetics
          </p>
          {/* Gold accent line */}
          <div className="w-12 h-px mt-3 mb-12" style={{ backgroundColor: "#c9a96e" }} />

          {/* Tagline */}
          <p
            className={`${cormorant.className} text-lg mb-10`}
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            The all-in-one platform for medical aesthetic practices.
          </p>

          {/* What's included */}
          <p
            className="text-xs tracking-[0.2em] uppercase mb-6"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            What&apos;s included
          </p>
          <ul className="space-y-3">
            {INCLUDED_FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <span style={{ color: "#c9a96e" }}>—</span>
                <span
                  className="text-sm tracking-wide"
                  style={{ color: "rgba(255,255,255,0.75)" }}
                >
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p
          className="text-xs"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          © {new Date().getFullYear()} MedAesthetics. All rights reserved.
        </p>
      </div>

      {/* Right panel — white */}
      <div className="flex flex-col justify-center px-20 py-16 w-1/2 bg-white">
        <div className="max-w-md">
          <h1
            className={`${cormorant.className} text-6xl font-semibold mb-4`}
            style={{ color: "#111111" }}
          >
            Welcome.
          </h1>
          <p className="text-lg mb-3" style={{ color: "#111111" }}>
            You&apos;re one step away from launching your practice.
          </p>
          <p className="text-sm leading-relaxed mb-10" style={{ color: "#666666" }}>
            Complete the 5-minute setup to configure your practice details, location,
            provider profile, and initial service menu. Once you&apos;re done, you&apos;ll
            have immediate access to your full MedAesthetics dashboard.
          </p>

          <Link
            href="/setup"
            className="inline-flex items-center gap-2 px-8 py-4 text-sm tracking-[0.15em] uppercase transition-opacity hover:opacity-80"
            style={{ backgroundColor: "#111111", color: "#ffffff" }}
          >
            Begin Setup →
          </Link>

          <p className="mt-8 text-xs" style={{ color: "#999999" }}>
            Already set up?{" "}
            <a
              href="http://localhost:3000"
              className="underline underline-offset-2"
              style={{ color: "#666666" }}
            >
              Sign in to your portal →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
