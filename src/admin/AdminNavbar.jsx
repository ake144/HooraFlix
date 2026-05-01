import React from 'react';
import './AdminNavbar.css';
import { FiBell, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const AdminNavbar = () => {
  const { logout } = useAuth();

  return (
    <header className="admin-navbar">
      <h1>Admin Control Panel</h1>
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <button className="admin-btn" style={{ background: 'transparent', color: '#97a3b6', padding: '8px' }}>
          <FiBell size={20} />
        </button>
        <button className="admin-btn" onClick={logout} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}>
          <FiLogOut /> Logout
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;
