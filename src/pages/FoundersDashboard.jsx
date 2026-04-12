import React, { useState, useEffect } from 'react';
import { FiUsers, FiAward, FiDollarSign, FiCopy, FiShare2, FiBookOpen, FiDownload, FiBell, FiShield, FiHome, FiVideo, FiGift, FiSettings, FiLifeBuoy, FiLogOut } from 'react-icons/fi';
import { useNavigate, Link } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { founderAPI } from '../utils/api';
import './FoundersDashboard.css';

const FoundersDashboard = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [showAllReferrals, setShowAllReferrals] = useState(false);
  const [allReferrals, setAllReferrals] = useState([]);
  const [allPagination, setAllPagination] = useState({});
  const [allPage, setAllPage] = useState(1);
  const [coins, setCoins] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastClaimDate, setLastClaimDate] = useState(null);
  const [claiming, setClaiming] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState('');

  const trainingModules = [
    'How to Promote Films',
    'TikTok Promotion Strategy',
    'Social Media Marketing',
    'Personal Branding',
  ];

  const marketingMaterials = [
    'Ready-to-use Posters',
    'Film Trailer Clips',
    'Course Promo Videos',
    'High-converting Social Captions',
    'Affiliate Banner Kits',
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const dashData = await founderAPI.getDashboard();
        if (dashData.success) {
          setDashboardData(dashData.data);
          setCoins(dashData.data.stats.coins || 0);
          setStreak(dashData.data.stats.claimStreak || 0);
          setLastClaimDate(dashData.data.stats.lastClaimDate);
        }

        try {
          const refData = await founderAPI.getReferrals(1, 5);
          if (refData.success) {
            setReferrals(refData.data.referrals || []);
          }
        } catch (refError) {
          console.error('Failed to fetch referrals:', refError);
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
      const data = await founderAPI.getReferrals(page, 10);
      if (data.success) {
        setAllReferrals(data.data.referrals || []);
        setAllPagination(data.data.pagination || {});
        setAllPage(page);
      }
    } catch (err) {
      console.error('Fetch all referrals error:', err);
    }
  };

  const handleClaimCoin = async () => {
    if (claiming) return;
    setClaiming(true);
    try {
      const res = await founderAPI.claimCoin();
      if (res.success) {
        setCoins(res.data.coins);
        setStreak(res.data.streak);
        setLastClaimDate(res.data.lastClaimDate);
        alert(res.message);
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to claim reward');
    } finally {
      setClaiming(false);
    }
  };

  const isClaimedToday = () => {
    if (!lastClaimDate) return false;
    const today = new Date().toDateString();
    const last = new Date(lastClaimDate).toDateString();
    return today === last;
  };

  const copyReferralLink = async () => {
    const link = dashboardData?.referralLink;
    if (!link) return false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(link);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (err) {
      console.error('Clipboard copy failed:', err);
      return false;
    }
  };

  if (loading) {
    return (
      <div className="fd-layout">
        <div className="fd-loader">Loading dashboard...</div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="fd-layout">
        <div className="fd-error">
          <h2>Error loading dashboard</h2>
          <p>{error || 'Please try again later'}</p>
          <div className="fd-error-actions">
            <button onClick={() => window.location.reload()}>Retry</button>
            <button onClick={() => navigate('/founders')}>Go to Founders Page</button>  
          </div>
        </div>
      </div>
    );
  }

  const { user, stats } = dashboardData;
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const getInitial = (name, email) => {
    return (name || email || 'F').charAt(0).toUpperCase();
  };

  const rewardMilestones = [5, 10, 15, 20, 25, 30, 50];
  const currentRewardDay = Math.min(Math.max(streak, 0), rewardMilestones.length);


  return (
    <div className="fd-layout">
      
      {/* LEFT SIDEBAR */}
      <aside className="fd-sidebar">
        <div className="fd-sidebar-top">
          <div className="fd-logo">HOORAFLIX</div>
          
          <div className="fd-user-profile">
            <div className="fd-avatar">{getInitial(user.name, user.email)}</div>
            <div className="fd-user-info">
              <div className="fd-user-status">Premium Member</div>
              <div className="fd-user-rank">{user.rank} Level</div>
            </div>
          </div>

          <nav className="fd-nav">
            <Link to="/founders-dashboard" className="fd-nav-item active"><FiHome /> Dashboard</Link>
            <Link to="/founders-dashboard/training" className="fd-nav-item"><FiVideo /> Training</Link>
            <Link to="/founders-dashboard/materials" className="fd-nav-item"><FiDownload /> Assets</Link>
            <Link to="/founders-dashboard/rewards" className="fd-nav-item"><FiGift /> Rewards</Link>
            <Link to="/settings" className="fd-nav-item"><FiSettings /> Settings</Link>
          </nav>

          <button 
            className="fd-claim-sidebar-btn" 
            onClick={handleClaimCoin} 
            disabled={claiming || isClaimedToday()}
          >
           {stats.coins}  {"  "}   {claiming ? '...' : isClaimedToday() ? 'Claimed ✅' : 'Claim Daily Coins'}
          </button>
        </div>

        <div className="fd-sidebar-bottom">
          <Link to="/support" className="fd-nav-item"><FiLifeBuoy /> Support</Link>
          <button className="fd-nav-item fd-logout-btn"><FiLogOut /> Logout</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="fd-main-content">
        
        {/* Header */}
        <header className="fd-header">
          <div>
            <h1 className="fd-welcome-title">Welcome Back, {user.name}.</h1>
            <p className="fd-welcome-subtitle">Your {user.rank} Founder status is active. Continue your streak to level up.</p>
          </div>
          <button className="fd-insights-btn">View Detailed Insights</button>
        </header>

        {/* Stats Row */}
        <section className="fd-stats-row">
          <div className="fd-stat-card">
            <div className="fd-stat-icon fd-icon-users"><FiUsers /></div>
            <div className="fd-stat-data">
              <p className="fd-stat-label">Total Referrals</p>
              <h3>{stats.totalReferrals}</h3>
              <span className="fd-stat-change positive">+12% this month</span>
            </div>
          </div>
          <div className="fd-stat-card">
            <div className="fd-stat-icon fd-icon-active"><FiShield /></div>
            <div className="fd-stat-data">
              <p className="fd-stat-label">Active Members</p>
              <h3>{stats.activeReferrals}</h3>
              <span className="fd-stat-change">67% Retention Rate</span>
            </div>
          </div>
          <div className="fd-stat-card fd-rewards-stat">
            <div className="fd-stat-icon fd-icon-money"><FiDollarSign /></div>
            <div className="fd-stat-data">
              <p className="fd-stat-label">Total Rewards</p>
              <h3>${stats.earnings ? stats.earnings.toFixed(2) : "0.00"}</h3>
              <span className="fd-stat-change">Lifetime Earnings</span>
            </div>
            <button className="fd-withdraw-btn" onClick={() => setShowWithdrawModal(true)}>Withdraw</button>
          </div>
        </section>

        {/* Content Layout */}
        <div className="fd-content-layout">
          
          <div className="fd-content-left">
            {/* Recent Referrals */}
            <div className="fd-card fd-referrals-card">
              <div className="fd-card-header">
                <h2>Recent Referrals</h2>
                <button className="fd-view-all" onClick={() => { setShowAllReferrals(true); fetchAllReferrals(1); }}>View All</button>
              </div>
              <div className="fd-table-wrapper">
                <table className="fd-table">
                  <thead>
                    <tr>
                      <th>Member Name</th>
                      <th>Date Joined</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referrals.length > 0 ? (
                      referrals.map((r, i) => (
                        <tr key={r.id || i}>
                          <td>
                            <div className="fd-member-cell">
                              <div className="fd-member-avatar">{getInitial(r.name, r.email)}</div>
                              <div className="fd-member-name">{r.name || r.email}</div>
                            </div>
                          </td>
                          <td>{formatDate(r.joinedAt)}</td>
                          <td>
                            <span className={`fd-status-badge ${r.role === "Founder" ? 'active' : 'pending'}`}>
                              {r.role === "Founder" ? "Active" : "Pending"}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="3" style={{textAlign:'center', padding:'20px'}}>No referrals yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Growth Cards */}
            <div className="fd-growth-cards">
              <div className="fd-growth-card">
                <h3><FiBookOpen /> Affiliate Training</h3>
                <p>Inside your dashboard, learn how to sell better and convert followers into active members.</p>
                <button onClick={() => navigate('/founders-dashboard/training')}>Open Training Center</button>
              </div>
              <div className="fd-growth-card">
                <h3><FiDownload /> Marketing Library</h3>
                <p>Download ready-made campaign assets and launch your promotions instantly.</p>
                <button className="alt" onClick={() => navigate('/founders-dashboard/materials')}>Browse Assets</button>
              </div>
            </div>
          </div>

          <div className="fd-content-right">
            {/* Daily Rewards Sidebar */}
            <div className="fd-card fd-daily-card">
              <div className="fd-daily-header">
                <h3>Daily Rewards</h3>
                <div className='fd-stats-section'>               
                  <div className="fd-streak-badge">{stats.coins} Coins</div>
                  <div className="fd-streak-badge-current">{currentRewardDay} Day  Streak</div>
               </div>
              </div>
              <p className="fd-daily-desc">Stack coins every day and earn bonuses.</p>
              
              <div className="fd-timeline">
                {rewardMilestones.slice(0, 5).map((amount, idx) => {
                  const day = idx + 1;
                  const isCompleted = day < currentRewardDay || (day === currentRewardDay && isClaimedToday());
                  const isCurrent = day === currentRewardDay && !isClaimedToday();
                  return (
                    <div key={idx} className={`fd-timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                      <div className="fd-timeline-circle">{day}</div>
                      <div className="fd-timeline-info">
                        <span className="fd-timeline-amount">{amount} Coins</span>
                        <span className="fd-timeline-label">Day {day}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button 
                className="fd-daily-claim-btn" 
                onClick={handleClaimCoin} 
                disabled={claiming || isClaimedToday()}
              >
                {claiming ? '...' : isClaimedToday() ? 'Reward Claimed Today' : 'Claim Daily Reward'}
              </button>
            </div>

            {/* Expand Your Circle */}
            <div className="fd-card fd-invite-card">
              <h3>Expand Your Circle</h3>
              <p>Share your unique founder link. Every referral earns you more rewards.</p>
              
              <div className="fd-qr-box">
                <QRCode value={dashboardData.referralLink || ''} bgColor="#1a1a1a" fgColor="#ffd700" level="H" size={120} />
              </div>

              <div className="fd-link-input">
                <input type="text" value={dashboardData.referralLink || ''} readOnly />
                <button onClick={copyReferralLink} className={copied ? 'copied' : ''}>
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

        </div>
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
                <input type="number" placeholder="Enter amount" max={stats.earnings} />
                <span className="fd-max-balance">Max: ${stats.earnings ? stats.earnings.toFixed(2) : "0.00"}</span>
              </div>
            </div>
            <div className="fd-modal-footer">
              <button className="fd-btn-cancel" onClick={() => setShowWithdrawModal(false)}>Cancel</button>
              <button className="fd-btn-confirm" disabled={!withdrawMethod}>Confirm Withdrawal</button>
            </div>
          </div>
        </div>
      )}

      {/* All Referrals Modal */}
      {showAllReferrals && (
        <div className="fd-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowAllReferrals(false)}>
          <div className="fd-modal fd-modal-large">
            <div className="fd-modal-header">
              <h2>All Referrals</h2>
              <button className="fd-close" onClick={() => setShowAllReferrals(false)}>&times;</button>
            </div>
            <div className="fd-table-wrapper">
              <table className="fd-table">
                <thead>
                  <tr>
                    <th>Member Name</th>
                    <th>Date Joined</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allReferrals.length > 0 ? (
                    allReferrals.map((r, i) => (
                      <tr key={r.id || i}>
                        <td>
                          <div className="fd-member-cell">
                            <div className="fd-member-avatar">{getInitial(r.name, r.email)}</div>
                            <div className="fd-member-name">{r.name || r.email}</div>
                          </div>
                        </td>
                        <td>{formatDate(r.joinedAt)}</td>
                        <td>
                          <span className={`fd-status-badge ${r.role === "Founder" ? 'active' : 'pending'}`}>
                            {r.role === "Founder" ? "Active" : "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="3" style={{textAlign:'center', padding:'20px'}}>No referrals inside network.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="fd-pagination">
              <button onClick={() => fetchAllReferrals(allPage - 1)} disabled={!allPagination.hasPrev}>Prev</button>
              <span>Page {allPagination.currentPage || allPage} of {allPagination.totalPages || 1}</span>
              <button onClick={() => fetchAllReferrals(allPage + 1)} disabled={!allPagination.hasNext}>Next</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default FoundersDashboard;
