import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from './AdminLayout';
import { adminAPI } from '../utils/api';
import { FiActivity, FiAlertCircle, FiBarChart2, FiKey, FiLayers, FiRefreshCw, FiShield, FiTrendingUp, FiUsers } from 'react-icons/fi';

const StatsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    adminAPI
      .getCodeStats()
      .then((response) => {
        if (!active) return;
        setStats(response?.data ?? response ?? null);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setError('Unable to load statistics right now.');
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const derived = useMemo(() => {
    const totalUsers = Number(stats?.totalUsers) || 0;
    const totalFounders = Number(stats?.totalFounders) || 0;
    const activeCodes = Number(stats?.activeCodes) || 0;
    const totalCodes = Number(stats?.totalCodes) || 0;

    return {
      codeUtilization: totalCodes > 0 ? Math.round((activeCodes / totalCodes) * 100) : 0,
      founderCoverage: totalUsers > 0 ? Math.round((totalFounders / totalUsers) * 100) : 0,
      systemHealth: totalUsers + totalCodes > 0 ? Math.round(((activeCodes + totalFounders) / (totalUsers + totalCodes)) * 100) : 0,
    };
  }, [stats]);

  const metricCards = [
    { label: 'Total Users', value: stats?.totalUsers ?? '0', note: 'Registered platform users', icon: <FiUsers />, tone: 'violet' },
    { label: 'Total Founders', value: stats?.totalFounders ?? '0', note: 'Verified founder accounts', icon: <FiShield />, tone: 'emerald' },
    { label: 'Active Codes', value: stats?.activeCodes ?? '0', note: 'Codes currently in use', icon: <FiKey />, tone: 'amber' },
    { label: 'Total Codes', value: stats?.totalCodes ?? '0', note: 'All generated codes', icon: <FiLayers />, tone: 'blue' },
  ];

  const barRows = [
    { label: 'Code utilization', value: derived.codeUtilization },
    { label: 'Founder coverage', value: derived.founderCoverage },
    { label: 'System health', value: derived.systemHealth },
  ];

  const insightRows = [
    { label: 'Active ratio', value: `${derived.codeUtilization}%` },
    { label: 'Founder share', value: `${derived.founderCoverage}%` },
    { label: 'Operational health', value: `${derived.systemHealth}%` },
  ];

  return (
    <AdminLayout>
      <div className="admin-stats-page">
        <section className="admin-stats-hero">
          <div className="admin-stats-hero-copy">
            <p className="admin-panel-kicker">Analytics</p>
            <h2>Code generation intelligence</h2>
            <p>Monitor how codes, founders, and users are scaling across the platform with a cleaner operational view.</p>
          </div>

          <div className="admin-stats-hero-actions">
            <div className="admin-stats-hero-chip">
              <FiActivity />
              <span>Live data</span>
            </div>
            <div className="admin-stats-hero-chip">
              <FiTrendingUp />
              <span>Rolling insights</span>
            </div>
            <div className="admin-stats-hero-chip">
              <FiRefreshCw />
              <span>Auto-refresh ready</span>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="admin-stats-empty-state">Loading analytics...</div>
        ) : error ? (
          <div className="admin-stats-empty-state admin-stats-empty-state-error">
            <FiAlertCircle />
            <span>{error}</span>
          </div>
        ) : (
          <>
            <section className="admin-stats-metrics-grid">
              {metricCards.map((card) => (
                <article key={card.label} className={`admin-stats-metric-card admin-tone-${card.tone}`}>
                  <div className="admin-stats-metric-top">
                    <span className="admin-stats-metric-icon">{card.icon}</span>
                    <span className="admin-stats-metric-note">{card.note}</span>
                  </div>
                  <p>{card.label}</p>
                  <strong>{card.value}</strong>
                </article>
              ))}
            </section>

            <section className="admin-stats-layout">
              <article className="admin-panel admin-stats-breakdown-card">
                <div className="admin-panel-header">
                  <div>
                    <p className="admin-panel-kicker">Code health</p>
                    <h3>System distribution</h3>
                  </div>
                  <span className="admin-panel-chip">Summary</span>
                </div>

                <div className="admin-stats-donut-wrap">
                  <div
                    className="admin-stats-donut"
                    style={{
                      background: `conic-gradient(#f7c948 0 ${derived.codeUtilization}%, #8b5cf6 ${derived.codeUtilization}% ${Math.min(derived.codeUtilization + 22, 100)}%, #22c55e ${Math.min(derived.codeUtilization + 22, 100)}% 100%)`,
                    }}
                  >
                    <div>
                      <strong>{derived.codeUtilization}%</strong>
                      <span>Active ratio</span>
                    </div>
                  </div>

                  <div className="admin-stats-legend">
                    <div>
                      <span />
                      <div>
                        <strong>{stats?.activeCodes ?? 0}</strong>
                        <small>Active codes</small>
                      </div>
                    </div>
                    <div>
                      <span />
                      <div>
                        <strong>{stats?.totalCodes ?? 0}</strong>
                        <small>Total codes</small>
                      </div>
                    </div>
                    <div>
                      <span />
                      <div>
                        <strong>{stats?.totalFounders ?? 0}</strong>
                        <small>Founders</small>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="admin-stats-bars">
                  {barRows.map((row) => (
                    <div key={row.label} className="admin-stats-bar-row">
                      <div className="admin-stats-bar-labels">
                        <strong>{row.label}</strong>
                        <span>{row.value}%</span>
                      </div>
                      <div className="admin-stats-bar-track">
                        <div className="admin-stats-bar-fill" style={{ width: `${row.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="admin-panel admin-stats-insights-card">
                <div className="admin-panel-header">
                  <div>
                    <p className="admin-panel-kicker">Insights</p>
                    <h3>Operational highlights</h3>
                  </div>
                  <span className="admin-panel-chip">At a glance</span>
                </div>

                <div className="admin-stats-insights-list">
                  {insightRows.map((item) => (
                    <div key={item.label} className="admin-stats-insight-item">
                      <div>
                        <small>{item.label}</small>
                        <strong>{item.value}</strong>
                      </div>
                      <FiBarChart2 />
                    </div>
                  ))}
                </div>

                <div className="admin-stats-callout">
                  <FiTrendingUp />
                  <div>
                    <strong>Recommended next step</strong>
                    <p>Expand founder onboarding and validate code activation flows to improve adoption efficiency.</p>
                  </div>
                </div>
              </article>
            </section>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default StatsPage;
