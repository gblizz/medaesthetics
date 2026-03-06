"use client";

import { useState } from "react";
import { trpc } from "../../lib/trpc";

interface TreatmentRecord {
  id: string;
  subjective: string | null;
  objective: string | null;
  assessment: string | null;
  plan: string | null;
  injectionMap: unknown;
  signedAt: Date | null;
  signedByName: string | null;
}

interface Appointment {
  id: string;
  client: { firstName: string; lastName: string };
  provider: { firstName: string; lastName: string };
}

interface Props {
  appointmentId: string;
  existingRecord: TreatmentRecord | null;
  appointment: Appointment;
}

export function ChartingEditor({ appointmentId, existingRecord, appointment }: Props) {
  const [subjective, setSubjective] = useState(existingRecord?.subjective ?? "");
  const [objective, setObjective] = useState(existingRecord?.objective ?? "");
  const [assessment, setAssessment] = useState(existingRecord?.assessment ?? "");
  const [plan, setPlan] = useState(existingRecord?.plan ?? "");
  const [saved, setSaved] = useState(false);

  const upsert = trpc.charting.upsertRecord.useMutation({
    onSuccess: () => setSaved(true),
  });

  const sign = trpc.charting.signRecord.useMutation();

  const isSigned = !!existingRecord?.signedAt;

  const handleSave = () => {
    upsert.mutate({ appointmentId, subjective, objective, assessment, plan });
  };

  const handleSign = () => {
    if (!existingRecord) return;
    sign.mutate({
      treatmentRecordId: existingRecord.id,
      providerName: `${appointment.provider.firstName} ${appointment.provider.lastName}`,
    });
  };

  return (
    <div className="space-y-4">
      {isSigned && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Signed by {existingRecord.signedByName} on{" "}
          {new Date(existingRecord.signedAt!).toLocaleString()}
        </div>
      )}

      <div className="grid gap-4 rounded-xl border border-gray-200 bg-white p-6">
        {(
          [
            { label: "S — Subjective", value: subjective, setter: setSubjective },
            { label: "O — Objective", value: objective, setter: setObjective },
            { label: "A — Assessment", value: assessment, setter: setAssessment },
            { label: "P — Plan", value: plan, setter: setPlan },
          ] as const
        ).map(({ label, value, setter }) => (
          <div key={label}>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <textarea
              rows={4}
              value={value}
              onChange={(e) => setter(e.target.value)}
              disabled={isSigned}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
        ))}
      </div>

      {!isSigned && (
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={upsert.isPending}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {upsert.isPending ? "Saving..." : "Save Draft"}
          </button>
          {existingRecord && (
            <button
              onClick={handleSign}
              disabled={sign.isPending}
              className="rounded-md border border-green-600 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50 disabled:opacity-50"
            >
              {sign.isPending ? "Signing..." : "Sign Record"}
            </button>
          )}
          {saved && (
            <span className="text-sm text-green-600">Saved successfully</span>
          )}
        </div>
      )}
    </div>
  );
}
