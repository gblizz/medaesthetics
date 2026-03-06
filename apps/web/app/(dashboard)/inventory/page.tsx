import { createServerCaller } from "../../../lib/trpc-server";
import { InventoryTable } from "../../../components/inventory/inventory-table";

export default async function InventoryPage() {
  const caller = await createServerCaller();
  const [items, lowStock, expiring] = await Promise.all([
    caller.inventory.list({}),
    caller.inventory.getLowStockAlerts(),
    caller.inventory.getExpiryAlerts({ withinDays: 30 }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
        <a
          href="/inventory/new"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Add Item
        </a>
      </div>

      {(lowStock.length > 0 || expiring.length > 0) && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-800">
            {lowStock.length > 0 && `${lowStock.length} item(s) low on stock. `}
            {expiring.length > 0 && `${expiring.length} item(s) expiring within 30 days.`}
          </p>
        </div>
      )}

      <InventoryTable items={items} />
    </div>
  );
}
