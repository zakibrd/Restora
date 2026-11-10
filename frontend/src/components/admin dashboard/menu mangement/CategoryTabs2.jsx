import { Plus } from "lucide-react";
export default function CategoryTabs2({
  categories,
  activeCategory,
  onSelect,
  onAddCategory,
  items = [],
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 pb-5 ml-4 mt-3">
      {categories.map((category) => {
        // Compute item count dynamically for this specific category
        const count = items.filter(
          (item) => item.categoryId === category.id,
        ).length;
        return (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              activeCategory === category.id
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {category.name} ({count})
          </button>
        );
      })}
      <button
        onClick={onAddCategory}
        className="flex items-center gap-1.5 rounded-full border border-dashed border-gray-300 px-4 py-2 text-sm font-semibold text-gray-500 hover:border-gray-400 hover:text-gray-700"
      >
        <Plus size={15} />
        Catégorie
      </button>
    </div>
  );
}
