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
    <div className="space-y-12">
      {/* Page header */}
      <div className="border-b border-gray-100 pb-8">
        <p className="mb-2 text-[11px] tracking-[0.25em] uppercase text-gray-400">
          Patient Portal
        </p>
        <h1 className="font-serif text-5xl font-light text-gray-900">
          Welcome Back
        </h1>
      </div>

      {/* Upcoming appointments */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-[11px] tracking-[0.2em] uppercase text-gray-500">
            Upcoming Appointments
          </h2>
          <a
            href="/book"
            className="border-b border-gray-900 pb-px text-[11px] tracking-[0.15em] uppercase text-gray-900 transition-colors hover:border-gray-400 hover:text-gray-400"
          >
            Schedule New
          </a>
        </div>

        {appointments.length === 0 ? (
          <div className="rounded-sm border border-stone-100 bg-stone-50 px-10 py-16 text-center">
            <p className="font-serif text-3xl font-light text-gray-400">
              No upcoming visits
            </p>
            <p className="mt-3 text-sm text-gray-400">
              You have no appointments scheduled at this time.
            </p>
            <a
              href="/book"
              style={{ color: "#ffffff" }}
              className="mt-8 inline-block bg-black px-10 py-3.5 text-[11px] tracking-[0.2em] uppercase transition-colors hover:bg-gray-800"
            >
              Schedule a Visit
            </a>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 border border-gray-100">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="flex items-center justify-between bg-white px-6 py-5 transition-colors hover:bg-stone-50"
              >
                <div>
                  <p className="font-medium text-gray-900">{appt.service.name}</p>
                  <p className="mt-1 text-sm text-gray-400">
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
                  className={`text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 ${
                    appt.status === "CONFIRMED"
                      ? "bg-stone-100 text-stone-600"
                      : "bg-gray-50 text-gray-500"
                  }`}
                >
                  {appt.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quick links */}
      <section>
        <h2 className="mb-6 text-[11px] tracking-[0.2em] uppercase text-gray-500">
          Quick Access
        </h2>
        <div className="grid grid-cols-1 gap-px bg-gray-100 border border-gray-100 sm:grid-cols-3">
          {[
            { href: "/book", label: "Book a Visit", sub: "Schedule your next appointment" },
            { href: "/records", label: "My Records", sub: "View your treatment history" },
            { href: "/invoices", label: "Invoices", sub: "Review and pay your balance" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group bg-white px-8 py-8 transition-colors hover:bg-stone-50"
            >
              <p className="font-serif text-xl font-light text-gray-900 group-hover:text-gray-700">
                {item.label}
              </p>
              <p className="mt-1 text-xs text-gray-400">{item.sub}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
