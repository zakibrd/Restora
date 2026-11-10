// components/admin/layout/Topbar.jsx
import { LogOut, Menu } from "lucide-react";

export default function Topbar({ title, onLogout, onMenuClick }) {
  return (
    <header className="flex items-center justify-between border-b border-gray-100 bg-orange-400 px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="text-gray-500 lg:hidden">
          <Menu size={22} />
        </button>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>

      <button
        onClick={onLogout}
        className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
      >
        <LogOut size={16} />
        <span className="hidden sm:inline">Déconnexion</span>
      </button>
    </header>
  );
}
