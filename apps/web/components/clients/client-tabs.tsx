"use client";

import { useState } from "react";
import Link from "next/link";

const tabs = [
  "Appointments",
  "Treatment History",
  "Forms",
  "Billing",
  "Photos",
];

interface Props {
  client: {
    id: string;
    appointments: {
      id: string;
      startsAt: Date;
      status: string;
      service: { name: string };
      provider: { firstName: string; lastName: string };
    }[];
  };
  timeline: {
    id: string;
    createdAt: Date;
    appointment: { service: { name: string }; startsAt: Date };
    signedAt: Date | null;
  }[];
  forms: {
    intake: { id: string; signedAt: Date; template: { name: string } }[];
    consent: { id: string; signedAt: Date; template: { name: string } }[];
  };
}

export function ClientTabs({ client, timeline, forms }: Props) {
  const [activeTab, setActiveTab] = useState("Appointments");

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200">
        <nav className="flex gap-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {activeTab === "Appointments" && (
          <div className="space-y-2">
            {client.appointments.length === 0 ? (
              <p className="text-sm text-gray-500">No appointments</p>
            ) : (
              client.appointments.map((appt) => (
                <div
                  key={appt.id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-4"
                >
                  <div>
                    <p className="font-medium text-gray-900">{appt.service.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(appt.startsAt).toLocaleString()} · {appt.provider.firstName}{" "}
                      {appt.provider.lastName}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">{appt.status}</span>
                    <Link
                      href={`/charting/${appt.id}`}
                      className="text-sm text-indigo-600 hover:underline"
                    >
                      Chart
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "Treatment History" && (
          <div className="space-y-2">
            {timeline.length === 0 ? (
              <p className="text-sm text-gray-500">No treatment records</p>
            ) : (
              timeline.map((record) => (
                <div
                  key={record.id}
                  className="rounded-lg border border-gray-100 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">
                      {record.appointment.service.name}
                    </p>
                    <span
                      className={`text-xs ${record.signedAt ? "text-green-600" : "text-amber-600"}`}
                    >
                      {record.signedAt ? "Signed" : "Unsigned"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(record.appointment.startsAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "Forms" && (
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-700">Intake Forms</h3>
              {forms.intake.length === 0 ? (
                <p className="text-sm text-gray-500">None</p>
              ) : (
                forms.intake.map((f) => (
                  <div key={f.id} className="rounded-lg border border-gray-100 p-3 text-sm">
                    <p className="font-medium">{f.template.name}</p>
                    <p className="text-gray-500">
                      Signed {new Date(f.signedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-700">Consent Forms</h3>
              {forms.consent.length === 0 ? (
                <p className="text-sm text-gray-500">None</p>
              ) : (
                forms.consent.map((f) => (
                  <div key={f.id} className="rounded-lg border border-gray-100 p-3 text-sm">
                    <p className="font-medium">{f.template.name}</p>
                    <p className="text-gray-500">
                      Signed {new Date(f.signedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "Billing" && (
          <p className="text-sm text-gray-500">
            View full billing history in the{" "}
            <Link href="/billing" className="text-indigo-600 hover:underline">
              Billing
            </Link>{" "}
            section.
          </p>
        )}

        {activeTab === "Photos" && (
          <p className="text-sm text-gray-500">
            Photos are accessible from individual treatment records in the Chart view.
          </p>
        )}
      </div>
    </div>
  );
}
