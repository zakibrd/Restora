import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import AddCategoryModal from "../../components/admin dashboard/menu mangement/AddCategoryModal";
import instance from "../../assets/axios";
import CategoryTabs2 from "../../components/admin dashboard/menu mangement/CategoryTabs2";
import MenuItemRow from "../../components/admin dashboard/menu mangement/MenuItemRow";
import AddItemModal from "../../components/admin dashboard/menu mangement/AddItemModal";
import ConfirmDeleteModal from "../../components/admin dashboard/menu mangement/ConfirmDeleteModal";
import { categories } from "../../data/mockdata";

export default function Menumanage() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [Categories, setCategories] = useState([]);
  const [menuitems, setMenuitems] = useState([]);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isItemOpen, setIsItemOpen] = useState(false);

  // fetch data

  useEffect(() => {
    const fetchcategory = async () => {
      const res = await instance.get("/api/category/");
      setCategories(res.data);
      const items = res.data.flatMap((cat) =>
        cat.items.map((item) => ({ ...item, categoryId: cat.id })),
      );
      setMenuitems(items);
    };
    fetchcategory();
  }, []);

  useEffect(() => {
    if (Categories.length > 0 && activeCategory === null) {
      setActiveCategory(categories[0].id);
    }
  }, [Categories, activeCategory]);

  // State to hold the item currently being edited
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const visibleItems = menuitems.filter(
    (item) => item.categoryId === activeCategory,
  );
  const handleToggleAvailable = async (itemId) => {
    // 1. Locate current item status
    const itemToToggle = menuitems.find((item) => item.id === itemId);
    if (!itemToToggle) return;

    const newStatus = !itemToToggle.available;

    // 2. Optimistic Update: Instantly toggle UI before API request finishes
    setMenuitems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, available: newStatus } : item,
      ),
    );

    try {
      // 3. Send partial update to Django backend
      await instance.patch(`/api/menuitem/${itemId}/`, {
        available: newStatus,
      });
    } catch (err) {
      console.error("Failed to toggle availability:", err);

      // 4. Rollback state if backend returns error
      setMenuitems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? { ...item, available: itemToToggle.available }
            : item,
        ),
      );
      alert("Impossible de modifier la disponibilité de l'article.");
    }
  };
  const handleAddcategory = async (name) => {
    try {
      const response = await instance.post("/api/category/", { name });
      const newcategory = {
        ...response.data,
        items: response.data.items || [],
      };
      Categories((prev) => [...prev, newcategory]);
      setActiveCategory(newcategory.id);
    } catch (err) {
      console.error("Failed to add category:", err);
      alert(
        err.response?.data?.detail || "Erreur lors de l'ajout de la catégorie",
      );
    }
  };
  // frontend/src/pages/admin/Menumanage.jsx

  const handleAddItem = async (newItemData) => {
    try {
      // 1. Format payload for DRF (expects 'category' ID integer)
      const payload = {
        name: newItemData.name,
        description: newItemData.description || "",
        price: newItemData.price,
        available: newItemData.available ?? true,
        category: newItemData.categoryId, // 👈 Maps category ID to 'category'
      };

      const res = await instance.post("/api/menuitem/", payload);

      // 2. Format returned item to match frontend state structure
      const createdItem = {
        ...res.data,
        categoryId: res.data.category, // Ensures visibility filter (item.categoryId === activeCategory) works
      };

      setMenuitems((prev) => [...prev, createdItem]);
      setActiveCategory(createdItem.categoryId);
      setIsItemOpen(false);
    } catch (err) {
      console.error("Failed to add menu item:", err);
      alert(
        err.response?.data?.detail || "Erreur lors de l'ajout de l'article",
      );
    }
  };
  function handleDeleteClick(item) {
    setDeletingItem(item);
  }

  // NEW: actually removes the item once confirmed
  const handleConfirmDelete = async () => {
    if (!deletingItem) return;

    try {
      await instance.delete(`/api/menuitem/${deletingItem.id}/`);

      setMenuitems((prev) =>
        prev.filter((item) => item.id !== deletingItem.id),
      );
      setDeletingItem(null);
    } catch (err) {
      console.error("Failed to delete item:", err);
      alert(
        err.response?.data?.detail ||
          "Erreur lors de la suppression de l'article",
      );
    }
  };
  function handleEditClick(item) {
    setEditingItem(item);
  }

  // Updates the edited item in state
  const handleSaveItem = async (updatedItem) => {
    try {
      const payload = {
        name: updatedItem.name,
        description: updatedItem.description || "",
        price: updatedItem.price,
        available: updatedItem.available,
        category: updatedItem.categoryId,
      };

      const res = await instance.patch(
        `/api/menuitem/${updatedItem.id}/`,
        payload,
      );

      const savedItem = {
        ...res.data,
        categoryId: res.data.category,
      };

      setMenuitems((prev) =>
        prev.map((item) => (item.id === savedItem.id ? savedItem : item)),
      );
      setEditingItem(null);
    } catch (err) {
      console.error("Failed to update item:", err);
      alert(
        err.response?.data?.detail ||
          "Erreur lors de la modification de l'article",
      );
    }
  };

  return (
    <>
      <div className="flex h-full overflow-hidden flex-col ">
        <div className="flex items-start justify-between p-4 sm:p-6 border-b border-gray-200">
          <div>
            <h2 className="flex flex-1 text-2xl font-bold text-gray-900">
              Gestion du Menu
            </h2>
            <p className="text-sm text-gray-500">
              {menuitems.length} articles · {Categories.length} catégories
            </p>
          </div>
          <button
            className="flex items-center gap-2 rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600"
            onClick={() => setIsItemOpen(true)}
          >
            <Plus size={16} />
            Ajouter un Article
          </button>
        </div>

        {/* NEW: everything below scrolls independently now */}
        <div className="flex-1 overflow-y-auto">
          <CategoryTabs2
            categories={Categories}
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
            onAddCategory={() => setIsAddCategoryOpen(true)}
            items={menuitems}
          />
          <div className="px-4 flex flex-col gap-3 pb-6">
            {visibleItems.map((item) => (
              <MenuItemRow
                key={item.id}
                item={item}
                onToggleAvailable={handleToggleAvailable}
                onEdit={handleEditClick}
                onDelete={() => handleDeleteClick(item)}
              />
            ))}
          </div>
        </div>

        <AddCategoryModal
          isOpen={isAddCategoryOpen}
          onClose={() => setIsAddCategoryOpen(false)}
          onAdd={handleAddcategory}
        />
        <AddItemModal
          isOpen={isItemOpen || Boolean(editingItem)}
          onClose={() => {
            setIsItemOpen(false);
            setEditingItem(null);
          }}
          onAdd={handleAddItem}
          onSave={handleSaveItem}
          editingItem={editingItem}
          categories={Categories}
          defaultCategoryId={activeCategory}
        />
        <ConfirmDeleteModal
          isOpen={Boolean(deletingItem)}
          itemName={deletingItem?.name}
          onCancel={() => setDeletingItem(null)}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </>
  );
}
