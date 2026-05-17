import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';
import './AdminLayout.css';
import './AdminShell.css';

const AdminLayout = ({ children }) => (
  <div className="admin-layout">
    <AdminSidebar />
    <div className="admin-main">
      <AdminNavbar />
      <div className="admin-content">{children}</div>
    </div>
  </div>
);

export default AdminLayout;
