"use client";

import { useState } from "react";
import { practice, locations } from "../../content";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire to email service (Resend)
    setSubmitted(true);
  };

  const inputClass =
    "mt-2 block w-full border-0 border-b bg-transparent px-0 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:border-gray-900 focus:outline-none transition-colors";
  const labelClass = "block text-[10px] tracking-[0.2em] uppercase text-gray-400";

  return (
    <main>
      <section className="bg-black px-6 py-28 text-center">
        <p style={{ color: "rgba(255,255,255,0.4)" }} className="text-[11px] tracking-[0.3em] uppercase">
          Get in Touch
        </p>
        <h1 style={{ color: "#ffffff" }} className="mt-4 font-serif text-6xl font-light">
          Contact
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)" }} className="mt-6 font-serif text-lg font-light italic">
          We&apos;d love to hear from you.
        </p>
      </section>

      <section className="bg-white px-6 py-24">
        <div className="mx-auto grid max-w-6xl gap-20 lg:grid-cols-2">

          {/* Contact info */}
          <div>
            <p className="text-[11px] tracking-[0.25em] uppercase text-gray-400">Find Us</p>
            <h2 className="mt-4 font-serif text-4xl font-light text-gray-900">Visit the Practice</h2>
            <div className="mt-10 space-y-8">
              {locations.map((loc) => (
                <div key={loc.name}>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400">{loc.name}</p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">
                    {loc.addressLine1}{loc.addressLine2 && <><br />{loc.addressLine2}</>}<br />
                    {loc.city}, {loc.state} {loc.zip}
                  </p>
                </div>
              ))}
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400">Phone</p>
                <a href={`tel:${practice.phone.replace(/\D/g, "")}`} className="mt-2 block text-sm text-gray-700 transition-colors hover:text-gray-900">
                  {practice.phone}
                </a>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400">Email</p>
                <a href={`mailto:${practice.email}`} className="mt-2 block text-sm text-gray-700 transition-colors hover:text-gray-900">
                  {practice.email}
                </a>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400">Hours</p>
                {practice.hours.map((h) => (
                  <p key={h.days} className="mt-1 text-sm text-gray-700">
                    {h.days}: {h.hours}
                  </p>
                ))}
              </div>
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400">Instagram</p>
                <a href={practice.instagramUrl} className="mt-2 block text-sm text-gray-700 transition-colors hover:text-gray-900">
                  {practice.instagram}
                </a>
              </div>
            </div>
            <div className="mt-12">
              <a
                href={practice.bookingUrl}
                className="inline-block bg-black px-10 py-4 text-[11px] tracking-[0.2em] uppercase transition-colors hover:bg-gray-800"
                style={{ color: "#ffffff" }}
              >
                Book Online Now
              </a>
            </div>
          </div>

          {/* Contact form */}
          <div>
            <p className="text-[11px] tracking-[0.25em] uppercase text-gray-400">Send a Message</p>
            <h2 className="mt-4 font-serif text-4xl font-light text-gray-900">Get in Touch</h2>
            {submitted ? (
              <div className="mt-10 border border-stone-100 bg-stone-50 px-8 py-12 text-center">
                <p className="font-serif text-2xl font-light text-gray-800">Thank you.</p>
                <p className="mt-3 text-sm text-gray-500">We&apos;ll be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-10 space-y-8">
                <div>
                  <label className={labelClass}>Name</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" className={inputClass} style={{ borderColor: "#e5e5e5" }} />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" className={inputClass} style={{ borderColor: "#e5e5e5" }} />
                </div>
                <div>
                  <label className={labelClass}>Message</label>
                  <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="How can we help you?" className={inputClass + " resize-none"} style={{ borderColor: "#e5e5e5" }} />
                </div>
                <button type="submit" className="w-full bg-black py-4 text-[11px] tracking-[0.2em] uppercase transition-colors hover:bg-gray-800" style={{ color: "#ffffff" }}>
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
