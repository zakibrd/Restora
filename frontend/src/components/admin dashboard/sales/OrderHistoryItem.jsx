// components/admin/sales/OrderHistoryItem.jsx
const statusStyles = {
  completed: { label: "TERMINÉE", className: "bg-emerald-50 text-emerald-600" },
  cancelled: { label: "ANNULÉE", className: "bg-red-50 text-red-500" },
  pending: { label: "PENDING", className: "bg-yellow-50 text-yellow-500" },
};

export default function OrderHistoryItem({ order }) {
  const status = statusStyles[order.status] || statusStyles.completed;

  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-5 py-4">
      <div className="flex items-center gap-3">
        <span className="font-bold text-orange-500">#{order.id}</span>
        <span className="font-medium text-gray-900">
          Table {String(order.table_number).padStart(2, "0")}
        </span>
        <span className="text-sm text-gray-400">
          {new Date(order.created_at).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "short",
          })}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span
          className={`rounded-lg px-3 py-1 text-xs font-bold tracking-wide ${status.className}`}
        >
          {status.label}
        </span>
        <span className="w-20 text-right font-bold text-gray-900">
          {order.total.toLocaleString()} DZD
        </span>
      </div>
    </div>
  );
}
