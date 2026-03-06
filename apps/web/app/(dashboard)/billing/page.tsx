import { createServerCaller } from "../../../lib/trpc-server";
import { InvoicesTable } from "../../../components/billing/invoices-table";

export default async function BillingPage() {
  const caller = await createServerCaller();
  const { invoices } = await caller.billing.listInvoices({ limit: 50 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <a
          href="/billing/new"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          New Invoice
        </a>
      </div>
      <InvoicesTable invoices={invoices} />
    </div>
  );
}
