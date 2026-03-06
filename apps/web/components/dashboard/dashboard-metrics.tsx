"use client";

interface Props {
  todayAppointmentCount: number;
}

export function DashboardMetrics({ todayAppointmentCount }: Props) {
  const metrics = [
    {
      label: "Today's Appointments",
      value: todayAppointmentCount,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {metrics.map((m) => (
        <div key={m.label} className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">{m.label}</p>
          <p className={`mt-1 text-3xl font-bold ${m.color}`}>{m.value}</p>
        </div>
      ))}
    </div>
  );
}
