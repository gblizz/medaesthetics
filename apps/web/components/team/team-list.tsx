"use client";

interface Provider {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string | null;
  role: string;
  isActive: boolean;
}

interface Credential {
  id: string;
  type: string;
  expiresAt: Date | null;
  provider: { id: string; firstName: string; lastName: string };
}

interface Props {
  providers: Provider[];
  expiringCredentials: Credential[];
}

const roleLabels: Record<string, string> = {
  PRACTICE_OWNER: "Practice Owner",
  PROVIDER: "Provider",
  FRONT_DESK: "Front Desk",
};

export function TeamList({ providers, expiringCredentials }: Props) {
  return (
    <div className="space-y-6">
      {expiringCredentials.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <h3 className="mb-2 text-sm font-semibold text-amber-800">Expiring Credentials</h3>
          <ul className="space-y-1">
            {expiringCredentials.map((cred) => (
              <li key={cred.id} className="text-sm text-amber-700">
                {cred.provider.firstName} {cred.provider.lastName} — {cred.type}
                {cred.expiresAt && (
                  <span> (expires {new Date(cred.expiresAt).toLocaleDateString()})</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {providers.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {p.firstName} {p.lastName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{p.title ?? "—"}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {roleLabels[p.role] ?? p.role}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{p.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      p.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {p.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {providers.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-500">No team members yet</p>
        )}
      </div>
    </div>
  );
}
