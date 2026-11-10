import { X, Check, Printer } from "lucide-react";

const statusBadge = {
  pending: {
    label: "⏳ EN ATTENTE",
    className: "bg-amber-100 text-amber-800 border border-amber-200",
  },
  confirmed: {
    label: "EN PRÉPARATION",
    className: "bg-blue-50 text-blue-700 border border-blue-200",
  },
};

function OrderBlock({ order, onAccept, onReprint }) {
  const badge = statusBadge[order.status] || statusBadge.pending;

  return (
    <div className="rounded-xl border border-gray-100 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500">
          Cmd #{order.id}
          {order.created_at
            ? ` · ${new Date(order.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}`
            : ""}
        </p>
        <span
          className={`inline-block rounded-lg px-2.5 py-1 text-xs font-bold ${badge.className}`}
        >
          {badge.label}
        </span>
      </div>

      <div className="space-y-2">
        {(order.items || []).map((item, i) => {
          const qty = Number(item.quantity) || 1;
          const price = Number(item.unit_price ?? item.price ?? 0);

          return (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-800">
                <span className="text-gray-400 mr-1.5">{qty}×</span>
                {item.name || item.menu_item_name || "Article"}
              </span>
              <span className="font-semibold text-gray-600">
                {(qty * price).toLocaleString()} DZD
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
        <span className="text-sm font-bold text-gray-900">Sous-total</span>
        <span className="text-base font-extrabold text-orange-500">
          {Number(order.total ?? 0).toLocaleString()} DZD
        </span>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {order.status !== "confirmed" && (
          <button
            onClick={() => onAccept(order.id)}
            className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 transition"
          >
            <Check size={16} />
            Accepter la Commande
          </button>
        )}
        <button
          onClick={() => onReprint(order.id)}
          className="flex items-center justify-center gap-2 rounded-xl bg-gray-100 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition"
        >
          <Printer size={16} />
          Réimprimer le Ticket
        </button>
      </div>
    </div>
  );
}

export default function Tableinfo({
  table,
  onClose,
  onAccept,
  onReprint,
  onComplete,
}) {
  if (!table) return null;

  // 👈 Ignore order data if table is marked empty/libre
  const isTableEmpty = table.status === "empty" || table.status === "libre";
  // 👈 On récupère maintenant TOUTES les commandes actives de la session, plus la dernière uniquement
  const orders = isTableEmpty ? [] : table.orders || [];

  const grandTotal = orders.reduce(
    (sum, order) => sum + Number(order.total ?? 0),
    0,
  );

  return (
    <div
      className={`h-full shrink-0 overflow-hidden border-l border-gray-200 bg-white shadow-xl transition-all duration-300 ${
        table ? "w-80" : "w-0 border-l-0"
      }`}
    >
      <div
        className={`flex h-full w-80 flex-col transform transition-transform duration-300 ease-out ${
          table ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {table && (
          <>
            <div className="flex items-start justify-between border-b border-gray-100 p-5 pt-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Table {String(table.number || 0).padStart(2, "0")}
                </h3>
                {orders.length > 0 && (
                  <p className="mt-1 text-xs text-gray-500">
                    {orders.length} commande{orders.length > 1 ? "s" : ""}{" "}
                    active{orders.length > 1 ? "s" : ""}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {orders.length > 0 ? (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto p-5">
                  {orders.map((order) => (
                    <OrderBlock
                      key={order.id}
                      order={order}
                      onAccept={onAccept}
                      onReprint={onReprint}
                    />
                  ))}
                </div>

                <div className="border-t border-gray-100 p-5 pb-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-base font-bold text-gray-900">
                      Total table
                    </span>
                    <span className="text-xl font-extrabold text-orange-500">
                      {grandTotal.toLocaleString()} DZD
                    </span>
                  </div>

                  <button
                    onClick={() => onComplete(table.id)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 font-semibold text-white shadow-sm hover:bg-emerald-600 transition"
                  >
                    <Check size={18} />
                    Compléter &amp; Libérer
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center p-5 text-center text-sm text-gray-400">
                Cette table est libre — aucune commande active.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
