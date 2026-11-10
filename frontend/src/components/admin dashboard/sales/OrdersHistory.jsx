// components/admin/sales/OrderHistory.jsx
import OrderHistoryItem from "./OrderHistoryItem";

export default function OrderHistory({ orders }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        Historique
      </h3>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white py-10 text-center text-sm text-gray-400">
          Aucune commande pour le moment.
        </div>
      ) : (
        orders.map((order) => <OrderHistoryItem key={order.id} order={order} />)
      )}
    </div>
  );
}
