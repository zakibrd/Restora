import { useEffect, useState, useCallback } from "react";
import TablesStatusLegend from "../../components/admin dashboard/tables/TablesStatusLegend";
import TablesCard from "../../components/admin dashboard/tables/TablesCard";
import Tableinfo from "../../components/admin dashboard/tables/Tablesinfo";

import instance from "../../assets/axios";
export default function Tables() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchtables = useCallback(async () => {
    try {
      const response = await instance.get("/api/table/");
      setTables(response.data);
    } catch (err) {
      console.error("failed to load tables", err);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    // 1. Fetch tables immediately on mount
    fetchtables();

    // 2. Poll for new orders/tables every 3 seconds
    const intervalId = setInterval(() => {
      fetchtables();
    }, 3000);

    // 3. Clean up interval when leaving the page
    return () => clearInterval(intervalId);
  }, [fetchtables]);

  // 👈 NOUVEAU : garde selectedTable synchronisé avec les données fraîchement pollées.
  // Avant ce correctif, selectedTable restait figé sur l'état au moment du clic,
  // donc le panneau affichait des données périmées et onAccept/onComplete
  // pouvaient agir sur une commande qui n'était plus celle affichée à l'écran.
  useEffect(() => {
    setSelectedTable((prev) => {
      if (!prev) return prev;
      const updated = tables.find((t) => t.id === prev.id);
      return updated || null;
    });
  }, [tables]);

  // 👈 orderId est maintenant obligatoire : chaque commande de la table
  // est acceptée individuellement, indépendamment des autres commandes
  // actives de la même session.
  const handleAccept = async (orderId) => {
    if (!selectedTable || !orderId) return;
    try {
      await instance.patch(`/api/orders/${orderId}/`, {
        status: "confirmed",
      });

      if (selectedTable.status !== "occupied") {
        await instance.patch(`/api/table/${selectedTable.id}/`, {
          status: "occupied",
        });
      }

      // Mise à jour optimiste : seule LA commande acceptée passe en "confirmed",
      // les autres commandes actives restent visibles telles quelles.
      setSelectedTable((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          status: "occupied",
          orders: (prev.orders || []).map((o) =>
            o.id === orderId ? { ...o, status: "confirmed" } : o,
          ),
        };
      });

      await fetchtables();
    } catch (err) {
      console.error("Failed to accept order:", err);
    }
  };

  function handleReprint(orderId) {
    console.log("reprint", orderId);
  }

  // 👈 Complète TOUTES les commandes actives de la session en une fois :
  // les commandes confirmées passent à "completed", les commandes encore
  // en attente (jamais acceptées) sont annulées, puis la table est libérée.
  const handleComplete = async (tableId) => {
    if (!selectedTable) return;

    const orders = selectedTable.orders || [];

    try {
      await Promise.all(
        orders.map((order) => {
          if (order.status === "confirmed") {
            return instance.patch(`/api/orders/${order.id}/`, {
              status: "completed",
            });
          }
          if (order.status === "pending") {
            return instance.patch(`/api/orders/${order.id}/`, {
              status: "cancelled",
            });
          }
          return Promise.resolve();
        }),
      );

      await instance.patch(`/api/table/${tableId}/`, {
        status: "empty",
      });

      setSelectedTable(null);
      await fetchtables();
    } catch (err) {
      console.error("Failed to complete table session:", err);
      alert("Erreur lors de la libération de la table.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500 font-medium">
        Chargement du plan de salle...
      </div>
    );
  }
  return (
    <div className="flex h-full overflow-hidden">
      {/* Left section for grid */}
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Plan de Salle</h2>
          <p className="text-sm text-gray-500">
            {tables.length} tables — cliquez pour voir une commande
          </p>
        </div>

        {/* 4-column grid layout matching Screenshot 2 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-4xl">
          {tables.map((table) => (
            <TablesCard
              key={table.id}
              table={table}
              isSelected={selectedTable?.id === table.id}
              onClick={() => setSelectedTable(table)}
            />
          ))}
        </div>

        <div className="mt-auto pt-4">
          <TablesStatusLegend />
        </div>
      </div>

      {/* Flush edge-to-edge right panel */}
      <Tableinfo
        table={selectedTable}
        onClose={() => setSelectedTable(null)}
        onAccept={handleAccept}
        onReprint={handleReprint}
        onComplete={handleComplete}
      />
    </div>
  );
}
