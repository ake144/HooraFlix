import React from 'react';
import './AdminSidebar.css';
import { Link } from 'react-router-dom';

const AdminSidebar = () => (
  <aside className="admin-sidebar">
    <nav>
      <ul>
        <li><Link to="/admin/users">Users</Link></li>
        <li><Link to="/admin/stats">Stats</Link></li>
        <li><Link to="/admin/payments">Payments</Link></li>
        <li><Link to="/admin/settings">Settings</Link></li>
      </ul>
    </nav>
  </aside>
);

export default AdminSidebar;
