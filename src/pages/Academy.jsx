import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { benefitsList, summaryBenefits, heroHighlights } from '../data/founderExperienceData';
import './FounderExperience.css';

const Academy = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="founder-experience-page">
      <Header />
      <main className="founder-experience-main">
        <section className="experience-hero">
          <div className="hero-text">
            <span className="hero-label">HOORAFILX • ACADEMY</span>
            <h1>Education Access</h1>
            <p>
              Learn. Create. Get Discovered. Tap into free or discounted access to acting, filmmaking
              and marketing classes built for founders who want to own the story.
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
            <h3>Academy Highlights</h3>
            <ul>
              {heroHighlights.academy.map((item) => (
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

       
      </main>
      <Footer />
    </div>
  );
};

export default Academy;
