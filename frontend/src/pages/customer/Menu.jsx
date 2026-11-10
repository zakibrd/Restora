import Navbar from "../../components/customer/Navbar";
import { table } from "../../data/mockdata";
import CategoryTabs from "../../components/customer/CategoryTabs";
import instance from "../../assets/axios";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
function Menu() {
  const [categories, setCategories] = useState([]);
  const [menuitems, setMenuitems] = useState([]);
  const [tables, setTables] = useState([]);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const fetchtables = useCallback(async () => {
    try {
      const response = await instance.get("/api/table/");
      setTables(response.data);
    } catch (err) {
      console.error("failed to load tables", err);
    }
  }, []);

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
    fetchtables();
  }, [fetchtables]);

  const currenttable = tables.find((table) => table.token === token);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar tableNumber={currenttable?.number} />

      <CategoryTabs
        categories={categories}
        menuItems={menuitems}
        tableToken={token}
      />

      {/* Menu items will go here */}
    </div>
  );
}

export default Menu;
