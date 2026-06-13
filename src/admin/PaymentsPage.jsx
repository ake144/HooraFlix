import React, { useEffect, useState, useMemo } from 'react';
import AdminLayout from './AdminLayout';
import './PaymentsPage.css';
import { adminAPI } from '../utils/api';
import {
  FiActivity,
  FiDollarSign,
  FiRefreshCw,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiXCircle,
} from 'react-icons/fi';

const numberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
});

const formatCoins = (value) => `${numberFormatter.format(Number(value) || 0)} coins`;

const formatDate = (value) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const loadPayments = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminAPI.getPayments();
      setPayments(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      console.error('Failed to load payments', err);
      setError('Unable to load payment transactions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const filteredPayments = useMemo(() => {
    if (filter === 'all') return payments;
    return payments.filter(p => p.status?.toLowerCase() === filter.toLowerCase());
  }, [payments, filter]);

  const metrics = useMemo(() => {
    const totalVolume = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const successful = payments.filter(p => p.status?.toLowerCase() === 'completed').length;
    const pending = payments.filter(p => p.status?.toLowerCase() === 'pending').length;
    return { totalVolume, successful, pending };
  }, [payments]);

  return (
    <AdminLayout>
      <div className="admin-payments-page">
        <section className="admin-panel admin-payments-hero">
          <div className="admin-payments-hero-copy">
            <p className="admin-panel-kicker">Transaction Monitoring</p>
            <h2>Track all platform payments and financial activity.</h2>
            <p>
              Monitor successful purchases, pending transactions, and overall revenue flow across the platform.
            </p>
            <div className="admin-payments-hero-actions">
              <button type="button" className="admin-btn" onClick={loadPayments}>
                <FiRefreshCw />
                Refresh Transactions
              </button>
            </div>
          </div>
          <div className="admin-payments-hero-metrics">
            <article>
              <span><FiDollarSign /></span>
              <small>Total Volume</small>
              <strong>{formatCoins(metrics.totalVolume)}</strong>
            </article>
            <article>
              <span><FiCheckCircle /></span>
              <small>Successful</small>
              <strong>{metrics.successful}</strong>
            </article>
            <article>
              <span><FiClock /></span>
              <small>Pending</small>
              <strong>{metrics.pending}</strong>
            </article>
            <article>
              <span><FiTrendingUp /></span>
              <small>Total Count</small>
              <strong>{payments.length}</strong>
            </article>
          </div>
        </section>

        <section className="admin-panel admin-payments-table-card">
          <div className="admin-panel-header">
            <div>
              <p className="admin-panel-kicker">Transaction Log</p>
              <h3>Recent Payments</h3>
            </div>
            <div className="admin-payments-filter-row">
              <button className={`admin-payments-filter-pill ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
              <button className={`admin-payments-filter-pill ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>Completed</button>
              <button className={`admin-payments-filter-pill ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>Pending</button>
            </div>
          </div>

          <div className="admin-payments-table-wrap">
            <table className="admin-payments-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-10">Loading transactions...</td></tr>
                ) : error ? (
                  <tr><td colSpan="5" className="text-center py-10 text-red-400">{error}</td></tr>
                ) : filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => (
                    <tr key={payment.id}>
                      <td><code>{payment.id}</code></td>
                      <td>{payment.userEmail || 'N/A'}</td>
                      <td><span className="admin-payments-amount">{formatCoins(payment.amount)}</span></td>
                      <td>{formatDate(payment.createdAt)}</td>
                      <td>
                        <span className={`admin-payments-status-pill admin-payments-status-${payment.status?.toLowerCase()}`}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" className="text-center py-10">No transactions found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

export default PaymentsPage;
