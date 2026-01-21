import React, { useState } from 'react';
import Header from '../components/Header';
import { FiUsers, FiAward, FiDollarSign, FiCopy, FiShare2 } from 'react-icons/fi';
import './FoundersDashboard.css';

const FoundersDashboard = () => {
  const [copied, setCopied] = useState(false);
  
  // Mock Data
  const user = {
    name: "Founder Ake",
    joinDate: "January 2026",
    rank: "Gold Founder",
    referralLink: "https://hooraflix.com/join?ref=ake2026"
  };

  const stats = {
    totalReferrals: 124,
    activeReferrals: 98,
    earnings: "$4,250.00",
    nextMilestone: 150
  };

  const recentReferrals = [
    { id: 1, name: "Sarah Johnson", date: "Jan 20, 2026", status: "Active", avatar: "https://i.pravatar.cc/150?u=1" },
    { id: 2, name: "Michael Chen", date: "Jan 19, 2026", status: "Pending", avatar: "https://i.pravatar.cc/150?u=2" },
    { id: 3, name: "Amara Okeke", date: "Jan 18, 2026", status: "Active", avatar: "https://i.pravatar.cc/150?u=3" },
    { id: 4, name: "David Miller", date: "Jan 18, 2026", status: "Active", avatar: "https://i.pravatar.cc/150?u=4" },
    { id: 5, name: "Priya Patel", date: "Jan 15, 2026", status: "Active", avatar: "https://i.pravatar.cc/150?u=5" },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(user.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="founders-dashboard">
      <Header />
      
      <div className="dashboard-container">
        {/* Welcome Section */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Founders Circle Dashboard</h1>
            <p className="dashboard-subtitle">Welcome back, {user.name}. Here is your community growth.</p>
          </div>
          <div className="user-badge">{user.rank}</div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon icon-users">
              <FiUsers />
            </div>
            <div className="stat-info">
              <h3>{stats.totalReferrals}</h3>
              <p>Total Referrals</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon icon-active">
              <FiAward />
            </div>
            <div className="stat-info">
              <h3>{stats.activeReferrals}</h3>
              <p>Active Members</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon icon-money">
              <FiDollarSign />
            </div>
            <div className="stat-info">
              <h3>{stats.earnings}</h3>
              <p>Total Rewards</p>
            </div>
          </div>
        </div>

        {/* content split - Referral Link & List */}
        <div className="dashboard-content-grid">
          
          {/* Recent Referrals List */}
          <div className="dashboard-section referral-list-section">
            <div className="section-header">
              <h2>Recent Referrals</h2>
              <button className="view-all-btn">View All</button>
            </div>
            
            <div className="referral-table-container">
              <table className="referral-table">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Date Joined</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReferrals.map((referral) => (
                    <tr key={referral.id}>
                      <td>
                        <div className="member-cell">
                          <img src={referral.avatar} alt={referral.name} className="member-avatar" />
                          <span className="member-name">{referral.name}</span>
                        </div>
                      </td>
                      <td>{referral.date}</td>
                      <td>
                        <span className={`status-badge ${referral.status.toLowerCase()}`}>
                          {referral.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar - Link & Actions */}
          <div className="dashboard-sidebar">
            <div className="sidebar-card invite-card">
              <h3>Invite New Founders</h3>
              <p>Share your unique code to grow your circle.</p>
              
              <div className="referral-link-box">
                <input type="text" value={user.referralLink} readOnly />
                <button onClick={copyToClipboard} className={copied ? 'copied' : ''}>
                  {copied ? 'Copied!' : <FiCopy />}
                </button>
              </div>
              
              <button className="share-btn">
                <FiShare2 /> Share Invite
              </button>
            </div>

            <div className="sidebar-card milestone-card">
              <h3>Next Milestone</h3>
              <div className="progress-container">
                <div className="progress-labels">
                  <span>{stats.totalReferrals} / {stats.nextMilestone}</span>
                  <span>Platinum Founder</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(stats.totalReferrals / stats.nextMilestone) * 100}%` }}
                  ></div>
                </div>
                <p className="milestone-text">
                  You need {stats.nextMilestone - stats.totalReferrals} more referrals to unlock Platinum perks.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FoundersDashboard;
