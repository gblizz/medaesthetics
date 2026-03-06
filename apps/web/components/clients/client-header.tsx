"use client";

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  dateOfBirth: Date | null;
}

interface Props {
  client: Client;
  loyaltyBalance: number;
}

export function ClientHeader({ client, loyaltyBalance }: Props) {
  const age = client.dateOfBirth
    ? Math.floor(
        (Date.now() - new Date(client.dateOfBirth).getTime()) /
          (365.25 * 24 * 60 * 60 * 1000)
      )
    : null;

  return (
    <div className="flex items-start justify-between rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-700">
          {client.firstName[0]}{client.lastName[0]}
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {client.firstName} {client.lastName}
          </h1>
          <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
            <span>{client.email}</span>
            {client.phone && <span>· {client.phone}</span>}
            {age && <span>· {age} yrs old</span>}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-lg bg-yellow-50 px-4 py-2">
        <span className="text-yellow-600">★</span>
        <div>
          <p className="text-xs text-gray-500">Loyalty Points</p>
          <p className="font-bold text-gray-900">{loyaltyBalance.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
