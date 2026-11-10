// components/admin/menu/AddCategoryModal.jsx
import { useState } from "react";
import { X } from "lucide-react";

export default function AddCategoryModal({ isOpen, onClose, onAdd }) {
  const [name, setName] = useState("");

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault(); // stops the form from reloading the page, default browser behavior
    if (!name.trim()) return; // ignore empty/whitespace-only input
    onAdd(name.trim());
    setName("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Nouvelle catégorie
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Nom de la catégorie
          </label>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ex. Desserts"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-orange-400"
          />

          <button
            type="submit"
            disabled={!name.trim()}
            className="mt-5 w-full rounded-full bg-orange-500 py-3 text-sm font-semibold text-white disabled:bg-gray-200 disabled:text-gray-400"
          >
            Ajouter
          </button>
        </form>
      </div>
    </div>
  );
}
