"use client";

import { CategoryBreakdownItem } from "@/types";

interface CategoryBreakdownProps {
  data: CategoryBreakdownItem[];
}

export default function CategoryBreakdown({ data }: CategoryBreakdownProps) {
  const maxRevenue = Math.max(...data.map((d) => d.total_revenue), 1);

  return (
    <div className="card p-6">
      <h2 className="text-lg font-bold text-dark mb-4">Sales by Category</h2>

      {data.length === 0 ? (
        <p className="text-medium text-sm py-4 text-center">No category data.</p>
      ) : (
        <div className="space-y-3">
          {data.map((cat) => {
            const pct = (cat.total_revenue / maxRevenue) * 100;
            return (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-dark">{cat.name}</span>
                  <div className="flex items-center gap-3 text-xs text-medium">
                    <span>{cat.total_orders} sold</span>
                    <span className="font-semibold text-primary">
                      ${cat.total_revenue.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-accent h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(pct, 0)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
