import React from 'react';
import Header from '../components/Header';
import './FoundersPage.css';

const FoundersPage = () => {
  return (
    <div className="founders-page">
      <Header />
      
      {/* Hero Section */}
      <section className="founders-hero">
        <div className="welcome-text">HOORAFLIX</div>
        <h1 className="main-title">
          Welcome, <span className="highlight-gold">Esteemed Founder</span>
        </h1>
        
        <p className="subtitle">
          <strong>Access Reserved for Founding Members</strong>
          <br />
          Exclusive educational opportunities, premium African content, and a lifetime commitment to participation in Hooraflix productions.
        </p>

        <div className="founder-badge">Founder since 2026</div>
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
          <a href="#" className="btn-primary">Join the Founders Circle</a>
          <a href="#" className="btn-secondary">View Benefits</a>
        </div>
      </section>

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
