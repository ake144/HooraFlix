import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';
import { FiX } from 'react-icons/fi';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const redirectMessage = sessionStorage.getItem('authRedirectMessage');
    if (redirectMessage) {
      setError(redirectMessage);
      sessionStorage.removeItem('authRedirectMessage');
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        console.log('Logged in user:', result.user);


        if (result.user.isFounder && result.user.role !== 'ADMIN') {
          navigate('/founders-dashboard');
        }
        else if (result.user.role === 'ADMIN') {
          navigate('/admin');
        }
        else {
          navigate('/founders');
        }
      } else {
        throw new Error(result.error || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate("/")}>
         <FiX  />
        </button>
      </div>

      <div className="auth-content-wrapper">
        <div className="coming-soon-side">
          <div className="coming-soon-content">
            <h1 className="coming-soon-title">Welcome Back to Hooraflix!</h1>
            {/* <p className="coming-soon-description">
              Sign in to access your personalized dashboard, manage your account, and explore exclusive content. We're excited to have you back!
            </p> */}
          </div>
        </div>

        <div className="auth-form-side">
          <div className="auth-box">
            <h1 className="auth-title">Sign In</h1>
            <p className="auth-subtitle">Enter your credentials to access your account</p>

            {error && <div className="auth-alert auth-alert-error">{error}</div>}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email or phone number"
                  className="form-input"
                  value={formData.email}
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
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="auth-inline-link-wrap">
                <Link to="/forgot-password" className="auth-link">Forgot password?</Link>
              </div>

              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="auth-footer">
              New to Hooraflix?
              <Link to="/signup" className="auth-link">Sign up now.</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
