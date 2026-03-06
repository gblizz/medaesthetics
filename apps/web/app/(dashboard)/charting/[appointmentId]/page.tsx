import { createServerCaller } from "../../../../lib/trpc-server";
import { notFound } from "next/navigation";
import { ChartingEditor } from "../../../../components/charting/charting-editor";

interface Props {
  params: Promise<{ appointmentId: string }>;
}

export default async function ChartingPage({ params }: Props) {
  const { appointmentId } = await params;
  const caller = await createServerCaller();

  const [appointment, record] = await Promise.all([
    caller.appointments.getById({ appointmentId }).catch(() => null),
    caller.charting.getRecord({ appointmentId }).catch(() => null),
  ]);

  if (!appointment) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Clinical Chart</h1>
        <p className="text-sm text-gray-500">
          {appointment.client.firstName} {appointment.client.lastName} —{" "}
          {appointment.service.name} on{" "}
          {new Date(appointment.startsAt).toLocaleDateString()}
        </p>
      </div>
      <ChartingEditor
        appointmentId={appointmentId}
        existingRecord={record}
        appointment={appointment}
      />
    </div>
  );
}
