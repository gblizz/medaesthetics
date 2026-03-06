"use client";

import Link from "next/link";

interface Appointment {
  id: string;
  startsAt: Date;
  status: string;
  client: { id: string; firstName: string; lastName: string };
  provider: { firstName: string; lastName: string; title?: string | null };
  service: { name: string; durationMins: number };
}

interface Props {
  appointments: Appointment[];
}

const statusColors: Record<string, string> = {
  SCHEDULED: "bg-blue-100 text-blue-800",
  CONFIRMED: "bg-green-100 text-green-800",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-gray-100 text-gray-800",
  CANCELLED: "bg-red-100 text-red-800",
  NO_SHOW: "bg-orange-100 text-orange-800",
};

export function UpcomingAppointments({ appointments }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-base font-semibold text-gray-900">Today's Appointments</h2>
      </div>
      {appointments.length === 0 ? (
        <p className="px-6 py-8 text-center text-sm text-gray-500">No appointments today</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {appointments.map((appt) => (
            <li key={appt.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50">
              <div className="min-w-[60px] text-center">
                <p className="text-sm font-medium text-gray-900">
                  {new Date(appt.startsAt).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>
              <div className="flex-1">
                <Link
                  href={`/clients/${appt.client.id}`}
                  className="text-sm font-medium text-gray-900 hover:text-indigo-600"
                >
                  {appt.client.firstName} {appt.client.lastName}
                </Link>
                <p className="text-xs text-gray-500">
                  {appt.service.name} · {appt.provider.title} {appt.provider.firstName}{" "}
                  {appt.provider.lastName}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    statusColors[appt.status] ?? "bg-gray-100 text-gray-700"
                  }`}
                >
                  {appt.status.replace("_", " ")}
                </span>
                <Link
                  href={`/charting/${appt.id}`}
                  className="text-xs text-indigo-600 hover:underline"
                >
                  Chart
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
