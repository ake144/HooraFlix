import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UsersPage from './UsersPage';
import StatsPage from './StatsPage';
import PaymentsPage from './PaymentsPage';
import AdminDashboard from './AdminDashboard';
import FounderCodesPage from './FounderCodesPage';
import AdminSettings from './AdminSettings';
import CoinManagement from './CoinManagement';
import CommissionManagement from './CommissionManagement';
import MarketingManagement from './MarketingManagement';
import TrainingManagement from './TrainingManagement';

const AdminRoutes = () => (
  <Routes>
    <Route path="/" element={<AdminDashboard />} />
    <Route path="/users" element={<UsersPage />} />
    <Route path="/stats" element={<StatsPage />} />
    <Route path="/payments" element={<PaymentsPage />} />
    <Route path="/commissions" element={<CommissionManagement />} />
    <Route path="/coins" element={<CoinManagement />} />
    <Route path="/founder-codes" element={<FounderCodesPage />} />
    <Route path="/marketing" element={<MarketingManagement />} />
    <Route path="/training" element={<TrainingManagement />} />
    <Route path="/settings" element={<AdminSettings />} />
    <Route path="*" element={<Navigate to="/admin" replace />} />
  </Routes>
);

export default AdminRoutes;
