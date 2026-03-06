"use client";

import { trpc } from "../../lib/trpc";
import { useState } from "react";

interface InventoryItem {
  id: string;
  name: string;
  category: string | null;
  unit: string | null;
  currentStock: number;
  lowStockThreshold: number | null;
  expiresAt: Date | null;
  supplier: string | null;
}

interface Props {
  items: InventoryItem[];
}

export function InventoryTable({ items: initialItems }: Props) {
  const { data: items } = trpc.inventory.list.useQuery(
    {},
    { initialData: initialItems }
  );

  const updateStock = trpc.inventory.updateStock.useMutation();
  const [adjustments, setAdjustments] = useState<Record<string, string>>({});

  const handleAdjust = (itemId: string) => {
    const adj = parseFloat(adjustments[itemId] ?? "0");
    if (isNaN(adj) || adj === 0) return;
    updateStock.mutate({ itemId, adjustment: adj });
    setAdjustments((prev) => ({ ...prev, [itemId]: "" }));
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
            <th className="px-6 py-3">Item</th>
            <th className="px-6 py-3">Category</th>
            <th className="px-6 py-3">Stock</th>
            <th className="px-6 py-3">Expires</th>
            <th className="px-6 py-3">Adjust</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {(items as InventoryItem[]).map((item) => {
            const isLow =
              item.lowStockThreshold !== null &&
              item.currentStock <= item.lowStockThreshold;
            return (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  {item.supplier && (
                    <p className="text-xs text-gray-500">{item.supplier}</p>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.category ?? "—"}</td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-medium ${isLow ? "text-red-600" : "text-gray-900"}`}>
                    {item.currentStock} {item.unit ?? ""}
                    {isLow && " ⚠️"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {item.expiresAt ? new Date(item.expiresAt).toLocaleDateString() : "—"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="±qty"
                      value={adjustments[item.id] ?? ""}
                      onChange={(e) =>
                        setAdjustments((prev) => ({
                          ...prev,
                          [item.id]: e.target.value,
                        }))
                      }
                      className="w-20 rounded border border-gray-300 px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none"
                    />
                    <button
                      onClick={() => handleAdjust(item.id)}
                      className="rounded bg-indigo-600 px-2 py-1 text-xs text-white hover:bg-indigo-700"
                    >
                      Apply
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {(items as InventoryItem[]).length === 0 && (
        <p className="py-8 text-center text-sm text-gray-500">No inventory items</p>
      )}
    </div>
  );
}
