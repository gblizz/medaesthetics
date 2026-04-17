import type { Metadata } from "next";
import localFont from "next/font/local";
import { Cormorant_Garamond } from "next/font/google";
import { practice } from "../content";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: `${practice.name} | Physician-Led Aesthetic Care`,
  description: practice.heroSubtitle,
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services + Pricing" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${cormorant.variable} antialiased`}>
        {/* Header */}
        <header className="sticky top-0 z-50 bg-black">
          <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
            <a href="/" style={{ color: "#ffffff" }} className="font-serif text-2xl tracking-[0.12em]">
              {practice.name}
            </a>
            <nav className="hidden items-center gap-8 md:flex">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  style={{ color: "#999999" }}
                  className="text-[11px] tracking-[0.2em] uppercase transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={`${practice.patientPortalUrl}/sign-in`}
                style={{ color: "#999999" }}
                className="text-[11px] tracking-[0.2em] uppercase transition-colors hover:text-white"
              >
                Log In
              </a>
              <a
                href={practice.bookingUrl}
                style={{ color: "#ffffff", borderColor: "#ffffff" }}
                className="border px-5 py-2 text-[11px] tracking-[0.2em] uppercase transition-colors hover:bg-white hover:text-black"
              >
                Book Now
              </a>
            </nav>
          </div>
        </header>

        {children}

        {/* Footer */}
        <footer className="bg-black py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-12 md:grid-cols-3">
              <div>
                <p style={{ color: "#ffffff" }} className="font-serif text-xl tracking-[0.12em]">
                  {practice.name}
                </p>
                <p style={{ color: "rgba(255,255,255,0.4)" }} className="mt-4 text-[11px] tracking-[0.2em] uppercase">
                  {practice.tagline}
                </p>
              </div>
              <div>
                <p style={{ color: "rgba(255,255,255,0.4)" }} className="mb-4 text-[10px] tracking-[0.25em] uppercase">
                  Contact
                </p>
                <p style={{ color: "rgba(255,255,255,0.7)" }} className="text-sm">
                  {practice.phone}
                </p>
                <p style={{ color: "rgba(255,255,255,0.7)" }} className="mt-1 text-sm">
                  {practice.email}
                </p>
                <a
                  href={practice.instagramUrl}
                  style={{ color: "rgba(255,255,255,0.5)" }}
                  className="mt-4 inline-block text-[11px] tracking-[0.2em] uppercase transition-colors hover:text-white"
                >
                  {practice.instagram}
                </a>
              </div>
              <div>
                <p style={{ color: "rgba(255,255,255,0.4)" }} className="mb-4 text-[10px] tracking-[0.25em] uppercase">
                  Hours
                </p>
                {practice.hours.map((h) => (
                  <p key={h.days} style={{ color: "rgba(255,255,255,0.7)" }} className="text-sm leading-relaxed">
                    {h.days}: {h.hours}
                  </p>
                ))}
              </div>
            </div>
            <div style={{ borderColor: "rgba(255,255,255,0.1)" }} className="mt-14 border-t pt-8 text-center">
              <p style={{ color: "rgba(255,255,255,0.3)" }} className="text-[11px] tracking-[0.15em]">
                © {new Date().getFullYear()} {practice.name}. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
