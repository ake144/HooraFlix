import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Auth.css';

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    refId: ''
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get('refId');
    if (ref) {
      setFormData(prev => ({ ...prev, refId: ref }));
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Signup Data:', formData);
    // Add signup logic here
    // Redirect to Founders Page (simulated signup success)
    navigate('/founders');
  };

  return (
    <div className="auth-container">
      <div className="auth-image-side">
        <div className="auth-image-overlay"></div>
      </div>
      <div className="auth-form-side">
        <div className="auth-box">
          <h1 className="auth-title">Sign Up</h1>
          
          {formData.refId && (
            <div className="ref-info">
              Referral Code Applied: <strong>{formData.refId}</strong>
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
                type="password"
                name="password"
                placeholder="Password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="auth-button">
              Sign Up
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? 
            <Link to="/login" className="auth-link">Sign in now.</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
