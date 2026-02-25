import { OrderStatus } from "@/types";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusConfig: Record<
  OrderStatus,
  { label: string; bg: string; text: string }
> = {
  pending: { label: "Pending", bg: "bg-yellow-100", text: "text-yellow-800" },
  confirmed: { label: "Confirmed", bg: "bg-blue-100", text: "text-blue-800" },
  shipped: { label: "Shipped", bg: "bg-purple-100", text: "text-purple-800" },
  delivered: { label: "Delivered", bg: "bg-green-100", text: "text-green-800" },
  cancelled: { label: "Cancelled", bg: "bg-red-100", text: "text-red-800" },
};

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
}
