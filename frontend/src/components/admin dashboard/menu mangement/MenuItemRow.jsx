// components/admin/menu/MenuItemRow.jsx
import { Pencil, Trash2 } from "lucide-react";

export default function MenuItemRow({
  item,
  onToggleAvailable,
  onEdit,
  onDelete,
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5">
      <div className={!item.available ? "opacity-50" : ""}>
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">{item.name}</h3>
          {!item.available && (
            <span className="rounded-md bg-red-50 px-2 py-0.5 text-xs font-bold text-red-500">
              ÉPUISÉ
            </span>
          )}
        </div>
        <p className="mt-0.5 text-sm text-gray-500">{item.description}</p>
      </div>

      <div className="flex items-center gap-5">
        <span className="font-semibold text-orange-500">
          {item.price.toLocaleString()} DZD
        </span>

        {/* Availability toggle switch */}
        <button
          onClick={() => onToggleAvailable(item.id)}
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
            item.available ? "bg-emerald-500" : "bg-gray-200"
          }`}
        >
          <span
            className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
              item.available ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(item)}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
