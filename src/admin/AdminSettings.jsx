import React, { useState } from 'react';
import { FiEye, FiEyeOff, FiCheck, FiX } from 'react-icons/fi';
import { adminAPI } from '../utils/api';
import './AdminSettings.css';
import AdminLayout from './AdminLayout';

const AdminSettings = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validatePasswords = () => {
    if (passwords.currentPassword.length < 1) {
      setMessage({ type: 'error', text: 'Current password is required' });
      return false;
    }
    if (passwords.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'New password must be at least 8 characters' });
      return false;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return false;
    }
    if (passwords.currentPassword === passwords.newPassword) {
      setMessage({ type: 'error', text: 'New password must be different from current password' });
      return false;
    }
    return true;
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!validatePasswords()) return;

    setLoading(true);
    try {
      const res = await adminAPI.updatePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });

      if (res.success) {
        setMessage({ type: 'success', text: 'Password updated successfully!' });
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  return (
 <AdminLayout>
    <div className="admin-settings-shell">
      <div className="admin-settings-container">
        <div className="admin-settings-card">
          <div className="admin-settings-header">
            <h2>Account Settings</h2>
            <p>Manage your admin account security and preferences</p>
          </div>

          <form className="admin-settings-form" onSubmit={handleUpdatePassword}>
            <fieldset>
              <legend>Change Password</legend>

              {/* Current Password */}
              <div className="admin-form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <div className="admin-password-input-wrapper">
                  <input
                    id="currentPassword"
                    type={showPasswords.current ? 'text' : 'password'}
                    name="currentPassword"
                    value={passwords.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter your current password"
                    required
                  />
                  <button
                    type="button"
                    className="admin-password-toggle"
                    onClick={() => togglePasswordVisibility('current')}
                    aria-label="Toggle password visibility"
                  >
                    {showPasswords.current ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="admin-form-group">
                <label htmlFor="newPassword">New Password</label>
                <div className="admin-password-input-wrapper">
                  <input
                    id="newPassword"
                    type={showPasswords.new ? 'text' : 'password'}
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter a new password (min. 8 characters)"
                    required
                  />
                  <button
                    type="button"
                    className="admin-password-toggle"
                    onClick={() => togglePasswordVisibility('new')}
                    aria-label="Toggle password visibility"
                  >
                    {showPasswords.new ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                <small className="admin-form-hint">
                  Password must be at least 8 characters long
                </small>
              </div>

              {/* Confirm Password */}
              <div className="admin-form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <div className="admin-password-input-wrapper">
                  <input
                    id="confirmPassword"
                    type={showPasswords.confirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm your new password"
                    required
                  />
                  <button
                    type="button"
                    className="admin-password-toggle"
                    onClick={() => togglePasswordVisibility('confirm')}
                    aria-label="Toggle password visibility"
                  >
                    {showPasswords.confirm ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              {/* Message */}
              {message.text && (
                <div className={`admin-alert admin-alert-${message.type}`}>
                  {message.type === 'success' ? <FiCheck /> : <FiX />}
                  {message.text}
                </div>
              )}

              {/* Actions */}
              <div className="admin-form-actions">
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </fieldset>
          </form>
        </div>

        {/* Security Info Card */}
        <div className="admin-settings-card admin-security-info">
          <h3>Security Tips</h3>
          <ul>
            <li>Use a strong, unique password</li>
            <li>Never share your admin credentials</li>
            <li>Change your password regularly</li>
            <li>Enable two-factor authentication when available</li>
          </ul>
        </div>
      </div>
    </div>
</AdminLayout>
  );
};

export default AdminSettings;
