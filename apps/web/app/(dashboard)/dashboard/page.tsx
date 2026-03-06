import { createServerCaller } from "../../../lib/trpc-server";
import { DashboardMetrics } from "../../../components/dashboard/dashboard-metrics";
import { UpcomingAppointments } from "../../../components/dashboard/upcoming-appointments";
import { AlertsPanel } from "../../../components/dashboard/alerts-panel";

export default async function DashboardPage() {
  const caller = await createServerCaller();

  const today = new Date();
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  const [appointments, lowStock, expiringCredentials] = await Promise.all([
    caller.appointments.list({
      startDate: today,
      endDate: endOfDay,
    }),
    caller.inventory.getLowStockAlerts(),
    caller.providers.getExpiringCredentials({ withinDays: 60 }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">
          {today.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <DashboardMetrics todayAppointmentCount={appointments.length} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <UpcomingAppointments appointments={appointments} />
        </div>
        <div>
          <AlertsPanel
            lowStockCount={lowStock.length}
            expiringCredentialCount={expiringCredentials.length}
          />
        </div>
      </div>
    </div>
  );
}
