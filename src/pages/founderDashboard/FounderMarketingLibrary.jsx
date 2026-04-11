import React from 'react';
import { Link } from 'react-router-dom';
import { FiDownload, FiImage, FiVideo, FiType, FiArrowLeft } from 'react-icons/fi';
import DashboardHeader from '../../components/dashboard/header';
import './FounderTools.css';

const marketingAssets = [
  {
    title: 'Poster Pack',
    type: 'Design',
    icon: <FiImage />,
    description: 'Ready-to-share posters for WhatsApp, Telegram, Instagram, and Facebook.',
    file: '/landing.jpg',
  },
  {
    title: 'Film Trailer Clips',
    type: 'Video',
    icon: <FiVideo />,
    description: 'Short teasers optimized for Reels and Shorts with pre-cut hooks.',
    file: '/hooraflix-logo.mp4',
  },
  {
    title: 'Course Promo Videos',
    type: 'Video',
    icon: <FiVideo />,
    description: 'Promotional cuts to announce new course availability to your audience.',
    file: '/DANASH ADVERT CINI.mp4',
  },
  {
    title: 'Social Media Captions',
    type: 'Copy',
    icon: <FiType />,
    description: 'Caption bank and CTAs crafted for referral conversion.',
    file: '/hoora1.jpg',
  },
];

const FounderMarketingLibrary = () => {
  return (
    <div className="founder-tool-page">
      <DashboardHeader />
      <div className="founder-tool-container">
        <div className="tool-page-topbar">
          <Link to="/founders-dashboard" className="tool-back-link">
            <FiArrowLeft /> Back to Dashboard
          </Link>
        </div>

        <section className="tool-hero materials-hero">
          <div>
            <p className="tool-kicker">Founder Exclusive</p>
            <h1>Marketing Materials Library</h1>
            <p>Download pre-built campaign assets and launch promotions faster.</p>
          </div>
          <img src="/landing5.jpg" alt="Marketing materials" />
        </section>

        <section className="tool-grid">
          {marketingAssets.map((asset) => (
            <article key={asset.title} className="tool-card">
              <div className="tool-card-head">
                <h3>{asset.title}</h3>
                <span className="tool-level">{asset.type}</span>
              </div>
              <p>{asset.description}</p>
              <div className="tool-meta">
                <span>{asset.icon} Asset ready</span>
                <span><FiDownload /> Downloadable</span>
              </div>
              <a className="tool-cta-btn" href={asset.file} download>
                <FiDownload /> Download Asset
              </a>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
};

export default FounderMarketingLibrary;
