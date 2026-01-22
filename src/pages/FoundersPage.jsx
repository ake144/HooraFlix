import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './FoundersPage.css';

const FoundersPage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('idle'); // idle, verifying, success, error
  const [message, setMessage] = useState('');

  const handleJoinClick = (e) => {
    e.preventDefault();
    setShowModal(true);
    setVerificationStatus('idle');
    setCode('');
    setMessage('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleVerify = async () => {
    if (!code.trim()) {
      setMessage('Please enter a valid code.');
      setVerificationStatus('error');
      return;
    }

    setVerificationStatus('verifying');

    try {
      const response = await fetch('http://localhost:5001/api/founders/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ code: code.trim() })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      if (data.success) {
        setVerificationStatus('success');
        setMessage('Welcome to the Founders Circle!');

        // Update local storage with founder status
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.isFounder = true;
        user.role = 'FOUNDER';
        localStorage.setItem('user', JSON.stringify(user));

        // Redirect to dashboard after 1.5 seconds
        setTimeout(() => {
          navigate('/founders-dashboard');
        }, 1500);
      }
    } catch (error) {
      setVerificationStatus('error');
      setMessage(error.message || 'Invalid code. Please try again.');
    }
  };

  return (
    <div className="founders-page">
      <Header />

      <div className='founders-container'>


        {/* Hero Section */}
        <section className="founders-hero">
          <div className="founders-hero-content">
            <div className="welcome-tag">HOORAFLIX EXCLUSIVE</div>
            <h1 className="main-title">
              The Future of <br />
              <span className="highlight-text">African Storytelling</span>
            </h1>

            <p className="subtitle">
              Join the <strong>Founders Circle</strong> today. Unlock exclusive educational content,
              premium entertainment, and become a part of the cinematic revolution.
            </p>

            <div className="hero-badges">
              <div className="founder-badge">Founder Status</div>
              <div className="founder-badge secondary">2026 Edition</div>
            </div>

            <div className="hero-cta">
              <button onClick={handleJoinClick} className="btn-primary btn-lg">Join the Movement</button>
              <button className="btn-text">Watch Trailer</button>
            </div>
          </div>

          <div className="founders-hero-media">
            <div className="video-container-styled">
              <video
                src="/hooraflix-logo.mp4"
                className="hero-video"
                autoPlay
                loop
                muted
                playsInline
              />
              <div className="video-overlay-gradient"></div>
              <div className="video-badges">
                <span>Ad</span>
                <span>4K Ultra HD</span>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="benefits-section">
          <h2 className="section-title">Founder Benefits & Lifetime Privileges</h2>
          <p className="section-subtitle">Permanent access, recognition, and participation rights.</p>

          <div className="benefits-grid">
            {/* Card 1 */}
            <div className="benefit-card">
              <h3 className="benefit-title">Lifetime Bonus</h3>
              <p className="benefit-desc">Premium access forever.</p>
            </div>

            {/* Card 2 */}
            <div className="benefit-card">
              <h3 className="benefit-title">Act in Movies</h3>
              <p className="benefit-desc">Priority casting access.</p>
            </div>

            {/* Card 3 */}
            <div className="benefit-card">
              <h3 className="benefit-title">Production Crew</h3>
              <p className="benefit-desc">Behind-the-scenes roles.</p>
            </div>

            {/* Card 4 */}
            <div className="benefit-card">
              <h3 className="benefit-title">Legacy Recognition</h3>
              <p className="benefit-desc">Permanent founder status.</p>
            </div>
          </div>

          <div className="action-buttons">
            <button onClick={handleJoinClick} className="btn-primary">Join the Founders Circle</button>
            <a href="#" className="btn-secondary">View Benefits</a>
          </div>
        </section>

        {/* Verification Modal */}
        {showModal && (
          <div className="founder-modal-overlay">
            <div className="founder-modal">
              <button className="founder-modal-close" onClick={handleCloseModal}>&times;</button>

              {verificationStatus === 'success' ? (
                <div className="founder-modal-content success">
                  <div className="success-icon">🎉</div>
                  <h3>Congratulations!</h3>
                  <p>{message}</p>
                  <button className="btn-primary" onClick={handleCloseModal}>Enter Lounge</button>
                </div>
              ) : (
                <div className="founder-modal-content">
                  <h3>Enter Your Founder Code</h3>
                  <p>Please enter your unique code to verify your membership.</p>

                  <input
                    type="text"
                    className="founder-input"
                    placeholder="Enter Code (e.g. HOORA2026)"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />

                  {message && <p className={`status-message ${verificationStatus}`}>{message}</p>}

                  <button
                    className="btn-primary btn-full"
                    onClick={handleVerify}
                    disabled={verificationStatus === 'verifying'}
                  >
                    {verificationStatus === 'verifying' ? 'Verifying...' : 'Verify Code'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Simple Footer */}
      <footer className="simple-footer">
        <div className="footer-brand">
          <h4>HOORAFLIX</h4>
          <p>The future of African cinema, education, and creator ownership.</p>
        </div>
        <div className="footer-col">
          <h5>Platform</h5>
          <ul>
            <li><a href="#">Founders</a></li>
            <li><a href="#">Browse</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h5>Company</h5>
          <ul>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default FoundersPage;
