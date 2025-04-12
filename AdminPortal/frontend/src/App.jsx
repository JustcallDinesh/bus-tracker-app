import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RoutesPage from "../pages/RoutePage";
import AddRouteForm from "../pages/AddRouteForm";
import EditRouteForm from "../pages/EditRouteForm";
import BusesPage from "../pages/BusesPage";
import AddBusForm from "../pages/AddBusForm";
import EditBusForm from "../pages/EditBusForm";
import SendNotificationForm from "../pages/SendNotificationForm";
import NotificationsPage from "../pages/NotificationsPage";
import AdminUsersPage from "../pages/AdminUsersPage";
import AddAdminUserForm from "../pages/AddAdminUserForm";
import EditAdminUserForm from "../pages/EditAdminUserForm";
import SchedulesPage from "../pages/SchedulesPage";
import AddScheduleForm from "../pages/AddScheduleForm";
import EditScheduleForm from "../pages/EditScheduleForm";
import HomePage from "../pages/HomePage";
import LoginForm from "../Components/LoginForm";
import RegisterForm from "../Components/RegisterForm";
import UnapprovedUsersPage from "../Components/UnapprovedUsersPage";

const ProtectedRoute = ({ children }) => {
  const authToken = localStorage.getItem("authToken");
  return authToken ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/" element={<HomePage />} />

      <Route
        path="/routes"
        element={
          <ProtectedRoute>
            <RoutesPage />
          </ProtectedRoute>
        }
      />
      <Route path="/routes/add" element={<AddRouteForm />} />
      <Route path="/routes/edit/:id" element={<EditRouteForm />} />

      <Route path="/buses" element={<BusesPage />} />
      <Route path="/buses/add" element={<AddBusForm />} />
      <Route path="/buses/edit/:id" element={<EditBusForm />} />

      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/notifications/send" element={<SendNotificationForm />} />

      <Route path="/admin/users" element={<AdminUsersPage />} />
      <Route path="/admin/users/add" element={<AddAdminUserForm />} />
      <Route path="/admin/users/edit/:id" element={<EditAdminUserForm />} />

      <Route path="/schedules" element={<SchedulesPage />} />
      <Route path="/schedules/add" element={<AddScheduleForm />} />
      <Route path="/schedules/edit/:id" element={<EditScheduleForm />} />

      <Route
        path="/admin/users/unapproved"
        element={
          <ProtectedRoute>
            <UnapprovedUsersPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
