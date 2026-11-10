// CategoryTabs.jsx
import { useEffect, useState } from "react";
import MenuItemCard from "./MenuItemCard";
import CartButton from "./CartButton";
import CartSheet from "./Cartsheet";
import { useNavigate } from "react-router-dom";
import instance from "../../assets/axios";

export default function CategoryTabs({
  categories,
  menuItems,
  onCategoryChange,
  tableToken,
}) {
  const [activeCategory, setActiveCategory] = useState(null);
  const [cart, setCart] = useState({});
  const [isCartopen, setIsCartopen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (categories.length > 0 && activeCategory === null) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  function handleSelect(id) {
    setActiveCategory(id);
    onCategoryChange?.(id);
  }

  function handleIncrease(itemId) {
    setCart((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  }

  function handleDecrease(itemId) {
    setCart((prev) => {
      const current = prev[itemId] || 0;
      if (current <= 1) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: current - 1 };
    });
  }

  const handleConfirm = async () => {
    if (Object.keys(cart).length === 0) {
      alert("votre panier est vide");
      return;
    }
    setIsSubmitting(true);
    const payload = {
      table_token: tableToken,
      items: Object.entries(cart).map(([itemId, quantity]) => ({
        menu_item_id: Number(itemId),
        quantity: quantity,
      })),
    };
    try {
      await instance.post("/api/orders/create/", payload);
      setCart({});
      setIsCartopen(false);
      navigate(`/commande/?token=${tableToken}`);
    } catch (error) {
      console.error("Failed to create order:", error);
      alert(
        error.response?.data?.error ||
          "Une erreur est survenue, veuillez réessayer.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const visibleItems = menuItems.filter(
    (item) => item.categoryId === activeCategory,
  );
  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [itemId, qty]) => {
    const item = menuItems.find((m) => m.id === Number(itemId));
    return sum + (item ? item.price * qty : 0);
  }, 0);
  const cartItems = Object.entries(cart).map(([itemId, quantity]) => ({
    item: menuItems.find((m) => m.id === Number(itemId)),
    quantity,
  }));

  return (
    <div className="flex flex-col gap-2 w-full max-w-full overflow-x-hidden">
      {/* Scrollable Category Bar Container */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="flex w-full overflow-x-auto overflow-y-hidden whitespace-nowrap   scrollbar-none">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleSelect(category.id)}
              className={`relative shrink-0 px-4 py-3 text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? "text-orange-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {category.name}
              {activeCategory === category.id && (
                <span className="absolute -bottom-px left-0 right-0 h-0.75 bg-orange-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="my-2 w-full max-w-2xl px-4 sm:px-6">
        {visibleItems.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            quantity={cart[item.id] || 0}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
          />
        ))}
      </div>

      <div>
        <CartButton
          totalItems={totalItems}
          totalPrice={totalPrice}
          onClick={() => setIsCartopen(true)}
        />
      </div>

      <CartSheet
        isOpen={isCartopen}
        onClose={() => setIsCartopen(false)}
        cartItems={cartItems}
        totalPrice={totalPrice}
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
        onConfirm={handleConfirm}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
