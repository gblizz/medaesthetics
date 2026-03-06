"use client";

import { trpc } from "../../../components/trpc-provider";

export default function PatientDashboardPage() {
  const today = new Date();
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const { data: appointmentsData } = trpc.appointments.list.useQuery({
    startDate: today,
    endDate: endOfMonth,
  });

  const appointments = appointmentsData ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Upcoming Appointments</h2>
        {appointments.length === 0 ? (
          <div className="text-center">
            <p className="text-sm text-gray-500">No upcoming appointments</p>
            <a
              href="/book"
              className="mt-3 inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Book Now
            </a>
          </div>
        ) : (
          <ul className="space-y-3">
            {appointments.map((appt) => (
              <li
                key={appt.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 p-4"
              >
                <div>
                  <p className="font-medium text-gray-900">{appt.service.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(appt.startsAt).toLocaleString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    appt.status === "CONFIRMED"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {appt.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
