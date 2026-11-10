// pages/admin/auth/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500 font-medium">Loading session...</p>
      </div>
    );
  }

  // 1. Not logged in -> Redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. User role not authorized -> Redirect to default tables view
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/admin/tables" replace />;
  }

  // 3. Render children (if used as wrapper) or <Outlet /> (if used as Route element)
  return children ? children : <Outlet />;
}
