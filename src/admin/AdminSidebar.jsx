import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiActivity, FiDatabase, FiDollarSign, FiHome, FiKey, FiLayers, FiLogOut, FiShield, FiUsers } from 'react-icons/fi';
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
        <div className="admin-sidebar-brand">
          <div className="admin-sidebar-mark">
            <span>H</span>
          </div>
          <div>
            <h2>Hooraflix</h2>
            <p>Stream Control</p>
          </div>
        </div>
        <div className="admin-sidebar-section-label">Main menu</div>
        <nav>
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} className={`admin-nav-link ${isActive(item.to) ? 'active' : ''}`}>
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-section-label admin-sidebar-section-label-spaced">Platform status</div>
        <div className="admin-sidebar-status-card">
          <div className="admin-sidebar-status-row">
            <span><FiShield /></span>
            <div>
              <strong>All systems operational</strong>
              <small>Streaming, payments, and database are stable</small>
            </div>
          </div>
          <div className="admin-sidebar-status-metrics">
            <div>
              <FiActivity />
              <span>Live</span>
            </div>
            <div>
              <FiDatabase />
              <span>Synced</span>
            </div>
            <div>
              <FiLayers />
              <span>Backups</span>
            </div>
          </div>
        </div>

        <div className="admin-sidebar-promo-card">
          <p className="admin-sidebar-promo-kicker">Hooraflix coming soon</p>
          <h3>Create, stream &amp; earn</h3>
          <button type="button">View Campaign</button>
        </div>
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
