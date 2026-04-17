/**
 * Marketing site content configuration.
 *
 * CURRENT: Hardcoded here — edit this file to update the site.
 *
 * FUTURE: This will be replaced by live queries against the Practice, Provider,
 * Service, and Location tables. The shape of each section intentionally mirrors
 * the Prisma schema so the migration is a straight swap:
 *   practice      → Practice model
 *   providers     → Provider model
 *   services      → Service model
 *   locations     → Location model
 *   (testimonials, packages, peels have no DB table yet — add as needed)
 */

// ─── Practice ────────────────────────────────────────────────────────────────
// Maps to: Practice { name, phone, email, website, primaryColor, logoUrl, ... }

export const practice = {
  name: "Refined Aesthetic",
  tagline: "Your features. Your goals. Your beauty.",
  heroHeadline: "Elevate Your\nConfidence",
  heroSubtitle: "Physician-performed aesthetic care focused on facial rejuvenation and natural-looking results.",
  philosophyBody:
    "Every treatment is performed by a board-certified physician and thoughtfully tailored to your unique features and goals. Feel confident. Feel refreshed. Feel beautifully you.",
  phone: "(512) 402-2757",
  email: "rebecca@refined-aesthetic.com",
  instagram: "@refinedaestheticmd",
  instagramUrl: "https://instagram.com/refinedaestheticmd",
  bookingUrl: "http://localhost:3001/book",   // → NEXT_PUBLIC_PATIENT_PORTAL_URL/book
  patientPortalUrl: "http://localhost:3001",  // → NEXT_PUBLIC_PATIENT_PORTAL_URL
  hours: [
    { days: "Monday – Friday", hours: "9am – 4pm" },
    { days: "Saturday – Sunday", hours: "Closed" },
  ],
};

// ─── Locations ────────────────────────────────────────────────────────────────
// Maps to: Location { name, addressLine1, addressLine2, city, state, zip, phone }

export const locations = [
  {
    name: "Primary Location",
    addressLine1: "9901 N Capital of Texas Hwy",
    addressLine2: "Suite 240",
    city: "Austin",
    state: "TX",
    zip: "78759",
  },
  {
    name: "Secondary Location",
    addressLine1: "14400 Kira Lane",
    addressLine2: null,
    city: "Manor",
    state: "TX",
    zip: "78653",
  },
];

// ─── Providers ────────────────────────────────────────────────────────────────
// Maps to: Provider { firstName, lastName, title, bio, avatarUrl }

export const providers = [
  {
    firstName: "Rebecca",
    lastName: "Duby",
    title: "MD",
    credential: "Board-Certified Physician",
    specialty: "Emergency Medicine",
    yearsExperience: "10+",
    location: "Austin, Texas",
    heroQuote: "Feel confident. Feel refreshed. Feel beautifully you.",
    bio: [
      "I'm Rebecca Duby, MD — a board-certified emergency medicine physician with over a decade of clinical experience. After years in emergency medicine, I transitioned into aesthetic medicine and preventive health, drawn by a passion for helping people feel their most confident selves.",
      "My family recently relocated from Portland, Oregon to Austin, Texas — in pursuit of sunshine, warmth, and the incredible community this city has to offer. I couldn't be more grateful to call Austin home.",
      "The concept of vitality guides everything I do. Approaching age 40 and through the experience of motherhood, I became deeply invested in what it means to feel well, look refreshed, and age on your own terms — not society's.",
      "Medical aesthetics requires a rare blend of knowledge, skill, and artistry. My background in emergency medicine trained me to read anatomy quickly, think precisely, and act with steady hands. I bring that same clinical rigor to every treatment — combined with a genuine appreciation for what makes each face uniquely beautiful.",
      "My goal is never to change you. It's to help you look like the most rested, refreshed, confident version of yourself.",
    ],
    avatarUrl: null, // replace with actual photo URL or S3 key
  },
];

// ─── Services ────────────────────────────────────────────────────────────────
// Maps to: Service { name, description, price, durationMins }
// price is stored in cents in the DB; here we use display strings for flexibility.

