// components/admin/layout/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Utensils, Receipt, X } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const navItems = [
    { to: "/admin/tables", label: "Tables", icon: LayoutDashboard },
    ...(user?.role === "admin"
      ? [
          { to: "/admin/menu", label: "Menu", icon: Utensils },
          { to: "/admin/sales", label: "Sales", icon: Receipt },
        ]
      : []),
  ];

  return (
    <>
      {/* Dark overlay behind the sidebar, only shown on narrow screens when open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-100 bg-white px-3 py-6
          transition-transform duration-200
          lg:static lg:z-auto lg:w-60 lg:translate-x-0 xl:w-64
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="mb-8 flex items-center justify-between px-3">
          <h1 className="text-lg font-bold text-gray-900">Restaurant Admin</h1>
          <button onClick={onClose} className="lg:hidden text-gray-400">
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-orange-50 text-orange-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
