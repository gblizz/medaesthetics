"use client";

import { useState } from "react";
import { trpc } from "../../../components/trpc-provider";

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

  const selectedService = services?.find((s) => s.id === selectedServiceId);

  const handleBook = () => {
    if (!selectedServiceId || !selectedProviderId || !selectedDate || !selectedTime) return;
    const startsAt = new Date(`${selectedDate}T${selectedTime}`);
    createAppt.mutate({
      serviceId: selectedServiceId,
      providerId: selectedProviderId,
      clientId: "self", // resolved server-side by clerkUserId lookup
      startsAt,
    });
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
        <p className="text-lg font-semibold text-green-800">Appointment booked!</p>
        <p className="mt-1 text-sm text-green-700">
          You'll receive a confirmation shortly.
        </p>
        <a
          href="/dashboard"
          className="mt-4 inline-block text-sm text-indigo-600 hover:underline"
        >
          Back to dashboard
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Book an Appointment</h1>

      <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Service</label>
          <select
            value={selectedServiceId ?? ""}
            onChange={(e) => setSelectedServiceId(e.target.value || null)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
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
          <label className="block text-sm font-medium text-gray-700">Provider</label>
          <select
            value={selectedProviderId ?? ""}
            onChange={(e) => setSelectedProviderId(e.target.value || null)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          >
            <option value="">Select a provider...</option>
            {providers?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title ? `${p.title} ` : ""}{p.firstName} {p.lastName}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {createAppt.error && (
          <p className="text-sm text-red-600">{createAppt.error.message}</p>
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
          className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {createAppt.isPending ? "Booking..." : "Book Appointment"}
        </button>
      </div>
    </div>
  );
}
