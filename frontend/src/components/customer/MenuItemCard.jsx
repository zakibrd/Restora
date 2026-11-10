import { Plus, Minus } from "lucide-react";
export default function MenuItemCard({
  item,
  quantity = 0,
  onIncrease,
  onDecrease,
}) {
  const isSoldOut = !item.available;
  return (
    <>
      <div className="flex  items-center justify-between h-30 py-4 px-4 border border-gray-200 rounded-2xl bg-white mb-2 shadow-sm shadow-gray-200">
        <div className={isSoldOut ? "opacity-50" : ""}>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{item.name}</h3>
            {isSoldOut && (
              <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                Épuisé
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>
          <p className="text-sm font-semibold text-orange-500 mt-1">
            {item.price.toLocaleString()} DZD
          </p>
        </div>
        {!isSoldOut && (
          <div className="flex items-start gap-3 shrink-0">
            <div className="flex items-center gap-3 shrink-0">
              {quantity > 0 && (
                <>
                  <button
                    onClick={() => onDecrease(item.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-orange-100 text-orange-500 font-bold"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-4 text-center font-medium text-gray-900">
                    {quantity}
                  </span>
                </>
              )}
              <button
                onClick={() => onIncrease(item.id)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold"
              >
                <Plus size={12} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
