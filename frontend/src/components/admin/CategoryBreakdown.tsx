"use client";

import { CategoryBreakdownItem } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

interface CategoryBreakdownProps {
  data: CategoryBreakdownItem[];
}

const categoryColors = [
  { dot: "bg-primary", bar: "bg-primary" },
  { dot: "bg-accent", bar: "bg-accent" },
  { dot: "bg-success", bar: "bg-success" },
  { dot: "bg-blue-500", bar: "bg-blue-500" },
  { dot: "bg-purple-500", bar: "bg-purple-500" },
  { dot: "bg-pink-400", bar: "bg-pink-400" },
];

export default function CategoryBreakdown({ data }: CategoryBreakdownProps) {
  const { formatPrice } = useLanguage();
  const maxRevenue = Math.max(...data.map((d) => d.total_revenue), 1);
  const totalRevenue = data.reduce((sum, d) => sum + d.total_revenue, 0);

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
        <h2 className="text-lg font-bold text-dark">Sales by Category</h2>
      </div>

      {data.length === 0 ? (
        <p className="text-medium text-sm py-4 text-center">No category data.</p>
      ) : (
        <div className="space-y-4">
          {data.map((cat, i) => {
            const pct = (cat.total_revenue / maxRevenue) * 100;
            const revPct = totalRevenue > 0 ? ((cat.total_revenue / totalRevenue) * 100).toFixed(1) : "0";
            const color = categoryColors[i % categoryColors.length];
            return (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${color.dot}`} />
                    <span className="text-sm font-medium text-dark">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-medium">
                    <span>{cat.total_orders} sold</span>
                    <span className="font-semibold text-primary">
                      {formatPrice(cat.total_revenue)}
                    </span>
                    <span className="text-medium/70">{revPct}%</span>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`${color.bar} h-full rounded-full transition-all duration-300`}
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
