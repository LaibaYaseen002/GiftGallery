"use client";

import { ChartDataPoint } from "@/types";

interface RevenueChartProps {
  data: ChartDataPoint[];
  period: "7d" | "30d";
  onPeriodChange: (period: "7d" | "30d") => void;
}

export default function RevenueChart({ data, period, onPeriodChange }: RevenueChartProps) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-dark">Revenue Overview</h2>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => onPeriodChange("7d")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              period === "7d"
                ? "bg-white text-primary shadow-sm"
                : "text-medium hover:text-dark"
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => onPeriodChange("30d")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              period === "30d"
                ? "bg-white text-primary shadow-sm"
                : "text-medium hover:text-dark"
            }`}
          >
            30 Days
          </button>
        </div>
      </div>

      {data.length === 0 ? (
        <p className="text-medium text-sm py-8 text-center">No data available.</p>
      ) : (
        <div className="space-y-2">
          {data.map((point) => {
            const pct = (point.revenue / maxRevenue) * 100;
            const dateLabel = new Date(point.date + "T00:00:00").toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
            return (
              <div key={point.date} className="flex items-center gap-3 text-sm">
                <span className="w-16 text-xs text-medium text-right shrink-0">
                  {dateLabel}
                </span>
                <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden relative">
                  <div
                    className="bg-primary/80 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(pct, 0)}%` }}
                  />
                  {point.revenue > 0 && (
                    <span className="absolute inset-y-0 right-2 flex items-center text-xs font-medium text-dark">
                      ${point.revenue.toFixed(0)} ({point.orders})
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
