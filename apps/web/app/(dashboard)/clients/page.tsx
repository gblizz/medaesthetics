import { createServerCaller } from "../../../lib/trpc-server";
import { ClientsTable } from "../../../components/clients/clients-table";

export default async function ClientsPage() {
  const caller = await createServerCaller();
  const { clients } = await caller.clients.list({ limit: 50 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <a
          href="/clients/new"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Add Client
        </a>
      </div>
      <ClientsTable initialClients={clients} />
    </div>
  );
}
