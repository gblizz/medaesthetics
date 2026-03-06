"use client";

import Link from "next/link";

interface Props {
  lowStockCount: number;
  expiringCredentialCount: number;
}

export function AlertsPanel({ lowStockCount, expiringCredentialCount }: Props) {
  const alerts = [
    ...(lowStockCount > 0
      ? [
          {
            label: `${lowStockCount} item(s) low on stock`,
            href: "/inventory",
            color: "text-amber-700",
            bg: "bg-amber-50 border-amber-200",
          },
        ]
      : []),
    ...(expiringCredentialCount > 0
      ? [
          {
            label: `${expiringCredentialCount} credential(s) expiring soon`,
            href: "/team",
            color: "text-red-700",
            bg: "bg-red-50 border-red-200",
          },
        ]
      : []),
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-base font-semibold text-gray-900">Alerts</h2>
      </div>
      {alerts.length === 0 ? (
        <p className="px-6 py-8 text-center text-sm text-gray-500">No alerts</p>
      ) : (
        <ul className="space-y-2 p-4">
          {alerts.map((alert) => (
            <li key={alert.label}>
              <Link
                href={alert.href}
                className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${alert.bg} ${alert.color} hover:opacity-80`}
              >
                <span>⚠️</span>
                {alert.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
