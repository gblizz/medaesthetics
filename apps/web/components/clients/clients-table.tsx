"use client";

import Link from "next/link";
import { useState } from "react";
import { trpc } from "../../lib/trpc";

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  dateOfBirth: Date | null;
  createdAt: Date;
}

interface Props {
  initialClients: Client[];
}

export function ClientsTable({ initialClients }: Props) {
  const [search, setSearch] = useState("");

  const { data } = trpc.clients.list.useQuery(
    { search: search || undefined, limit: 50 },
    { initialData: { clients: initialClients, nextCursor: undefined } }
  );

  const clients = data?.clients ?? initialClients;

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-4">
        <input
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Phone</th>
            <th className="px-6 py-3">DOB</th>
            <th className="px-6 py-3">Client Since</th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {clients.map((client) => (
            <tr key={client.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <Link
                  href={`/clients/${client.id}`}
                  className="font-medium text-gray-900 hover:text-indigo-600"
                >
                  {client.firstName} {client.lastName}
                </Link>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{client.email}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{client.phone ?? "—"}</td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {client.dateOfBirth
                  ? new Date(client.dateOfBirth).toLocaleDateString()
                  : "—"}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {new Date(client.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-right">
                <Link
                  href={`/clients/${client.id}`}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {clients.length === 0 && (
        <p className="py-8 text-center text-sm text-gray-500">No clients found</p>
      )}
    </div>
  );
}
