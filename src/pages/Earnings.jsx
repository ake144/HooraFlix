import React, { useState, useEffect } from 'react';
import { FiUsers, FiDollarSign, FiCopy, FiBookOpen, FiDownload, FiBell, FiShield, FiHome, FiVideo, FiGift, FiSettings, FiLifeBuoy, FiLogOut, FiSearch, FiHelpCircle, FiGrid, FiShare2, FiPieChart, FiRepeat, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { founderAPI } from '../utils/api';
import { Link } from 'react-router-dom';
import NotificationDropdown from '../components/NotificationDropdown';
import './FoundersDashboard.css';

const Earnings = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ coins: 0, earnings: 0, withdrawn: 0, available: 0 });
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [claiming, setClaiming] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchTransactions(1);
  }, []);

  const fetchStats = async () => {
    try {
      const dashData = await founderAPI.getDashboard();
      if (dashData.success) {
        setStats({
          coins: dashData.data.stats.coins || 0,
          earnings: dashData.data.stats.earnings || 0,
          withdrawn: dashData.data.stats.withdrawn || 0,
          available: dashData.data.stats.available || 0,
        });
      }
    } catch (e) { }
  };

  const fetchTransactions = async (page = 1) => {
    setLoading(true);
    try {
      const data = await founderAPI.getTransactions(page, 10);
      if (data.success) {
        setTransactions(data.data.transactions || []);
        setPagination(data.data.pagination || { currentPage: 1, totalPages: 1 });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClaimCoin = async () => {
    if (claiming) return;
    setClaiming(true);
    try {
      const res = await founderAPI.claimCoin();
      if (res.success) {
        fetchStats();
      }
    } finally {
      setClaiming(false);
    }
  };

  const getInitial = (name, email) => {
    return (name || email || 'F').charAt(0).toUpperCase();
  };

  return (
    <div className="fd-layout">
      <aside className="fd-sidebar">
        <div className="fd-sidebar-top">
          <Link to="/founders-dashboard">
            <div className="fd-logo">Hooraflix</div>
            <p className="fd-logo-sub">Admin Console</p>
          </Link>

          <nav className="fd-nav">
            <Link to="/founders-dashboard" className="fd-nav-item"><FiGrid /> Dashboard</Link>
            <Link to="/founders-dashboard/training" className="fd-nav-item"><FiVideo /> Training</Link>
            <Link to="/founders-dashboard/materials" className="fd-nav-item"><FiDownload /> Assets</Link>
            <Link to="/founders-dashboard/settings" className="fd-nav-item"><FiSettings /> Settings</Link>
          </nav>
        </div>

        <div className="fd-sidebar-bottom">
          <div className="fd-profile-card">
            <div className="fd-avatar">{getInitial(user?.name, user?.email)}</div>
            <div className="fd-user-info">
              <div className="fd-user-status">{user?.name || user?.email}</div>
              <div className="fd-user-rank">{user?.rank || 'Starter'} Level</div>
            </div>
          </div>
          <Link to="/founders-dashboard/support" className="fd-nav-item"><FiLifeBuoy /> Support</Link>
          <button className="fd-nav-item " onClick={logout}><FiLogOut /> Logout</button>
        </div>
      </aside>

      <main className="fd-main-content">
        <header className="fd-desktop-topbar">
          <div>
            <h1 className="fd-welcome-title">Earnings & Rewards</h1>
          </div>
          <div className="fd-topbar-actions">
            <span className="fd-coin-pill">Available Coins: {stats.coins?.toLocaleString()}</span>
            <NotificationDropdown />
            <button className="fd-icon-btn" type="button" aria-label="Support"><FiHelpCircle /></button>
          </div>
        </header>

        <section className="fd-dashboard-desktop">
          <div className="fd-content-layout">
            <div className="fd-content-left">
              <div className="fd-card fd-referrals-card">
                <div className="fd-card-header">
                  <h2>Transaction History</h2>
                </div>
                <div className="fd-table-wrapper">
                  {loading ? (
                    <div style={{ padding: 40, textAlign: 'center' }}>Loading transactions...</div>
                  ) : transactions.length > 0 ? (
                    <table className="fd-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Type</th>
                          <th>Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((t, i) => (
                          <tr key={t.id || i}>
                            <td>{new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                            <td>
                              <span className={`fd-status-badge ${t.type === 'Withdrawal' ? 'pending' : 'active'}`}>
                                {t.type}
                              </span>
                            </td>
                            <td className={t.amount > 0 ? "fd-reward-cell" : ""}>
                              {t.amount > 0 ? '+' : ''}${t.amount.toFixed(2)}
                            </td>
                            <td>
                              <span className={`fd-status-badge ${t.status === 'Completed' ? 'active' : 'pending'}`}>
                                {t.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ padding: 40, textAlign: 'center' }}>No transactions yet.</div>
                  )}
                </div>
                <div className="fd-pagination">
                  <button onClick={() => fetchTransactions(pagination.currentPage - 1)} disabled={pagination.currentPage <= 1}><FiChevronLeft /> Prev</button>
                  <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
                  <button onClick={() => fetchTransactions(pagination.currentPage + 1)} disabled={pagination.currentPage >= pagination.totalPages}>Next <FiChevronRight /></button>
                </div>
              </div>
            </div>

            <div className="fd-content-right">
              <div className="fd-card fd-rewards-hero">
                <p className="fd-stat-label">Total Earnings</p>
                <h3>${stats.earnings?.toFixed(2) || '0.00'}</h3>
                <span className="fd-stat-change positive">Available: ${stats.available?.toFixed(2) || '0.00'}</span>
                <button className="fd-withdraw-action" onClick={() => setShowWithdrawModal(true)}>Withdraw Funds</button>
              </div>

              <div className="fd-mini-stats-row">
                <div className="fd-card fd-mini-stat">
                  <p>Withdrawn</p>
                  <strong>${stats.withdrawn?.toFixed(2) || '0.00'}</strong>
                </div>
                <div className="fd-card fd-mini-stat">
                  <p>Available Coins</p>
                  <strong>{stats.coins?.toLocaleString() || '0'}</strong>
                </div>
              </div>

              <div className="fd-card fd-daily-card">
                <div className="fd-daily-header">
                  <h3>Claim Coins</h3>
                </div>
                <p style={{ color: '#a0aec0', marginBottom: '15px', fontSize: '0.9rem' }}>Convert your daily activities into Hooraflix coins.</p>
                <button
                  className="fd-daily-claim-btn"
                  onClick={handleClaimCoin}
                  disabled={claiming}
                >
                  {claiming ? 'Claiming...' : 'Claim Available Coins'}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="fd-dashboard-mobile">
          <header className="fd-mobile-head">
            <div className="fd-mobile-avatar">{getInitial(user?.name, user?.email)}</div>
            <div className="fd-mobile-search">
              <FiSearch />
              <input type="text" value="Search Hooraflix..." readOnly />
            </div>
            <NotificationDropdown />
          </header>

          {/* <div className="fd-mobile-dashboard-grid">
            <Link to="/founders-dashboard" className="fd-mobile-dashboard-card">
              <span className="fd-mobile-dashboard-icon gold"><FiPieChart /></span>
              <span className="fd-mobile-dashboard-label">Overview</span>
            </Link>
            <Link to="/founders-dashboard/earnings" className="fd-mobile-dashboard-card">
              <span className="fd-mobile-dashboard-icon gold"><FiDollarSign /></span>
              <span className="fd-mobile-dashboard-label">Earnings</span>
            </Link>
            <Link to="/founders-dashboard/referrals" className="fd-mobile-dashboard-card">
              <span className="fd-mobile-dashboard-icon gold"><FiUsers /></span>
              <span className="fd-mobile-dashboard-label">Referrals</span>
            </Link>
            <Link to="/founders-dashboard/transactions" className="fd-mobile-dashboard-card">
              <span className="fd-mobile-dashboard-icon gold"><FiRepeat /></span>
              <span className="fd-mobile-dashboard-label">Transactions</span>
            </Link>
          </div> */}

          <div className="fd-card fd-mobile-stat-card">
            <div className="fd-mobile-stat-header">
              <p><FiDollarSign /> Total Earnings</p>
            </div>
            <h3>${stats.earnings?.toFixed(2) || '0.00'}</h3>
            <p className="fd-mobile-sub">Available: ${stats.available?.toFixed(2) || '0.00'}</p>
            <button className="fd-withdraw-action" style={{ marginTop: '15px', width: '100%' }} onClick={() => setShowWithdrawModal(true)}>Withdraw Funds</button>
          </div>

          <div className="fd-card fd-mobile-stat-card">
            <div className="fd-mobile-stat-header">
              <p><FiRepeat /> Withdrawn</p>
            </div>
            <h3>${stats.withdrawn?.toFixed(2) || '0.00'}</h3>
          </div>

          <div className="fd-card fd-mobile-referrals-card">
            <div className="fd-card-header">
              <h2>Recent Transactions</h2>
            </div>
            <div className="fd-mobile-referrals-list">
              {loading ? (
                <div className="fd-mobile-empty-state">Loading...</div>
              ) : transactions.length > 0 ? (
                transactions.map((t, index) => (
                  <div key={t.id || index} className="fd-mobile-referral-item">
                    <div className="fd-member-cell">
                      <div className="fd-member-avatar" style={{ background: t.amount > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: t.amount > 0 ? '#10b981' : '#ef4444' }}>
                        {t.amount > 0 ? '+' : '-'}
                      </div>
                      <div>
                        <div className="fd-member-name">{t.type}</div>
                        <div className="fd-mobile-referral-date">{new Date(t.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="fd-mobile-referral-meta">
                      <span className={`fd-status-badge ${t.status === 'Completed' ? 'active' : 'pending'}`}>
                        {t.status}
                      </span>
                      <strong style={{ color: t.amount > 0 ? '#10b981' : '#fff' }}>{t.amount > 0 ? '+' : ''}${t.amount.toFixed(2)}</strong>
                    </div>
                  </div>
                ))
              ) : (
                <div className="fd-mobile-empty-state">No transactions yet.</div>
              )}
            </div>
            <div className="fd-pagination" style={{ padding: '15px' }}>
              <button onClick={() => fetchTransactions(pagination.currentPage - 1)} disabled={pagination.currentPage <= 1}><FiChevronLeft /></button>
              <span>{pagination.currentPage} / {pagination.totalPages}</span>
              <button onClick={() => fetchTransactions(pagination.currentPage + 1)} disabled={pagination.currentPage >= pagination.totalPages}><FiChevronRight /></button>
            </div>
          </div>

          <nav className="fd-mobile-nav">
            <Link to="/founders-dashboard" className="fd-mobile-nav-item"><FiHome /><span>Home</span></Link>
            <Link to="/founders-dashboard/referrals" className="fd-mobile-nav-item"><FiUsers /><span>Referrals</span></Link>
            <Link to="/founders-dashboard/earnings" className="fd-mobile-nav-item active"><FiDollarSign /><span>Earnings</span></Link>
            <Link to="/founders-dashboard/settings" className="fd-mobile-nav-item"><FiShield /><span>Profile</span></Link>
            <button type="button" className="fd-mobile-nav-item fd-mobile-logout-btn" onClick={logout}>
              <FiLogOut />
              <span>Logout</span>
            </button>
          </nav>
        </section>
      </main>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fd-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowWithdrawModal(false)}>
          <div className="fd-modal">
            <div className="fd-modal-header">
              <h2>Withdraw Rewards</h2>
              <button className="fd-close" onClick={() => setShowWithdrawModal(false)}>&times;</button>
            </div>
            <div className="fd-modal-body">
              <p>Select your preferred withdrawal method:</p>
              <div className="fd-withdraw-options">
                {['Bank Transfer', 'Mobile Money', 'Crypto', 'PayPal'].map(method => (
                  <label key={method} className={`fd-option ${withdrawMethod === method ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="withdrawMethod"
                      value={method}
                      onChange={(e) => setWithdrawMethod(e.target.value)}
                    />
                    {method}
                  </label>
                ))}
              </div>
              <div className="fd-withdraw-amount">
                <label>Amount to Withdraw:</label>
                <input type="number" placeholder="Enter amount" max={stats.available} />
                <span className="fd-max-balance">Max: ${stats.available ? stats.available.toFixed(2) : "0.00"}</span>
              </div>
            </div>
            <div className="fd-modal-footer">
              <button className="fd-btn-cancel" onClick={() => setShowWithdrawModal(false)}>Cancel</button>
              <button className="fd-btn-confirm" disabled={!withdrawMethod}>Confirm Withdrawal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Earnings;
