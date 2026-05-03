import React from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiKey, FiDollarSign, FiActivity, FiShield, FiClock } from 'react-icons/fi';
import AdminLayout from './AdminLayout';

const AdminDashboard = () => {
    const overviewStats = [
        { label: 'Live Monitoring', value: '24/7', icon: <FiActivity /> },
        { label: 'Admin Security', value: 'High', icon: <FiShield /> },
        { label: 'Avg. Review Time', value: '2h', icon: <FiClock /> },
    ];

    return (
        <AdminLayout>
            <div className="admin-header-section admin-dashboard-hero">
                <div>
                    <p className="admin-hero-kicker">Back office</p>
                    <h2>Admin Control Panel</h2>
                    <p>Manage users, founder codes, payouts, and growth operations from one control center.</p>
                </div>
                <div className="admin-hero-badges">
                    {overviewStats.map((stat) => (
                        <div key={stat.label} className="admin-hero-badge">
                            <span>{stat.icon}</span>
                            <div>
                                <small>{stat.label}</small>
                                <strong>{stat.value}</strong>
                            </div>
                        </div>
                    ))}
                </div>
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
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
