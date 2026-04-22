import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiVideo, FiDownload, FiSettings, FiLifeBuoy, FiLogOut, FiArrowLeft, FiMapPin, FiPhone, FiMail, FiMessageSquare, FiSearch, FiBell, FiShield } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { founderAPI } from '../../utils/api';
import '../FoundersDashboard.css';
import './FounderTools.css';
import './FounderSupport.css';
import toast from 'react-hot-toast';

const FounderSupport = () => {
  const { logout } = useAuth();
  
  const [dashboardData, setDashboardData] = useState(null);
  const [claiming, setClaiming] = useState(false);
  const [coins, setCoins] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastClaimDate, setLastClaimDate] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });
  const [sending, setSending] = useState(false);
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
        toast(res.message);
      }
    } catch (err) {
      console.error(err);
      toast(err.message || 'Failed to claim reward');
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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setSending(true);
    setSuccessMsg('');
    
    // Simulate API call for sending message
    setTimeout(() => {
      setSending(false);
      setSuccessMsg('Your message has been sent successfully! Our support team will get back to you soon.');
      setFormData({ subject: '', message: '' });
      setTimeout(() => setSuccessMsg(''), 5000);
    }, 1500);
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
          <Link to="/founders-dashboard">
            <div className="fd-logo">Hooraflix</div>
            <p className="fd-logo-sub">Admin Console</p>
          </Link>

          <nav className="fd-nav">
            <Link to="/founders-dashboard" className="fd-nav-item"><FiHome /> Dashboard</Link>
            <Link to="/founders-dashboard/training" className="fd-nav-item"><FiVideo /> Training</Link>
            <Link to="/founders-dashboard/materials" className="fd-nav-item"><FiDownload /> Assets</Link>
            <Link to="/founders-dashboard/settings" className="fd-nav-item"><FiSettings /> Settings</Link>
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
              <Link to="/founders-dashboard/support" className="fd-nav-item"><FiLifeBuoy /> Support</Link>
              <button className="fd-nav-item " onClick={logout}><FiLogOut /> Logout</button>
            </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="fd-main-content founder-tool-page-content">
        <section className="founder-mobile-page-head">
          <div className="fd-mobile-head">
            <div className="fd-mobile-avatar">{getInitial(user.name, user.email)}</div>
            <div className="fd-mobile-search">
              <FiSearch />
              <input type="text" value="Search support topics..." readOnly />
            </div>
            <button className="fd-mobile-bell" type="button" aria-label="Notifications"><FiBell /></button>
          </div>
        </section>

        <div className="founder-tool-container">
          <div className="tool-page-topbar">
            <Link to="/founders-dashboard" className="tool-back-link">
              <FiArrowLeft /> Back to Dashboard
            </Link>

             <button className="fd-nav-item" onClick={logout}><FiLogOut /> 
                  Logout
              </button>
          </div>

          <section className="tool-hero support-hero">
            <div className="tool-hero-content" style={{ maxWidth: '800px' }}>
              <p className="tool-kicker">WE'RE HERE TO HELP</p>
              <h1>Founder Support</h1>
              <p>Have questions or need assistance? Reach out to our dedicated support team directly.</p>
            </div>
          </section>

          <div className="support-content-grid">
            {/* Contact Info Cards */}
            <div className="support-info-cards">
              <div className="support-card info">
                <div className="support-icon-wrapper location">
                  <FiMapPin />
                </div>
                <h3>Headquarters</h3>
                <p>Addis Ababa, Ethiopia</p>
              </div>

              <div className="support-card info">
                <div className="support-icon-wrapper phone">
                  <FiPhone />
                </div>
                <h3>Call Us</h3>
                <p><a href="tel:+251902357777">+251 902 357 777</a></p>
              </div>

              <div className="support-card info">
                <div className="support-icon-wrapper email">
                  <FiMail />
                </div>
                <h3>Email Us</h3>
                <p><a href="mailto:contact@hoorafilx.com">contact@hoorafilx.com</a></p>
                <p><a href="mailto:info@hoorafilx.com">info@hoorafilx.com</a></p>
              </div>
            </div>

            {/* Direct Message Form */}
            <div className="support-card form-card">
              <div className="support-card-header">
                <h3><FiMessageSquare style={{marginRight: '10px'}}/> Send a Direct Message</h3>
                <p>Describe your issue or inquiry below and our team will respond shortly.</p>
              </div>

              {successMsg && (
                <div className="support-success-msg">
                  {successMsg}
                </div>
              )}

              <form onSubmit={handleSendMessage} className="support-form">
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input 
                    type="text" 
                    id="subject"
                    name="subject"
                    placeholder="E.g., Payment issue, General question"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea 
                    id="message"
                    name="message"
                    rows="6"
                    placeholder="How can we help you today?"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="support-submit-btn" disabled={sending}>
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <nav className="fd-mobile-nav founder-mobile-nav-only">
          <Link to="/founders-dashboard" className="fd-mobile-nav-item"><FiHome /><span>Home</span></Link>
          <Link to="/founders-dashboard/training" className="fd-mobile-nav-item"><FiVideo /><span>Training</span></Link>
          <Link to="/founders-dashboard/materials" className="fd-mobile-nav-item"><FiDownload /><span>Assets</span></Link>
          <Link to="/founders-dashboard/settings" className="fd-mobile-nav-item"><FiShield /><span>Profile</span></Link>
          <button type="button" className="fd-mobile-nav-item fd-mobile-logout-btn" onClick={logout}>
            <FiLogOut />
            <span>Logout</span>
          </button>
        </nav>
      </main>
    </div>
  );
};

export default FounderSupport;