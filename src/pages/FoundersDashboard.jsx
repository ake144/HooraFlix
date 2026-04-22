import React, { useState, useEffect } from 'react';
import { FiUsers, FiDollarSign, FiCopy, FiBookOpen, FiDownload, FiBell, FiShield, FiHome, FiVideo, FiGift, FiSettings, FiLifeBuoy, FiLogOut, FiSearch, FiHelpCircle, FiGrid } from 'react-icons/fi';
import { useNavigate, Link } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { useAuth } from '../context/AuthContext';
import { founderAPI } from '../utils/api';
import './FoundersDashboard.css';

const FoundersDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
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
  const currentCoins = Number(stats.coins || coins || 0);
  const rankTiers = [
    { name: 'Starter', requiredCoins: 1000, theme: 'starter' },
    { name: 'Promoter', requiredCoins: 2000, theme: 'promoter' },
    { name: 'Gold', requiredCoins: 3000, theme: 'gold' },
  ];
  const nextRankTier = rankTiers.find((tier) => currentCoins < tier.requiredCoins) || null;
  const coinsNeededForNextRank = nextRankTier ? nextRankTier.requiredCoins - currentCoins : 0;
  const nextRankProgress = nextRankTier
    ? Math.min((currentCoins / nextRankTier.requiredCoins) * 100, 100)
    : 100;
  const referralLink = dashboardData.referralLink || '';

  const getReferralReward = (referral) => {
    if (typeof referral?.rewardAmount === 'number') {
      return referral.rewardAmount;
    }

    return referral?.role === 'Founder' ? 50 : 15;
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
            <Link to="/founders-dashboard" className="fd-nav-item active"><FiGrid /> Dashboard</Link>
            <Link to="/founders-dashboard/training" className="fd-nav-item"><FiVideo /> Training</Link>
            <Link to="/founders-dashboard/materials" className="fd-nav-item"><FiDownload /> Assets</Link>
            <Link to="/settings" className="fd-nav-item"><FiSettings /> Settings</Link>
          </nav>
        </div>

        <div className="fd-sidebar-bottom">
          <div className="fd-profile-card">
            <div className="fd-avatar">{getInitial(user.name, user.email)}</div>
            <div className="fd-user-info">
              <div className="fd-user-status">{user.name || user.email}</div>
              <div className="fd-user-rank">{user.rank} Level</div>
            </div>
          </div>
          <Link to="/support" className="fd-nav-item"><FiLifeBuoy /> Support</Link>
          <button className="fd-nav-item fd-logout-btn" onClick={logout}><FiLogOut /> Logout</button>
        </div>
      </aside>

      <main className="fd-main-content">
        <header className="fd-desktop-topbar">
          <div>
            <h1 className="fd-welcome-title">Welcome Back, {user.name || 'Founder'}</h1>
          </div>
          <div className="fd-topbar-actions">
            <span className="fd-member-pill">Pro Member</span>
            <span className="fd-coin-pill">Available Coins: {currentCoins.toLocaleString()}</span>
            <button className="fd-icon-btn" type="button" aria-label="Notifications"><FiBell /></button>
            <button className="fd-icon-btn" type="button" aria-label="Support"><FiHelpCircle /></button>
          </div>
        </header>

        <section className="fd-dashboard-desktop">
          <div className="fd-content-layout">
            <div className="fd-content-left">
              <div className="fd-card fd-roadmap-desktop">
                <div className="fd-card-header">
                  <div>
                    <p className="fd-eyebrow">Milestone Tracker</p>
                    <h2>Founder Roadmap</h2>
                  </div>
                  <span className="fd-current-tier">Current: {user.rank || 'Starter'}</span>
                </div>

                <div className="fd-roadline">
                  <div className="fd-roadline-progress" style={{ width: `${Math.max(10, nextRankProgress)}%` }} />
                  {rankTiers.map((tier, index) => {
                    const activeTier = currentCoins >= tier.requiredCoins;
                    const currentTier = nextRankTier?.name === tier.name;
                    const lockedTier = !activeTier && !currentTier;

                    return (
                      <div key={tier.name} className={`fd-road-node ${activeTier ? 'done' : ''} ${currentTier ? 'active' : ''} ${lockedTier ? 'locked' : ''}`}>
                        <span className="fd-road-dot">{activeTier ? '✓' : index + 1}</span>
                        <h4>{tier.name}</h4>
                        <small>{activeTier ? 'Completed' : currentTier ? 'Active' : 'Next Goal'}</small>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="fd-card fd-referrals-card">
                <div className="fd-card-header">
                  <h2>Recent Referrals</h2>
                  <button className="fd-view-all" onClick={() => { setShowAllReferrals(true); fetchAllReferrals(1); }}>View All</button>
                </div>
                <div className="fd-table-wrapper">
                  <table className="fd-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Date</th>
                        <th>Tier</th>
                        <th>Reward</th>
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
                              <span className={`fd-status-badge ${r.role === 'Founder' ? 'active' : 'pending'}`}>
                                {(r.role || 'Starter').toUpperCase()}
                              </span>
                            </td>
                            <td className="fd-reward-cell">+${getReferralReward(r).toFixed(2)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No referrals yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="fd-next-rank-card">
                  <div className="fd-next-rank-head">
                    <h4>Next Milestone</h4>
                    {nextRankTier ? (
                      <span className={`fd-next-rank-pill ${nextRankTier.theme}`}>{nextRankTier.name}</span>
                    ) : (
                      <span className="fd-next-rank-pill gold">Max Rank Reached</span>
                    )}
                  </div>

                  {nextRankTier ? (
                    <>
                      <p>
                        You need <strong>{coinsNeededForNextRank}</strong> more coins to unlock <strong>{nextRankTier.name}</strong>.
                      </p>
                      <div className="fd-next-rank-track">
                        <div className="fd-next-rank-fill" style={{ width: `${nextRankProgress}%` }} />
                      </div>
                      <small>{currentCoins} / {nextRankTier.requiredCoins} coins</small>
                    </>
                  ) : (
                    <p>All founder core ranks unlocked. Keep building for future elite tiers.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="fd-content-right">
              <div className="fd-card fd-rewards-hero">
                <p className="fd-stat-label">Total Rewards</p>
                <h3>${stats.earnings ? stats.earnings.toFixed(2) : '0.00'}</h3>
                <span className="fd-stat-change positive">+{Math.min(25, 4 + currentRewardDay)}.5% this month</span>
                <button className="fd-withdraw-action" onClick={() => setShowWithdrawModal(true)}>Withdraw Funds</button>
              </div>

              <div className="fd-mini-stats-row">
                <div className="fd-card fd-mini-stat">
                  <p>Total Referrals</p>
                  <strong>{stats.totalReferrals}</strong>
                </div>
                <div className="fd-card fd-mini-stat">
                  <p>Active Members</p>
                  <strong>{stats.activeReferrals}</strong>
                </div>
              </div>

              <div className="fd-card fd-daily-card">
                <div className="fd-daily-header">
                  <h3>Daily Streak</h3>
                  <span className="fd-streak-count">Day {currentRewardDay || 1}/7</span>
                </div>
                <div className="fd-streak-dots">
                  {Array.from({ length: 3 }).map((_, idx) => {
                    const isLit = idx + 1 <= Math.min(currentRewardDay || 1, 3);
                    return <span key={idx} className={`fd-dot ${isLit ? 'active' : ''}`}>{idx + 1}</span>;
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

              <div className="fd-card fd-invite-card">
                <h3>Expand Your Circle</h3>
                <p>Share your link to earn more rewards.</p>
                <div className="fd-invite-row">
                  <div className="fd-qr-box">
                    <QRCode value={referralLink} bgColor="#0f1218" fgColor="#ffe8a1" level="H" size={84} />
                  </div>
                  <div className="fd-link-input">
                    <input type="text" value={referralLink} readOnly />
                    <button onClick={copyReferralLink} className={copied ? 'copied' : ''}>
                      {copied ? 'Copied' : <FiCopy />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="fd-dashboard-mobile">
          <header className="fd-mobile-head">
            <div className="fd-mobile-avatar">{getInitial(user.name, user.email)}</div>
            <div className="fd-mobile-search">
              <FiSearch />
              <input type="text" value="Search Hooraflix..." readOnly />
            </div>
            <button className="fd-mobile-bell" type="button" aria-label="Notifications"><FiBell /></button>
          </header>

          <div className="fd-mobile-coin-banner">
            <span>Available Coins</span>
            <strong>{currentCoins.toLocaleString()}</strong>
          </div>

          <div className="fd-card fd-mobile-claim">
            <h2>Claim Daily Rewards</h2>
            <p>Complete your admin tasks to earn ecosystem bonuses.</p>
            <button
              className="fd-mobile-claim-btn"
              onClick={handleClaimCoin}
              disabled={claiming || isClaimedToday()}
            >
              {claiming ? 'Claiming...' : isClaimedToday() ? 'Claimed' : 'Claim Now'}
            </button>
          </div>

          <div className="fd-mobile-quick-actions">
            <Link to="/founders-dashboard/training" className="fd-mobile-action"><FiBookOpen /><span>Training</span></Link>
            <Link to="/founders-dashboard/materials" className="fd-mobile-action"><FiDownload /><span>Assets</span></Link>
            <Link to="/support" className="fd-mobile-action"><FiLifeBuoy /><span>Support</span></Link>
            <button className="fd-mobile-action" type="button" onClick={() => setShowWithdrawModal(true)}><FiGift /><span>Rewards</span></button>
          </div>

          <div className="fd-card fd-mobile-stat-card">
            <div className="fd-mobile-stat-header">
              <p><FiUsers /> Total Referrals</p>
              <span>+12.5%</span>
            </div>
            <h3>{stats.totalReferrals}<small> users</small></h3>
            <div className="fd-mobile-bars">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className="fd-card fd-mobile-stat-card">
            <div className="fd-mobile-stat-header">
              <p><FiDollarSign /> Total Rewards Pool</p>
            </div>
            <h3>{currentCoins.toLocaleString()} <small>HFX</small></h3>
            <p className="fd-mobile-sub">≈ ${stats.earnings ? stats.earnings.toFixed(2) : '0.00'} USD</p>
            <div className="fd-mobile-countdown">
              <span>Next distribution</span>
              <strong>04:12:00</strong>
            </div>
          </div>

          <div className="fd-card fd-mobile-roadmap">
            <div className="fd-card-header">
              <h2>Founder Roadmap</h2>
              <button className="fd-view-all" onClick={() => { setShowAllReferrals(true); fetchAllReferrals(1); }}>View Details</button>
            </div>
            <div className="fd-mobile-timeline">
              <div className="fd-mobile-phase done">
                <span className="fd-phase-dot">✓</span>
                <div>
                  <h4>Phase 1: Seed Generation</h4>
                  <p>Initial platform infrastructure and core team assembly completed.</p>
                </div>
              </div>
              <div className="fd-mobile-phase active">
                <span className="fd-phase-dot">•</span>
                <div>
                  <h4>Phase 2: Beta Launch</h4>
                  <p>Onboarding initial user cohort and stress-testing reward distribution.</p>
                  <div className="fd-mobile-progress-row">
                    <div className="fd-mobile-progress-track">
                      <div className="fd-mobile-progress-fill" style={{ width: `${Math.max(30, Math.min(95, nextRankProgress))}%` }} />
                    </div>
                    <span>{Math.round(Math.max(30, Math.min(95, nextRankProgress)))}%</span>
                  </div>
                </div>
              </div>
              <div className="fd-mobile-phase locked">
                <span className="fd-phase-dot">🔒</span>
                <div>
                  <h4>Phase 3: Public Release</h4>
                  <p>Full market availability and exchange listings.</p>
                </div>
              </div>
            </div>
          </div>

          <nav className="fd-mobile-nav">
            <Link to="/founders-dashboard" className="fd-mobile-nav-item active"><FiHome /><span>Home</span></Link>
            <Link to="/founders-dashboard/training" className="fd-mobile-nav-item"><FiVideo /><span>Training</span></Link>
            <Link to="/founders-dashboard/materials" className="fd-mobile-nav-item"><FiDownload /><span>Assets</span></Link>
            <Link to="/settings" className="fd-mobile-nav-item"><FiShield /><span>Profile</span></Link>
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
                            <span className={`fd-status-badge ${r.role === 'Founder' ? 'active' : 'pending'}`}>
                              {r.role === 'Founder' ? 'Active' : 'Pending'}
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
