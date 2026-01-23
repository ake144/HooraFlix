import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { benefitsList, summaryBenefits, heroHighlights } from '../data/founderExperienceData';
import './FounderExperience.css';

const Revenue = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="founder-experience-page">
      <Header />
      <main className="founder-experience-main">
        <section className="experience-hero">
          <div className="hero-text">
            <span className="hero-label">HOORAFILX • REVENUE</span>
            <h1>Revenue Participation</h1>
            <p>
              Earn from subscriptions, PPV, ads and education while maintaining transparency and priority spots in revenue pilots.
            </p>
            <div className="hero-status">Current Status: {user?.role || 'USER'}</div>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => navigate('/founders')}>
                Join the Founders Circle
              </button>
              <button className="btn-secondary" onClick={() => navigate('/founders')}>
                Verify Founder Code
              </button>
            </div>
          </div>
          <div className="hero-card">
            <h3>Revenue Highlights</h3>
            <ul>
              {heroHighlights.revenue.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="benefits-section">
          <h2 className="section-title">What Founder Members Get</h2>
          <div className="benefits-grid">
            {benefitsList.map((benefit) => (
              <div key={benefit.id} className="benefit-card">
                <h3>{benefit.title}</h3>
                <ul>
                  {benefit.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="summary-section">
          <h2 className="section-title">Founder Benefits (Short Summary)</h2>
          <div className="summary-grid">
            {summaryBenefits.map((item) => (
              <div className="summary-card" key={item.title}>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Revenue;
