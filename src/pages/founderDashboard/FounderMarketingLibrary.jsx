import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiUsers, FiDollarSign, FiVideo, FiDownload, FiSettings, FiLifeBuoy, FiLogOut, FiSearch, FiFilter, FiImage, FiFileText, FiBell, FiHelpCircle, FiGrid, FiShield } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { founderAPI } from '../../utils/api';
import '../FoundersDashboard.css';
import './FounderTools.css';


const FounderMarketingLibrary = () => {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [coins, setCoins] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [marketingAssets, setMarketingAssets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashData, assetsData] = await Promise.all([
          founderAPI.getDashboard(),
          founderAPI.getMarketingAssets()
        ]);

        if (dashData.success) {
          setDashboardData(dashData.data);
          setCoins(dashData.data.stats?.coins || 0);
        }

        if (assetsData.success) {
          setMarketingAssets(assetsData.data);
        }
      } catch (err) {
        console.error('Data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getInitial = (name, email) => {
    return (name || email || 'F').charAt(0).toUpperCase();
  };

  const user = dashboardData?.user || { name: 'Founder', email: 'founder@hooraflix.com', rank: 'Starter' };

  const filteredAssets = marketingAssets.filter((asset) => {
    if (!searchQuery.trim()) return true;
    const haystack = `${asset.title} ${asset.type} ${asset.description} ${asset.formats?.join(' ')}`.toLowerCase();
    return haystack.includes(searchQuery.toLowerCase());
  });

  const featuredAssets = marketingAssets.filter(a => a.type === 'DESIGN' || a.type === 'POSTER').slice(0, 3);
  const regularAssets = marketingAssets.filter(a => !featuredAssets.find(f => f.id === a.id));

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
            <Link to="/founders-dashboard/materials" className="fd-nav-item active"><FiDownload /> Assets</Link>
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
          <button className="fd-nav-item" onClick={logout}><FiLogOut /> Logout</button>
        </div>
      </aside>

      <main className="fd-main-content founder-tool-page-content">
        <header className="fd-desktop-topbar">
          <div>
            <h1 className="fd-welcome-title">Marketing Library</h1>
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
              <input type="text" value="Search marketing assets..." readOnly />
            </div>
            <button className="fd-mobile-bell" type="button" aria-label="Notifications"><FiBell /></button>
          </div>
        </section>

        <div className="founder-tool-container marketing-library-container">
          {loading && <p className="tool-inline-status">Loading library...</p>}

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
                <option>Poster</option>
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

          <section className="ml-featured-section">
            <div className="ml-featured-head">
              <h2>Featured Campaign Posters</h2>
              <span>Promotion-ready key art for active campaigns</span>
            </div>

            <div className="ml-asset-grid ml-featured-grid">
              {featuredAssets.map((asset, index) => (
                <div key={asset.id || `featured-${index}`} className="ml-asset-card">
                  <div className="ml-asset-img-container">
                    <span className="ml-type-badge ml-type-poster">{asset.type}</span>
                    <img src={asset.thumbnailUrl || asset.fileUrl} alt={asset.title} className="ml-asset-img" />
                  </div>
                  <div className="ml-asset-content">
                    <h3 className="ml-asset-title">{asset.title}</h3>
                    <p className="ml-asset-desc">{asset.description}</p>
                    <div className="ml-asset-formats">
                      {asset.formats?.map((fmt, i) => (
                        <span key={i} className="ml-format-tag">{fmt}</span>
                      ))}
                    </div>
                    <a className="ml-download-btn" href={asset.fileUrl} download target="_blank" rel="noreferrer">
                      <FiDownload className="ml-btn-icon" /> Download Poster
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="ml-asset-grid">
            {filteredAssets.map((asset, index) => (
              <div key={asset.id || index} className="ml-asset-card">
                <div className="ml-asset-img-container">
                  <span className={`ml-type-badge ml-type-${asset.type.toLowerCase()}`}>{asset.type}</span>
                  <img src={asset.thumbnailUrl || asset.fileUrl} alt={asset.title} className="ml-asset-img" />
                </div>
                <div className="ml-asset-content">
                  <h3 className="ml-asset-title">{asset.title}</h3>
                  <div className="ml-asset-formats">
                    {asset.formats?.map((fmt, i) => (
                      <span key={i} className="ml-format-tag">{fmt}</span>
                    ))}
                  </div>
                  <a className="ml-download-btn" href={asset.fileUrl} download target="_blank" rel="noreferrer">
                    <FiDownload className="ml-btn-icon" /> Download Asset
                  </a>
                </div>
              </div>
            ))}
            {filteredAssets.length === 0 && !loading && (
              <div className="ml-empty-state">No assets match your search.</div>
            )}
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

        <nav className="fd-mobile-nav founder-mobile-nav-only">
          <Link to="/founders-dashboard" className="fd-mobile-nav-item"><FiHome /><span>Home</span></Link>
          <Link to="/founders-dashboard/training" className="fd-mobile-nav-item"><FiUsers /><span>Referrals</span></Link>
          <Link to="/founders-dashboard/materials" className="fd-mobile-nav-item active"><FiDollarSign /><span>Earnings</span></Link>
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

export default FounderMarketingLibrary;
