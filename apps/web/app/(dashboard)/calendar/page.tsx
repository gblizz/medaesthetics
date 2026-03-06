import { createServerCaller } from "../../../lib/trpc-server";
import { CalendarView } from "../../../components/calendar/calendar-view";

export default async function CalendarPage() {
  const caller = await createServerCaller();
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  const [appointments, providers] = await Promise.all([
    caller.appointments.list({ startDate: weekStart, endDate: weekEnd }),
    caller.providers.list(),
  ]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
      <CalendarView
        initialAppointments={appointments}
        providers={providers}
      />
    </div>
  );
}
