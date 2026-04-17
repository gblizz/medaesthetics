"use client";

import { useState, useEffect } from "react";
import { Cormorant_Garamond } from "next/font/google";
import { onboardPractice, type OnboardingData, type ServiceInput } from "../actions/onboard";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// ─── Types ────────────────────────────────────────────────────────────────────

type PracticeData = OnboardingData["practice"];
type LocationData = OnboardingData["location"];
type ProviderData = OnboardingData["provider"];

type BrandingData = {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  titleFont: string;
  headerFont: string;
  bodyFont: string;
};

// ─── Font definitions ─────────────────────────────────────────────────────────

type FontOption = { name: string; category: string; googleFamily: string };

const TITLE_FONTS: FontOption[] = [
  { name: "Cormorant Garamond", category: "Serif", googleFamily: "Cormorant+Garamond:wght@400;600" },
  { name: "Playfair Display",   category: "Serif", googleFamily: "Playfair+Display:wght@400;600" },
  { name: "DM Serif Display",   category: "Serif", googleFamily: "DM+Serif+Display" },
  { name: "Libre Baskerville",  category: "Serif", googleFamily: "Libre+Baskerville:wght@400;700" },
  { name: "Josefin Sans",       category: "Sans",  googleFamily: "Josefin+Sans:wght@300;400" },
  { name: "Raleway",            category: "Sans",  googleFamily: "Raleway:wght@300;400" },
];

const HEADER_FONTS: FontOption[] = [
  { name: "Montserrat",  category: "Sans", googleFamily: "Montserrat:wght@400;600" },
  { name: "Raleway",     category: "Sans", googleFamily: "Raleway:wght@400;600" },
  { name: "Josefin Sans",category: "Sans", googleFamily: "Josefin+Sans:wght@300;400" },
  { name: "DM Sans",     category: "Sans", googleFamily: "DM+Sans:wght@400;500" },
  { name: "Nunito Sans", category: "Sans", googleFamily: "Nunito+Sans:wght@400;600" },
  { name: "Lato",        category: "Sans", googleFamily: "Lato:wght@400;700" },
];

const BODY_FONTS: FontOption[] = [
  { name: "Inter",         category: "Sans", googleFamily: "Inter:wght@400;500" },
  { name: "DM Sans",       category: "Sans", googleFamily: "DM+Sans:wght@400;500" },
  { name: "Lato",          category: "Sans", googleFamily: "Lato:wght@400;400" },
  { name: "Open Sans",     category: "Sans", googleFamily: "Open+Sans:wght@400;500" },
  { name: "Nunito",        category: "Sans", googleFamily: "Nunito:wght@400;500" },
  { name: "Source Sans 3", category: "Sans", googleFamily: "Source+Sans+3:wght@400;500" },
];

function loadGoogleFont(googleFamily: string) {
  const id = `gfont-${googleFamily.replace(/[^a-z0-9]/gi, "-")}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${googleFamily}&display=swap`;
  document.head.appendChild(link);
}

// ─── US States ────────────────────────────────────────────────────────────────

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC",
];

// ─── Step sidebar data ────────────────────────────────────────────────────────

const STEPS = [
  { number: 1, label: "Practice Details" },
  { number: 2, label: "Branding" },
  { number: 3, label: "Location" },
  { number: 4, label: "Your Profile" },
  { number: 5, label: "Your Services" },
  { number: 6, label: "Review & Launch" },
];

// ─── Defaults ─────────────────────────────────────────────────────────────────

const defaultPractice: Omit<PracticeData, "primaryColor" | "secondaryColor" | "accentColor" | "titleFont" | "headerFont" | "bodyFont"> = {
  name: "",
  tagline: "",
  phone: "",
  email: "",
  website: "",
  timezone: "America/New_York",
};

