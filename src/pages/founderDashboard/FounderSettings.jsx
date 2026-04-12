import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiVideo, FiDownload, FiGift, FiSettings, FiLifeBuoy, FiLogOut, FiArrowLeft, FiSave } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { founderAPI } from '../../utils/api';
import '../FoundersDashboard.css';
import './FounderTools.css';

const FounderSettings = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const [dashboardData, setDashboardData] = useState(null);
  const [claiming, setClaiming] = useState(false);
  const [coins, setCoins] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastClaimDate, setLastClaimDate] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: ''
  });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const dashData = await founderAPI.getDashboard();
        if (dashData.success) {
          setDashboardData(dashData.data);
          setCoins(dashData.data.stats.coins || 0);
          setStreak(dashData.data.stats.claimStreak || 0);
          setLastClaimDate(dashData.data.stats.lastClaimDate);
          
          // Pre-fill form
          setFormData({
            fullName: dashData.data.user.name || '',
            email: dashData.data.user.email || '',
            phoneNumber: dashData.data.user.phoneNumber || ''
          });
        }
      } catch (err) {
        console.error('Dashboard error:', err);
      }
    };
    fetchDashboardData();
  }, []);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    
    // Simulate API call for saving profile
    setTimeout(() => {
      setSaving(false);
      setSuccessMsg('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMsg(''), 3000);
    }, 1000);
  };

  const getInitial = (name, email) => {
    return (name || email || 'F').charAt(0).toUpperCase();
  };

  const user = dashboardData?.user || { name: 'Founder', email: 'founder@hooraflix.com', rank: 'Starter' };

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
            <Link to="/founders-dashboard" className="fd-nav-item"><FiHome /> Dashboard</Link>
            <Link to="/founders-dashboard/training" className="fd-nav-item"><FiVideo /> Training</Link>
            <Link to="/founders-dashboard/materials" className="fd-nav-item"><FiDownload /> Assets</Link>
            <Link to="/settings" className="fd-nav-item active"><FiSettings /> Settings</Link>
          </nav>

          <button 
            className="fd-claim-sidebar-btn" 
            onClick={handleClaimCoin} 
            disabled={claiming || isClaimedToday()}
          >
            {claiming ? '...' : isClaimedToday() ? 'Claimed ✅' : 'Claim Daily Coins'}
          </button>
        </div>

        <div className="fd-sidebar-bottom">
          <Link to="/support" className="fd-nav-item"><FiLifeBuoy /> Support</Link>
          <button className="fd-nav-item fd-logout-btn" onClick={() => { logout(); navigate('/login'); }}><FiLogOut /> Logout</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="fd-main-content founder-tool-page-content">
        <div className="founder-tool-container">
          <div className="tool-page-topbar">
            <Link to="/founders-dashboard" className="tool-back-link">
              <FiArrowLeft /> Back to Dashboard
            </Link>
          </div>

          <section className="tool-hero">
            <div className="tool-hero-content" style={{ maxWidth: '800px' }}>
              <p className="tool-kicker">PERSONALIZATION</p>
              <h1>Account Settings</h1>
              <p>Manage your profile, preferences, and account security.</p>
            </div>
          </section>

          <section className="settings-section" style={{ marginTop: '2rem' }}>
            <div className="tool-card" style={{ maxWidth: '600px', cursor: 'default' }}>
              <div className="tool-card-content" style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>Profile Information</h3>
                
                {successMsg && (
                  <div style={{ padding: '10px', backgroundColor: 'rgba(46, 213, 115, 0.1)', color: '#2ed573', borderRadius: '8px', marginBottom: '1rem', border: '1px solid rgba(46, 213, 115, 0.2)' }}>
                    {successMsg}
                  </div>
                )}
                
                <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label htmlFor="fullName" style={{ fontSize: '0.9rem', color: '#aaa' }}>Full Name</label>
                    <input 
                      type="text" 
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      style={{ padding: '0.8rem', borderRadius: '8px', backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#fff', fontSize: '1rem' }}
                      required
                    />
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label htmlFor="email" style={{ fontSize: '0.9rem', color: '#aaa' }}>Email Address <span style={{fontSize: '0.8rem', color: '#666'}}>(Cannot be changed)</span></label>
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      value={formData.email}
                      disabled
                      style={{ padding: '0.8rem', borderRadius: '8px', backgroundColor: '#0a0a0a', border: '1px solid #222', color: '#666', fontSize: '1rem', cursor: 'not-allowed' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label htmlFor="phoneNumber" style={{ fontSize: '0.9rem', color: '#aaa' }}>Phone Number</label>
                    <input 
                      type="tel" 
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      style={{ padding: '0.8rem', borderRadius: '8px', backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#fff', fontSize: '1rem' }}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn-primary" 
                    style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '1rem' }}
                    disabled={saving}
                  >
                    <FiSave /> {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default FounderSettings;
