import React, { useState, useEffect } from 'react';
import { FiUsers, FiDollarSign, FiCopy, FiBookOpen, FiDownload, FiBell, FiShield, FiHome, FiVideo, FiGift, FiSettings, FiLifeBuoy, FiLogOut, FiSearch, FiHelpCircle, FiGrid, FiShare2, FiPieChart, FiRepeat, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { SiWhatsapp, SiTelegram, SiLinkedin, SiFacebook, SiX } from 'react-icons/si';
import QRCode from 'react-qr-code';
import { useAuth } from '../context/AuthContext';
import { founderAPI } from '../utils/api';
import NotificationDropdown from '../components/NotificationDropdown';
import { Link } from 'react-router-dom';
import './FoundersDashboard.css';

const Referrals = () => {
  const { user, logout } = useAuth();
  const [referrals, setReferrals] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0 });
  const [referralLink, setReferralLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [referralCommissionMap, setReferralCommissionMap] = useState({});

  useEffect(() => {
    fetchStatsAndLink();
    fetchReferrals(1);
    fetchEarningsBreakdown();
  }, []);

  const fetchEarningsBreakdown = async () => {
    try {
      const res = await founderAPI.getEarningsBreakdown();
      if (res.success && Array.isArray(res.data.breakdown)) {
        const map = {};
        res.data.breakdown.forEach(b => {
          if (b && b.referralId) map[b.referralId] = Number(b.amount || 0);
        });
        setReferralCommissionMap(map);
      }
    } catch (err) {
      console.error('Failed to load earnings breakdown', err);
    }
  };

  const fetchStatsAndLink = async () => {
    try {
      const dashData = await founderAPI.getDashboard();
      if (dashData.success) {
        setStats({
          total: dashData.data.stats.totalReferrals || 0,
          active: dashData.data.stats.activeReferrals || 0,
          pending: dashData.data.stats.pendingReferrals || 0,
        });
        setReferralLink(dashData.data.referralLink || '');
      }
    } catch (e) { }
  };

  const fetchReferrals = async (page = 1) => {
    setLoading(true);
    try {
      const data = await founderAPI.getReferrals(page, 10);
      if (data.success) {
        setReferrals(data.data.referrals || []);
        setPagination(data.data.pagination || { currentPage: 1, totalPages: 1 });
      }
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleShare = (platform) => {
    const text = encodeURIComponent(`Join Hooraflix with my referral link!`);
    const url = encodeURIComponent(referralLink);
    let shareUrl = '';
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'x':
        shareUrl = `https://x.com/intent/tweet?url=${url}&text=${text}`;
        break;
      default:
        break;
    }
    if (shareUrl) window.open(shareUrl, '_blank');
  };

  const getInitial = (name, email) => {
    return (name || email || 'F').charAt(0).toUpperCase();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const getReferralReward = (referral) => {
    if (referral && referralCommissionMap[referral.id] != null) {
      return referralCommissionMap[referral.id];
    }
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
            <h1 className="fd-welcome-title">My Referrals</h1>
          </div>
          <div className="fd-topbar-actions">
            <span className="fd-member-pill">Pro Member</span>
            <NotificationDropdown />
            <button className="fd-icon-btn" type="button" aria-label="Support"><FiHelpCircle /></button>
          </div>
        </header>

        <section className="fd-dashboard-desktop">
          <div className="fd-content-layout">
            <div className="fd-content-left">
              <div className="fd-card fd-referrals-card">
                <div className="fd-card-header">
                  <h2>Referred Users</h2>
                </div>
                <div className="fd-table-wrapper">
                  {loading ? (
                    <div style={{ padding: 40, textAlign: 'center' }}>Loading referrals...</div>
                  ) : referrals.length > 0 ? (
                    <table className="fd-table">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Date Joined</th>
                          <th>Status</th>
                          <th>Earnings</th>
                        </tr>
                      </thead>
                      <tbody>
                        {referrals.map((r, i) => (
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
                                {r.role === 'Founder' ? 'Active' : 'INACTIVE'}
                              </span>
                            </td>
                            <td className="fd-reward-cell">+${getReferralReward(r).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ padding: 40, textAlign: 'center' }}>No referrals yet.</div>
                  )}
                </div>
                <div className="fd-pagination">
                  <button onClick={() => fetchReferrals(pagination.currentPage - 1)} disabled={pagination.currentPage <= 1}><FiChevronLeft /> Prev</button>
                  <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
                  <button onClick={() => fetchReferrals(pagination.currentPage + 1)} disabled={pagination.currentPage >= pagination.totalPages}>Next <FiChevronRight /></button>
                </div>
              </div>
            </div>

            <div className="fd-content-right">
              <div className="fd-mini-stats-row">
                <div className="fd-card fd-mini-stat">
                  <p>Total Referrals</p>
                  <strong>{stats.total}</strong>
                </div>
                <div className="fd-card fd-mini-stat">
                  <p>Active Members</p>
                  <strong>{stats.active}</strong>
                </div>
              </div>

              <div className="fd-card fd-invite-card">
                <h3>Expand Your Circle</h3>
                <p>Share your link to earn more rewards.</p>
                <div className="fd-invite-row">
                  <div className="fd-qr-box">
                    {referralLink ? <QRCode value={referralLink} bgColor="#0f1218" fgColor="#ffe8a1" level="H" size={84} /> : <div style={{ width: 84, height: 84, background: '#1a1f2b', borderRadius: 8 }}></div>}
                  </div>
                  <div className="fd-link-input">
                    <input type="text" value={referralLink} readOnly />
                    <button onClick={copyReferralLink} className={copied ? 'copied' : ''}>
                      {copied ? 'Copied' : <FiCopy />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="fd-share-wrap">
                <div className="fd-share-head">
                  <h4>Share Across Social Media</h4>
                </div>
                <p>Post your founder invite with a short pitch to reach more followers.</p>
                <div className="fd-share-grid">
                  <button type="button" className="fd-share-btn" onClick={() => handleShare('whatsapp')}><SiWhatsapp /><span>WhatsApp</span></button>
                  <button type="button" className="fd-share-btn" onClick={() => handleShare('telegram')}><SiTelegram /><span>Telegram</span></button>
                  <button type="button" className="fd-share-btn" onClick={() => handleShare('facebook')}><SiFacebook /><span>Facebook</span></button>
                  <button type="button" className="fd-share-btn" onClick={() => handleShare('x')}><SiX /><span>X</span></button>
                  <button type="button" className="fd-share-btn" onClick={() => handleShare('linkedin')}><SiLinkedin /><span>LinkedIn</span></button>
                </div>
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
          {/* 
          <div className="fd-mobile-dashboard-grid">
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
              <p><FiUsers /> Total Referrals</p>
            </div>
            <h3>{stats.total}<small> users</small></h3>
            <div className="fd-mobile-bars">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className="fd-card fd-mobile-invite-card">
            <h3>Expand Your Circle</h3>
            <p>Share your founder link and let people join directly from the QR code or referral URL.</p>

            <div className="fd-mobile-invite-preview">
              <div className="fd-mobile-qr-box">
                {referralLink ? <QRCode value={referralLink} bgColor="#0f1218" fgColor="#ffe8a1" level="H" size={112} /> : <div style={{ width: 112, height: 112, background: '#1a1f2b', borderRadius: 8 }}></div>}
              </div>

              <div className="fd-mobile-link-input">
                <span className="fd-mobile-link-label">Referral Link</span>
                <div className="fd-link-input fd-mobile-link-field">
                  <input type="text" value={referralLink} readOnly />
                  <button onClick={copyReferralLink} className={copied ? 'copied' : ''}>
                    {copied ? 'Copied' : <FiCopy />}
                  </button>
                </div>
              </div>
            </div>

            <div className="fd-mobile-share-wrap">
              <div className="fd-share-head">
                <h4>Share Invite</h4>
              </div>
              <p>Share a quick founder pitch plus your link on social apps.</p>
              <div className="fd-share-grid fd-share-grid-mobile">
                <button type="button" className="fd-share-btn" onClick={() => handleShare('whatsapp')}><SiWhatsapp /><span>WhatsApp</span></button>
                <button type="button" className="fd-share-btn" onClick={() => handleShare('telegram')}><SiTelegram /><span>Telegram</span></button>
                <button type="button" className="fd-share-btn" onClick={() => handleShare('facebook')}><SiFacebook /><span>Facebook</span></button>
                <button type="button" className="fd-share-btn" onClick={() => handleShare('x')}><SiX /><span>X</span></button>
                <button type="button" className="fd-share-btn" onClick={() => handleShare('linkedin')}><SiLinkedin /><span>LinkedIn</span></button>
              </div>
            </div>
          </div>

          <div className="fd-card fd-mobile-referrals-card">
            <div className="fd-card-header">
              <h2>Referred Users</h2>
            </div>

            <div className="fd-mobile-referrals-list">
              {loading ? (
                <div className="fd-mobile-empty-state">Loading...</div>
              ) : referrals.length > 0 ? (
                referrals.map((referral, index) => (
                  <div key={referral.id || index} className="fd-mobile-referral-item">
                    <div className="fd-member-cell">
                      <div className="fd-member-avatar">{getInitial(referral.name, referral.email)}</div>
                      <div>
                        <div className="fd-member-name">{referral.name || referral.email}</div>
                        <div className="fd-mobile-referral-date">{formatDate(referral.joinedAt)}</div>
                      </div>
                    </div>
                    <div className="fd-mobile-referral-meta">
                      {referral.role === 'Founder' ? (
                        <>
                          <span className={`fd-status-badge active`}>
                            FOUNDER
                          </span>
                          <strong>+${getReferralReward(referral).toFixed(2)}</strong>
                        </>
                      ) : (
                        <span className={`fd-status-badge pending`}>
                          INACTIVE
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="fd-mobile-empty-state">No referrals yet.</div>
              )}
            </div>
            <div className="fd-pagination" style={{ padding: '15px' }}>
              <button onClick={() => fetchReferrals(pagination.currentPage - 1)} disabled={pagination.currentPage <= 1}><FiChevronLeft /></button>
              <span>{pagination.currentPage} / {pagination.totalPages}</span>
              <button onClick={() => fetchReferrals(pagination.currentPage + 1)} disabled={pagination.currentPage >= pagination.totalPages}><FiChevronRight /></button>
            </div>
          </div>

          <nav className="fd-mobile-nav">
            <Link to="/founders-dashboard" className="fd-mobile-nav-item"><FiHome /><span>Home</span></Link>
            <Link to="/founders-dashboard/referrals" className="fd-mobile-nav-item active"><FiUsers /><span>Referrals</span></Link>
            <Link to="/founders-dashboard/earnings" className="fd-mobile-nav-item"><FiDollarSign /><span>Earnings</span></Link>
            <Link to="/founders-dashboard/settings" className="fd-mobile-nav-item"><FiShield /><span>Profile</span></Link>
            <button type="button" className="fd-mobile-nav-item fd-mobile-logout-btn" onClick={logout}>
              <FiLogOut />
              <span>Logout</span>
            </button>
          </nav>
        </section>
      </main>
    </div>
  );
};

export default Referrals;
