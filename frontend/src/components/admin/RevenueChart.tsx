"use client";

import { ChartDataPoint } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

interface RevenueChartProps {
  data: ChartDataPoint[];
  period: "7d" | "30d";
  onPeriodChange: (period: "7d" | "30d") => void;
}

export default function RevenueChart({ data, period, onPeriodChange }: RevenueChartProps) {
  const { formatPrice } = useLanguage();
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = data.reduce((sum, d) => sum + d.orders, 0);

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <h2 className="text-lg font-bold text-dark">Revenue Overview</h2>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => onPeriodChange("7d")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              period === "7d"
                ? "bg-primary text-white shadow-sm"
                : "text-medium hover:text-dark"
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => onPeriodChange("30d")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              period === "30d"
                ? "bg-primary text-white shadow-sm"
                : "text-medium hover:text-dark"
            }`}
          >
            30 Days
          </button>
        </div>
      </div>

      {/* Period summary */}
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-2xl font-bold text-dark">{formatPrice(totalRevenue)}</span>
        <span className="text-xs text-medium">{totalOrders} orders in {period === "7d" ? "7 days" : "30 days"}</span>
      </div>

      {data.length === 0 ? (
        <p className="text-medium text-sm py-8 text-center">No data available.</p>
      ) : (
        <div>
          {/* Vertical bar chart */}
          <div className="flex items-end gap-1 h-48 border-b border-border pb-2">
            {data.map((point) => {
              const pct = (point.revenue / maxRevenue) * 100;
              return (
                <div
                  key={point.date}
                  className="flex-1 flex flex-col items-center justify-end h-full group relative"
                >
                  {/* Tooltip */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-dark text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                    <p className="font-semibold">${point.revenue.toFixed(0)}</p>
                    <p className="text-white/70">{point.orders} orders</p>
                  </div>
                  {/* Bar */}
                  <div
                    className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-t-md transition-all duration-300 hover:from-primary-dark hover:to-primary min-h-[4px]"
                    style={{ height: `${Math.max(pct, 2)}%` }}
                  />
                </div>
              );
            })}
          </div>
          {/* Date labels */}
          <div className="flex gap-1 mt-1.5">
            {data.map((point, i) => {
              const showLabel = period === "7d" || i % 3 === 0 || i === data.length - 1;
              const dateLabel = new Date(point.date + "T00:00:00").toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
              return (
                <div key={point.date} className="flex-1 text-center">
                  {showLabel && (
                    <span className="text-[10px] text-medium">{dateLabel}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
