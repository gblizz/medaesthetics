"use client";

import { useState } from "react";
import { trpc } from "../../../components/trpc-provider";

const inputClass =
  "mt-2 block w-full border-0 border-b border-gray-200 bg-transparent px-0 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:border-gray-900 focus:outline-none transition-colors";

const labelClass = "block text-[10px] tracking-[0.2em] uppercase text-gray-400";

export default function BookAppointmentPage() {
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { data: services } = trpc.services.list.useQuery();
  const { data: providers } = trpc.providers.list.useQuery();

  const createAppt = trpc.appointments.create.useMutation({
    onSuccess: () => setSubmitted(true),
  });

  const handleBook = () => {
    if (!selectedServiceId || !selectedProviderId || !selectedDate || !selectedTime) return;
    const startsAt = new Date(`${selectedDate}T${selectedTime}`);
    createAppt.mutate({
      serviceId: selectedServiceId,
      providerId: selectedProviderId,
      clientId: "self",
      startsAt,
    });
  };

  if (submitted) {
    return (
      <div className="max-w-lg space-y-12">
        <div className="border-b border-gray-100 pb-8">
          <p className="mb-2 text-[11px] tracking-[0.25em] uppercase text-gray-400">
            Patient Portal
          </p>
          <h1 className="font-serif text-5xl font-light text-gray-900">
            Schedule a Visit
          </h1>
        </div>
        <div className="rounded-sm border border-stone-100 bg-stone-50 px-10 py-16 text-center">
          <p className="font-serif text-3xl font-light text-gray-800">
            You&apos;re confirmed.
          </p>
          <p className="mt-3 text-sm text-gray-400">
            A confirmation has been sent to your email address.
          </p>
          <a
            href="/dashboard"
            className="mt-8 inline-block border-b border-gray-900 pb-px text-[11px] tracking-[0.2em] uppercase text-gray-900 transition-colors hover:border-gray-400 hover:text-gray-400"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg space-y-12">
      {/* Page header */}
      <div className="border-b border-gray-100 pb-8">
        <p className="mb-2 text-[11px] tracking-[0.25em] uppercase text-gray-400">
          Patient Portal
        </p>
        <h1 className="font-serif text-5xl font-light text-gray-900">
          Schedule a Visit
        </h1>
      </div>

      {/* Form */}
      <div className="space-y-10">
        <div>
          <label className={labelClass}>Service</label>
          <select
            value={selectedServiceId ?? ""}
            onChange={(e) => setSelectedServiceId(e.target.value || null)}
            className={inputClass}
          >
            <option value="">Select a service...</option>
            {services?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {s.durationMins} min (${(s.price / 100).toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Provider</label>
          <select
            value={selectedProviderId ?? ""}
            onChange={(e) => setSelectedProviderId(e.target.value || null)}
            className={inputClass}
          >
            <option value="">Select a provider...</option>
            {providers?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title ? `${p.title} ` : ""}
                {p.firstName} {p.lastName}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className={labelClass}>Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Time</label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {createAppt.error && (
          <p className="text-sm text-red-500">{createAppt.error.message}</p>
        )}

        <button
          onClick={handleBook}
          disabled={
            !selectedServiceId ||
            !selectedProviderId ||
            !selectedDate ||
            !selectedTime ||
            createAppt.isPending
          }
          style={{ color: "#ffffff" }}
          className="w-full bg-black py-4 text-[11px] tracking-[0.2em] uppercase transition-colors hover:bg-gray-800 disabled:opacity-40"
        >
          {createAppt.isPending ? "Booking..." : "Schedule Visit"}
        </button>
      </div>
    </div>
  );
}
