import React from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiKey, FiDollarSign, FiSettings, FiActivity } from 'react-icons/fi';
import AdminLayout from './AdminLayout';

const AdminDashboard = () => {
    return (
        <AdminLayout>
            <div className="admin-header-section" style={{ marginBottom: '30px' }}>
                <h2 style={{ margin: 0, fontSize: '28px', color: '#f3f5f7' }}>Admin Control Panel</h2>
                <p style={{ margin: '8px 0 0', color: '#97a3b6' }}>Manage users, founder codes, and platform settings.</p>
            </div>

            <div className="cpanel-grid">
                <Link to="/admin/users" className="cpanel-card">
                    <div className="cpanel-icon"><FiUsers /></div>
                    <h3>User Management</h3>
                    <p>View and manage all registered users and founders.</p>
                </Link>

                <Link to="/admin/founder-codes" className="cpanel-card">
                    <div className="cpanel-icon"><FiKey /></div>
                    <h3>Founder Codes</h3>
                    <p>Generate and manage referral codes for founders.</p>
                </Link>

                <Link to="/admin/payments" className="cpanel-card">
                    <div className="cpanel-icon"><FiDollarSign /></div>
                    <h3>Payments & Withdrawals</h3>
                    <p>Process withdrawal requests and view payment history.</p>
                </Link>

                <Link to="/admin/stats" className="cpanel-card">
                    <div className="cpanel-icon"><FiActivity /></div>
                    <h3>Platform Statistics</h3>
                    <p>View analytics, growth metrics, and code usage stats.</p>
                </Link>

                <Link to="/admin/settings" className="cpanel-card">
                    <div className="cpanel-icon"><FiSettings /></div>
                    <h3>System Settings</h3>
                    <p>Configure global platform settings and integrations.</p>
                </Link>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