const defaultBranding: BrandingData = {
  primaryColor: "#c9a96e",
  secondaryColor: "#111111",
  accentColor: "#f5f0eb",
  titleFont: "Cormorant Garamond",
  headerFont: "Montserrat",
  bodyFont: "Inter",
};

const defaultLocation: LocationData = {
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  zip: "",
};

const defaultProvider: ProviderData = {
  firstName: "",
  lastName: "",
  email: "",
  title: "",
  bio: "",
  npiNumber: "",
};

const defaultService = (): ServiceInput => ({
  name: "",
  description: "",
  durationMins: 60,
  price: 0,
});

// ─── Shared input styles ──────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.65rem",
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: "#999999",
  marginBottom: "6px",
};

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
      {error && (
        <p style={{ fontSize: "0.72rem", color: "#dc2626", marginTop: "4px" }}>{error}</p>
      )}
    </div>
  );
}

function inputStyle(hasError: boolean): React.CSSProperties {
  return {
    width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: `1px solid ${hasError ? "#dc2626" : "#e5e7eb"}`,
    outline: "none",
    padding: "6px 0",
    fontSize: "0.9rem",
    color: "#111111",
    fontFamily: "inherit",
  };
}

// ─── Step 1: Practice Details ──────────────────────────────────────────────────

type PracticeBasicData = Omit<PracticeData, "primaryColor" | "secondaryColor" | "accentColor" | "titleFont" | "headerFont" | "bodyFont">;
type PracticeBasicErrors = Partial<Record<keyof PracticeBasicData, string>>;

function StepPractice({
  data,
  setData,
  errors,
}: {
  data: PracticeBasicData;
  setData: (d: PracticeBasicData) => void;
  errors: PracticeBasicErrors;
}) {
  const set = (k: keyof PracticeBasicData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setData({ ...data, [k]: e.target.value });

  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
      <div className="col-span-2">
        <Field label="Business Name *" error={errors.name}>
          <input
            style={inputStyle(!!errors.name)}
            value={data.name}
            onChange={set("name")}
            placeholder="Glow Aesthetic Studio"
          />
        </Field>
      </div>
      <div className="col-span-2">
        <Field label="Tagline">
          <input
            style={inputStyle(false)}
            value={data.tagline}
            onChange={set("tagline")}
            placeholder="Where science meets beauty"
          />
        </Field>
      </div>
      <Field label="Phone">
        <input
          style={inputStyle(false)}
          value={data.phone}
          onChange={set("phone")}
          placeholder="(555) 000-0000"
          type="tel"
        />
      </Field>
      <Field label="Email">
        <input
          style={inputStyle(false)}
          value={data.email}
          onChange={set("email")}
          placeholder="hello@mypractice.com"
          type="email"
        />
      </Field>
      <Field label="Website">
        <input
          style={inputStyle(false)}
          value={data.website}
          onChange={set("website")}
          placeholder="https://mypractice.com"
          type="url"
        />
      </Field>
      <Field label="Timezone">
        <select
          style={{ ...inputStyle(false), cursor: "pointer" }}
          value={data.timezone}
          onChange={set("timezone")}
        >
          <option value="America/New_York">Eastern (ET)</option>
          <option value="America/Chicago">Central (CT)</option>
          <option value="America/Denver">Mountain (MT)</option>
          <option value="America/Los_Angeles">Pacific (PT)</option>
          <option value="America/Phoenix">Arizona (MT, no DST)</option>
        </select>
      </Field>
    </div>
  );
}

// ─── Step 2: Branding ─────────────────────────────────────────────────────────

