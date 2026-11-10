// OrderConfirmation.jsx
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import instance from "../../assets/axios";
export default function OrderConfirmation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const fetchtables = useCallback(async () => {
    try {
      const response = await instance.get("/api/table/");
      setTables(response.data);
    } catch (err) {
      console.error("failed to load tables", err);
    }
  }, []);
  const fetchorders = useCallback(async () => {
    try {
      const response = await instance.get("/api/orders/");
      setOrders(response.data);
    } catch (err) {
      console.error("failed to load tables", err);
    }
  }, []);

  useEffect(() => {
    // 1. Fetch tables immediately on mount
    fetchtables();
    fetchorders();
  }, [fetchtables, fetchorders]);

  const currenttable = tables.find((table) => table.token === token);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50">
        <CheckCircle2 size={44} className="text-orange-500" />
      </div>

      <h1 className="text-xl font-semibold text-gray-900">
        Commande envoyée !
      </h1>
      <p className="mt-2 max-w-xs text-sm text-gray-500">
        Votre commande a été reçue par la cuisine. Merci de patienter à votre
        table.
      </p>

      <div className="mt-6 w-full max-w-xs rounded-2xl bg-gray-50 px-5 py-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Table</span>
          <span className="font-medium text-gray-900">
            {currenttable ? `#${currenttable.number}` : "—"}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-gray-500">Commande</span>
          <span className="font-medium text-gray-900">#{orders[0]?.id}</span>
        </div>
      </div>

      <button
        onClick={() => navigate(`/?token=${token}`)}
        className="mt-8 w-full max-w-xs rounded-full bg-orange-500 py-4 text-sm font-medium text-white"
      >
        Retour au menu
      </button>
    </div>
  );
}