export const services = [
  {
    name: "Botox",
    price: "Starting at $12 / unit",
    description:
      "Smooths fine lines and wrinkles across the forehead, between the brows, and around the eyes. Also used for jawline definition and neck bands. Results appear within days, fully settle in two weeks, and last up to four months.",
  },
  {
    name: "Dysport",
    price: "Starting at $4 / unit",
    description:
      "An alternative neurotoxin with the same smoothing effect as Botox. Dosing is 1:3 equivalent to Botox. Some patients find Dysport spreads more naturally in certain areas.",
  },
  {
    name: "Lip Enhancement",
    price: "Starting at $700 / syringe",
    description:
      "Hyaluronic acid filler to add volume, definition, and hydration to the lips. Results are subtle and natural — designed to complement your natural lip shape.",
  },
  {
    name: "Undereyes",
    price: "Starting at $700 / syringe",
    description:
      "Tear trough filler softens hollowing and dark circles beneath the eyes for a rested, refreshed appearance.",
  },
  {
    name: "Cheeks",
    price: "Starting at $700 / syringe",
    description:
      "Filler placed in the mid-face to restore lost volume, lift the midface, and create youthful contour.",
  },
  {
    name: "Jawline & Chin",
    price: "Starting at $700 / syringe",
    description:
      "Structural filler to define the jawline, balance facial proportions, and project the chin for a more refined profile.",
  },
  {
    name: "Smile Lines",
    price: "Starting at $700 / syringe",
    description:
      "Filler to soften nasolabial folds and marionette lines for a more rested, youthful expression.",
  },
  {
    name: "Full Face Rejuvenation",
    price: "Custom quote following consult",
    description:
      "A comprehensive, personalized plan combining neurotoxin and filler across multiple areas. Pricing determined following an in-person consultation.",
  },
  {
    name: "Facial Slimming (Kybella)",
    price: "Starting at $600 / vial",
    description:
      "FDA-approved injectable that dissolves unwanted fat beneath the chin and lower face. Most clients require 2–4 vials per session with multiple sessions for optimal results.",
  },
];

// ─── Packages ────────────────────────────────────────────────────────────────
// No direct DB equivalent yet — could become a ServicePackage relation.

export const packages = [
  {
    name: "Airbrush Package",
    tagline: "2 syringes of filler",
    description:
      "Buy 2 syringes of filler and receive $200 off. Option to add up to 50 units of Botox at $10/unit.",
    savings: "Total savings: $300",
  },
  {
    name: "Foundations Package",
    tagline: "Cheeks + Lips · 3 syringes",
    description:
      "Buy 3 syringes of filler and receive $350 off. Option to add up to 50 units of Botox at $10/unit.",
    savings: "Total savings: $450",
  },
  {
    name: "Definition Package",
    tagline: "4 syringes of filler",
    description:
      "Buy 4 syringes of filler and receive $500 off. Option to add up to 50 units of Botox at $10/unit.",
    savings: "Total savings: $600",
  },
];

// ─── Chemical Peels ───────────────────────────────────────────────────────────

export const peels = [
  {
    name: "Light Peel",
    price: "$125",
    description: "Gentle resurfacing to brighten skin tone and smooth texture with minimal downtime.",
  },
  {
    name: "Medium Peel",
    price: "$150",
    description: "Targets mild pigmentation, fine lines, and uneven texture. Expect 3–5 days of peeling.",
  },
  {
    name: "Moderate-Deep Peel",
    price: "$175",
    description:
      "Addresses deeper lines and pigmentation. More significant peeling over 5–7 days with notable results.",
  },
];

// ─── Concerns (homepage service grid) ────────────────────────────────────────

export const concerns = [
  "Full Face Rejuvenation",
  "Facial Balancing",
  "Fine Lines & Wrinkles",
  "Facial Contouring",
  "Volume Loss",
  "Facial Slimming",
  "Skin Rejuvenation",
  "Lip Enhancement",
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
// No DB table yet. Could become a Testimonial model on Practice.

export const testimonials = [
  {
    name: "Sarah M.",
    quote:
      "Rebecca is a magician — so artistic, thoughtful, skilled and knowledgeable. I walked out feeling like the best version of myself.",
  },
  {
    name: "Jennifer L.",
    quote:
      "I was nervous about fillers, but Rebecca took the time to understand exactly what I wanted. The results are incredibly natural.",
  },
  {
    name: "Amanda K.",
    quote:
      "The most professional, personalized experience I've had. Rebecca's medical background shows in every detail of her work.",
  },
];

// ─── Why Choose ───────────────────────────────────────────────────────────────

export const whyChoose = [
  {
    title: "Physician-Led",
    description:
      "Every injection is performed by a board-certified physician — never delegated to non-physician staff.",
  },
  {
    title: "Boutique Setting",
    description:
      "An intimate, private practice focused entirely on your comfort, safety, and results.",
  },
  {
    title: "FDA-Approved",
    description:
      "Only FDA-approved neurotoxins and hyaluronic acid fillers from trusted manufacturers.",
  },
  {
    title: "Natural Results",
    description:
      "Subtle, artful enhancements designed to complement your features — never overdone.",
  },
];
