// components/admin/menu/AddItemModal.jsx
import { useState } from "react";
import { X } from "lucide-react";

export default function AddItemModal({
  isOpen,
  onClose,
  onAdd,
  onSave,
  categories,
  defaultCategoryId,
  editingItem,
}) {
  const isEditMode = Boolean(editingItem);

  // Initialize state directly from props (no useEffect needed)
  const [name, setName] = useState(editingItem?.name ?? "");
  const [categoryId, setCategoryId] = useState(
    editingItem?.categoryId ?? defaultCategoryId ?? categories?.[0]?.id ?? "",
  );
  const [description, setDescription] = useState(
    editingItem?.description ?? "",
  );
  const [price, setPrice] = useState(
    editingItem ? String(editingItem.price) : "",
  );
  const [available, setAvailable] = useState(editingItem?.available ?? true);

  if (!isOpen) return null;

  const isValid = name.trim() && categoryId && Number(price) > 0;

  function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) return;

    const itemData = {
      name: name.trim(),
      categoryId: Number(categoryId),
      description: description.trim(),
      price: Number(price),
      available,
    };

    if (isEditMode) {
      onSave({ id: editingItem.id, ...itemData });
    } else {
      onAdd(itemData);
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditMode ? "Modifier l'article" : "Nouvel article"}
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Nom
            </label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex. Margherita"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-orange-400"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Catégorie
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-orange-400"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Description{" "}
              <span className="font-normal text-gray-400">(optionnel)</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ex. Sauce tomate, mozzarella, basilic frais"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-orange-400"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Prix (DZD)
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="ex. 650"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-orange-400"
            />
          </div>

          <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
            <span className="text-sm font-medium text-gray-700">
              {isEditMode ? "Disponible" : "Disponible immédiatement"}
            </span>
            <button
              type="button"
              onClick={() => setAvailable((a) => !a)}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                available ? "bg-emerald-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  available ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className="mt-1 w-full rounded-full bg-orange-500 py-3 text-sm font-semibold text-white disabled:bg-gray-200 disabled:text-gray-400 hover:bg-orange-600 transition"
          >
            {isEditMode ? "Enregistrer les modifications" : "Ajouter l'article"}
          </button>
        </form>
      </div>
    </div>
  );
}
