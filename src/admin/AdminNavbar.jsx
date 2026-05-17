import React from 'react';
import { FiBell, FiCalendar, FiChevronDown, FiLogOut, FiSearch } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

const AdminNavbar = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const today = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

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
      <div className="admin-navbar-title-group">
        <div>
          <p className="admin-navbar-kicker">Operations</p>
          <h1>{title}</h1>
        </div>
        <div className="admin-navbar-date-pill">
          <FiCalendar />
          <span>{today}</span>
        </div>
      </div>

      <div className="admin-navbar-actions">
        <label className="admin-navbar-search" aria-label="Search admin data">
          <FiSearch />
          <input type="search" placeholder="Search anything..." />
        </label>

        <button className="admin-icon-btn" aria-label="Notifications">
          <FiBell size={18} />
          <span className="admin-notification-dot" />
        </button>

        <button type="button" className="admin-profile-chip" aria-label="Admin profile">
          <span className="admin-profile-avatar">AD</span>
          <div>
            <strong>Admin</strong>
            <small>Super Admin</small>
          </div>
          <FiChevronDown />
        </button>

        <button className="admin-btn admin-logout-btn" onClick={logout}>
          <FiLogOut />
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;
