import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiVideo, FiDownload, FiSettings, FiLifeBuoy, FiLogOut, FiSave, FiShield, FiBell, FiSearch, FiUsers, FiDollarSign, FiGrid, FiLock, FiUser, FiMail } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { founderAPI } from '../../utils/api';
import NotificationDropdown from '../../components/NotificationDropdown';
import '../FoundersDashboard.css';
import toast from 'react-hot-toast';

const FounderSettings = () => {
  const { logout } = useAuth();

  const [dashboardData, setDashboardData] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    companyName: '',
    website: '',
    twitter: '',
    bio: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    marketing: true
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const dashData = await founderAPI.getDashboard();
        if (dashData.success) {
          setDashboardData(dashData.data);

          // Pre-fill form
          setFormData({
            fullName: dashData.data.user.name || '',
            email: dashData.data.user.email || '',
            phoneNumber: dashData.data.user.phoneNumber || '',
            companyName: dashData.data.user.companyName || '',
            website: dashData.data.user.website || '',
            twitter: dashData.data.user.twitter || '',
            bio: dashData.data.user.bio || ''
          });
        }
      } catch (err) {
        console.error('Dashboard error:', err);
      }
    };
    fetchDashboardData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);

    // Simulate API call for saving profile
    setTimeout(() => {
      setSavingProfile(false);
      toast.success('Profile updated successfully!');
    }, 1000);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }
    setSavingPassword(true);

    // Simulate API call for saving password
    setTimeout(() => {
      setSavingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password updated successfully!');
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
          <Link to="/founders-dashboard">
            <div className="fd-logo">Hooraflix</div>
            <p className="fd-logo-sub">Admin Console</p>
          </Link>

          <nav className="fd-nav">
            <Link to="/founders-dashboard" className="fd-nav-item"><FiGrid /> Dashboard</Link>
            <Link to="/founders-dashboard/training" className="fd-nav-item"><FiVideo /> Training</Link>
            <Link to="/founders-dashboard/materials" className="fd-nav-item"><FiDownload /> Assets</Link>
            <Link to="/founders-dashboard/settings" className="fd-nav-item active"><FiSettings /> Settings</Link>
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

      {/* MAIN CONTENT */}
      <main className="fd-main-content">
        <header className="fd-desktop-topbar">
          <div>
            <h1 className="fd-welcome-title">Account Settings</h1>
          </div>
          <div className="fd-topbar-actions">
            <span className="fd-member-pill">Pro Member</span>
            <NotificationDropdown />
          </div>
        </header>

        <section className="fd-dashboard-desktop">
          <div className="fd-content-layout">
            <div className="fd-content-left">
              <div className="fd-card">
                <div className="fd-card-header">
                  <h2><FiUser style={{ marginRight: '10px', color: '#f1c339' }} /> Profile Information</h2>
                </div>
                <form onSubmit={handleSaveProfile} className="fd-settings-form">
                  <div className="fd-form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="fd-form-group">
                    <label htmlFor="email">Email Address <span className="fd-muted-text">(Cannot be changed)</span></label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="fd-input-disabled"
                    />
                  </div>

                  <div className="fd-form-group">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div className="fd-form-group">
                    <label htmlFor="companyName">Company / Organization Name</label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="Your Company LLC"
                    />
                  </div>

                  <div className="fd-form-group">
                    <label htmlFor="website">Website URL</label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  <div className="fd-form-group">
                    <label htmlFor="twitter">X (Twitter) Handle</label>
                    <input
                      type="text"
                      id="twitter"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleInputChange}
                      placeholder="@yourhandle"
                    />
                  </div>

                  <div className="fd-form-group">
                    <label htmlFor="bio">Bio / Description</label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us a little about yourself..."
                      rows="4"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="fd-btn-primary"
                    disabled={savingProfile}
                  >
                    <FiSave /> {savingProfile ? 'Saving...' : 'Save Profile'}
                  </button>
                </form>
              </div>

              <div className="fd-card">
                <div className="fd-card-header">
                  <h2><FiLock style={{ marginRight: '10px', color: '#f1c339' }} /> Security & Password</h2>
                </div>
                <form onSubmit={handleUpdatePassword} className="fd-settings-form">
                  <div className="fd-form-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                      required
                    />
                  </div>

                  <div className="fd-form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                      required
                    />
                  </div>

                  <div className="fd-form-group">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="fd-btn-primary"
                    disabled={savingPassword}
                  >
                    <FiShield /> {savingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </form>

                <div className="fd-settings-toggles" style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #1b222e' }}>
                  <div className="fd-toggle-row">
                    <div>
                      <h4>Two-Factor Authentication (2FA)</h4>
                      <p>Add an extra layer of security to your account.</p>
                    </div>
                    <label className="fd-switch">
                      <input type="checkbox" name="twoFactor" />
                      <span className="fd-slider round"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="fd-content-right">
              <div className="fd-card">
                <div className="fd-card-header">
                  <h2><FiBell style={{ marginRight: '10px', color: '#f1c339' }} /> Notifications</h2>
                </div>
                <div className="fd-settings-toggles">
                  <div className="fd-toggle-row">
                    <div>
                      <h4>Email Alerts</h4>
                      <p>Receive updates about your referrals and earnings.</p>
                    </div>
                    <label className="fd-switch">
                      <input type="checkbox" name="emailAlerts" checked={notifications.emailAlerts} onChange={handleNotificationChange} />
                      <span className="fd-slider round"></span>
                    </label>
                  </div>
                  <div className="fd-toggle-row">
                    <div>
                      <h4>SMS Alerts</h4>
                      <p>Get text messages for important account security events.</p>
                    </div>
                    <label className="fd-switch">
                      <input type="checkbox" name="smsAlerts" checked={notifications.smsAlerts} onChange={handleNotificationChange} />
                      <span className="fd-slider round"></span>
                    </label>
                  </div>
                  <div className="fd-toggle-row">
                    <div>
                      <h4>Marketing Emails</h4>
                      <p>Receive news, promotions, and platform updates.</p>
                    </div>
                    <label className="fd-switch">
                      <input type="checkbox" name="marketing" checked={notifications.marketing} onChange={handleNotificationChange} />
                      <span className="fd-slider round"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="fd-card fd-danger-zone">
                <div className="fd-card-header">
                  <h2 style={{ color: '#ff4d4d' }}>Danger Zone</h2>
                </div>
                <p style={{ color: '#a0aec0', marginBottom: '15px', fontSize: '0.9rem' }}>
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button className="fd-btn-danger">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="fd-dashboard-mobile">
          <header className="fd-mobile-head">
            <div className="fd-mobile-avatar">{getInitial(user?.name, user?.email)}</div>
            <div className="fd-mobile-search">
              <FiSearch />
              <input type="text" value="Search settings..." readOnly />
            </div>
            <NotificationDropdown />
          </header>

          <div className="fd-mobile-welcome-section">
            <h2>Settings</h2>
            <p>Manage your account preferences.</p>
          </div>

          <div className="fd-card">
            <div className="fd-card-header">
              <h2><FiUser style={{ marginRight: '10px', color: '#f1c339' }} /> Profile</h2>
            </div>
            <form onSubmit={handleSaveProfile} className="fd-settings-form">
              <div className="fd-form-group">
                <label htmlFor="mobileFullName">Full Name</label>
                <input
                  type="text"
                  id="mobileFullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="fd-form-group">
                <label htmlFor="mobileEmail">Email</label>
                <input
                  type="email"
                  id="mobileEmail"
                  name="email"
                  value={formData.email}
                  disabled
                  className="fd-input-disabled"
                />
              </div>
              <div className="fd-form-group">
                <label htmlFor="mobileCompanyName">Company Name</label>
                <input
                  type="text"
                  id="mobileCompanyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Your Company LLC"
                />
              </div>
              <div className="fd-form-group">
                <label htmlFor="mobileBio">Bio</label>
                <textarea
                  id="mobileBio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself..."
                  rows="3"
                ></textarea>
              </div>
              <button type="submit" className="fd-btn-primary" disabled={savingProfile}>
                <FiSave /> {savingProfile ? 'Saving...' : 'Save Profile'}
              </button>
            </form>
          </div>

          <div className="fd-card">
            <div className="fd-card-header">
              <h2><FiLock style={{ marginRight: '10px', color: '#f1c339' }} /> Password</h2>
            </div>
            <form onSubmit={handleUpdatePassword} className="fd-settings-form">
              <div className="fd-form-group">
                <label htmlFor="mobileCurrentPassword">Current Password</label>
                <input
                  type="password"
                  id="mobileCurrentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="fd-form-group">
                <label htmlFor="mobileNewPassword">New Password</label>
                <input
                  type="password"
                  id="mobileNewPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <button type="submit" className="fd-btn-primary" disabled={savingPassword}>
                <FiShield /> {savingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </form>

            <div className="fd-settings-toggles" style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #1b222e' }}>
              <div className="fd-toggle-row">
                <div>
                  <h4>Two-Factor Auth (2FA)</h4>
                  <p>Extra security for your account.</p>
                </div>
                <label className="fd-switch">
                  <input type="checkbox" name="mobileTwoFactor" />
                  <span className="fd-slider round"></span>
                </label>
              </div>
            </div>
          </div>

          <nav className="fd-mobile-nav">
            <Link to="/founders-dashboard" className="fd-mobile-nav-item"><FiHome /><span>Home</span></Link>
            <Link to="/founders-dashboard/referrals" className="fd-mobile-nav-item"><FiUsers /><span>Referrals</span></Link>
            <Link to="/founders-dashboard/earnings" className="fd-mobile-nav-item"><FiDollarSign /><span>Earnings</span></Link>
            <Link to="/founders-dashboard/settings" className="fd-mobile-nav-item active"><FiShield /><span>Profile</span></Link>
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

export default FounderSettings;
