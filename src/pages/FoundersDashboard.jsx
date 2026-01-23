import React, { useState, useEffect } from 'react';
import { FiUsers, FiAward, FiDollarSign, FiCopy, FiShare2 } from 'react-icons/fi';
import QRCode from 'react-qr-code';
import './FoundersDashboard.css';
import DashboardHeader from '../components/dashboard/header';

const FoundersDashboard = () => {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [showAllReferrals, setShowAllReferrals] = useState(false);
  const [allReferrals, setAllReferrals] = useState([]);
  const [allPagination, setAllPagination] = useState({});
  const [allPage, setAllPage] = useState(1);

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          return;
        }

        // Fetch dashboard stats
        const dashResponse = await fetch('http://localhost:5001/api/founders/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!dashResponse.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const dashData = await dashResponse.json();
        if (dashData.success) {
          setDashboardData(dashData.data);
        }

        // Fetch recent referrals
        const refResponse = await fetch('http://localhost:5001/api/founders/referrals?page=1&limit=5', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (refResponse.ok) {
          const refData = await refResponse.json();
          if (refData.success) {
            setReferrals(refData.data.referrals || []);
          }
        }
      } catch (err) {
        setError(err.message);
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const fetchAllReferrals = async (page = 1) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const response = await fetch(`http://localhost:5001/api/founders/referrals?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch referrals');
      }

      const data = await response.json();
      if (data.success) {
        setAllReferrals(data.data.referrals || []);
        setAllPagination(data.data.pagination || {});
        setAllPage(page);
      }
    } catch (err) {
      console.error('Fetch all referrals error:', err);
    }
  };

  const copyTextFallback = (text) => {
    if (typeof document === 'undefined') {
      return false;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    return successful;
  };

  const copyReferralLink = async () => {
    const link = dashboardData?.referralLink;
    if (!link) {
      return false;
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(link);
      } else if (!copyTextFallback(link)) {
        throw new Error('Clipboard fallback failed');
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (err) {
      console.error('Clipboard copy failed:', err);
      return false;
    }
  };

  const handleShare = async () => {
    const link = dashboardData?.referralLink;
    if (!link) return;

    const sharePayload = {
      title: 'Join HooraFlix',
      text: 'Join me on HooraFlix and unlock founder rewards.',
      url: link
    };

    try {
      if (navigator.share) {
        await navigator.share(sharePayload);
      } else {
        await copyReferralLink();
      }
    } catch (err) {
      console.debug('Share failed, falling back to copy', err);
      await copyReferralLink();
    }
  };

  if (loading) {
    return (
      <div className="founders-dashboard">
        <DashboardHeader />
        <div className="dashboard-container" style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Loading dashboard...</h2>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="founders-dashboard">
        <DashboardHeader />
        <div className="dashboard-container" style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Error loading dashboard</h2>
          <p>{error || 'Please try again later'}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  const { user, stats } = dashboardData;
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getInitial = (name, email) => {
    if (name && name.length) {
      return name.charAt(0).toUpperCase();
    }
    if (email && email.length) {
      return email.charAt(0).toUpperCase();
    }
    return 'F';
  }

  return (
    <div className="founders-dashboard">
      <DashboardHeader />

      <div className="dashboard-container">
        {/* Welcome Section */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Founders Circle Dashboard</h1>
            <p className="dashboard-subtitle">Welcome back, {user.name}. Here is your community growth.</p>
          </div>
          <div className="user-badge">{user.rank} Founder</div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon icon-users">
              <FiUsers />
            </div>
            <div className="stat-info">
              <h3>{stats.totalReferrals}</h3>
              <p>Total Referrals</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon icon-active">
              <FiAward />
            </div>
            <div className="stat-info">
              <h3>{stats.activeReferrals}</h3>
              <p>Active Members</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon icon-money">
              <FiDollarSign />
            </div>
            <div className="stat-info">
              <h3>${stats.earnings.toFixed(2)}</h3>
              <p>Total Rewards</p>
            </div>
          </div>
        </div>

        {/* content split - Referral Link & List */}
        <div className="dashboard-content-grid">

          {/* Recent Referrals List */}
          <div className="dashboard-section referral-list-section">
              <div className="section-header">
                <h2>Recent Referrals</h2>
                <button
                  className="view-all-btn"
                  onClick={() => {
                    setShowAllReferrals(true);
                    fetchAllReferrals(1);
                  }}
                >
                  View All
                </button>
              </div>

            <div className="referral-table-container">
              <table className="referral-table">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Date Joined</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.length > 0 ? (
                    referrals.map((referral, index) => (
                      <tr key={referral.id || index}>
                        <td>
                          <div className="member-cell">
                            <div className="member-avatar">
                              {getInitial(referral.name, referral.email)}
                            </div>
                            <div>
                              <span className="member-name">{referral.name || referral.email}</span>
                              <span className="member-email">{referral.email}</span>
                            </div>
                          </div>
                        </td>
                        <td>{formatDate(referral.joinedAt)}</td>
                        <td>
                          <span className={`status-badge ${referral.status.toLowerCase()}`}>
                            {referral.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                        No referrals yet. Start inviting friends!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar - Link & Actions */}
          <div className="dashboard-sidebar">
            <div className="sidebar-card invite-card">
              <div className="invite-header">
                <div>
                  <h3>Invite Friends</h3>
                  <p>Share your unique founder link, and every friend who joins becomes part of your community.</p>
                  <p className="invite-note">
                    The affiliate link will be automatically converted to a QR code. To show your friend, simply let them scan your QR code.
                  </p>
                </div>
              </div>

              <div className="referral-link-box">
                <input type="text" value={dashboardData.referralLink} readOnly />
                <button onClick={copyReferralLink} className={copied ? 'copied' : ''}>
                  {copied ? 'Copied!' : <FiCopy />}
                </button>
              </div>

              <div className="qr-wrapper">
                <QRCode value={dashboardData.referralLink} bgColor="#050505" fgColor="#fff" level="H" size={152} />
                <span className="qr-caption">Scan to join now</span>
              </div>

              <div className="invite-actions">
                <button className="share-btn primary" onClick={handleShare}>
                  <FiShare2 /> Share Invite
                </button>
                <button className="share-btn secondary" onClick={copyReferralLink}>
                  <FiCopy /> Copy Link
                </button>
              </div>
            </div>

            <div className="sidebar-card milestone-card">
              <h3>Next Milestone</h3>
              <div className="progress-container">
                <div className="progress-labels">
                  <span>{stats.totalReferrals} / {stats.nextMilestone || 150}</span>
                  <span>{stats.nextRank || 'Max Level'}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${stats.nextMilestone ? (stats.totalReferrals / stats.nextMilestone) * 100 : 100}%` }}
                  ></div>
                </div>
                <p className="milestone-text">
                  {stats.nextMilestone ?
                    `You need ${stats.nextMilestone - stats.totalReferrals} more referrals to unlock ${stats.nextRank} perks.` :
                    'You have reached the maximum rank! Keep inviting to increase rewards.'
                  }
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {showAllReferrals && (
        <div
          className="modal-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setShowAllReferrals(false);
            }
          }}
        >
          <div className="modal-panel">
            <div className="modal-header">
              <h3>All Referrals</h3>
              <button className="modal-close" onClick={() => setShowAllReferrals(false)}>
                &times;
              </button>
            </div>
            <div className="referral-table-container">
              <table className="referral-table">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Date Joined</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allReferrals.length > 0 ? (
                    allReferrals.map((referral, index) => (
                      <tr key={referral.id || index}>
                        <td>
                          <div className="member-cell">
                            <div className="member-avatar">
                              {getInitial(referral.name, referral.email)}
                            </div>
                            <div>
                              <span className="member-name">{referral.name || referral.email}</span>
                              <span className="member-email">{referral.email}</span>
                            </div>
                          </div>
                        </td>
                        <td>{formatDate(referral.joinedAt)}</td>
                        <td>
                          <span className={`status-badge ${referral.status.toLowerCase()}`}>
                            {referral.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                        No referrals to show
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="modal-pagination">
              <button
                onClick={() => fetchAllReferrals(allPage - 1)}
                disabled={!allPagination.hasPrev}
              >
                Previous
              </button>
              <span>
                Page {allPagination.currentPage || allPage} of {allPagination.totalPages || 1}
              </span>
              <button
                onClick={() => fetchAllReferrals(allPage + 1)}
                disabled={!allPagination.hasNext}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoundersDashboard;
