import "./App.css";
import { Route, Routes } from "react-router-dom";
import Menu from "./pages/customer/Menu";
import OrderConfirmation from "./pages/customer/OrderConfirmation";
import AdminLayout from "./components/admin dashboard/layout/AdminLayout";
import Tables from "./pages/admin/Tables";
import Sales from "./pages/admin/Sales";
import Menumanage from "./pages/admin/Menumanage";
import Login from "./pages/admin/Login";
import ProtectedRoute from "./pages/admin/auth/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          {/* Customer */}
          <Route path="/" element={<Menu></Menu>}></Route>
          <Route
            path="/commande"
            element={<OrderConfirmation></OrderConfirmation>}
          ></Route>
          {/* Admin */}
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout title={"Restaurant el djazayr"} />
              </ProtectedRoute>
            }
          >
            <Route
              element={<ProtectedRoute allowedRoles={["admin", "cashier"]} />}
            >
              <Route path="/admin/tables" element={<Tables />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/menu" element={<Menumanage />} />
              <Route path="/admin/sales" element={<Sales />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
