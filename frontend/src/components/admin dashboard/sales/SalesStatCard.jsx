// components/admin/sales/SalesStatCard.jsx
export default function SalesStatCard({
  label,
  value,
  icon: Icon,
  valueColor = "text-gray-900",
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
        <Icon size={22} />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          {label}
        </p>
        <p className={`mt-1 text-2xl font-bold ${valueColor}`}>{value}</p>
      </div>
    </div>
  );
}
