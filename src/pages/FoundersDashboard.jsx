import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { FiUsers, FiAward, FiDollarSign, FiCopy, FiShare2 } from 'react-icons/fi';
import './FoundersDashboard.css';

const FoundersDashboard = () => {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [referrals, setReferrals] = useState([]);

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

  const copyToClipboard = () => {
    if (dashboardData?.referralLink) {
      navigator.clipboard.writeText(dashboardData.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="founders-dashboard">
        <Header />
        <div className="dashboard-container" style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Loading dashboard...</h2>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="founders-dashboard">
        <Header />
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

  return (
    <div className="founders-dashboard">
      <Header />

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
              <button className="view-all-btn">View All</button>
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
                            <img
                              src={`https://i.pravatar.cc/150?u=${referral.email}`}
                              alt={referral.name}
                              className="member-avatar"
                            />
                            <span className="member-name">{referral.name}</span>
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
              <h3>Invite New Founders</h3>
              <p>Share your unique code to grow your circle.</p>

              <div className="referral-link-box">
                <input type="text" value={dashboardData.referralLink} readOnly />
                <button onClick={copyToClipboard} className={copied ? 'copied' : ''}>
                  {copied ? 'Copied!' : <FiCopy />}
                </button>
              </div>

              <button className="share-btn">
                <FiShare2 /> Share Invite
              </button>
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
    </div>
  );
};

export default FoundersDashboard;