function FontCard({
  font,
  selected,
  sampleText,
  onSelect,
}: {
  font: FontOption;
  selected: boolean;
  sampleText: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      style={{
        textAlign: "left",
        padding: "16px",
        border: selected ? "2px solid #111111" : "1px solid #e5e7eb",
        background: selected ? "#fafafa" : "#ffffff",
        cursor: "pointer",
        transition: "border-color 0.15s",
        width: "100%",
      }}
    >
      <p
        style={{
          fontFamily: `"${font.name}", ${font.category === "Serif" ? "Georgia, serif" : "system-ui, sans-serif"}`,
          fontSize: "1.4rem",
          fontWeight: 400,
          color: "#111111",
          marginBottom: "6px",
          lineHeight: 1.2,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {sampleText}
      </p>
      <p style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#aaaaaa" }}>
        {font.name} · {font.category}
      </p>
      {selected && (
        <p style={{ fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#111111", marginTop: "4px", fontWeight: 600 }}>
          ✓ Selected
        </p>
      )}
    </button>
  );
}

function StepBranding({
  data,
  setData,
  practiceName,
}: {
  data: BrandingData;
  setData: (d: BrandingData) => void;
  practiceName: string;
}) {
  // Load all font families on mount
  useEffect(() => {
    [...TITLE_FONTS, ...HEADER_FONTS, ...BODY_FONTS].forEach((f) => loadGoogleFont(f.googleFamily));
  }, []);

  const previewName = practiceName || "Your Practice Name";

  return (
    <div className="space-y-12">
      {/* Colors */}
      <div>
        <label style={labelStyle}>Brand Colors</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px", marginTop: "8px" }}>
          {(
            [
              { key: "primaryColor",   label: "Primary" },
              { key: "secondaryColor", label: "Secondary" },
              { key: "accentColor",    label: "Accent" },
            ] as { key: keyof BrandingData; label: string }[]
          ).map(({ key, label }) => (
            <div key={key}>
              <p style={{ fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#bbbbbb", marginBottom: "8px" }}>
                {label}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="color"
                  value={data[key] as string}
                  onChange={(e) => setData({ ...data, [key]: e.target.value })}
                  style={{
                    width: "36px",
                    height: "36px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "4px",
                    background: "transparent",
                    cursor: "pointer",
                    padding: "2px",
                    flexShrink: 0,
                  }}
                />
                <input
                  style={{ ...inputStyle(false), flex: 1, fontSize: "0.8rem" }}
                  value={data[key] as string}
                  onChange={(e) => setData({ ...data, [key]: e.target.value })}
                  placeholder="#000000"
                  maxLength={7}
                />
              </div>
              <div
                style={{
                  marginTop: "8px",
                  height: "4px",
                  borderRadius: "2px",
                  backgroundColor: data[key] as string,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Title Font */}
      <div>
        <label style={labelStyle}>Business Title Font</label>
        <p style={{ fontSize: "0.75rem", color: "#aaaaaa", marginBottom: "12px" }}>Used for your practice name and hero headings.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
          {TITLE_FONTS.map((font) => (
            <FontCard
              key={font.name}
              font={font}
              selected={data.titleFont === font.name}
              sampleText={previewName}
              onSelect={() => setData({ ...data, titleFont: font.name })}
            />
          ))}
        </div>
      </div>

      {/* Header Font */}
      <div>
        <label style={labelStyle}>Header Font</label>
        <p style={{ fontSize: "0.75rem", color: "#aaaaaa", marginBottom: "12px" }}>Used for section headings and navigation.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
          {HEADER_FONTS.map((font) => (
            <FontCard
              key={font.name}
              font={font}
              selected={data.headerFont === font.name}
              sampleText="Our Services"
              onSelect={() => setData({ ...data, headerFont: font.name })}
            />
          ))}
        </div>
      </div>

      {/* Body Font */}
      <div>
        <label style={labelStyle}>Paragraph Font</label>
        <p style={{ fontSize: "0.75rem", color: "#aaaaaa", marginBottom: "12px" }}>Used for body text and descriptions.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
          {BODY_FONTS.map((font) => (
            <FontCard
              key={font.name}
              font={font}
              selected={data.bodyFont === font.name}
              sampleText="Beautiful results, crafted with care."
              onSelect={() => setData({ ...data, bodyFont: font.name })}
            />
          ))}
        </div>
      </div>

      {/* Live preview */}
      <div>
        <label style={labelStyle}>Live Preview</label>
        <div
          style={{
            marginTop: "12px",
            padding: "40px",
            backgroundColor: data.accentColor || "#f5f0eb",
            border: "1px solid #e5e7eb",
          }}
        >
          <p
            style={{
              fontFamily: `"${data.titleFont}", Georgia, serif`,
              fontSize: "2rem",
              fontWeight: 400,
              color: data.primaryColor || "#c9a96e",
              marginBottom: "8px",
              lineHeight: 1.2,
            }}
          >
            {previewName}
          </p>
          <p
            style={{
              fontFamily: `"${data.headerFont}", system-ui, sans-serif`,
              fontSize: "1rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: data.secondaryColor || "#111111",
              marginBottom: "12px",
            }}
          >
            Our Services
          </p>
          <p
            style={{
              fontFamily: `"${data.bodyFont}", system-ui, sans-serif`,
              fontSize: "0.9rem",
              lineHeight: 1.6,
              color: data.secondaryColor || "#111111",
              opacity: 0.7,
              maxWidth: "480px",
            }}
          >
            Personalized aesthetic treatments crafted to enhance your natural beauty. We combine science and artistry
            to help you look and feel your best.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Step 3: Location ─────────────────────────────────────────────────────────

type LocationErrors = Partial<Record<keyof LocationData, string>>;

function StepLocation({
  data,
  setData,
  errors,
}: {
  data: LocationData;
  setData: (d: LocationData) => void;
  errors: LocationErrors;
}) {
  const set = (k: keyof LocationData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setData({ ...data, [k]: e.target.value });

  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
      <div className="col-span-2">
        <Field label="Address Line 1 *" error={errors.addressLine1}>
          <input
            style={inputStyle(!!errors.addressLine1)}
            value={data.addressLine1}
            onChange={set("addressLine1")}
            placeholder="123 Main Street"
          />
        </Field>
      </div>
      <div className="col-span-2">
        <Field label="Address Line 2">
          <input
            style={inputStyle(false)}
            value={data.addressLine2}
            onChange={set("addressLine2")}
            placeholder="Suite 200"
          />
        </Field>
      </div>
      <Field label="City *" error={errors.city}>
        <input
          style={inputStyle(!!errors.city)}
          value={data.city}
          onChange={set("city")}
          placeholder="Beverly Hills"
        />
      </Field>
      <Field label="State *" error={errors.state}>
        <select
          style={{ ...inputStyle(!!errors.state), cursor: "pointer" }}
          value={data.state}
          onChange={set("state")}
        >
          <option value="">Select state…</option>
          {US_STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </Field>
      <Field label="ZIP Code *" error={errors.zip}>
        <input
          style={inputStyle(!!errors.zip)}
          value={data.zip}
          onChange={set("zip")}
          placeholder="90210"
          maxLength={10}
        />
      </Field>
    </div>
  );
}

// ─── Step 4: Provider ─────────────────────────────────────────────────────────

type ProviderErrors = Partial<Record<keyof ProviderData, string>>;

function StepProvider({
  data,
  setData,
  errors,
}: {
  data: ProviderData;
  setData: (d: ProviderData) => void;
  errors: ProviderErrors;
}) {
  const set = (k: keyof ProviderData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setData({ ...data, [k]: e.target.value });

  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
      <Field label="First Name *" error={errors.firstName}>
        <input
          style={inputStyle(!!errors.firstName)}
          value={data.firstName}
          onChange={set("firstName")}
          placeholder="Jane"
        />
      </Field>
      <Field label="Last Name *" error={errors.lastName}>
        <input
          style={inputStyle(!!errors.lastName)}
          value={data.lastName}
          onChange={set("lastName")}
          placeholder="Smith"
        />
      </Field>
      <div className="col-span-2">
        <Field label="Email Address *" error={errors.email}>
          <input
            style={inputStyle(!!errors.email)}
            value={data.email}
            onChange={set("email")}
            placeholder="jane@mypractice.com"
            type="email"
          />
        </Field>
      </div>
      <Field label="Title">
        <select
          style={{ ...inputStyle(false), cursor: "pointer" }}
          value={data.title}
          onChange={set("title")}
        >
          <option value="">Select title…</option>
          <option value="MD">MD</option>
          <option value="DO">DO</option>
          <option value="NP">NP</option>
          <option value="PA-C">PA-C</option>
          <option value="RN">RN</option>
          <option value="Other">Other</option>
        </select>
      </Field>
      <Field label="NPI Number">
        <input
          style={inputStyle(false)}
          value={data.npiNumber}
          onChange={set("npiNumber")}
          placeholder="1234567890"
          maxLength={10}
        />
      </Field>
      <div className="col-span-2">
        <Field label="Bio">
          <textarea
            style={{
              ...inputStyle(false),
              resize: "vertical",
              minHeight: "80px",
              paddingTop: "6px",
            }}
            value={data.bio}
            onChange={set("bio")}
            placeholder="Tell patients a little about yourself…"
          />
        </Field>
      </div>
    </div>
  );
}

// ─── Step 5: Services ─────────────────────────────────────────────────────────

function StepServices({
  services,
  setServices,
}: {
  services: ServiceInput[];
  setServices: (s: ServiceInput[]) => void;
}) {
  const updateService = (index: number, field: keyof ServiceInput, value: string | number) => {
    const updated = services.map((svc, i) =>
      i === index ? { ...svc, [field]: value } : svc
    );
    setServices(updated);
  };

  const removeService = (index: number) => {
    if (services.length <= 1) return;
    setServices(services.filter((_, i) => i !== index));
  };

  const addService = () => {
    setServices([...services, defaultService()]);
  };

  return (
    <div className="space-y-8">
      {services.map((svc, index) => (
        <div key={index} className="relative pb-8" style={{ borderBottom: "1px solid #f3f4f6" }}>
          <div className="flex items-center justify-between mb-4">
            <p style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#aaaaaa" }}>
              Service {index + 1}
            </p>
            {services.length > 1 && (
              <button
                type="button"
                onClick={() => removeService(index)}
                style={{ fontSize: "0.72rem", color: "#dc2626", background: "none", border: "none", cursor: "pointer" }}
              >
                Remove
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            <div className="col-span-2">
              <Field label="Service Name">
                <input
                  style={inputStyle(false)}
                  value={svc.name}
                  onChange={(e) => updateService(index, "name", e.target.value)}
                  placeholder="Botox Treatment"
                />
              </Field>
            </div>
            <Field label="Duration (mins)">
              <input
                style={inputStyle(false)}
                type="number"
                min={5}
                step={5}
                value={svc.durationMins}
                onChange={(e) => updateService(index, "durationMins", parseInt(e.target.value, 10) || 0)}
                placeholder="60"
              />
            </Field>
            <Field label="Price ($)">
              <input
                style={inputStyle(false)}
                type="number"
                min={0}
                step={0.01}
                value={svc.price === 0 ? "" : (svc.price / 100).toFixed(2)}
                onChange={(e) => {
                  const dollars = parseFloat(e.target.value) || 0;
                  updateService(index, "price", Math.round(dollars * 100));
                }}
                placeholder="350.00"
              />
            </Field>
            <div className="col-span-2">
              <Field label="Description">
                <textarea
                  style={{ ...inputStyle(false), resize: "vertical", minHeight: "60px", paddingTop: "6px" }}
                  value={svc.description}
                  onChange={(e) => updateService(index, "description", e.target.value)}
                  placeholder="Brief description of this service…"
                />
              </Field>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addService}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "0.78rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#111111",
          background: "none",
          border: "1px solid #e5e7eb",
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        + Add Another Service
      </button>
    </div>
  );
}

// ─── Step 6: Review ───────────────────────────────────────────────────────────

function ReviewCard({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <div className="mb-6 p-6 bg-stone-50" style={{ borderLeft: "3px solid #c9a96e" }}>
      <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#999999", marginBottom: "16px" }}>
        {title}
      </p>
      <dl className="space-y-2">
        {rows.map(([label, value]) =>
          value ? (
            <div key={label} style={{ display: "flex", gap: "16px", fontSize: "0.85rem", alignItems: "center" }}>
              <dt style={{ color: "#999999", minWidth: "140px", flexShrink: 0 }}>{label}</dt>
              <dd style={{ color: "#111111", display: "flex", alignItems: "center", gap: "8px" }}>
                {/^#[0-9a-fA-F]{3,6}$/.test(value) && (
                  <span style={{ display: "inline-block", width: "14px", height: "14px", borderRadius: "3px", backgroundColor: value, border: "1px solid #e5e7eb", flexShrink: 0 }} />
                )}
                {value}
              </dd>
            </div>
          ) : null
        )}
      </dl>
    </div>
  );
}

function StepReview({
  practice,
  branding,
  location,
  provider,
  services,
  agreed,
  setAgreed,
  onLaunch,
  loading,
  error,
}: {
  practice: PracticeBasicData;
  branding: BrandingData;
  location: LocationData;
  provider: ProviderData;
  services: ServiceInput[];
  agreed: boolean;
  setAgreed: (v: boolean) => void;
  onLaunch: () => void;
  loading: boolean;
  error: string | null;
}) {
  const namedServices = services.filter((s) => s.name.trim());

  return (
    <div>
      <ReviewCard
        title="Practice Details"
        rows={[
          ["Business Name", practice.name],
          ["Tagline", practice.tagline],
          ["Phone", practice.phone],
          ["Email", practice.email],
          ["Website", practice.website],
          ["Timezone", practice.timezone],
        ]}
      />
      <ReviewCard
        title="Branding"
        rows={[
          ["Primary Color", branding.primaryColor],
          ["Secondary Color", branding.secondaryColor],
          ["Accent Color", branding.accentColor],
          ["Title Font", branding.titleFont],
          ["Header Font", branding.headerFont],
          ["Body Font", branding.bodyFont],
        ]}
      />
      <ReviewCard
        title="Location"
        rows={[
          ["Address", [location.addressLine1, location.addressLine2].filter(Boolean).join(", ")],
          ["City / State / ZIP", [location.city, location.state, location.zip].filter(Boolean).join(" ")],
        ]}
      />
      <ReviewCard
        title="Provider Profile"
        rows={[
          ["Name", `${provider.firstName} ${provider.lastName}`.trim()],
          ["Email", provider.email],
          ["Title", provider.title],
          ["NPI", provider.npiNumber],
          ["Bio", provider.bio],
        ]}
      />
      {namedServices.length > 0 && (
        <ReviewCard
          title="Services"
          rows={namedServices.map((s) => [
            s.name,
            `${s.durationMins} min · $${(s.price / 100).toFixed(2)}`,
          ])}
        />
      )}

      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "24px" }}>
        <input
          id="agree"
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          style={{ marginTop: "2px", cursor: "pointer", accentColor: "#111111" }}
        />
        <label htmlFor="agree" style={{ fontSize: "0.85rem", color: "#555555", cursor: "pointer" }}>
          I&apos;m ready to launch — the information above is accurate and I&apos;m ready to create my practice.
        </label>
      </div>

      {error && (
        <div
          style={{
            padding: "12px 16px",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#dc2626",
            fontSize: "0.85rem",
            marginBottom: "16px",
          }}
        >
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={onLaunch}
        disabled={!agreed || loading}
        style={{
          padding: "14px 32px",
          backgroundColor: agreed && !loading ? "#111111" : "#d1d5db",
          color: "#ffffff",
          border: "none",
          fontSize: "0.8rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          cursor: agreed && !loading ? "pointer" : "not-allowed",
          transition: "background-color 0.15s",
        }}
      >
        {loading ? "Launching…" : "Launch My Practice"}
      </button>
    </div>
  );
}

// ─── Sidebar step indicator ───────────────────────────────────────────────────

function StepIndicator({ step, current }: { step: typeof STEPS[0]; current: number }) {
  const done = step.number < current;
  const active = step.number === current;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.75rem",
          fontWeight: 600,
          border: done
            ? "none"
            : active
            ? "none"
            : "1.5px solid rgba(255,255,255,0.2)",
          backgroundColor: done
            ? "#c9a96e"
            : active
            ? "rgba(255,255,255,0.15)"
            : "transparent",
          color: done ? "#000000" : "#ffffff",
        }}
      >
        {done ? "✓" : step.number}
      </div>
      <span
        style={{
          fontSize: "0.8rem",
          letterSpacing: "0.05em",
          color: active
            ? "#ffffff"
            : done
            ? "rgba(255,255,255,0.6)"
            : "rgba(255,255,255,0.3)",
          fontWeight: active ? 500 : 400,
        }}
      >
        {step.label}
      </span>
    </div>
  );
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validatePractice(data: PracticeBasicData): PracticeBasicErrors {
  const errors: PracticeBasicErrors = {};
  if (!data.name.trim()) errors.name = "Business name is required";
  return errors;
}

function validateLocation(data: LocationData): LocationErrors {
  const errors: LocationErrors = {};
  if (!data.addressLine1.trim()) errors.addressLine1 = "Address is required";
  if (!data.city.trim()) errors.city = "City is required";
  if (!data.state) errors.state = "State is required";
  if (!data.zip.trim()) errors.zip = "ZIP code is required";
  return errors;
}

function validateProvider(data: ProviderData): ProviderErrors {
  const errors: ProviderErrors = {};
  if (!data.firstName.trim()) errors.firstName = "First name is required";
  if (!data.lastName.trim()) errors.lastName = "Last name is required";
  if (!data.email.trim()) errors.email = "Email is required";
  return errors;
}

// ─── Main wizard ──────────────────────────────────────────────────────────────

export default function SetupPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const [practice, setPractice] = useState<PracticeBasicData>(defaultPractice);
  const [branding, setBranding] = useState<BrandingData>(defaultBranding);
  const [location, setLocation] = useState<LocationData>(defaultLocation);
  const [provider, setProvider] = useState<ProviderData>(defaultProvider);
  const [services, setServices] = useState<ServiceInput[]>([
    defaultService(),
    defaultService(),
    defaultService(),
  ]);

  const [practiceErrors, setPracticeErrors] = useState<PracticeBasicErrors>({});
  const [locationErrors, setLocationErrors] = useState<LocationErrors>({});
  const [providerErrors, setProviderErrors] = useState<ProviderErrors>({});

  const [agreed, setAgreed] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [launchError, setLaunchError] = useState<string | null>(null);

  const STEP_TITLES: Record<number, string> = {
    1: "Practice Details",
    2: "Branding",
    3: "Location",
    4: "Your Profile",
    5: "Your Services",
    6: "Review & Launch",
  };

  const STEP_SUBTITLES: Record<number, string> = {
    1: "Tell us about your practice.",
    2: "Choose your brand colors and fonts.",
    3: "Where is your practice located?",
    4: "Set up your provider profile.",
    5: "Add the services you offer.",
    6: "Everything look good? Let's go.",
  };

  const handleContinue = () => {
    if (currentStep === 1) {
      const errors = validatePractice(practice);
      setPracticeErrors(errors);
      if (Object.keys(errors).length > 0) return;
    }
    if (currentStep === 3) {
      const errors = validateLocation(location);
      setLocationErrors(errors);
      if (Object.keys(errors).length > 0) return;
    }
    if (currentStep === 4) {
      const errors = validateProvider(provider);
      setProviderErrors(errors);
      if (Object.keys(errors).length > 0) return;
    }
    setCurrentStep((s) => Math.min(s + 1, STEPS.length));
  };

  const handleBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  const handleLaunch = async () => {
    setLaunchError(null);
    setLaunching(true);
    try {
      const fullPractice: PracticeData = {
        ...practice,
        primaryColor: branding.primaryColor,
        secondaryColor: branding.secondaryColor,
        accentColor: branding.accentColor,
        titleFont: branding.titleFont,
        headerFont: branding.headerFont,
        bodyFont: branding.bodyFont,
      };
      await onboardPractice({ practice: fullPractice, location, provider, services });
      window.location.href = process.env.NEXT_PUBLIC_WEB_PORTAL_URL ?? "http://localhost:3000";
    } catch (err) {
      setLaunchError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLaunching(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* ── Sidebar ── */}
      <div
        style={{
          width: "280px",
          flexShrink: 0,
          backgroundColor: "#0a0a0a",
          display: "flex",
          flexDirection: "column",
          padding: "48px 32px",
        }}
      >
        <div style={{ marginBottom: "48px" }}>
          <p
            className={cormorant.className}
            style={{ fontSize: "0.85rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#c9a96e", marginBottom: "4px" }}
          >
            MedAesthetics
          </p>
          <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Practice Setup
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {STEPS.map((step) => (
            <StepIndicator key={step.number} step={step} current={currentStep} />
          ))}
        </div>
      </div>

      {/* ── Main content ── */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Step header */}
        <div style={{ padding: "48px 56px 32px", borderBottom: "1px solid #f3f4f6" }}>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a96e", marginBottom: "8px" }}>
            Step {currentStep} of {STEPS.length}
          </p>
          <h1
            className={cormorant.className}
            style={{ fontSize: "2.4rem", fontWeight: 600, color: "#111111", marginBottom: "6px" }}
          >
            {STEP_TITLES[currentStep]}
          </h1>
          <p style={{ fontSize: "0.9rem", color: "#888888" }}>{STEP_SUBTITLES[currentStep]}</p>
        </div>

        {/* Step body */}
        <div style={{ flex: 1, padding: "40px 56px", overflowY: "auto" }}>
          {currentStep === 1 && (
            <StepPractice data={practice} setData={setPractice} errors={practiceErrors} />
          )}
          {currentStep === 2 && (
            <StepBranding data={branding} setData={setBranding} practiceName={practice.name} />
          )}
          {currentStep === 3 && (
            <StepLocation data={location} setData={setLocation} errors={locationErrors} />
          )}
          {currentStep === 4 && (
            <StepProvider data={provider} setData={setProvider} errors={providerErrors} />
          )}
          {currentStep === 5 && (
            <StepServices services={services} setServices={setServices} />
          )}
          {currentStep === 6 && (
            <StepReview
              practice={practice}
              branding={branding}
              location={location}
              provider={provider}
              services={services}
              agreed={agreed}
              setAgreed={setAgreed}
              onLaunch={handleLaunch}
              loading={launching}
              error={launchError}
            />
          )}
        </div>

        {/* Navigation buttons */}
        {currentStep < STEPS.length && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "24px 56px",
              borderTop: "1px solid #f3f4f6",
            }}
          >
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              style={{
                padding: "12px 28px",
                background: "transparent",
                border: "1px solid #e5e7eb",
                color: currentStep === 1 ? "#d1d5db" : "#111111",
                fontSize: "0.78rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                cursor: currentStep === 1 ? "not-allowed" : "pointer",
              }}
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleContinue}
              style={{
                padding: "12px 32px",
                backgroundColor: "#111111",
                color: "#ffffff",
                border: "none",
                fontSize: "0.78rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Continue →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
