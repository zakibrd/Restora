// components/admin/menu/ConfirmDeleteModal.jsx
export default function ConfirmDeleteModal({
  isOpen,
  itemName,
  onCancel,
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="absolute inset-0" onClick={onCancel} />

      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl text-center">
        <h2 className="text-lg font-semibold text-gray-900">
          Supprimer cet article ?
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          "{itemName}" sera définitivement supprimé du menu. Cette action est
          irréversible.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-full bg-gray-100 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-200"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-full bg-red-500 py-3 text-sm font-semibold text-white hover:bg-red-600"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
