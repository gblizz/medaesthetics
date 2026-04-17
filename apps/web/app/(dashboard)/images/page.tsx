"use client";

import { useState } from "react";
import { IMAGE_PROMPTS, type ImagePromptKey } from "@repo/ai";

type Status = "idle" | "generating" | "done" | "error";

interface ImageSlot {
  key: ImagePromptKey;
  label: string;
  description: string;
}

const SLOTS: { section: string; items: ImageSlot[] }[] = [
  {
    section: "Lifestyle & Ambiance",
    items: [
      { key: "lifestyle_hero", label: "Hero / Banner", description: "Spa interior for homepage hero" },
      { key: "lifestyle_consultation", label: "Consultation Room", description: "Elegant treatment room" },
      { key: "lifestyle_products", label: "Products", description: "Premium skincare products" },
      { key: "lifestyle_ambiance", label: "Waiting Area", description: "Luxury lobby ambiance" },
    ],
  },
  {
    section: "Physician",
    items: [
      { key: "physician_portrait", label: "Portrait", description: "Professional headshot" },
      { key: "physician_consultation", label: "Consultation", description: "Physician with patient" },
      { key: "physician_treatment", label: "Treatment", description: "Performing a procedure" },
    ],
  },
  {
    section: "Treatments",
    items: [
      { key: "treatment_botox", label: "Botox / Neurotoxin", description: "Smooth skin result" },
      { key: "treatment_filler", label: "Lip Filler", description: "Natural lip enhancement" },
      { key: "treatment_cheeks", label: "Cheek Filler", description: "Lifted cheek contour" },
      { key: "treatment_undereyes", label: "Under Eyes", description: "Refreshed eye area" },
      { key: "treatment_jawline", label: "Jawline / Chin", description: "Defined jaw profile" },
      { key: "treatment_peel", label: "Chemical Peel", description: "Radiant skin result" },
    ],
  },
];

interface SlotState {
  status: Status;
  path?: string;
  error?: string;
  revisedPrompt?: string;
}

export default function ImagesPage() {
  const [states, setStates] = useState<Record<string, SlotState>>({});
  const [customPrompt, setCustomPrompt] = useState("");
  const [customKey, setCustomKey] = useState("");
  const [customState, setCustomState] = useState<SlotState>({ status: "idle" });

  async function generate(key: ImagePromptKey) {
    setStates((s) => ({ ...s, [key]: { status: "generating" } }));
    try {
      const res = await fetch("/api/images/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setStates((s) => ({ ...s, [key]: { status: "done", path: data.path, revisedPrompt: data.revisedPrompt } }));
    } catch (err) {
      setStates((s) => ({ ...s, [key]: { status: "error", error: String(err) } }));
    }
  }

  async function generateCustom() {
    if (!customPrompt.trim()) return;
    setCustomState({ status: "generating" });
    try {
      const res = await fetch("/api/images/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customPrompt: customPrompt.trim(), key: customKey.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setCustomState({ status: "done", path: data.path, revisedPrompt: data.revisedPrompt });
    } catch (err) {
      setCustomState({ status: "error", error: String(err) });
    }
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Marketing Images</h1>
        <p className="mt-1 text-sm text-gray-500">
          Generate AI images using Grok Imagine. Images are saved to the marketing site&apos;s public folder.
        </p>
      </div>

      {SLOTS.map(({ section, items }) => (
        <div key={section}>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">{section}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map(({ key, label, description }) => {
              const state = states[key] ?? { status: "idle" };
              return (
                <div key={key} className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                  <div className="relative aspect-[4/3] bg-gray-50">
                    {state.status === "done" && state.path ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`http://localhost:3002${state.path}`}
                        alt={label}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        {state.status === "generating" ? (
                          <div className="text-center">
                            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />
                            <p className="mt-2 text-xs text-gray-400">Generating…</p>
                          </div>
                        ) : state.status === "error" ? (
                          <p className="px-4 text-center text-xs text-red-500">{state.error}</p>
                        ) : (
                          <p className="text-xs text-gray-300">No image yet</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-800">{label}</p>
                    <p className="text-xs text-gray-400">{description}</p>
                    <p className="mt-1 font-mono text-[10px] text-gray-300">{key}</p>
                    <button
                      onClick={() => generate(key)}
                      disabled={state.status === "generating"}
                      className="mt-3 w-full rounded bg-gray-900 px-3 py-1.5 text-xs text-white transition hover:bg-gray-700 disabled:opacity-40"
                    >
                      {state.status === "done" ? "Regenerate" : "Generate"}
                    </button>
                    {state.status === "done" && state.path && (
                      <a
                        href={`http://localhost:3002${state.path}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 block text-center text-[10px] text-blue-500 hover:underline"
                      >
                        View on marketing site
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Custom prompt */}
      <div>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">Custom Prompt</h2>
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-gray-600">Prompt</label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Describe the image you want to generate…"
                rows={3}
                className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Save as filename (optional)</label>
              <input
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                placeholder="e.g. hero_summer"
                className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
          </div>
          <button
            onClick={generateCustom}
            disabled={!customPrompt.trim() || customState.status === "generating"}
            className="mt-4 rounded bg-gray-900 px-5 py-2 text-sm text-white transition hover:bg-gray-700 disabled:opacity-40"
          >
            {customState.status === "generating" ? "Generating…" : "Generate Image"}
          </button>
          {customState.status === "done" && customState.path && (
            <div className="mt-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`http://localhost:3002${customState.path}`}
                alt="Generated"
                className="max-h-64 rounded border border-gray-100 object-contain"
              />
              <p className="mt-2 font-mono text-xs text-gray-400">Saved to: {customState.path}</p>
            </div>
          )}
          {customState.status === "error" && (
            <p className="mt-3 text-sm text-red-500">{customState.error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
