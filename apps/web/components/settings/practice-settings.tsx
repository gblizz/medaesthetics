"use client";

import { useState } from "react";
import { trpc } from "../../lib/trpc";

interface Practice {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  addressLine1: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  timezone: string;
  primaryColor: string | null;
}

interface Props {
  practice: Practice;
}

export function PracticeSettings({ practice }: Props) {
  const [form, setForm] = useState({
    name: practice.name,
    phone: practice.phone ?? "",
    email: practice.email ?? "",
    website: practice.website ?? "",
    addressLine1: practice.addressLine1 ?? "",
    city: practice.city ?? "",
    state: practice.state ?? "",
    zip: practice.zip ?? "",
    timezone: practice.timezone,
    primaryColor: practice.primaryColor ?? "#6366f1",
  });

  const update = trpc.practice.update.useMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    update.mutate(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Practice Information</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {(
            [
              { key: "name", label: "Practice Name", required: true },
              { key: "phone", label: "Phone" },
              { key: "email", label: "Email" },
              { key: "website", label: "Website" },
              { key: "addressLine1", label: "Address" },
              { key: "city", label: "City" },
              { key: "state", label: "State" },
              { key: "zip", label: "ZIP" },
            ] as const
          ).map(({ key, label, required }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                value={form[key]}
                onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700">Brand Color</label>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="color"
                value={form.primaryColor}
                onChange={(e) => setForm((prev) => ({ ...prev, primaryColor: e.target.value }))}
                className="h-9 w-16 cursor-pointer rounded border border-gray-300"
              />
              <span className="text-sm text-gray-500">{form.primaryColor}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={update.isPending}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {update.isPending ? "Saving..." : "Save Changes"}
        </button>
        {update.isSuccess && (
          <span className="text-sm text-green-600">Saved successfully</span>
        )}
      </div>
    </form>
  );
}
