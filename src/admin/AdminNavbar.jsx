import React from 'react';
import { FiBell, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

const AdminNavbar = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const titles = {
    '/admin': 'Admin Control Panel',
    '/admin/users': 'User Management',
    '/admin/founder-codes': 'Founder Codes',
    '/admin/payments': 'Payments and Withdrawals',
    '/admin/stats': 'Platform Statistics',
  };

  const title = titles[location.pathname] || 'Admin Control Panel';

  return (
    <header className="admin-navbar">
      <div>
        <p className="admin-navbar-kicker">Operations</p>
        <h1>{title}</h1>
      </div>
      <div className="admin-navbar-actions">
        <button className="admin-icon-btn" aria-label="Notifications">
          <FiBell size={20} />
        </button>
        <button className="admin-btn admin-logout-btn" onClick={logout}>
          <FiLogOut /> Logout
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;
