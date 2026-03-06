import { createServerCaller } from "../../../lib/trpc-server";
import { TeamList } from "../../../components/team/team-list";

export default async function TeamPage() {
  const caller = await createServerCaller();
  const [providers, expiringCredentials] = await Promise.all([
    caller.providers.list(),
    caller.providers.getExpiringCredentials({ withinDays: 60 }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Team</h1>
        <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          Invite Provider
        </button>
      </div>
      <TeamList providers={providers} expiringCredentials={expiringCredentials} />
    </div>
  );
}
