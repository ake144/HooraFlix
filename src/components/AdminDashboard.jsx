import React, { useEffect, useState, useContext } from 'react';
import './AdminDashboard.css';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../utils/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [codeStats, setCodeStats] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setUsers(await adminAPI.getUsers());
      setCodeStats(await adminAPI.getCodeStats());
      setPayments(await adminAPI.getPayments());
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await adminAPI.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  if (!user || user.role !== 'admin') {
    return <div className="admin-dashboard-error">Access denied.</div>;
  }

  return (
    <div className="admin-dashboard-container">
      <h1>Admin Dashboard</h1>
      {loading ? <div>Loading...</div> : (
        <>
          <section className="admin-section">
            <h2>Manage Users</h2>
            <ul className="admin-user-list">
              {users.map(u => (
                <li key={u.id} className="admin-user-item">
                  <span>{u.email} ({u.role})</span>
                  <button onClick={() => handleDeleteUser(u.id)}>Delete</button>
                </li>
              ))}
            </ul>
          </section>
          <section className="admin-section">
            <h2>Code Generation Stats</h2>
            <div className="admin-code-stats">
              {codeStats ? JSON.stringify(codeStats) : 'No data'}
            </div>
          </section>
          <section className="admin-section">
            <h2>Payments / Coins</h2>
            <ul className="admin-payment-list">
              {payments.map(p => (
                <li key={p.id} className="admin-payment-item">
                  <span>User: {p.userEmail}</span>
                  <span>Amount: {p.amount}</span>
                  <span>Date: {p.date}</span>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
