// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { ProtectedRoute } from "./ProtectedRoute";
import { MainLayout } from "./components/MainLayout";
import { Login } from "./login/login.page";
import { Register } from "./login/register.page";
import { Movement } from "./Movement/feature/page/movimentList.page";
// import { ManagementDashboard } from "./Movement/feature/dashboard/ManagementDashboard";
// import { MovementDashboardComp } from "./Movement/feature/dashboard/MovementDashboardComp";
import { UserList } from "./Movement/feature/page/userList.page";
import { MovementDashboardCompP } from "./Movement/feature/dashboard/MovementDashboardComp2";
import { ManagementDashboardDrawer } from "./Movement/feature/dashboard/ManagementDashboardDrawer";
// import { Customer } from "./customer/feature/customer.page";
// import BancoInterDashboard from "./Modal/BancoDashboard";
// import DashboardInter from "./Modal/BancoDashboard";
// import DashboardFAWS from "./Modal/BancoDashboardFaws";
// import DashboardMobileFAWS from "./Modal/DashboardMobileFAWS";
// import DashboardResponsivo from "./Modal/DashboardResponsivo";

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const savedUser = localStorage.getItem("faws:user");
  
  if (savedUser) {
    try {
      const userObj = JSON.parse(savedUser);
      if (userObj && userObj.role?.toUpperCase() === "ADMIN") {
        return <>{children}</>;
      }
    } catch (e) {
      console.error("Erro ao ler dados do usuário no AdminRoute", e);
    }
  }

  return <Navigate to="/dashboard" replace />;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Customer />} />
        <Route path="/1" element={<DashboardInter />} />
        <Route path="/2" element={<DashboardFAWS />} />
        <Route path="/3" element={<DashboardMobileFAWS />} />
        <Route path="/4" element={<DashboardResponsivo />} /> */}
        
        
        <Route path="/login" element={<Login />} />
        <Route  element={<ProtectedRoute><MainLayout /></ProtectedRoute> }>
          <Route path="/dashboard" element={<MovementDashboardCompP/>} />
          <Route path="/movimentacao" element={<Movement/>} />
          <Route path="/cadastro" element={<ManagementDashboardDrawer/>} />
          <Route path="/usuarios" element={<AdminRoute><UserList /></AdminRoute>} />
          <Route path="/register" element={<AdminRoute><Register /></AdminRoute>} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;