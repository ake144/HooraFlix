import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FiActivity,
    FiArrowUpRight,
    FiClock,
    FiDollarSign,
    FiFilm,
    FiKey,
    FiPlay,
    FiSend,
    FiShield,
    FiStar,
    FiTrendingUp,
    FiUpload,
    FiUser,
    FiUsers,
    FiZap,
} from 'react-icons/fi';
import AdminLayout from './AdminLayout';
import { adminAPI } from '../utils/api';


const AdminDashboard = () => {
    const [stats, setStats] = React.useState(null);



    useEffect(() => {
         adminAPI.getDashboardStats()
         .then((response)=>{
            setStats(response?.data ?? response ?? null);
         })
         .catch(()=>{
            console.error('Error fetching dashboard stats:');
           throw new Error('Unable to load dashboard statistics right now.');
         })
    }, []);

    const overviewStats = [
        { label: 'Total Users', value: stats?.totalUsers, change: '+12.5%', icon: <FiUsers />, tone: 'violet' },
        { label: 'Total Founders', value: stats?.totalFounders, change: '+8.7%', icon: <FiActivity />, tone: 'emerald' },
        { label: 'Total Codes', value: stats?.totalCodes, change: '+5.3%', icon: <FiFilm />, tone: 'blue' },
        { label: 'Total Payout Requests', value: stats?.totalPayoutRequests, change: '+15.8%', icon: <FiDollarSign />, tone: 'amber' },
        { label: 'Active Coins', value: stats?.activeCodes, change: '+11.3%', icon: <FiKey />, tone: 'rose' },
        { label: 'Total Admins', value: stats?.totalAdmins, change: '+9.5%', icon: <FiUsers />, tone: 'cyan' },
    ];

    const signupSeries = [420, 860, 610, 1200, 1490, 980, 1560];
    const revenueSeries = [16, 22, 25, 34, 29, 44];
    const maxSignup = Math.max(...signupSeries);
    const maxRevenue = Math.max(...revenueSeries);
    const signupWidth = 100 / (signupSeries.length - 1);
    const signupPoints = signupSeries
        .map((value, index) => {
            const x = index * signupWidth;
            const y = 90 - (value / maxSignup) * 70;
            return `${x},${y}`;
        })
        .join(' ');


    const today = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date());

    const activityItems = [
        { title: 'New user registered', meta: 'Selam Bekele', time: '2 min ago', icon: <FiUser /> },
        { title: 'New movie uploaded', meta: 'Beyond the Mountains', time: '15 min ago', icon: <FiUpload /> },
        { title: 'Affiliate joined', meta: 'Dawit Alemu', time: '32 min ago', icon: <FiZap /> },
        { title: 'Payment received', meta: '$4,999', time: '1 hour ago', icon: <FiDollarSign /> },
        { title: 'Withdrawal request', meta: 'Kidus Yohannes', time: '3 hours ago', icon: <FiClock /> },
        { title: 'New student enrolled', meta: 'Natnael Girma', time: '5 hours ago', icon: <FiStar /> },
    ];

    const quickActions = [
        { label: 'Add Movie', icon: <FiFilm />, to: '/admin/users' },
        { label: 'Add Series', icon: <FiPlay />, to: '/admin/users' },
        { label: 'Add User', icon: <FiUsers />, to: '/admin/users' },
        { label: 'Send Email', icon: <FiSend />, to: '/admin/users' },
        { label: 'Promo Code', icon: <FiKey />, to: '/admin/founder-codes' },
        { label: 'View Reports', icon: <FiTrendingUp />, to: '/admin/stats' },
    ];

    const topMovie = {
        title: 'The Last Legend',
        genre: 'Action, Adventure',
        year: '2024',
        runtime: '2h 15m',
        views: '125,430',
        watchTime: '8,245h',
    };

    const topAffiliate = {
        name: 'Abel Tesfaye',
        tier: 'Gold Leader',
        earnings: '$5,432',
        referrals: '1,245',
    };

    return (
        <AdminLayout>
            <div className="admin-dashboard-shell">
                <section className="admin-hero-panel">
                    <div className="admin-hero-copy">
                        <p className="admin-hero-kicker">Operations hub</p>
                        <h2>Welcome back, Admin</h2>
                        <p>
                            Manage users, founder codes, payouts, academy activity, and platform growth from a single command center.
                        </p>
                        <div className="admin-hero-actions">
                            <Link to="/admin/users" className="admin-hero-primary">
                                <FiUsers /> Open users
                            </Link>
                            <Link to="/admin/stats" className="admin-hero-secondary">
                                <FiTrendingUp /> View analytics
                            </Link>
                        </div>
                    </div>

                    <div className="admin-hero-summary">
                        <div className="admin-summary-card">
                            <span className="admin-summary-icon"><FiClock /></span>
                            <div>
                                <small>Today</small>
                                <strong>{today}</strong>
                            </div>
                        </div>
                        <div className="admin-summary-card">
                            <span className="admin-summary-icon"><FiShield /></span>
                            <div>
                                <small>System status</small>
                                <strong>All systems operational</strong>
                            </div>
                        </div>
                        <div className="admin-summary-card admin-summary-card-highlight">
                            <span className="admin-summary-icon"><FiArrowUpRight /></span>
                            <div>
                                <small>Growth this week</small>
                                <strong>+18.6% revenue</strong>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="admin-kpi-grid" aria-label="Platform overview metrics">
                    {overviewStats.map((stat) => (
                        <article key={stat.label} className={`admin-kpi-card admin-tone-${stat.tone}`}>
                            <div className="admin-kpi-top">
                                <span className="admin-kpi-icon">{stat.icon}</span>
                                <span className="admin-kpi-change">{stat.change}</span>
                            </div>
                            <div>
                                <p>{stat.label}</p>
                                <strong>{stat.value}</strong>
                            </div>
                        </article>
                    ))}
                </section>

                <section className="admin-dashboard-grid">
                    <div className="admin-main-stack">
                        <article className="admin-panel admin-chart-panel">
                            <div className="admin-panel-header">
                                <div>
                                    <p className="admin-panel-kicker">Daily signups</p>
                                    <h3>Weekly user growth</h3>
                                </div>
                                <span className="admin-panel-chip">Last 7 days</span>
                            </div>

                            <div className="admin-line-chart">
                                <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                                    <defs>
                                        <linearGradient id="signupGradient" x1="0" x2="0" y1="0" y2="1">
                                            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.42" />
                                            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    <polygon points={`0,100 ${signupPoints} 100,100`} fill="url(#signupGradient)" />
                                    <polyline points={signupPoints} fill="none" stroke="#a855f7" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                                    {signupSeries.map((value, index) => {
                                        const x = index * signupWidth;
                                        const y = 90 - (value / maxSignup) * 70;
                                        return <circle key={`${value}-${index}`} cx={x} cy={y} r="2.6" fill="#e9d5ff" />;
                                    })}
                                </svg>

                                <div className="admin-chart-labels">
                                    {['May 16', 'May 17', 'May 18', 'May 19', 'May 20', 'May 21', 'May 22'].map((label) => (
                                        <span key={label}>{label}</span>
                                    ))}
                                </div>
                                <div className="admin-chart-badge">2,340<br />May 22, 2025</div>
                            </div>
                        </article>

                        <article className="admin-panel admin-activity-panel">
                            <div className="admin-panel-header">
                                <div>
                                    <p className="admin-panel-kicker">Recent activity</p>
                                    <h3>Platform feed</h3>
                                </div>
                                <Link to="/admin/users" className="admin-text-link">View all</Link>
                            </div>

                            <div className="admin-activity-list">
                                {activityItems.map((item) => (
                                    <div key={item.title} className="admin-activity-item">
                                        <span className="admin-activity-icon">{item.icon}</span>
                                        <div>
                                            <strong>{item.title}</strong>
                                            <p>{item.meta}</p>
                                        </div>
                                        <time>{item.time}</time>
                                    </div>
                                ))}
                            </div>
                        </article>

                        <article className="admin-panel admin-quick-panel">
                            <div className="admin-panel-header">
                                <div>
                                    <p className="admin-panel-kicker">Quick access</p>
                                    <h3>Operational shortcuts</h3>
                                </div>
                            </div>
                            <div className="admin-quick-grid">
                                {quickActions.map((action) => (
                                    <Link key={action.label} to={action.to} className="admin-quick-card">
                                        <span>{action.icon}</span>
                                        <strong>{action.label}</strong>
                                    </Link>
                                ))}
                            </div>
                        </article>
                    </div>

                    <aside className="admin-side-stack">
                        <article className="admin-panel admin-feature-panel">
                            <div className="admin-panel-header">
                                <div>
                                    <p className="admin-panel-kicker">Most watched movie</p>
                                    <h3>{topMovie.title}</h3>
                                </div>
                                <span className="admin-panel-chip">Top pick</span>
                            </div>
                            <div className="admin-feature-poster">
                                <div className="admin-feature-overlay">
                                    <span>{topMovie.year}</span>
                                    <strong>{topMovie.genre}</strong>
                                </div>
                            </div>
                            <div className="admin-feature-meta">
                                <div>
                                    <small>Views</small>
                                    <strong>{topMovie.views}</strong>
                                </div>
                                <div>
                                    <small>Watch time</small>
                                    <strong>{topMovie.watchTime}</strong>
                                </div>
                            </div>
                            <p className="admin-feature-text">
                                {topMovie.title} is currently driving the strongest watch time and retention across the platform.
                            </p>
                        </article>

                        <article className="admin-panel admin-leader-panel">
                            <div className="admin-panel-header">
                                <div>
                                    <p className="admin-panel-kicker">Top affiliate leader</p>
                                    <h3>{topAffiliate.name}</h3>
                                </div>
                                <span className="admin-panel-chip">Gold</span>
                            </div>
                            <div className="admin-leader-avatar">
                                <span>{topAffiliate.name.split(' ').map((part) => part[0]).join('')}</span>
                            </div>
                            <p className="admin-leader-tier">{topAffiliate.tier}</p>
                            <div className="admin-feature-meta">
                                <div>
                                    <small>Total earnings</small>
                                    <strong>{topAffiliate.earnings}</strong>
                                </div>
                                <div>
                                    <small>Total referrals</small>
                                    <strong>{topAffiliate.referrals}</strong>
                                </div>
                            </div>
                        </article>

                        <article className="admin-panel admin-sources-panel">
                            <div className="admin-panel-header">
                                <div>
                                    <p className="admin-panel-kicker">Revenue overview</p>
                                    <h3>This week</h3>
                                </div>
                                <span className="admin-panel-chip">$87,540</span>
                            </div>
                            <div className="admin-bar-chart" aria-hidden="true">
                                {revenueSeries.map((value, index) => (
                                    <div key={`${value}-${index}`} className="admin-bar-wrap">
                                        <div className="admin-bar" style={{ height: `${(value / maxRevenue) * 100}%` }} />
                                        <span>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]}</span>
                                    </div>
                                ))}
                            </div>
                        </article>
                    </aside>
                </section>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
