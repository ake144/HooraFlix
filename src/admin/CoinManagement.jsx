import React, { useEffect, useState, useMemo } from 'react';
import AdminLayout from './AdminLayout';
import './CoinManagement.css';
import { adminAPI } from '../utils/api';
import {
    FiActivity,
    FiDatabase,
    FiRefreshCw,
    FiTrendingUp,
    FiClock,
    FiCalendar,
    FiArrowUpRight,
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
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
};

const CoinManagement = () => {
    const [coinStats, setCoinStats] = useState({ total: 0, series: [], recentClaims: [] });
    const [coinDate, setCoinDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterLoading, setFilterLoading] = useState(false);

    const loadCoinStats = async (date = null) => {
        if (date) setFilterLoading(true);
        else setLoading(true);

        setError('');

        try {
            const res = await adminAPI.getCoinClaims(date);
            if (res.success) {
                if (date) {
                    // When filtering by date, we might get a different structure
                    setCoinStats(prev => ({
                        ...prev,
                        total: res.data.total || 0,
                        recentClaims: res.data.claims || [],
                        date: res.data.date
                    }));
                } else {
                    setCoinStats({
                        series: res.data.series || [],
                        recentClaims: res.data.recentClaims || [],
                        total: (res.data.series && res.data.series.slice(-1)[0]?.total) || 0
                    });
                }
            }
        } catch (err) {
            console.error('Failed to load coin claims', err);
            setError('Failed to load coin statistics. Please try again.');
        } finally {
            setLoading(false);
            setFilterLoading(false);
        }
    };

    useEffect(() => {
        loadCoinStats();
    }, []);

    const handleFilter = (e) => {
        e.preventDefault();
        loadCoinStats(coinDate);
    };

    const totalClaimedAllTime = useMemo(() => {
        if (coinStats.series && coinStats.series.length > 0) {
            return coinStats.series.reduce((acc, curr) => acc + (curr.total || 0), 0);
        }
        return coinStats.total || 0;
    }, [coinStats]);

    return (
        <AdminLayout>
            <div className="admin-coins-page">
                <section className="admin-panel admin-coins-hero">
                    <div className="admin-coins-hero-copy">
                        <p className="admin-panel-kicker">Coin Management</p>
                        <h2>Monitor coin distribution and reward performance.</h2>
                        <p>
                            Track how many coins are being claimed across the platform and analyze reward trends over time.
                        </p>

                        <div className="admin-coins-hero-actions">
                            <button type="button" className="admin-btn admin-coins-refresh-btn" onClick={() => loadCoinStats()}>
                                <FiRefreshCw />
                                Refresh Stats
                            </button>
                        </div>
                    </div>

                    <div className="admin-coins-filter-card">
                        <div className="admin-panel-header">
                            <div>
                                <p className="admin-panel-kicker">Date Filter</p>
                                <h3>View claims by date</h3>
                            </div>
                        </div>
                        <form onSubmit={handleFilter} className="admin-coins-filter-form">
                            <div className="admin-coins-field">
                                <span>Select Date</span>
                                <div className="admin-coins-input-group">
                                    <input
                                        type="date"
                                        value={coinDate}
                                        onChange={(e) => setCoinDate(e.target.value)}
                                    />
                                    <button type="submit" className="admin-btn" disabled={filterLoading}>
                                        {filterLoading ? 'Filtering...' : 'Filter'}
                                    </button>
                                </div>
                            </div>
                        </form>
                        {coinStats.date && (
                            <div className="admin-coins-filter-result">
                                <small>Total for {coinStats.date}:</small>
                                <strong>{formatCoins(coinStats.total)}</strong>
                            </div>
                        )}
                    </div>
                </section>

                <div className="admin-coins-metrics-grid">
                    <article className="admin-panel admin-coins-metric-card">
                        <div className="admin-coins-metric-icon">
                            <FiDatabase />
                        </div>
                        <div className="admin-coins-metric-info">
                            <small>Total Coins Claimed</small>
                            <strong>{formatCoins(totalClaimedAllTime)}</strong>
                        </div>
                    </article>

                    <article className="admin-panel admin-coins-metric-card">
                        <div className="admin-coins-metric-icon">
                            <FiTrendingUp />
                        </div>
                        <div className="admin-coins-metric-info">
                            <small>Recent Activity</small>
                            <strong>{coinStats.recentClaims?.length || 0} Claims</strong>
                        </div>
                    </article>

                    <article className="admin-panel admin-coins-metric-card">
                        <div className="admin-coins-metric-icon">
                            <FiClock />
                        </div>
                        <div className="admin-coins-metric-info">
                            <small>Last Updated</small>
                            <strong>{new Date().toLocaleTimeString()}</strong>
                        </div>
                    </article>
                </div>

                <section className="admin-coins-content-grid">
                    <article className="admin-panel admin-coins-table-card">
                        <div className="admin-panel-header">
                            <div>
                                <p className="admin-panel-kicker">Activity Log</p>
                                <h3>Recent Coin Claims</h3>
                            </div>
                            <span className="admin-panel-chip">{coinStats.recentClaims?.length || 0} entries</span>
                        </div>

                        <div className="admin-coins-table-wrap">
                            <table className="admin-coins-table">
                                <thead>
                                    <tr>
                                        <th>User / Email</th>
                                        <th>Amount</th>
                                        <th>Date & Time</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="4" className="admin-coins-table-empty">Loading claims...</td>
                                        </tr>
                                    ) : coinStats.recentClaims && coinStats.recentClaims.length > 0 ? (
                                        coinStats.recentClaims.map((claim, index) => (
                                            <tr key={claim.id || index}>
                                                <td>
                                                    <div className="admin-coins-user-cell">
                                                        <strong>{claim.userEmail || 'Unknown User'}</strong>
                                                        <span>{claim.userName || 'N/A'}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="admin-coins-amount">+{numberFormatter.format(claim.amount)}</span>
                                                </td>
                                                <td>
                                                    <div className="admin-coins-date-cell">
                                                        <FiCalendar />
                                                        <span>{formatDate(claim.createdAt || claim.date)}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="admin-coins-status-pill">
                                                        Completed
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="admin-coins-table-empty">No claims found for this period.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </article>

                    <article className="admin-panel admin-coins-stats-card">
                        <div className="admin-panel-header">
                            <div>
                                <p className="admin-panel-kicker">Performance</p>
                                <h3>Daily Distribution</h3>
                            </div>
                        </div>

                        <div className="admin-coins-stats-list">
                            {coinStats.series && coinStats.series.length > 0 ? (
                                coinStats.series.map((item, index) => (
                                    <div key={index} className="admin-coins-stat-item">
                                        <div className="admin-coins-stat-label">
                                            <span>{item.date}</span>
                                            <strong>{formatCoins(item.total)}</strong>
                                        </div>
                                        <div className="admin-coins-stat-bar-wrap">
                                            <div
                                                className="admin-coins-stat-bar-fill"
                                                style={{ width: `${Math.min(100, (item.total / (Math.max(...coinStats.series.map(s => s.total)) || 1)) * 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="admin-coins-empty-stats">
                                    <FiActivity />
                                    <p>No distribution data available yet.</p>
                                </div>
                            )}
                        </div>

                        <div className="admin-coins-promo-box">
                            <FiArrowUpRight />
                            <div>
                                <h4>Reward Optimization</h4>
                                <p>Adjust commission rules in the Payments section to balance the coin economy.</p>
                            </div>
                        </div>
                    </article>
                </section>
            </div>
        </AdminLayout>
    );
};

export default CoinManagement;
