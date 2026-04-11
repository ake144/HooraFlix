import React from 'react';
import { Link } from 'react-router-dom';
import { FiPlayCircle, FiClock, FiTrendingUp, FiArrowLeft } from 'react-icons/fi';
import DashboardHeader from '../../components/dashboard/header';
import './FounderTools.css';

const trainingCourses = [
  {
    title: 'How to Promote Films',
    duration: '45 mins',
    level: 'Beginner',
    description: 'Learn campaign setup, targeting, and launch timing for independent films.',
  },
  {
    title: 'TikTok Promotion Strategy',
    duration: '35 mins',
    level: 'Intermediate',
    description: 'Build short-form hooks and posting systems that drive real referral growth.',
  },
  {
    title: 'Social Media Marketing',
    duration: '60 mins',
    level: 'Beginner',
    description: 'Design a weekly content calendar across Instagram, TikTok, and YouTube Shorts.',
  },
  {
    title: 'Personal Branding for Founders',
    duration: '50 mins',
    level: 'Advanced',
    description: 'Position your identity, story, and voice to increase trust and conversions.',
  },
];

const FounderTrainingCenter = () => {
  return (
    <div className="founder-tool-page">
      <DashboardHeader />
      <div className="founder-tool-container">
        <div className="tool-page-topbar">
          <Link to="/founders-dashboard" className="tool-back-link">
            <FiArrowLeft /> Back to Dashboard
          </Link>
        </div>

        <section className="tool-hero training-hero">
          <div>
            <p className="tool-kicker">Founder Exclusive</p>
            <h1>Affiliate Training Center</h1>
            <p>Master promotion and sales skills with founder-only practical lessons.</p>
          </div>
          <img src="/landing3.jpg" alt="Training center" />
        </section>

        <section className="tool-grid">
          {trainingCourses.map((course) => (
            <article key={course.title} className="tool-card">
              <div className="tool-card-head">
                <h3>{course.title}</h3>
                <span className="tool-level">{course.level}</span>
              </div>
              <p>{course.description}</p>
              <div className="tool-meta">
                <span><FiClock /> {course.duration}</span>
                <span><FiTrendingUp /> Conversion focused</span>
              </div>
              <button className="tool-cta-btn">
                <FiPlayCircle /> Start Lesson
              </button>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
};

export default FounderTrainingCenter;
