import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    avatarUrl: '',
    refId: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get('refId');
    if (ref) {
      setFormData(prev => ({ ...prev, refId: ref }));
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'password') {
      if (value.length < 8) {
        setPasswordError('Password must be at least 8 characters long.');
      } else {
        setPasswordError('');
      }
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await register(formData.name, formData.email, formData.phone, formData.password, formData.refId);

      if (result.success) {

        navigate('/founders');
      } else {
        throw new Error(result.error || 'Registration failed');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate("/")}>
          &larr; 
        </button>
      </div>

      <div className="auth-content-wrapper">
        <div className="coming-soon-side">
          <div className="coming-soon-content">
            <h1 className="coming-soon-title">Welcome to Hooraflix!</h1>
            {/* <p className="coming-soon-description">
              Join our community of founders and investors. Sign up now to access exclusive content, connect with like-minded individuals, and stay updated on the latest in the startup ecosystem.
            </p> */}
          </div>
        </div>

        <div className="auth-form-side">
          <div className="auth-box">
            <h1 className="auth-title">Sign Up</h1>
            <p className="auth-subtitle">Create your account to get started</p>

            {formData.refId && (
              <div className="ref-info">
                <span>Referral Code Applied</span>
                <strong>{formData.refId}</strong>
              </div>
            )}

            {error && (
              <div className="auth-alert auth-alert-error">
                {error}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
               <div className="form-group">
                <input
                  type="phone"
                  name="phone"
                  placeholder="Phone number"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="form-input"
                  minLength={8}
                  maxLength={128}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {passwordError && (
                  <div className="auth-alert auth-alert-error" style={{ marginTop: '8px', marginBottom: 0 }}>
                    {passwordError}
                  </div>
                )}
              </div>

              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'Signing Up...' : 'Sign Up'}
              </button>
            </form>

            <div className="auth-footer">
              Already have an account?
              <Link to="/login" className="auth-link">Sign in now.</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
