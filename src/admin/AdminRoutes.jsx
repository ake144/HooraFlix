import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UsersPage from './UsersPage';
import StatsPage from './StatsPage';
import PaymentsPage from './PaymentsPage';
import AdminDashboard from './AdminDashboard';
import FounderCodesPage from './FounderCodesPage';
import AdminSettings from './AdminSettings';

const AdminRoutes = () => (
  <Routes>
    <Route path="/" element={<AdminDashboard />} />
    <Route path="/users" element={<UsersPage />} />
    <Route path="/stats" element={<StatsPage />} />
    <Route path="/payments" element={<PaymentsPage />} />
    <Route path="/founder-codes" element={<FounderCodesPage />} />
    <Route path="/settings" element={<AdminSettings />} />
    <Route path="*" element={<Navigate to="/admin" replace />} />
  </Routes>
);

export default AdminRoutes;
