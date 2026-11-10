// components/admin/tables/TableStatusLegend.jsx
export default function TablesStatusLegend() {
  const items = [
    { label: "Vide", color: "bg-white border border-gray-300" },
    { label: "Occupée", color: "bg-orange-50 border border-orange-200" },
    { label: "Nouvelle commande", color: "bg-orange-500" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
      {items.map(({ label, color }) => (
        <div key={label} className="flex items-center gap-2">
          <span className={`h-3 w-3 rounded-full ${color}`} />
          {label}
        </div>
      ))}
    </div>
  );
}
