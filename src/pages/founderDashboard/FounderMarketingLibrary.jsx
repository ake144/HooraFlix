import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiVideo, FiDownload, FiGift, FiSettings, FiLifeBuoy, FiLogOut, FiSearch, FiFilter, FiImage, FiFileText } from 'react-icons/fi';
import { founderAPI } from '../../utils/api';
import '../FoundersDashboard.css';
import './FounderTools.css';

const marketingAssets = [
  {
    title: 'Poster Pack',
    type: 'DESIGN',
    icon: <FiImage />,
    formats: ['PSD', 'PNG'],
    description: 'Ready-to-share posters for WhatsApp, Telegram, Instagram, and Facebook.',
    file: '/landing.jpg',
    thumbnail: '/landing.jpg',
  },
  {
    title: 'Film Trailer Clips',
    type: 'VIDEO',
    icon: <FiVideo />,
    formats: ['4K', 'MP4'],
    description: 'Short teasers optimized for Reels and Shorts with pre-cut hooks.',
    file: '/hooraflix-logo.mp4',
    thumbnail: '/landing5.jpg',
  },
  {
    title: 'Course Promo Videos',
    type: 'VIDEO',
    icon: <FiVideo />,
    formats: ['HD', 'MP4'],
    description: 'Promotional cuts to announce new course availability to your audience.',
    file: '/DANASH ADVERT CINI.mp4',
    thumbnail: '/hoora1.jpg',
  },
  {
    title: 'Social Media Captions',
    type: 'COPY',
    icon: <FiFileText />,
    formats: ['DOCX', 'TXT'],
    description: 'Caption bank and CTAs crafted for referral conversion.',
    file: '/hoora1.jpg',
    thumbnail: '/landing2.jpg',
  },
];

const FounderMarketingLibrary = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [coins, setCoins] = useState(0);
  const [lastClaimDate, setLastClaimDate] = useState(null);
  const [claiming, setClaiming] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const dashData = await founderAPI.getDashboard();
        if (dashData.success) {
          setDashboardData(dashData.data);
          setCoins(dashData.data.stats?.coins || 0);
          setLastClaimDate(dashData.data.stats?.lastClaimDate);
        }
      } catch (err) {
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
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

  return (
    <div className="fd-layout">
      {/* LEFT SIDEBAR */}
      <aside className="fd-sidebar">
        <div className="fd-sidebar-top">
          <div className="fd-logo">HOORAFLIX</div>
          
          <div className="fd-user-profile">
            <div className="fd-avatar">{dashboardData ? getInitial(dashboardData.user.name, dashboardData.user.email) : 'F'}</div>
            <div className="fd-user-info">
              <div className="fd-user-status">Premium Member</div>
              <div className="fd-user-rank">{dashboardData ? dashboardData.user.rank : 'Loading'} Level</div>
            </div>
          </div>

          <nav className="fd-nav">
            <Link to="/founders-dashboard" className="fd-nav-item"><FiHome /> Dashboard</Link>
            <Link to="/founders-dashboard/training" className="fd-nav-item"><FiVideo /> Training</Link>
            <Link to="/founders-dashboard/materials" className="fd-nav-item active"><FiDownload /> Assets</Link>
            <Link to="/settings" className="fd-nav-item"><FiSettings /> Settings</Link>
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
          <button className="fd-nav-item fd-logout-btn"><FiLogOut /> Logout</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="fd-main-content founder-tool-page-content">
        <div className="founder-tool-container marketing-library-container">
          
          <div className="ml-header-section">
            <div className="ml-badge">LIVE LIBRARY</div>
            <h1 className="ml-title">Marketing Materials <span className="text-red">Library</span></h1>
            <p className="ml-subtitle">Download pre-built campaign assets, uncompressed design files, and proven copy templates to launch your promotions faster and smarter.</p>
          </div>

          <div className="ml-filter-bar">
            <div className="ml-search-input-wrapper">
              <FiSearch className="ml-search-icon" />
              <input 
                type="text" 
                placeholder="Search campaign assets, formats, or keywords..." 
                className="ml-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="ml-dropdowns">
              <select className="ml-select">
                <option>All Categories</option>
                <option>Video</option>
                <option>Design</option>
                <option>Copy</option>
              </select>
              <select className="ml-select">
                <option>Recent</option>
                <option>Most Downloaded</option>
                <option>Highest Converting</option>
              </select>
              <button className="ml-filter-btn">
                <FiFilter /> Filter
              </button>
            </div>
          </div>

          <div className="ml-asset-grid">
            {marketingAssets.map((asset, index) => (
              <div key={index} className="ml-asset-card">
                <div className="ml-asset-img-container">
                  <span className={`ml-type-badge ml-type-${asset.type.toLowerCase()}`}>{asset.type}</span>
                  <img src={asset.thumbnail} alt={asset.title} className="ml-asset-img" />
                </div>
                <div className="ml-asset-content">
                  <h3 className="ml-asset-title">{asset.title}</h3>
                  <div className="ml-asset-formats">
                    {asset.formats.map((fmt, i) => (
                      <span key={i} className="ml-format-tag">{fmt}</span>
                    ))}
                  </div>
                  <a className="ml-download-btn" href={asset.file} download>
                    <FiDownload className="ml-btn-icon"/> Download Asset
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="ml-premium-bundle">
            <div className="ml-bundle-content">
              <div className="ml-bundle-kicker">QUARTERLY LAUNCH KIT</div>
              <h2 className="ml-bundle-title">The "Obsidian Stage" Campaign Collection</h2>
              <p className="ml-bundle-desc">Get the complete set of ultra-high-resolution billboards, 8K video trailers, and deep-dive marketing strategies used by Top-Tier Founders for Q4 promotions.</p>
              
              <div className="ml-bundle-tags">
                <span className="ml-bundle-tag">✓ Video Assets</span>
                <span className="ml-bundle-tag">✓ Design Files</span>
                <span className="ml-bundle-tag">✓ Copy Guides</span>
              </div>
              
              <button className="ml-bundle-btn">
                UNLOCK FULL BUNDLE (4.2 GB)
              </button>
            </div>
            <div className="ml-bundle-image">
              {/* Optional: Add related image class or actual img tag */}
              <div className="ml-bundle-abstract"></div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default FounderMarketingLibrary;
