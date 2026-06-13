import React from 'react';
import { FiBell, FiCalendar, FiChevronDown, FiLogOut, FiSearch, FiMenu } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminNavbar = ({ toggleSidebar }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const today = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const titles = {
    '/admin': 'Admin Control Panel',
    '/admin/users': 'User Management',
    '/admin/founder-codes': 'Founder Codes',
    '/admin/payments': 'Commission & Payouts',
    '/admin/stats': 'Platform Statistics',
    '/admin/settings': 'Account Settings',
  };

  const title = titles[location.pathname] || 'Admin Control Panel';

  const getInitials = (name) => {
    if (!name) return 'AD';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <header className="admin-navbar">
      <div className="admin-navbar-title-group">
        <button className="admin-mobile-menu-btn" onClick={toggleSidebar} aria-label="Toggle menu">
          <FiMenu size={24} />
        </button>
        <div className="admin-navbar-title-text">
          <p className="admin-navbar-kicker">Operations</p>
          <h1>{title}</h1>
        </div>
      </div>

      <div className="admin-navbar-actions">
        <div className="admin-navbar-date-pill desktop-only">
          <FiCalendar />
          <span>{today}</span>
        </div>

        <label className="admin-navbar-search desktop-only" aria-label="Search admin data">
          <FiSearch />
          <input type="search" placeholder="Search anything..." />
        </label>

        <button className="admin-icon-btn" aria-label="Notifications">
          <FiBell size={18} />
          <span className="admin-notification-dot" />
        </button>

        <button type="button" className="admin-profile-chip" aria-label="Admin profile">
          <span className="admin-profile-avatar">{getInitials(user?.name)}</span>
          <div className="desktop-only">
            <strong>{user?.name || 'Admin'}</strong>
            <small>{user?.role === 'ADMIN' ? 'Super Admin' : 'Admin'}</small>
          </div>
          {/* <FiChevronDown className="desktop-only" /> */}
        </button>

        <button className="admin-btn admin-logout-btn desktop-only" onClick={logout}>
          <FiLogOut />
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;

