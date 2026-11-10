// pages/admin/Sales.jsx
import { useEffect, useState } from "react";
import { ShoppingBag, TrendingUp, ShoppingBasket, Clock } from "lucide-react";
import SalesStatCard from "../../components/admin dashboard/sales/SalesStatCard";
import OrderHistory from "../../components/admin dashboard/sales/OrdersHistory";
import instance from "../../assets/axios";

export default function Sales() {
  const [orders, setOrders] = useState([]);

  const completedOrders = orders.filter((o) => o.status === "completed");
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
  const totalCount = orders.length;
  const avgBasket = completedOrders.length
    ? Math.round(totalRevenue / completedOrders.length)
    : 0;
  const inProgressCount = orders.filter((o) => o.status === "pending").length;

  const fetchorders = async () => {
    try {
      const response = await instance.get("/api/orders/");
      setOrders(response.data);
    } catch (err) {
      console.error("failed to load tables", err);
    }
  };
  useEffect(() => {
    fetchorders();
  }, []);

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Ventes du Jour</h2>
        <p className="text-sm text-gray-500">
          Aperçu des ventes et historique des commandes
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SalesStatCard
          label="Total Commandes"
          value={totalCount}
          icon={ShoppingBag}
        />
        <SalesStatCard
          label="Chiffre d'affaires"
          value={`${totalRevenue.toLocaleString()} DZD`}
          icon={TrendingUp}
          valueColor="text-orange-500"
        />
        <SalesStatCard
          label="Panier moyen"
          value={`${avgBasket.toLocaleString()} DZD`}
          icon={ShoppingBasket}
          valueColor="text-orange-500"
        />
        <SalesStatCard label="En cours" value={inProgressCount} icon={Clock} />
      </div>

      <OrderHistory orders={orders} />
    </div>
  );
}
