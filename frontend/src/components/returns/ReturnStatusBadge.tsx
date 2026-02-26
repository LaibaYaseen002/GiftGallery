import { ReturnStatus } from "@/types";

interface ReturnStatusBadgeProps {
  status: ReturnStatus;
}

const statusConfig: Record<
  ReturnStatus,
  { label: string; bg: string; text: string }
> = {
  pending: { label: "Pending", bg: "bg-yellow-100", text: "text-yellow-800" },
  approved: { label: "Approved", bg: "bg-green-100", text: "text-green-800" },
  rejected: { label: "Rejected", bg: "bg-red-100", text: "text-red-800" },
  refunded: { label: "Refunded", bg: "bg-blue-100", text: "text-blue-800" },
};

export default function ReturnStatusBadge({ status }: ReturnStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
}
