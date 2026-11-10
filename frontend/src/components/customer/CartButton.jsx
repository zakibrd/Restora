export default function CartButton({ totalItems, totalPrice, onClick }) {
  if (totalItems === 0) return null;

  return (
    <>
      <button
        onClick={onClick}
        className={`fixed bottom-4 left-4 right-4 flex items-center justify-between rounded-full  px-5 py-4 text-white shadow-lg mx-auto max-w-2xl transition-colors duration-200 bg-orange-500 active:bg-orange-600 `}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm font-bold text-orange-500">
            {totalItems}
          </span>
          <span className="font-medium">Voir le panier</span>
        </div>
        <span className="font-semibold">{totalPrice} DZD</span>
      </button>
    </>
  );
}
