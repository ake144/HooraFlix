import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UsersPage from './UsersPage';
import StatsPage from './StatsPage';
import PaymentsPage from './PaymentsPage';

const AdminRoutes = () => (
  <Routes>
    <Route path="/admin/users" element={<UsersPage />} />
    <Route path="/admin/stats" element={<StatsPage />} />
    <Route path="/admin/payments" element={<PaymentsPage />} />
    <Route path="/admin/*" element={<Navigate to="/admin/users" replace />} />
  </Routes>
);

export default AdminRoutes;
