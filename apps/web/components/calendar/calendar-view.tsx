"use client";

import { useState } from "react";
import Link from "next/link";

interface Appointment {
  id: string;
  startsAt: Date;
  endsAt: Date;
  status: string;
  client: { id: string; firstName: string; lastName: string };
  provider: { id: string; firstName: string; lastName: string };
  service: { name: string; color?: string | null };
}

interface Provider {
  id: string;
  firstName: string;
  lastName: string;
}

interface Props {
  initialAppointments: Appointment[];
  providers: Provider[];
}

const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8am–7pm

export function CalendarView({ initialAppointments, providers }: Props) {
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);

  const filtered = selectedProviderId
    ? initialAppointments.filter((a) => a.provider.id === selectedProviderId)
    : initialAppointments;

  return (
    <div className="space-y-4">
      {/* Provider filter */}
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedProviderId(null)}
          className={`rounded-full px-3 py-1 text-sm ${
            !selectedProviderId
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        {providers.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedProviderId(p.id)}
            className={`rounded-full px-3 py-1 text-sm ${
              selectedProviderId === p.id
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {p.firstName} {p.lastName}
          </button>
        ))}
      </div>

      {/* Time grid */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-auto">
        <div className="min-w-[600px]">
          {hours.map((hour) => {
            const hourAppointments = filtered.filter((a) => {
              const h = new Date(a.startsAt).getHours();
              return h === hour;
            });
            return (
              <div key={hour} className="flex border-b border-gray-100">
                <div className="w-16 shrink-0 py-2 pl-3 text-xs text-gray-400">
                  {hour % 12 === 0 ? 12 : hour % 12}
                  {hour < 12 ? "am" : "pm"}
                </div>
                <div className="flex flex-1 flex-wrap gap-2 p-2">
                  {hourAppointments.map((appt) => (
                    <Link
                      key={appt.id}
                      href={`/charting/${appt.id}`}
                      className="flex min-w-[140px] max-w-[200px] flex-col rounded-md p-2 text-xs"
                      style={{
                        backgroundColor: appt.service.color ?? "#e0e7ff",
                        color: "#1e1b4b",
                      }}
                    >
                      <span className="font-medium">
                        {appt.client.firstName} {appt.client.lastName}
                      </span>
                      <span className="opacity-80">{appt.service.name}</span>
                      <span className="opacity-60">
                        {new Date(appt.startsAt).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
