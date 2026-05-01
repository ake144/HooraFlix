import React from 'react';
import './AdminSidebar.css';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiUsers, FiKey, FiDollarSign, FiActivity, FiSettings } from 'react-icons/fi';

const AdminSidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-logo">
        <h2>Hooraflix Admin</h2>
      </div>
      <nav>
        <Link to="/admin" className={`admin-nav-link ${isActive('/admin') ? 'active' : ''}`}>
          <FiHome /> Dashboard
        </Link>
        <Link to="/admin/users" className={`admin-nav-link ${isActive('/admin/users') ? 'active' : ''}`}>
          <FiUsers /> Users
        </Link>
        <Link to="/admin/founder-codes" className={`admin-nav-link ${isActive('/admin/founder-codes') ? 'active' : ''}`}>
          <FiKey /> Founder Codes
        </Link>
        <Link to="/admin/payments" className={`admin-nav-link ${isActive('/admin/payments') ? 'active' : ''}`}>
          <FiDollarSign /> Payments
        </Link>
        <Link to="/admin/stats" className={`admin-nav-link ${isActive('/admin/stats') ? 'active' : ''}`}>
          <FiActivity /> Stats
        </Link>
        <Link to="/admin/settings" className={`admin-nav-link ${isActive('/admin/settings') ? 'active' : ''}`}>
          <FiSettings /> Settings
        </Link>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
