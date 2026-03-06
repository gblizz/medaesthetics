import { createServerCaller } from "../../../lib/trpc-server";
import { PracticeSettings } from "../../../components/settings/practice-settings";

export default async function SettingsPage() {
  const caller = await createServerCaller();
  const practice = await caller.practice.get();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <PracticeSettings practice={practice} />
    </div>
  );
}
