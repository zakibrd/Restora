// CartSheet.jsx
import { Minus, Plus } from "lucide-react";
import { useEffect } from "react";

export default function CartSheet({
  isOpen,
  onClose,
  cartItems,
  totalPrice,
  onIncrease,
  onDecrease,
  onConfirm,
  isSubmitting = false,
}) {
  // Lock page scroll while the sheet is open, restore it when closed.
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // Cleanup: always restore scrolling if this component unmounts while open
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isEmpty = cartItems.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl rounded-t-3xl bg-white px-6 pb-8 pt-4 shadow-xl">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200" />

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Votre panier</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500"
          >
            ✕
          </button>
        </div>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-3xl">
              🛒
            </div>
            <p className="font-medium text-gray-900">Votre panier est vide</p>
            <p className="mt-1 text-sm text-gray-500">
              Ajoutez des plats depuis le menu pour commencer votre commande.
            </p>
            <button
              onClick={onClose}
              className="mt-6 rounded-full bg-orange-500 px-6 py-3 text-sm font-medium text-white"
            >
              Voir le menu
            </button>
          </div>
        ) : (
          <>
            <div className="max-h-80 space-y-4 overflow-y-auto">
              {cartItems.map(({ item, quantity }) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.price.toLocaleString()} DZD × {quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onDecrease(item.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-500"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-4 text-center font-medium text-gray-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => onIncrease(item.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 font-bold text-white"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
              <span className="font-medium text-gray-900">Total</span>
              <span className="text-lg font-semibold text-orange-500">
                {totalPrice.toLocaleString()} DZD
              </span>
            </div>

            <button
              onClick={onConfirm}
              disabled={isSubmitting}
              className={`mt-4 w-full rounded-full py-4 font-medium text-white ${
                isSubmitting
                  ? "bg-orange-300 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              {isSubmitting ? "Envoi en cours..." : "Confirmer la commande"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
