import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import './FoundersPage.css';
import DashboardHeader from '../components/dashboard/header';

const FoundersPage = () => {
  const navigate = useNavigate();
  const { user, checkAuth } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('idle'); // idle, verifying, success, error
  const [message, setMessage] = useState('');

  // Redirect if already founder
  useEffect(() => {
    if (user?.isFounder) {
      navigate('/founders-dashboard');
    }
  }, [user, navigate]);

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
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        userData.isFounder = true;
        userData.role = 'FOUNDER';
        localStorage.setItem('user', JSON.stringify(userData));
        await checkAuth();

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

  const benefitsList = [
    {
      id: 1,
      title: "Lifetime Founder Badge",
      details: ["Verified Founder status on profile", "Special recognition across the platform"]
    },
    {
      id: 2,
      title: "Early & Exclusive Access",
      details: ["Early access to new films, series & originals", "Beta access to new features before public release"]
    },
    {
      id: 3,
      title: "Revenue Participation (Selected Programs)",
      details: ["Priority eligibility for creator revenue share", "Early participation in PPV, affiliate & education programs"]
    },
    {
      id: 4,
      title: "Direct Industry Access",
      details: ["Private sessions with filmmakers, actors & mentors", "Invitations to closed casting calls and industry rooms"]
    },
    {
      id: 5,
      title: "Education & Growth",
      details: ["Free or discounted access to acting, filmmaking & digital marketing classes", "Founder-only workshops and masterclasses"]
    },
    {
      id: 6,
      title: "Influence the Platform",
      details: ["Voting rights on selected content & features", "Shape the future direction of HOORAFILX"]
    },
    {
      id: 7,
      title: "Priority Opportunities",
      details: ["Early casting notifications", "First access to collaborations, sponsorships & partnerships"]
    }
  ];

  const summaryBenefits = [
    { title: "Equity & Revenue Share", desc: "Own a stake and earn from subscriptions, PPV, ads, and education" },
    { title: "Creative Influence", desc: "Priority content approval, Executive Producer credit" },
    { title: "Early Platform Access", desc: "Shape product, tech, and monetization roadmap" },
    { title: "Founder Recognition", desc: "“Founding Partner – HOORAFILX” public branding" },
    { title: "Talent & Training Access", desc: "Free/discounted film & acting programs" },
    { title: "Strategic Voice", desc: "Advisory/observer role on key decisions" },
    { title: "First-Mover Advantage", desc: "Early deal flow, partnerships, and exits" },
    { title: "Legacy Impact", desc: "Build Africa’s next global storytelling platform" }
  ];

  return (
    <div className="founders-page">
      <DashboardHeader />

      <main className="founders-main">
        {/* Verification Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-modal" onClick={handleCloseModal}>×</button>
              <h2>Enter Verification Code</h2>
              <p>Please enter your founder access code below.</p>
              
              <div className="verification-form">
                <input
                  type="text"
                  placeholder="Enter Code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={verificationStatus === 'verifying' || verificationStatus === 'success'}
                />
                
                {message && (
                  <div className={`message ${verificationStatus}`}>
                    {message}
                  </div>
                )}

                <button 
                  onClick={handleVerify} 
                  disabled={verificationStatus === 'verifying' || verificationStatus === 'success'}
                  className="verify-btn"
                >
                  {verificationStatus === 'verifying' ? 'Verifying...' : 'Verify Access'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        {/* <section className="hero-section">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1 className="hero-title">HOORAFILX GOLD FOUNDER</h1>
            <p className="hero-subtitle">Learn. Create. Get Discovered.</p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={handleJoinClick}>Verify Founder Status</button>
            </div>
          </div>
        </section> */}

        {/* Hero Section */}
        <section className="hero-section">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="hero-video-bg"
          >
            <source src="/hooraflix-logo.mp4" type="video/mp4" />
          </video>
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="user-status-pill">Current Status: {user?.role || 'User'}</div>
            <h1 className="hero-title">Join the Founders Circle</h1>
            <p className="hero-subtitle">Upgrade to unlock exclusive benefits.</p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={handleJoinClick}>Upgrade</button>
            </div>
          </div>
        </section>

        {/* Education Access Section */}
        <section className="education-access-section">
          <div className="section-container">
            <div className="education-content">
              <h2>EDUCATION ACCESS</h2>
              <hr className="divider" />
              <ul className="check-list">
                <li>Acting • Filmmaking • Screenwriting</li>
                <li>Digital Marketing & Personal Branding</li>
                <li>Founder-only Masterclasses</li>
                <li>Early Access to New Courses</li>
                <li>Certificate & Gold Founder Badge</li>
                <li>Direct Path to Casting & Productions</li>
              </ul>
            </div>
            <div className="education-image">
               <img src="/hoora.jpg" alt="Education Access" />
            </div>
          </div>
        </section>

        {/* Main Benefits List */}
        <section className="benefits-list-section">
          <div className="section-container">
            <h2 className="section-title">What Founder Members Get</h2>
            <div className="benefits-grid">
              {benefitsList.map((benefit) => (
                <div key={benefit.id} className="benefit-card">
                  <div className="benefit-number">{benefit.id}</div>
                  <h3>{benefit.title}</h3>
                  <ul className="benefit-details">
                    {benefit.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Summary Benefits Section */}
         {/* <section className="summary-section">
          <div className="section-container">
             <div className="summary-wrapper">
                <div className="summary-text">
                  <h2 className="section-title">Founder Benefits (Short Summary)</h2>
                  <div className="summary-simple-list">
                    {summaryBenefits.map((item, index) => (
                      <div key={index} className="summary-item">
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="summary-image">
                  <img src="/hoora1.jpg" alt="Founder Benefits" />
                </div>
             </div>
          </div>
        </section> */}
        <Footer />
      </main>
    </div>
  );
};

export default FoundersPage;
