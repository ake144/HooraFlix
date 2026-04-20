import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlayCircle, FiClock, FiTrendingUp, FiArrowLeft, FiHome, FiVideo, FiDownload, FiSettings, FiLifeBuoy, FiLogOut, FiPlay, FiBell, FiHelpCircle, FiGrid, FiSearch, FiShield } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { founderAPI } from '../../utils/api';
import '../FoundersDashboard.css';
import './FounderTools.css';

const trainingCourses = [
  {
    title: 'How to Promote Films',
    duration: '45 mins',
    level: 'Beginner',
    description: 'Learn campaign setup, targeting, and launch timing for independent films.',
    focus: 'Conversion',
    thumbnail: 'https://images.unsplash.com/photo-1682130301125-5b63bbf93241?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    title: 'TikTok Promotion Strategy',
    duration: '35 mins',
    level: 'Intermediate',
    description: 'Build short-form hooks and posting systems that drive real referral growth.',
    focus: 'Viral',
    thumbnail: 'https://images.unsplash.com/photo-1660136007317-b0d7dd3cee08?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',

  },
  {
    title: 'Social Media Marketing',
    duration: '60 mins',
    level: 'Beginner',
    description: 'Design a weekly content calendar across Instagram, TikTok, and YouTube Shorts.',
    focus: 'ROI',
    thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    title: 'Personal Branding for Founders',
    duration: '50 mins',
    level: 'Advanced',
    description: 'Position your identity, story, and voice to increase trust and conversions.',
    focus: 'Trust',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
];

const FounderTrainingCenter = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [claiming, setClaiming] = useState(false);
  const [coins, setCoins] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastClaimDate, setLastClaimDate] = useState(null);

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

  const getInitial = (name, email) => {
    return (name || email || 'F').charAt(0).toUpperCase();
  };

  const user = dashboardData?.user || { name: 'Founder', email: 'founder@hooraflix.com', rank: 'Starter' };

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
            <Link to="/founders-dashboard/training" className="fd-nav-item active"><FiVideo /> Training</Link>
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
          <button className="fd-nav-item fd-logout-btn" onClick={() => { logout(); navigate('/login'); }}><FiLogOut /> Logout</button>
        </div>
      </aside>

      <main className="fd-main-content founder-tool-page-content">
        <header className="fd-desktop-topbar">
          <div>
            <h1 className="fd-welcome-title">Training Center</h1>
          </div>
          <div className="fd-topbar-actions">
            <span className="fd-member-pill">{coins} Coins</span>
            <button className="fd-icon-btn" type="button" aria-label="Notifications"><FiBell /></button>
            <button className="fd-icon-btn" type="button" aria-label="Support"><FiHelpCircle /></button>
          </div>
        </header>

        <section className="founder-mobile-page-head">
          <div className="fd-mobile-head">
            <div className="fd-mobile-avatar">{getInitial(user.name, user.email)}</div>
            <div className="fd-mobile-search">
              <FiSearch />
              <input type="text" value="Search training lessons..." readOnly />
            </div>
            <button className="fd-mobile-bell" type="button" aria-label="Notifications"><FiBell /></button>
          </div>
        </section>

        <div className="founder-tool-container">
          <div className="tool-page-topbar">
            <Link to="/founders-dashboard" className="tool-back-link">
              <FiArrowLeft /> Back to Dashboard
            </Link>
            <button
              className="tool-claim-btn"
              onClick={handleClaimCoin}
              disabled={claiming || isClaimedToday()}
            >
              {claiming ? '...' : isClaimedToday() ? 'Claimed Today' : `Claim ${Math.max(5, streak || 5)} Coins`}
            </button>
          </div>

          <section className="tool-hero training-hero">
            <div className="tool-hero-content">
              <p className="tool-kicker">OFFICIAL CERTIFICATION</p>
              <h1>Affiliate Training Center</h1>
              <p>Master promotion and sales skills with Hollywood-grade techniques. Turn your audience into loyal subscribers with our proven partner blueprint.</p>
              <div className="tool-hero-buttons">
                <button className="btn-primary">Start Learning Now</button>
                <button className="btn-secondary">View Curriculum</button>
              </div>
            </div>
            <div className="tool-hero-image-wrapper">
              <img src="/newCourse.jpg" alt="Training center" className="tool-hero-img" />
              <div className="play-button-overlay">
                <FiPlay />
              </div>
            </div>
          </section>

          {/* New Courses Banners */}
          {/* <div className="training-banners" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '2rem 0', padding: '1rem', background: '#0a0a0a', borderRadius: '16px', border: '1px solid #1a1a1a' }}>
            <img src="/new-course.jpg" alt="New courses" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} onError={(e) => { e.target.src = 'https://via.placeholder.com/800x400/101010/ff4500?text=NEW+COURSES+COMING+SOON'; }} />
            <img src="/newCourse.jpg" alt="Founder courses" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} onError={(e) => { e.target.src = 'https://via.placeholder.com/800x400/101010/ffd700?text=DIFFERENT+COURSES+FOR+FOUNDERS'; }} />
          </div> */}

          <h2 className="section-title">Masterclass Series</h2>

          <section className="tool-grid">
            {trainingCourses.map((course) => (
              <article key={course.title} className="tool-card">
                {/* <div className="tool-card-image">
                  <div className="tool-card-badge">{course.level}</div>
                  <img src={course.thumbnail} alt={course.title} className="tool-card-img" />
                </div> */}
                <div className="ml-asset-img-container">
                  <span className={`ml-type-badge ml-type-${course.level.toLowerCase()}`}>{course.level}</span>
                  <img src={course.thumbnail} alt={course.title} className="ml-asset-img" />
                </div>

                <div className="tool-card-content">
                  <div className="tool-card-head">
                    <h3>{course.title}</h3>
                  </div>
                  <div className="tool-meta">
                    <span><FiClock /> {course.duration}</span>
                    <span className="focus-tag"><FiTrendingUp /> {course.focus} focused</span>
                  </div>
                  <p>{course.description}</p>
                  <button className="tool-cta-btn">
                    <FiPlayCircle /> Start Lesson
                  </button>
                </div>
              </article>
            ))}
          </section>

          <section className="bottom-banner">
            <div className="bottom-banner-content">
              <h2>Ready to go live?</h2>
              <p>Your dashboard is waiting with your fresh affiliate links.</p>
            </div>
            <button className="btn-yellow" onClick={() => navigate('/founders-dashboard')}>Go to Dashboard</button>
          </section>
        </div>

        <nav className="fd-mobile-nav founder-mobile-nav-only">
          <Link to="/founders-dashboard" className="fd-mobile-nav-item"><FiHome /><span>Home</span></Link>
          <Link to="/founders-dashboard/training" className="fd-mobile-nav-item active"><FiVideo /><span>Training</span></Link>
          <Link to="/founders-dashboard/materials" className="fd-mobile-nav-item"><FiDownload /><span>Assets</span></Link>
          <Link to="/settings" className="fd-mobile-nav-item"><FiShield /><span>Profile</span></Link>
        </nav>
      </main>
    </div>
  );
};

export default FounderTrainingCenter;
