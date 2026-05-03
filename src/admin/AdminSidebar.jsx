import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiUsers, FiKey, FiDollarSign, FiActivity, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { to: '/admin', label: 'Dashboard', shortLabel: 'Home', icon: <FiHome /> },
    { to: '/admin/users', label: 'Users', shortLabel: 'Users', icon: <FiUsers /> },
    { to: '/admin/founder-codes', label: 'Founder Codes', shortLabel: 'Codes', icon: <FiKey /> },
    { to: '/admin/payments', label: 'Payments', shortLabel: 'Pay', icon: <FiDollarSign /> },
    { to: '/admin/stats', label: 'Stats', shortLabel: 'Stats', icon: <FiActivity /> },
  ];

  const isActive = (path) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <h2>Hooraflix Admin</h2>
        </div>
        <nav>
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} className={`admin-nav-link ${isActive(item.to) ? 'active' : ''}`}>
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <nav className="admin-mobile-nav" aria-label="Admin mobile navigation">
        {navItems.map((item) => (
          <Link key={`mobile-${item.to}`} to={item.to} className={`admin-mobile-nav-item ${isActive(item.to) ? 'active' : ''}`}>
            {item.icon}
            <span>{item.shortLabel}</span>
          </Link>
        ))}
        <button type="button" className="admin-mobile-nav-item admin-mobile-logout-btn" onClick={logout}>
          <FiLogOut />
          <span>Out</span>
        </button>
      </nav>
    </>
  );
};

export default AdminSidebar;
