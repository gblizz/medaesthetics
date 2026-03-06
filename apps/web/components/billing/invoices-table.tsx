"use client";

import Link from "next/link";

interface Invoice {
  id: string;
  invoiceNumber: string;
  status: string;
  total: number;
  amountPaid: number;
  createdAt: Date;
  client: { id: string; firstName: string; lastName: string };
}

interface Props {
  invoices: Invoice[];
}

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  SENT: "bg-blue-100 text-blue-700",
  PAID: "bg-green-100 text-green-700",
  PARTIALLY_PAID: "bg-yellow-100 text-yellow-700",
  OVERDUE: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-100 text-gray-500",
};

function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function InvoicesTable({ invoices }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
            <th className="px-6 py-3">Invoice #</th>
            <th className="px-6 py-3">Client</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Total</th>
            <th className="px-6 py-3">Paid</th>
            <th className="px-6 py-3">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {invoices.map((inv) => (
            <tr key={inv.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-indigo-600">
                {inv.invoiceNumber}
              </td>
              <td className="px-6 py-4">
                <Link
                  href={`/clients/${inv.client.id}`}
                  className="text-sm text-gray-900 hover:text-indigo-600"
                >
                  {inv.client.firstName} {inv.client.lastName}
                </Link>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    statusColors[inv.status] ?? "bg-gray-100"
                  }`}
                >
                  {inv.status.replace("_", " ")}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">{formatCents(inv.total)}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{formatCents(inv.amountPaid)}</td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {new Date(inv.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {invoices.length === 0 && (
        <p className="py-8 text-center text-sm text-gray-500">No invoices</p>
      )}
    </div>
  );
}
