export default function TablesCard({ table, isSelected, onClick }) {
  const styles = {
    empty: "border-gray-200 bg-white text-gray-400 hover:border-gray-300",
    occupied:
      "border-orange-200 bg-orange-50 text-gray-900 hover:border-orange-300",
    new_order: "border-orange-500 bg-orange-500 text-white shadow-sm",
  };

  const dotColors = {
    empty: "bg-emerald-500",
    occupied: "bg-orange-500",
    new_order: "bg-amber-300",
  };

  const labels = {
    empty: "LIBRE",
    occupied: table.total ? `${table.total.toLocaleString()} DZD` : "OCCUPÉE",
    new_order: "NOUVELLE",
  };

  return (
    <button
      onClick={onClick}
      className={`relative flex aspect-square flex-col justify-between rounded-2xl border-2 p-4 text-left transition-all active:scale-95 ${
        styles[table.status]
      } ${
        isSelected
          ? "ring-4 ring-orange-400/50 border-orange-500 font-bold"
          : ""
      }`}
    >
      {/* Top row: Status dot & warning badge */}
      <div className="flex items-center justify-between">
        <span
          className={`h-2.5 w-2.5 rounded-full ${dotColors[table.status]}`}
        />
        {table.status === "new_order" && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-xs font-black text-gray-900 shadow">
            !
          </span>
        )}
      </div>

      {/* Center content */}
      <div className="my-auto flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          {String(table.number).padStart(2, "0")}
        </span>
        <span className="mt-1 text-xs font-bold uppercase tracking-wider">
          {labels[table.status]}
        </span>
      </div>
    </button>
  );
}
